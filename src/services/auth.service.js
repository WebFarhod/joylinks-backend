const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { generateVerificationCode } = require("../utils/generateVerCode");
const BaseError = require("../utils/baseError");
const smsService = require("./sms.service");
const Auth = require("../models/auth.model");
const jwt = require("../utils/jwt");
const UserDto = require("../dto/user.dto");
const TokenDto = require("../dto/token.dto");

class AuthService {
  async isBlock(authUser) {
    if (authUser.isBlocked) {
      if (authUser.blockExpires && new Date() < authUser.blockExpires) {
        throw BaseError.BadRequest(
          "Hisobga kirish uchun juda ko`p urinish, keyinroq qayta urinib ko'ring!"
        );
      } else {
        authUser.isBlocked = false;
        authUser.attemptCount = 0;
        authUser.blockExpires = null;
        await authUser.save();
      }
    }
  }

  async attemptCount(authUser) {
    authUser.attemptCount += 1;
    await authUser.save();
    if (authUser.attemptCount >= 10) {
      authUser.isBlocked = true;
      authUser.blockExpires = new Date(Date.now() + 10 * 60 * 1000);
      await authUser.save();

      throw BaseError.BadRequest(
        "Hisobga kirish uchun juda ko`p urinish, keyinroq qayta urinib ko'ring."
      );
    }
  }

  async sendSms(phone, code) {
    const sms = await smsService.sendCode(phone, code);
    if (sms == null) {
      throw BaseError.InternalServerError(
        "Tasdiqlash kodini yuborishda xatolik yuz berdi."
      );
    }
  }

  async checkPhone(phone) {
    const user = await User.findOne({ phone }).populate("auth");
    if (user) {
      if (user.isActive) {
        return {
          message: "Parolingizni kiriting.",
          redirect: "login",
          phone,
        };
      } else {
        if (user.isApproved) {
          const authUser = user.auth;
          const { code, expires } = await generateVerificationCode();

          await this.sendSms(phone, code);

          authUser.code = code;
          authUser.expires = expires;
          await authUser.save();
          return {
            message: "Tasdiqlash kodi yuborildi.",
            redirect: "verification",
            phone,
          };
        } else {
          return {
            message: "Tizimdam ro'yxatdan o'tishingiz mumkin.",
            redirect: "register",
            phone,
          };
        }
      }
    } else {
      return {
        message: "Tizimdam ro'yxatdan o'tishingiz mumkin.",
        redirect: "register",
        phone,
      };
    }
  }

  async register(firstname, lastname, phone, password) {
    const user = await User.findOne({ phone }).populate("auth");
    const { code, expires } = await generateVerificationCode();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      this.sendSms(phone, code);

      const newAuth = new Auth({ password: hashedPassword, code, expires });
      await newAuth.save();
      const newUser = new User({
        firstname,
        lastname,
        phone,
        auth: newAuth._id,
      });
      await newUser.save();
      return {
        message: "Tasdiqlash kodi yuborildi.",
        redirect: "verification",
      };
    }
    if (user.isActive) {
      throw BaseError.BadRequest(
        `${phone} ushbu raqam tizimda ro'yxatdan o'tgan!`
      );
    }
    if (!user.isApproved) {
      const authUser = user.auth;
      this.sendSms(phone, code);

      user.firstname = firstname;
      user.lastname = lastname;
      authUser.password = hashedPassword;
      authUser.code = code;
      authUser.expires = expires;
      await user.save();
      await authUser.save();
      return {
        message: "Tasdiqlash kodi yuborildi.",
        redirect: "verification",
      };
    }
  }

  async verification(code, phone, res) {
    const user = await User.findOne({ phone }).populate("auth");

    if (!user) {
      throw BaseError.BadRequest("Ushbu raqam mavjud emas.");
    }

    const authUser = user.auth;

    await this.isBlock(authUser);

    if (authUser.expires && new Date() > authUser.expires) {
      throw BaseError.BadRequest("Tasdiqlash kodi muddati tugagan.");
    }

    console.log(authUser.code, code);

    if (authUser.code !== code) {
      await this.attemptCount(authUser);
      throw BaseError.BadRequest("Tasdiqlash kodi xato!");
    }
    if (user.isActive) {
      const userDto = new TokenDto(user);
      const key = jwt.signKeyToken({ ...userDto });
      authUser.code = null;
      authUser.expires = null;
      authUser.attemptCount = 0;
      authUser.isBlocked = false;
      authUser.blockExpires = null;
      authUser.key = key;
      await authUser.save();
      return res.json({
        message: "Yangi password kiritishingiz mumkin",
        redirect: "new-password",
        key,
      });
    } else {
      user.isActive = true;
      user.isApproved = true;
      authUser.code = null;
      authUser.expires = null;
      authUser.attemptCount = 0;
      authUser.isBlocked = false;
      authUser.blockExpires = null;
      await user.save();
      await authUser.save();

      const userData = new UserDto(user);
      const userTokenData = new TokenDto(user);
      const token = jwt.sign({ ...userTokenData });

      res.cookie("refresh_token", token.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        message: "Siz Hisobingiz tasdiqlandi",
        user: userData,
        accessToken: token.accessToken,
        redirect: "profile",
      });
    }
  }

  async resendCode(phone) {
    const user = await User.findOne({ phone }).populate("auth");
    if (!user) {
      throw BaseError.BadRequest("Ushbu telefon raqamiga mavjud emas");
    }
    const authUser = user.auth;
    await this.isBlock(authUser);
    await this.attemptCount(authUser);
    if (authUser.expires && new Date() > authUser.expires) {
      const { code, expires } = await generateVerificationCode();

      this.sendSms(phone, code);

      authUser.code = code;
      authUser.expires = expires;
      await authUser.save();

      return { message: "Yangi tasdiqlash kodi yuborildi." };
    }
    return { message: "Tasdiqlash kodi yuborilgan." };
  }

  async getUser(token) {
    const user = await User.findById(token.sub);
    if (!user) {
      throw BaseError.UnauthorizedError();
    }
    const userData = new UserDto(user);

    return { user: userData };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw BaseError.UnauthorizedError();
    }

    const userPayload = jwt.validateRefreshToken(refreshToken);
    if (!userPayload) {
      throw BaseError.UnauthorizedError();
    }

    const user = await User.findById(userPayload.sub);
    if (!user) {
      throw BaseError.UnauthorizedError();
    }
    const userData = new UserDto(user);
    const userDto = new TokenDto(user);
    const accessToken = jwt.signrefresh({ ...userDto });
    return { user: userData, accessToken };
  }

  async login(phone, password) {
    const user = await User.findOne({ phone }).populate("auth");
    if (!user) {
      throw BaseError.UnauthorizedError();
    }
    if (!user.isActive) {
      throw BaseError.UnauthorizedError();
    }
    const authUser = user.auth;

    this.isBlock(authUser);
    const isMatched = await bcrypt.compare(password, authUser.password || "");

    if (!isMatched) {
      this.attemptCount(authUser);
      throw BaseError.BadRequest("parol yoki username xato");
    }

    authUser.attemptCount = 0;
    authUser.isBlocked = false;
    authUser.blockExpires = null;
    await authUser.save();

    const userData = new UserDto(user);
    const userDto = new TokenDto(user);
    const token = jwt.sign({ ...userDto });

    return {
      message: "Siz muvaffaqiyatli tizimga kirdingiz",
      user: userData,
      ...token,
      redirect: "profile",
    };
  }

  async forgotPassword(phone) {
    const user = await User.findOne({ phone }).populate("auth");
    if (!user) {
      throw BaseError.BadRequest("Ushbu telefon raqamiga mavjud emas");
    }
    const authUser = user.auth;
    await this.isBlock(authUser);
    await this.attemptCount(authUser);
    const { code, expires } = await generateVerificationCode();
    this.sendSms(phone, code);
    authUser.code = code;
    authUser.expires = expires;
    await authUser.save();
    return {
      message: "Tasdiqlash kodi yuborildi.",
      redirect: "verification",
    };
  }

  async newPassword(phone, password, key) {
    const user = await User.findOne({ phone }).populate("auth");
    if (!user) {
      throw BaseError.UnauthorizedError();
    }
    const authUser = user.auth;
    if (authUser.key !== key) {
      throw BaseError.UnauthorizedError();
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    authUser.password = hashedPassword;
    authUser.key = null;
    await authUser.save();

    const userData = new UserDto(user);
    const userDto = new TokenDto(user);
    const token = jwt.sign({ ...userDto });

    return {
      message: "Siz muvaffaqiyatli tizimga kirdingiz",
      user: userData,
      ...token,
      redirect: "profile",
    };
  }
}

module.exports = new AuthService();

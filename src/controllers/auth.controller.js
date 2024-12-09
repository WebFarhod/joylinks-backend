const authService = require("../services/auth.service");

class AuthController {
  async checkPhone(req, res, next) {
    try {
      const phone = req.body.phone;
      if (!phone) {
        return res
          .status(400)
          .json({ message: "Talab qilinga malumotlar mavjud emas" });
      }
      if (phone.length !== 13) {
        return res
          .status(400)
          .json({ message: "Telefon raqami talab qilingan miqdordan qisqa." });
      }
      const data = await authService.checkPhone(phone);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { firstname, lastname, phone, password } = req.body;

      if (!firstname || !lastname || !phone || !password) {
        return res
          .status(400)
          .json({ message: "Talab qilinga malumotlar mavjud emas" });
      }
      if (phone.length !== 13) {
        return res
          .status(400)
          .json({ message: "Telefon raqami talab qilingan miqdordan qisqa." });
      }

      const data = await authService.register(
        firstname,
        lastname,
        phone,
        password
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async verification(req, res, next) {
    try {
      const { code, phone } = req.body;

      if (!code || !phone) {
        return res
          .status(400)
          .json({ message: "Talab qilinga malumotlar mavjud emas" });
      }
      // const { message, user, accessToken, refreshToken, redirect } =
      return await authService.verification(code, phone, res);
      // res.cookie("refresh_token", refreshToken, {
      //   httpOnly: true,
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });
      // return res.json({ message, user, accessToken, redirect });
    } catch (error) {
      next(error);
    }
  }

  async resendCode(req, res, next) {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Tel raqam mavjud emas" });
    }
    try {
      const data = await authService.resendCode(phone);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Tel raqam mavjud emas" });
    }
    try {
      const data = await authService.forgotPassword(phone);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res.status(400).json({
          message: "Talab qilinga malumotlar mavjud emas mavjud emas",
        });
      }
      const { message, user, accessToken, refreshToken, redirect } =
        await authService.login(phone, password);
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({ message, user, accessToken, redirect });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = req.user;
      if (user) {
        const data = await authService.getUser(user);
        return res.json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refresh_token } = req.cookies;
      const data = await authService.refresh(refresh_token);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async newPassword(req, res, next) {
    try {
      const { phone, password, key } = req.body;

      if (!phone || !password || !key) {
        return res.status(400).json({
          message: "Talab qilinga malumotlar mavjud emas mavjud emas",
        });
      }
      const { message, user, accessToken, refreshToken, redirect } =
        await authService.newPassword(phone, password, key);
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({ message, user, accessToken, redirect });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

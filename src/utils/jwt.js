// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const generateAccessToken = (user) => {
//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "3600m",
//   });
// };

// const generateRefreshToken = (user) => {
//   return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
// };

// const verifyAccessToken = (token) => {
//   return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
// };

// const verifyRefreshToken = (token) => {
//   return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
// };

// module.exports = {
//   generateAccessToken,
//   generateRefreshToken,
//   verifyAccessToken,
//   verifyRefreshToken,
// };

const jwt = require("jsonwebtoken");
// import jwt from "jsonwebtoken";
// import IJwtUser from "../types/user";
// import IJwtRegisterKey from "../types/registerKey";

class Jwt {
  accessTokenSecret;
  refreshTokenSecret;
  signKey;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_KEY || "";
    this.refreshTokenSecret = process.env.JWT_REFRESH_KEY || "";
    this.signKey = process.env.JWT_SIGN_KEY || "";

    if (!this.accessTokenSecret || !this.refreshTokenSecret || !this.signKey) {
      throw new Error("JWT keys are not defined in environment variables");
    }
  }

  sign(payload) {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: "15d",
    });
    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  }

  signKeyToken(payload) {
    return jwt.sign(payload, this.signKey, {
      expiresIn: "1d",
    });
  }

  signrefresh(payload) {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: "15d",
    });
    return accessToken;
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      return null;
    }
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      return null;
    }
  }

  validateKeyToken(token) {
    try {
      return jwt.verify(token, this.signKey);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new Jwt();

const userService = require("../services/user.service");
const BaseError = require("../utils/baseError");
const jwt = require("../utils/jwt");

const AdminMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return next(BaseError.UnauthorizedError());
    }
    const accressToken = auth.split(" ")[1];
    if (!accressToken) {
      return next(BaseError.UnauthorizedError());
    }
    const userData = jwt.validateAccessToken(accressToken);
    if (!userData) {
      return next(BaseError.UnauthorizedError());
    }

    const user = await userService.findUserById(userData.sub);
    if (!user) {
      return next(BaseError.UnauthorizedError());
    }
    if (user.role !== "admin") {
      return next(BaseError.UnauthorizedError());
    }
    req.user = userData;
    next();
  } catch (error) {
    console.log("check admin middleware", error);
    return next(BaseError.UnauthorizedError());
  }
};

module.exports = AdminMiddleware;

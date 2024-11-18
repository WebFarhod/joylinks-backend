const userService = require("../services/user.service");
const BaseError = require("../utils/baseError");
const jwt = require("../utils/jwt");

const RoleMiddleware = (roles) => {
  return async (req, res, next) => {
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
      if (roles.includes(user.role)) {
        req.user = user;
        next();
      } else {
        return next(BaseError.UnauthorizedError());
      }
    } catch (error) {
      console.log("role middleware", error);
      return next(BaseError.UnauthorizedError());
    }
  };
};

module.exports = RoleMiddleware;

const BaseError = require("../utils/baseError");

const ErrorMiddleware = (error, req, res, next) => {
  if (error instanceof BaseError) {
    return res
      .status(error.status)
      .json({ message: error.message, errors: error.errors });
  }
  console.log(error);

  return res.status(500).json({ message: "Server error", error });
};

module.exports = ErrorMiddleware;

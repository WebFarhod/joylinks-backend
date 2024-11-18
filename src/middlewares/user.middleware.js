// const jwt = require("jsonwebtoken");
// const { verifyAccessToken } = require("../utils/jwt");

const jwt = require("../utils/jwt");

const UserMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const user = jwt.validateAccessToken(token);
    req.user = user;
    next();
  } catch (err) {
    console.log("fg", err);

    return res.sendStatus(403);
  }
};

module.exports = UserMiddleware;

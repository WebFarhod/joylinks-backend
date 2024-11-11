const jwt = require("jsonwebtoken");
const { verifyAccessToken } = require("../utils/jwt");

const checkUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

module.exports = { checkUser };

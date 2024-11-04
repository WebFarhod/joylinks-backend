// role.middleware.js
const jwt = require("jsonwebtoken");
const Role = require("../models/role.model");
require("dotenv").config();

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (allowedRoles.includes(user.role)) {
        req.user = user;
        next();
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    });
  };
};

const checkAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const role = await Role.findById(user.role).select("id name");
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    if (role.name === "admin") {
      req.user = user;
      next();
    } else {
      res.status(403).json({ message: "Access denied: Admins only" });
    }
  });
};

module.exports = {
  checkRole,
  checkAdmin
};

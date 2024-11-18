const User = require("../models/user.model"); // Make sure the path is correct
const Auth = require("../models/auth.model");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");

const checkAndCreateAdmin = async () => {
  try {
    const ADMIN_NAME = process.env.ADMIN_NAME;
    const ADMIN_SURNAME = process.env.ADMIN_SURNAME;
    const ADMIN_PHONE = process.env.ADMIN_PHONE;

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_NAME || !ADMIN_SURNAME || !ADMIN_PHONE || !ADMIN_PASSWORD) {
      throw new Error("Environment variables ADMIN DATAs are missing");
    }

    const admin = await User.findOne({
      phone: ADMIN_PHONE,
    });

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (!admin) {
      const auth = new Auth({ password: hashedPassword });
      await auth.save();
      const admin = new User({
        phone: ADMIN_PHONE,
        firstname: ADMIN_NAME,
        lastname: ADMIN_SURNAME,

        role: "admin",
        isActive: true,
        auth: auth,
      });
      await admin.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error checking or creating admin user:", error);
    process.exit(1);
  }
};

module.exports = { checkAndCreateAdmin };

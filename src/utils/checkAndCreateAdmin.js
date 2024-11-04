const mongoose = require("mongoose");
const User = require("../models/user.model"); // Make sure the path is correct
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkAndCreateAdmin = async () => {
  try {
    const admin = await User.findOne({
      role: "66b7643a2718a86350e0b9d3",
    });

    if (!admin) {
      // const hashedPassword = await bcrypt.hash("12345678", 10); // Use a secure password
      const newAdmin = new User({
        phone: "999999999",
        firstname: "Mironshoh",
        lastname: "LastName",
        password: "12345678",
        role: "66b7643a2718a86350e0b9d3",
        active: true,
        photo: "default.png", // Replace with a valid path or URL
      });
      await newAdmin.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error checking or creating admin user:", error);
  }
};

module.exports = { checkAndCreateAdmin };

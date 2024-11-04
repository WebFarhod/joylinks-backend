require("dotenv").config();
const mongoose = require("mongoose");
const { checkAndCreateAdmin } = require("./checkAndCreateAdmin");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("Connected to MongoDB");

      checkAndCreateAdmin();
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
module.exports = connectDB;

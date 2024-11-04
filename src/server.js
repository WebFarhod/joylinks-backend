require("dotenv").config();
const { wss } = require("./utils/wbserver");

const app = require("./app");
const connectDB = require("./utils/db");

const PORT = process.env.PORT || 3000;

// Unhandeled Rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 💥");
  console.log(err.name, err.message, err);
  // process.exit(1);
});

// Unhandled Excpections
process.on("uncaughtException", (err) => {
  console.log("UNHANDLED Excpections 💥");
  console.log(err.name, err.message);
  // process.exit(1);
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on portO ${PORT}`);
  });
});

wss.on("connection", (ws, req) => {
  // You can access user information from cookies or authentication headers here
  // For example, set ws.userId from a decoded token or session
  ws.userId = req.headers["user-id"]; // You might need to decode a token to get the user ID
});

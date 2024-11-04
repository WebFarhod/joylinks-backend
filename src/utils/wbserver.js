const WebSocket = require("ws");
const mongoose = require("mongoose");
const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const Role = require("../models/role.model");

// Create a new WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("A new client connected.");

  // Listen for messages from the client
  ws.on("message", (message) => {
    console.log("Received:", message);
    // Handle messages from the client
  });

  // Send a welcome message to the client
  ws.send("Welcome to the WebSocket server!");

  // Handle the disconnection
  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});

// // Function to send a notification to a specific user
// const sendNotificationToUser = async (userId, notificationMessage) => {
//   // Find the client based on user ID
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN && client.userId === userId) {
//       client.send(notificationMessage);
//     }
//   });
// };

// // Save the notification to the database and send it to the client
// const notifyUser = async (userId, message) => {
//   const notification = new Notification({
//     user_id: userId,
//     message: message,
//     isRead: false,
//     createdAt: new Date(),
//   });

//   await notification.save();

//   sendNotificationToUser(userId, message);
// };



const notifyAllUsers = async (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ notification: message }));
    }
  });
};

const notifyUsersByRole = async (roleName, message) => {
  try {

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      throw new Error("Role not found");
    }

    const users = await User.find({ role: role._id });

    users.forEach((user) => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.userId === user._id.toString()) {

          client.send(JSON.stringify({ notification: message }));
        }
      });
    });
  } catch (error) {
    console.error('Error notifying users by role:', error);
  }
};


const notifyUser = async (userId, message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.userId === userId) {
      client.send(JSON.stringify({ notification: message }));
    }
  });
};

module.exports = { wss, notifyUser, notifyAllUsers, notifyUsersByRole };
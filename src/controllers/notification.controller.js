const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

const {
  notifyUser,
  notifyAllUsers,
  notifyUsersByRole,
} = require("../utils/wbserver");

exports.createNotification = async (req, res) => {
  try {
    const { userId, message, toAll, toStudents, toMentors, is_active } =
      req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!userId && !toAll && !toStudents && !toMentors) {
      return res.status(400).json({
        error:
          "At least one target (userId, toAll, toStudents, toMentors) is required",
      });
    }

    const notification = new Notification({
      userId,
      message,
      toAll: toAll || false,
      toStudents: toStudents || false,
      toMentors: toMentors || false,
      is_active: true,
    });

    await notification.save();

    if (toAll) {
      await notifyAllUsers(message);
    } else {
      if (toStudents) {
        await notifyUsersByRole("student", message);
      }
      if (toMentors) {
        await notifyUsersByRole("mentor", message);
      }
      if (userId) {
        await notifyUser(userId, message);
      }
    }

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const userId = req.user.id;

    // Fetch user details and validate user existence
    const user = await User.findById(userId).populate("role").exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userCreatedAt = user.createdAt;

    let filters = {
      createdAt: { $gte: userCreatedAt },
    };

    if (user.role.name == "student") {
      filters.$or = [
        { toStudents: true },
        { userId: new mongoose.Types.ObjectId(user.id) },
        { is_active: true },
      ];
    }
    if (user.role.name === "mentor") {
      filters.$or = [
        { toMentors: true },
        { userId: new mongoose.Types.ObjectId(user.id) },
        { is_active: true },
      ];
    }
    if (user.role.name === "admin") {
      filters = {};
    }

    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit)) {
      return res.status(400).json({ error: "Invalid limit value" });
    }

    const unreadCount = await Notification.countDocuments({
      ...filters,
      readByUsers: { $ne: new mongoose.Types.ObjectId(userId) },
    });

    // Fetch notifications with user information
    const notifications = await Notification.aggregate([
      { $match: filters },
      {
        $lookup: {
          from: "users", // Name of the user collection
          localField: "userId",
          foreignField: "_id",
          as: "userInfo", // This will create a new field with user details
        },
      },
      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          message: 1,
          toAll: 1,
          toStudents: 1,
          toMentors: 1,
          isRead: 1,
          is_active: 1,
          createdAt: 1,
          updatedAt: 1,
          userId: "$userInfo._id",
          "user.name": "$userInfo.firstname",
          "user.lastname": "$userInfo.lastname",

          isRead: {
            $in: [new mongoose.Types.ObjectId(userId), "$readByUsers"],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parsedLimit },
    ]);

    // Count total notifications matching the filters
    const totalCount = await Notification.countDocuments(filters);

    if (notifications.length === 0) {
      return res.status(200).json({
        message: "No notifications available.",
        notifications: [],
        totalPages: 0,
        currentPage: page,
        unreadCount: unreadCount,
      });
    }
    // Respond with notifications or a message if none exist
    if (notifications.length === 0) {
      return res.status(200).json({
        message: "No notifications available.",
        notifications: [],
        totalPages: 0,
        currentPage: page,
        unreadCount: unreadCount,
      });
    }

    res.status(200).json({
      notifications: notifications,
      totalPages: Math.ceil(totalCount / parsedLimit),
      currentPage: parseInt(page, 10),
      unreadCount: unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (!notification.readByUsers.includes(userId)) {
      notification.readByUsers.push(userId);
      await notification.save();
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error fetching notification by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, req.body);

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid notification ID format" });
    }

    // Find and update the notification by ID
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { $set: req.body }, // Use $set to update only the provided fields
      { new: true, runValidators: true } // Return the updated document and run schema validation
    );

    // Check if the notification was found and updated
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: error.message });
  }
};
// Delete a notification by ID
exports.deleteNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid notification ID format" });
    }

    console.log("Attempting to delete notification with ID:", id);

    // Find the notification by ID
    const notification = await Notification.findById(id);
    // const notification = await Notification.deleteMany();

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    console.log("Found notification:", notification);

    // Delete the notification
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res
        .status(404)
        .json({ message: "Notification not found during delete operation" });
    }

    console.log("Deleted notification with ID:", id);

    // Return a success response
    res.status(200).json({
      message: "Notification deleted successfully",
      deletedNotification,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: error.message });
  }
};

// Send a notification message to a specific user
exports.sendMessageToUser = async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Notify only the specific user (userId)
    await notifyUser(userId, message);
    res.status(200).json({ message: "Notification sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

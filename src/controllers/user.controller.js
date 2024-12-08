const User = require("../models/user.model");
const userService = require("../services/user.service");

class UserController {
  async createUser(req, res, next) {
    try {
      const { firstname, lastname, phone, role, password } = req.body;
      const user = req.user;
      if (!firstname || !lastname || !phone || !role || !password) {
        return res
          .status(400)
          .json({ error: "Talab qilinga malumotlar mavjud emas" });
      }
      const data = await userService.create(
        firstname,
        lastname,
        phone,
        role,
        password,
        user
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log("error", error);

      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const user = req.user;
      const data = await userService.getAll(req.query, user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const data = await userService.getById(req.params.id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req, res, next) {
    try {
      const data = await userService.updateMe(req.user.sub, req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateUserById(req, res, next) {
    try {
      if (!req.body) {
        return res.status(400).json({
          message: "Yangilash uchun hech qanday ma'lumot berilmagan.",
        });
      }
      const data = await userService.update(req.params.id, req.body, req.user);
      return res.status(200).json(data);
    } catch (error) {
      console.log("errt", error);

      next(error);
    }
  }

  async deleteUserById(req, res, next) {
    try {
      const data = await userService.delete(req.params.id, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

// Create a new user
// exports.createUser = async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get all users with optional filtering by is_active
// exports.getUsers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, role, search, is_active } = req.query;

//     // Construct the match stage for filtering users
//     const matchStage = {};

//     if (search) {
//       matchStage.$or = [
//         { firstname: { $regex: search, $options: "i" } },
//         { lastname: { $regex: search, $options: "i" } },
//         { phone: { $regex: search, $options: "i" } }, // Use phone for search, not email
//       ];
//     }

//     if (is_active !== undefined) {
//       matchStage.is_active = is_active === "true"; // Convert string to boolean
//     }

//     // Initialize the aggregation pipeline
//     const pipeline = [
//       { $match: matchStage },
//       {
//         $lookup: {
//           from: "courses", // Assuming there is a 'courses' collection
//           localField: "_id",
//           foreignField: "teacher_id", // Adjust according to the relationship
//           as: "courses",
//         },
//       },
//       {
//         $lookup: {
//           from: "roles", // The collection to join with
//           localField: "role", // Field from the `users` collection
//           foreignField: "_id", // Field from the `roles` collection
//           as: "roleDetails", // Output field
//         },
//       },
//       {
//         $unwind: {
//           path: "$roleDetails", // Deconstruct the `roleDetails` array
//           preserveNullAndEmptyArrays: true, // Include users without a role
//         },
//       },
//       {
//         $match: role ? { "roleDetails.name": role } : {}, // Filter by role name if provided
//       },
//       {
//         $project: {
//           firstname: 1,
//           lastname: 1,
//           phone: 1,
//           role: {
//             name: "$roleDetails.name",
//             _id: "$roleDetails._id",
//           },
//           biography: 1,
//           photo: 1,
//           courseCount: { $size: "$courses" }, // Get the number of courses
//         },
//       },
//       { $skip: (page - 1) * parseInt(limit) },
//       { $limit: parseInt(limit) },
//     ];

//     // Execute the aggregation pipeline
//     const users = await User.aggregate(pipeline);

//     // Count the total number of users matching the filter
//     const totalUsers = await User.countDocuments(matchStage);

//     // Respond with paginated results
//     res.status(200).json({
//       total: totalUsers,
//       totalPages: Math.ceil(totalUsers / limit),
//       currentPage: parseInt(page),
//       users,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get a user by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).populate("role");
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Update a user by ID
// exports.updateUserById = async (req, res) => {
//   try {
//     console.log("Request body:", req.body); // Log the request body

//     const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error during update:", error); // Log the error
//     res.status(400).json({ error: error.message });
//   }
// };

// Delete a user by ID
// exports.deleteUserById = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const BaseError = require("../utils/baseError");
const mongoose = require("mongoose");
const Auth = require("../models/auth.model");
// import RoleUser from "../enums/role.enum";
// import { AddUserCourseDto, CheckUserApprovedDto } from "../validators/user";
// import Course from "../schemas/course.schema";

class UserService {
  async findUserById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw BaseError.BadRequest("Invalid ID format");
    }

    return await User.findById(id);
  }

  async create(firstname, lastname, phone, role, password) {
    const user = await User.findOne({ phone }).populate("auth");
    if (user) {
      throw BaseError.BadRequest(
        `${phone} ushbu raqam tizimda ro'yxatdan o'tgan!`
      );
    }
    const roles = ["teacher", "mentor"];
    if (roles.includes(data.role)) {
      throw BaseError.BadRequest(`${data.role} ruhsat etilmagan role`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAuth = new Auth({ password: hashedPassword });
    await newAuth.save();
    const newUser = new User({
      firstname,
      lastname,
      phone,
      role,
      isApproved: true,
      auth: newAuth._id,
    });
    await newUser.save();
    return {
      message: `${role} tizimdan ro'xatdan o'tkazildi.`,
    };
  }

  async getAll(data) {
    const { page = 1, limit = 10, role, search, isActive } = data;
    const matchStage = {};

    if (search) {
      matchStage.$or = [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== undefined) {
      matchStage.isActive = isActive;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "courses", // Assuming there is a 'courses' collection
          localField: "_id",
          foreignField: "teacher_id", // Adjust according to the relationship
          as: "courses",
        },
      },
      {
        $lookup: {
          from: "roles", // The collection to join with
          localField: "role", // Field from the `users` collection
          foreignField: "_id", // Field from the `roles` collection
          as: "roleDetails", // Output field
        },
      },
      {
        $unwind: {
          path: "$roleDetails", // Deconstruct the `roleDetails` array
          preserveNullAndEmptyArrays: true, // Include users without a role
        },
      },
      {
        $match: role ? { "roleDetails.name": role } : {}, // Filter by role name if provided
      },
      {
        $project: {
          firstname: 1,
          lastname: 1,
          phone: 1,
          role: {
            name: "$roleDetails.name",
            _id: "$roleDetails._id",
          },
          biography: 1,
          photo: 1,
          courseCount: { $size: "$courses" }, // Get the number of courses
        },
      },
      { $skip: (page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
    ];

    // Execute the aggregation pipeline
    const users = await User.aggregate(pipeline);

    // Count the total number of users matching the filter
    const totalUsers = await User.countDocuments(matchStage);

    // Respond with paginated results
    return {
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
      users,
    };
  }

  async getById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw BaseError.BadRequest("Foydalanuvchi mavjud emas.");
    }
    return user;
  }

  async updateMe(id, data) {
    if (!id) {
      throw BaseError.NotFoundError("Id mavjud emas");
    }
    const updateData = {};
    if (data.firstname) updateData.firstname = data.firstname;
    if (data.lastname) updateData.lastname = data.lastname;
    if (data.photo) updateData.photo = data.photo;
    if (data.biography) updateData.biography = data.biography;
    if (data.region) updateData.region = data.region;
    if (data.district) updateData.district = data.district;
    if (data.birthdate) updateData.birthdate = data.birthdate;
    if (data.gender) updateData.gender = data.gender;
    if (Object.keys(updateData).length === 0) {
      throw BaseError.BadRequest(
        "Yangilash uchun hech qanday ma'lumot berilmagan."
      );
    }
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!user) {
      throw BaseError.NotFoundError("User topilmadi.");
    }
    return {
      message: "Ma'limotlar muvaffaqiyatli yangilandi.",
    };
  }

  async update(id, data) {
    if (!id) {
      throw BaseError.NotFoundError("Id mavjud emas");
    }
    const userCheck = await User.findById(id);
    if (!userCheck) {
      throw BaseError.NotFoundError("User topilmadi.");
    }
    if (userCheck.role === "admin") {
      throw BaseError.BadRequest("Ruhsat berilmagan.");
    }

    const roles = ["teacher", "mentor", "student"];
    console.log(data.role, roles.includes(data.role));
    if (!roles.includes(data.role)) {
      throw BaseError.BadRequest(`${data.role} ruhsat etilmagan role`);
    }
    const updateData = {};
    if (data.role) updateData.role = data.role;
    if (data.balance) updateData.balance = data.balance;
    if (data.isBlock) updateData.isBlock = data.isBlock;
    if (Object.keys(updateData).length === 0) {
      throw BaseError.BadRequest(
        "Yangilash uchun hech qanday ma'lumot berilmagan."
      );
    }
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!user) {
      throw BaseError.NotFoundError("User topilmadi.");
    }
    return {
      message: "User muvaffaqiyatli yangilandi.",
    };
  }

  async delete(id) {
    if (!id) {
      throw BaseError.NotFoundError("Id mavjud emas");
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw BaseError.NotFoundError("Banner topilmadi.");
    }
    await Auth.findByIdAndDelete(user.auth);

    return { message: "User o'chirildi" };
  }
}
module.exports = new UserService();

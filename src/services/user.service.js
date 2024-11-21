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

  async create(firstname, lastname, phone, role, password, user) {
    const existUser = await User.findOne({ phone }).populate("auth");
    if (existUser) {
      throw BaseError.BadRequest(
        `${phone} ushbu raqam tizimda ro'yxatdan o'tgan!`
      );
    }
    if (user.role === "admin") {
      const roles = ["teacher", "mentor"];
      if (!roles.includes(role)) {
        throw BaseError.BadRequest(`${role} ruhsat etilmagan role`);
      }
    } else {
      const roles = ["mentor"];
      if (!roles.includes(role)) {
        throw BaseError.BadRequest(`${role} ruhsat etilmagan role`);
      }
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
      createBy: user.sub,
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
          from: "users", // Assuming there is a 'courses' collection
          localField: "_id",
          foreignField: "createBy", // Adjust according to the relationship
          as: "createBy",
        },
      },
      // {
      //   $lookup: {
      //     from: "roles", // The collection to join with
      //     localField: "role", // Field from the `users` collection
      //     foreignField: "_id", // Field from the `roles` collection
      //     as: "roleDetails", // Output field
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$roleDetails", // Deconstruct the `roleDetails` array
      //     preserveNullAndEmptyArrays: true, // Include users without a role
      //   },
      // },
      {
        $match: role ? { role } : {}, // Filter by role name if provided
      },
      {
        $project: {
          firstname: 1,
          lastname: 1,
          phone: 1,
          role: 1,
          biography: 1,
          photo: 1,
          balance: 1,
          region: 1,
          district: 1,
          birthdate: 1,
          gender: 1,
          isActive: 1,
          isApproved: 1,
          isBlock: 1,
          isApproved: 1,
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
    if (data.birthdate) {
      if (!data.birthdate) {
        return { valid: false, message: "Birthdate berilmagan." };
      }

      const date = new Date(data.birthdate);
      if (isNaN(date.getTime())) {
        throw BaseError.BadRequest("Noto'g'ri sana formati.");
      }

      const now = new Date();
      if (date > now) {
        throw BaseError.BadRequest("Noto'g'ri sana formati.");
      }
      updateData.birthdate = data.birthdate;
    }
    if (data.gender) {
      const gender = ["male", "female"];
      if (!gender.includes(data.gender)) {
        throw BaseError.BadRequest(`${data.gender} ruhsat etilmagan tur`);
      }
      updateData.gender = data.gender;
    }
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
      data: user,
    };
  }

  async update(id, data, user) {
    if (!id) {
      throw BaseError.NotFoundError("Id mavjud emas");
    }
    let filter = { _id: id };
    if (user.role !== "admin") {
      filter.createBy = user.sub;
    }
    const userCheck = await User.findOne(filter);
    if (!userCheck) {
      throw BaseError.NotFoundError("User topilmadi.");
    }
    if (userCheck.role === "admin") {
      throw BaseError.BadRequest("Ruhsat berilmagan.");
    }

    if (user.role === "admin") {
      const roles = ["teacher", "mentor", "student"];
      console.log(data.role, roles.includes(data.role));
      if (!roles.includes(data.role)) {
        throw BaseError.BadRequest(`${data.role} ruhsat etilmagan role`);
      }
      const updateData = {};
      if (data.role) updateData.role = data.role;
      if (data.balance) updateData.balance = data.balance;
      if (typeof data.isBlock !== "undefined")
        updateData.isBlock = data.isBlock;
      if (Object.keys(updateData).length === 0) {
        throw BaseError.BadRequest(
          "Yangilash uchun hech qanday ma'lumot berilmagan."
        );
      }
      const existUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!existUser) {
        throw BaseError.NotFoundError("User topilmadi.");
      }
      return {
        message: "User muvaffaqiyatli yangilandi.",
        data: existUser,
      };
    } else {
      const updateData = {};
      if (typeof data.isBlock !== "undefined")
        updateData.isBlock = data.isBlock;
      if (Object.keys(updateData).length === 0) {
        throw BaseError.BadRequest(
          "Yangilash uchun hech qanday ma'lumot berilmagan."
        );
      }
      const existUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!existUser) {
        throw BaseError.NotFoundError("User topilmadi.");
      }
      return {
        message: "User muvaffaqiyatli yangilandi.",
        data: existUser,
      };
    }
  }

  async delete(id, user) {
    if (!id) {
      throw BaseError.NotFoundError("Id mavjud emas");
    }
    const filter = { _id: id };
    if (user.role !== "admin") {
      filter.createBy = user.sub;
    }
    let existUser = await User.findOne(filter);
    if (!existUser) {
      throw BaseError.NotFoundError("User topilmadi.");
    }
    if (existUser.role === "admin") {
      throw BaseError.BadRequest("Ruhsat berilmagan.");
    }
    existUser = await User.findOneAndDelete(filter);
    if (!existUser) {
      throw BaseError.NotFoundError("User topilmadi.");
    }
    await Auth.findByIdAndDelete(existUser.auth);

    return { message: "User o'chirildi" };
  }
}
module.exports = new UserService();

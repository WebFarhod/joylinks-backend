const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      minlength: 3,
      trim: true,
    },
    lastname: {
      type: String,
      minlength: 3,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      minlength: 9,
      maxlength: 9,
      match: [/^\d{9}$/, "Phone number must be 9 digits."],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    biography: {
      type: String,
      default: "Salom Men dasturchiman",
    },
    photo: {
      type: String,
      trim: true,
      default: "./profiles/user.jpg",
    },
    lastname: {
      type: String,
      minlength: 3,
      trim: true,
    },
    region: {
      type: String,
      enum: [
        "Toshkent viloyati",
        "Andijon viloyati",
        "Buxoro viloyati",
        "Samarqand viloyati",
        "Farg‘ona viloyati",
        "Jizzax viloyati",
        "Qashqadaryo viloyati",
        "Xorazm viloyati",
        "Namangan viloyati",
        "Navoiy viloyati",
        "Surxondaryo viloyati",
        "Qoraqalpog‘iston Respublikasi",
        "Toshkent shahar",
      ],
      default: "Toshkent viloyati",
    },
    district: {
      type: String,
      default: "Asaka tumani",
    },
    birthdate: {
      type: Date,
      default: Date.now,
    },
    refreshToken: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    is_active: {
      type: Boolean,
      default: true, // New field to indicate if the user is active
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.virtual("notifications", {
  ref: "notifications",
  localField: "_id",
  foreignField: "userId",
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hashPassword = await bcrypt.hash(this.password, 12);
  this.password = hashPassword;
  next();
});

// Filter out inactive users
userSchema.pre(/^find/, function (next) {
  this.find({ is_active: { $ne: false } });
  next();
});

// Cascade delete related notifications
userSchema.pre(
  "deleteOne",
  { document: true, query: true },
  async function (next) {
    try {
      // Delete all notifications related to this user
      await mongoose.model("notifications").deleteMany({ userId: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;

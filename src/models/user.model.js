const { Schema, model } = require("mongoose");
const { RegionsEnum } = require("../enums/region.enum");
const { RolesEnum } = require("../enums/role.enum");
const { GendersEnum } = require("../enums/gender.enum");

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      minlength: 3,
      trim: false,
      required: false,
    },
    lastname: {
      type: String,
      minlength: 3,
      trim: false,
      required: false,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: RolesEnum,
      default: "student",
      required: true,
    },
    biography: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      trim: true,
      default: null,
      required: false,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
    region: {
      type: String,
      enum: RegionsEnum,
      default: null,
      required: false,
    },
    district: {
      type: String,
      default: null,
      required: false,
    },
    birthdate: {
      type: Date,
      default: null,
      required: false,
    },
    gender: {
      type: String,
      enum: GendersEnum,
      default: "none",
    },
    isActive: {
      type: Boolean,
      default: false,
      required: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
      required: false,
    },
    isBlock: {
      type: Boolean,
      default: false,
      required: true,
    },
    auth: {
      type: Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },
    createBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
  },
  { timestamps: true }
);

const User = model("users", userSchema);
module.exports = User;

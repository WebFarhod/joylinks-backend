const { Schema, model } = require("mongoose");

const authSchema = new Schema(
  {
    code: {
      type: String,
      required: false,
      default: null,
    },
    expires: {
      type: Date,
      required: false,
      default: null,
    },
    attemptCount: {
      type: Number,
      required: false,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      required: false,
      default: false,
    },
    blockExpires: {
      type: Date,
      required: false,
      default: null,
    },
    password: {
      type: String,
      required: false,
    },
    key: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Auth = model("auth", authSchema);

module.exports = Auth;

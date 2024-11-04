const mongoose = require("mongoose");
const { TransactionStatus } = require("../configs/transaction");

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    trans_id: {
      type: String,
      // required: true,
    },
    user_id: {
      type: String,
      required: true,
      ref: "users",
    },
    course_id: {
      type: String,
      required: true,
      ref: "courses",
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    create_time: {
      type: Number,
      default: Date.now(),
    },
    perform_time: {
      type: Number,
      default: 0,
    },
    cancel_time: {
      type: Number,
      default: 0,
    },
    prepare_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("transaction", transactionSchema);

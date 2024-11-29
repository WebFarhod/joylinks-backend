const { Schema, model } = require("mongoose");

const paymentSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
      required: true,
    },
    payment_type: {
      type: String,
      enum: ["payme", "click", "course"],
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = model("payment", paymentSchema);
module.exports = Payment;

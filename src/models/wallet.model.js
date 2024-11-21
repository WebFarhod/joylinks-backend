const { Schema, model } = require("mongoose");

const walletSchema = new Schema(
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
  },
  { timestamps: true }
);

const Wallet = model("wallet", walletSchema);
module.exports = Wallet;

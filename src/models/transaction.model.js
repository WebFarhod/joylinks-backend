const mongoose = require("mongoose");

const { PaymeState } = require("../enums/PaymeState");

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        course_id: {
            type: Schema.Types.ObjectId,
            ref: "courses",
            required: true,
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        state: {
            type: Number,
            enum: Object.values(PaymeState),
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
        reason: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);
const Transaction = model("transaction", transactionSchema);

module.exports = Transaction;

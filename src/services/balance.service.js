const mongoose = require("mongoose");
const BaseError = require("../utils/baseError");
const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const CoursePayment = require("../models/coursePayment");
const Course = require("../models/course.model");

class BalanceService {
  async processPayment(payment_type, amount, user_id, payment_id) {
    const Mid = process.env.PAYME_MERCHANT_ID;
    // console.log("====================================");
    // console.log(Mid);
    // console.log("====================================");
    if (!Mid) {
      throw BaseError.BadRequest("merchant id topilmadi");
    }
    // console.log(payment_type, amount, user_id);

    if (payment_type === "payme") {
      const params = {
        m: Mid,
        "ac.user_id": user_id,
        "ac.course_id": payment_id,
        a: amount * 100,
      };

      let queryString = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join(";");

      console.log("====================================");
      console.log("0001:", queryString);
      console.log("0002:", ` m=${Mid};ac.user_id=${user_id};a=${amount * 100}`);
      console.log("====================================");

      let base64String = Buffer.from(queryString).toString("base64");

      let paymeUrl = `https://checkout.paycom.uz/${base64String}`;
      // console.log("sdfsdfsdfsd", paymeUrl);
      return paymeUrl;
    }
  }
  async create(amount, user, payment_type) {
    // let wallet = await Wallet.findOne({ user_id: user.sub });
    // if (wallet) {
    //   wallet.amount = amount;
    //   wallet.save();
    // } else {
    const payment = new Payment({
      user_id: user.sub,
      amount,
      payment_type,
      isCompleted: false,
    });
    await payment.save();
    const paymentSuccess = await this.processPayment(
      payment_type,
      amount,
      user.sub,
      payment._id
    );
    return paymentSuccess;
  }

  async myBalance(user) {
    const userData = await User.findById(user.sub);
    const payments = await Payment.find({ user_id: user.sub });
    const balance = userData.balance;
    if (user.role == "student") {
      return {
        balance,
        payments,
      };
    }
    if (user.role == "mentor") {
      const courses = await Course.find({ mentorId: user.sub });
      let coursePayments = [];
      console.log("ghj", courses);

      for (const course of courses) {
        coursePayments = await CoursePayment.find({ courseId: course._id });
        for (const coursePayment of coursePayments) {
          coursePayment.totalMentorSum =
            (coursePayment.total * coursePayment.mentorPercentage) / 100;
        }
      }
      return {
        balance,
        payments,
        coursePayments,
      };
    }
    if (user.role == "teacher") {
      const courses = await Course.find({ teacherId: user.sub });
      let coursePayments = null;
      for (const course of courses) {
        coursePayments = await CoursePayment.find({ courseId: course._id });
        for (const coursePayment of coursePayments) {
          coursePayment.totalMentorSum =
            (coursePayment.total * coursePayment.mentorPercentage) / 100;
        }
      }
      return {
        balance,
        payments,
        mentorSum: coursePayments,
      };
    }
  }
}

module.exports = new BalanceService();

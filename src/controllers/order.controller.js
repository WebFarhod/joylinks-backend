// const axios = require("axios");
const Course = require("../models/course.model");
const StudentCourse = require("../models/studentCourse.model");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Buffer = require("buffer").Buffer;

const processPayment = async (payment_type, price, course_id, user_id) => {
  const Mid = process.env.PAYME_MERCHANT_ID;
  console.log("====================================");
  console.log(Mid);
  console.log("====================================");
  if (!Mid) {
    return "merchant id topilmadi";
  }
  if (payment_type === "payme") {
    const params = {
      m: Mid,
      "ac.course_id": course_id,
      "ac.user_id": user_id,
      a: price * 100,
    };

    let queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join(";");

    console.log("====================================");
    console.log("Yaratilgan Query String:", queryString);
    console.log("====================================");

    let base64String = Buffer.from(
      ` m=${Mid};ac.course_id=${course_id};ac.user_id=${user_id};a=${
        price * 100
      }`
    ).toString("base64");

    let paymeUrl = `https://checkout.paycom.uz/${base64String}`;
    return paymeUrl;
  }
};
exports.createOrder = async (req, res) => {
  const { course_id, user_id, payment_type } = req.body;

  try {
    const course = await Course.findById(course_id);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
    }
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const studentCourse = await StudentCourse.findOne({
      course_id,
      student_id: user_id,
    });
    console.log("vg0", studentCourse);

    if (studentCourse) {
      return res.status(404).json({ message: "Course already exist" });
    }
    const price = course.price;

    const paymentSuccess = await processPayment(
      payment_type,
      price,
      course_id,
      user_id
    );

    res.json(paymentSuccess);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

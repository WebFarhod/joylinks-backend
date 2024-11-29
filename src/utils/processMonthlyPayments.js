const Balance = require("../models/balance.model");
// const CoursePayment = require("../models/coursePayment.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const CoursePayment = require("../models/coursePayment");
const Payment = require("../models/payment.model");
const StudentCourse = require("../models/studentCourse.model");

async function processMonthlyPayments() {
  try {
    const today = new Date();
    const courses = await Course.find();
    for (const course of courses) {
      let mentorSum = 0;
      const studentCourses = await StudentCourse.find({ courseId: course._id });

      const mentor = await User.findById(course.mentorId);
      if (!mentor) {
        console.log(`Mentor topilmadi: ${course.mentorId}`);
        continue;
      }
      console.log("Student courses:", studentCourses);

      for (const studentCourse of studentCourses) {
        const startDate = studentCourse.createdAt;
        const endDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + studentCourse.supportUntil
        );

        if (today > endDate) {
          console.log(
            `Kursning qo'llab-quvvatlash muddati tugagan: ${studentCourse.id}`
          );
          continue;
        }

        const totalMonths = studentCourse.supportUntil;

        const monthlyMentorAmount =
          (studentCourse.price * (studentCourse.mentorPercentage / 100)) /
          totalMonths;

        const elapsedMonths =
          (today.getFullYear() - startDate.getFullYear()) * 12 +
          (today.getMonth() - startDate.getMonth());
        console.log(
          "elapsedMonths:",
          elapsedMonths,
          "totalMonths:",
          totalMonths
        );

        if (elapsedMonths >= totalMonths) {
          console.log(
            `Kursning mentorga to'lov muddati tugagan: ${studentcourse.courseId}`
          );
          continue;
        }
        mentorSum += monthlyMentorAmount;
      }
      mentor.balance += mentorSum;
      mentor.save();

      await Payment.create({
        user_id: course.mentorId,
        amount: mentorSum,
        payment_type: "course",
      });
      const coursePayment = await CoursePayment.findOne({
        courseId: course._id,
      });
      if (coursePayment) {
        coursePayment.mentorSum = (coursePayment.mentorSum || 0) + mentorSum;
        await coursePayment.save();
      }
    }
  } catch (error) {
    console.error("Error processing monthly payments:", error);
  }
}

module.exports = processMonthlyPayments;

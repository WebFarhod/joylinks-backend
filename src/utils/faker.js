const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

// Import your models
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Category = require("../models/category.model");
const Course = require("../models/category.model");
const Module = require("../models/module.model");
const Lesson = require("../models/lesson.model");
const Question = require("../models/question.model");
const Review = require("../models/review.model");
const StudentCourse = require("../models/studentCourse.model");
const Assignment = require("../models/assign.model");
const Quiz = require("../models/quiz.model");
const Notification = require("../models/notification.model");
const QuizQuestion = require("../models/quizQuestion.model");
const connectDB = require("./db");
// const app = require("../app");
const generateFakeData = async () => {
  try {
    await connectDB().then(() => {
      // app.listen(PORT, () => {
      //   console.log(`Server running on port ${PORT}`);
      // });
    });
    // Create fake roles
    // for (let i = 0; i < 5; i++) {
    //   await Role.create({
    //     name: faker.helpers.arrayElement([
    //       "user",
    //       "student",
    //       "admin",
    //       "teacher",
    //       "mentor",
    //     ]),
    //     status: faker.datatype.boolean(),
    //   });
    // }

    // Create fake users
    // for (let i = 0; i < 10; i++) {
    //   await User.create({
    //     phone: faker.phone.number("#########"),
    //     password: faker.internet.password(),
    //     role: faker.random.arrayElement([
    //       "66b7630e0f59666fbef15be1",
    //       "66b859e2d88861bec54fc69f",
    //       "66b85a1cd88861bec54fc6a1",
    
    //     ]),
    //     active: faker.datatype.boolean(),
    //     // photo: faker.internet.avatar(),
    //   });
    // }

    // Create fake categories
    for (let i = 0; i < 10; i++) {
      await Category.create({
        name: faker.commerce.department(),
        is_active: faker.datatype.boolean(),
      });
    }

    // Create fake courses
    for (let i = 0; i < 10; i++) {
      await Course.create({
        category_id: faker.datatype.number({ min: 1, max: 10 }),
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        teacher_id: JSON.stringify([
          faker.datatype.number({ min: 1, max: 10 }),
        ]),
        price: faker.commerce.price(),
        duration: faker.date.future(),
        level: faker.helpers.arrayElement([
          "beginner",
          "intermediate",
          "advanced",
        ]),
        is_active: faker.datatype.boolean(),
        mentor_id: faker.datatype.number({ min: 1, max: 10 }),
      });
    }

    // Create fake modules
    for (let i = 0; i < 10; i++) {
      await Module.create({
        course_id: faker.datatype.number({ min: 1, max: 10 }),
        name: faker.commerce.productName(),
        sequence: faker.datatype.number(),
        is_active: faker.datatype.boolean(),
      });
    }

    // Create fake lessons
    for (let i = 0; i < 10; i++) {
      await Lesson.create({
        name: faker.lorem.words(3),
        sequence: faker.datatype.number(),
        video_link: faker.internet.url(),
        duration: faker.datatype.number(),
        module_id: faker.datatype.number({ min: 1, max: 10 }),
        is_active: faker.datatype.boolean(),
      });
    }

    // Create fake questions
    for (let i = 0; i < 10; i++) {
      await Question.create({
        course: faker.datatype.number({ min: 1, max: 10 }),
        lesson: faker.datatype.number({ min: 1, max: 10 }),
        student_id: faker.datatype.number({ min: 1, max: 10 }),
        text: faker.lorem.sentence(),
        replies: JSON.stringify([faker.lorem.sentence()]),
        file: faker.system.filePath(),
      });
    }

    // Create fake reviews
    for (let i = 0; i < 10; i++) {
      await Review.create({
        course_id: faker.datatype.number({ min: 1, max: 10 }),
        comment: faker.lorem.paragraph(),
        rating: faker.datatype.number({ min: 1, max: 5 }),
        createdAt: faker.date.past(),
        student_id: faker.datatype.number({ min: 1, max: 10 }),
        is_active: faker.datatype.boolean(),
      });
    }

    // Create fake student courses
    for (let i = 0; i < 10; i++) {
      await StudentCourse.create({
        course_id: faker.datatype.number({ min: 1, max: 10 }),
        student_id: faker.datatype.number({ min: 1, max: 10 }),
        enrolledAt: faker.date.past(),
        progress: faker.datatype.number({ min: 0, max: 100 }),
        completed: faker.datatype.boolean(),
      });
    }

    // Create fake assignments
    for (let i = 0; i < 10; i++) {
      await Assignment.create({
        module_id: faker.datatype.number({ min: 1, max: 10 }),
        teacher_id: faker.datatype.number({ min: 1, max: 10 }),
        name: faker.commerce.productName(),
        decription: faker.lorem.paragraph(),
        file: faker.system.filePath(),
        mark: faker.datatype.number({ min: 0, max: 100 }),
        fileUrl: faker.internet.url(),
        dueTime: faker.date.future(),
        is_active: faker.datatype.boolean(),
      });
    }

    // Create fake quizzes
    for (let i = 0; i < 10; i++) {
      await Quiz.create({
        teacher_id: faker.datatype.number({ min: 1, max: 10 }),
        questions: JSON.stringify([
          {
            question: faker.lorem.sentence(),
            options: [
              { text: faker.lorem.word(), isCorrect: false },
              { text: faker.lorem.word(), isCorrect: true },
            ],
          },
        ]),
        mark: faker.datatype.number({ min: 0, max: 100 }),
      });
    }

    // Create fake notifications
    for (let i = 0; i < 10; i++) {
      await Notification.create({
        user_id: faker.datatype.number({ min: 1, max: 10 }),
        message: faker.lorem.sentence(),
        isRead: faker.datatype.boolean(),
        createdAt: faker.date.recent(),
      });
    }

    console.log("Fake data generation completed!");
  } catch (error) {
    console.error("Error generating fake data:", error.message);
  }
};

// Call the function
generateFakeData();

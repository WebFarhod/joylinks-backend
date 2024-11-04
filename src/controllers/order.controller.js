const Order = require("../models/order.model");
const Course = require("../models/course.model");
const StudentCourse = require("../models/studentCourse.model");
const mongoose = require('mongoose');
const User = require("../models/user.model");

exports.createOrder = async (req, res) => {
    const { course_id, user_id, payment_type } = req.body;
    console.log('====================================');
    console.log(course_id, user_id);
    console.log('====================================');
    try {
        const course = await Course.findById(course_id);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
        }
        const user = await User.findById(user_id);
        if (!course) {
            res.status(404).json({ message: "User not found" });
        }
        const price = course.price;

        // const paymentSuccess = await processPayment(payment_type, price, course_id, user_id);

        if (true) {

            const order = new Order({
                course_id: course._id,
                student_id: user._id,
                status: 'paid'
            });

            await order.save();

            // const studentCourse = new StudentCourse({
            //     student_id: user_id,
            //     course_id: course_id,
            // });

            // await studentCourse.save();

            res.status(201).json(order);
        } else {
            res.status(400).json({ message: 'Payment failed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    const orderId = new mongoose.Types.ObjectId(id);

    try {
        const order = await Order.aggregate([{
            $match: { _id: orderId }
        },
        {
            $lookup: {
                from: "courses",
                localField: "course_id",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $unwind: "$course"
        },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 0,
                user: {
                    id: "$user._id",
                    name: "$user.name",
                    phone: "$user.phone"
                },
                course: "$course",
            }
        },
        ])

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const { student_id, course_id } = req.query;

        const matchCriteria = {};
        if (student_id) {
            matchCriteria.student_id = new mongoose.Types.ObjectId(student_id);
        }
        if (course_id) {
            matchCriteria.course_id = new mongoose.Types.ObjectId(course_id);
        }
        const orders = await Order.aggregate([
            {
                $match: matchCriteria
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course_id",
                    foreignField: "_id",
                    as: "course_info"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "student_id",
                    foreignField: "_id",
                    as: "student_info"
                }
            },
            {
                $unwind: "$course_info"
            },
            {
                $unwind: "$student_info"
            },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    created_at: 1,
                    course: {
                        id: "$course_info._id",
                        name: "$course_info.name",
                        price: "$course_info.price"
                    },
                    student: {
                        id: "$student_info._id",
                        name: "$student_info.name",
                        phone: "$student_info.phone"
                    }
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);


        const totalOrders = await Order.countDocuments(matchCriteria);
        const totalPages = Math.ceil(totalOrders / limit);

        res.status(200).json({
            orders,
            currentPage: page,
            totalPages,
            totalOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
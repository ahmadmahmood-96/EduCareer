const router = require('express').Router();
const OrderModel = require('../models/order');
const { User } = require("../models/user");
const CoursesModel = require('../models/course');

// Get all orders with user details and course names
router.get('/allOrders', async (req, res) => {
    try {
        const orders = await OrderModel.find();

        // Iterate through each order and fetch user details and course names
        const ordersWithUserAndCourseDetails = await Promise.all(orders.map(async order => {
            const user = await User.findById(order.userId);

            // Extract course IDs from the order
            const courseIds = order.courses.map(course => course.courseId);

            // Fetch course names using course IDs
            const courses = await CoursesModel.find({ _id: { $in: courseIds } });

            // Map course names to an array
            const courseNames = courses.map(course => course.title);

            // Merge order, user, and course details
            return {
                ...order.toObject(),
                userName: `${user.firstName} ${user.lastName}`,
                userEmail: user.email,
                courseNames: courseNames
            };
        }));

        res.json(ordersWithUserAndCourseDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

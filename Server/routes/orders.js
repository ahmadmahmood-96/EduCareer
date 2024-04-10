const router = require('express').Router();
const OrderModel = require('../models/order');
const CoursesModel = require('../models/course');

// Route to get order details for a specific user
router.get('/orders/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await OrderModel.find({ userId });

         for (const order of orders) {
            const courseIds = order.courses.map(course => course.courseId);
            const courses = await CoursesModel.find({ _id: { $in: courseIds } });

            order.courses = order.courses.map(course => {
                const correspondingCourse = courses.find(c => c._id.toString() === course.courseId.toString());
                return {
                    ...course,
                    title: correspondingCourse ? correspondingCourse.title : 'Unknown Course',
                    price: correspondingCourse ? correspondingCourse.price : 0 // Assuming price is stored in the course model
                };
            });
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;

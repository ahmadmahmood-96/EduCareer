const router = require('express').Router();
const { User } = require("../models/user");
const CoursesModel = require('../models/course');

// Get all courses
router.get('/allCourses', async (req, res) => {
    try {
        const allCourses = await CoursesModel.find();
        const coursesWithEmail = await Promise.all(allCourses.map(async (course) => {
            // Fetch the instructor's email from the User model using the userId
            const instructor = await User.findById(course.userId);
            // Create a new object with the instructor's email added to the course data
            return {
                ...course.toObject(),
                instructorEmail: instructor ? instructor.email : null
            };
        }));
        res.json(coursesWithEmail);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

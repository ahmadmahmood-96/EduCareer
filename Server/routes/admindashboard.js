const router = require('express').Router();
const {User} = require("../models/user");
const CoursesModel = require('../models/course');
const EnrollmentModel = require('../models/enrollment');

//get total number of users
router.get('/totalUsers', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({
            totalUsers
        });
    } catch (error) {
        res.json({
            error: 'Internal Server Error'
        });
    }
});


//get total number of users
router.get('/totalNumberOfInstructors', async (req, res) => {
    try {
        const totalNumberOfInstructors = await User.countDocuments({ accountType: "instructor" });
        res.json({
            totalNumberOfInstructors
        });
    } catch (error) {
        res.json({
            error: 'Internal Server Error'
        });
    }
});

//get total number of students
router.get('/totalNumberOfStudents', async (req, res) => {
    try {
        const totalNumberOfStudents = await User.countDocuments({ accountType: "student" });
        res.json({
            totalNumberOfStudents
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

//get total number of free courses
router.get('/totalNumberOfFreeCourses', async (req, res) => {
    try {
        const totalNumberOfFreeCourses = await CoursesModel.countDocuments({ categorypaid: "Free" });
        res.json({
            totalNumberOfFreeCourses
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

// get total number of paid courses
router.get('/totalNumberOfPaidCourses', async (req, res) => {
    try {
        const totalNumberOfPaidCourses = await CoursesModel.countDocuments({ categorypaid: "Paid" });
        res.json({
            totalNumberOfPaidCourses
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

// get total number of enrollments in paid courses
router.get('/totalNumberOfEnrollementsInPaidCourses', async (req, res) => {
    try {
           
        // Find all enrollments
        const enrollments = await EnrollmentModel.find();
        
        // Extract course IDs from enrollments
        const courseIds = enrollments.map(enrollment => enrollment.courseId);

        // Find all free courses
        const paidCourses = await CoursesModel.find({ categorypaid: "Paid", _id: { $in: courseIds } });

        // Count the total number of users enrolled in free courses
        let totalNumberOfEnrollementsInPaidCourses = 0;
        for (const enrollment of enrollments) {
            if (paidCourses.some(course => course._id.equals(enrollment.courseId))) {
                totalNumberOfEnrollementsInPaidCourses++;
            }
        }

        res.json({
            totalNumberOfEnrollementsInPaidCourses
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

router.get('/totalNumberOfEnrollementsInFreeCourses', async (req, res) => {
    
        try {
           
            // Find all enrollments
            const enrollments = await EnrollmentModel.find();
            
            // Extract course IDs from enrollments
            const courseIds = enrollments.map(enrollment => enrollment.courseId);
    
            // Find all free courses
            const freeCourses = await CoursesModel.find({ categorypaid: "Free", _id: { $in: courseIds } });
    
            // Count the total number of users enrolled in free courses
            let totalNumberOfEnrollementsInFreeCourses = 0;
            for (const enrollment of enrollments) {
                if (freeCourses.some(course => course._id.equals(enrollment.courseId))) {
                    totalNumberOfEnrollementsInFreeCourses++;
                }
            }
    
            res.json({
                totalNumberOfEnrollementsInFreeCourses
            });
        } catch (error) {
            res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    });
    


module.exports = router;
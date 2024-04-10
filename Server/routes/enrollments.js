const router = require('express').Router();
const EnrollmentModel = require('../models/enrollment');
const { User, validate } = require("../models/user");
const CoursesModel = require('../models/course');
const AssModel = require('../models/Assignmnet');
const QuizModel = require('../models/Quiz');
const SubmittedAssignmentModel = require('../models/SubmittedAssignment');
// const UserModel = require('../models/user');

router.post('/', async (req, res) => {
    try {
        // Retrieve course details
        const course = await CoursesModel.findById(req.body.courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Retrieve user details using token or any other authentication method
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user is the instructor of the course
        if (user._id.equals(course.userId)) {
            return res.send({ message:'Instructors cannot enroll in their own course' });
        }

        // Check if the user is already enrolled in the course
        if (user.enrolledCourses.includes(course._id)) {
            return res.send({ message: 'User is already enrolled in this course' });
        }

        else{
        // Create enrollment with additional details
        const enrollmentDetails = {
            userId: user._id,
            courseId: course._id,
            instructor: course.instructor,
            studentName: `${user.firstName} ${user.lastName}`,
            courseName: course.title,
            // Add any other fields you need for enrollment details
        };

        const enrollment = await EnrollmentModel.create(enrollmentDetails);

        // Update user's enrolledCourses field
        user.enrolledCourses.push(course._id);
        await user.save();

        res.status(201).json(enrollment);}
    } catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).json({ error: 'Failed to create enrollment', details: error.message });
    }
});

// router.post('/', async (req, res) => {
//     try {
//         // Retrieve course details
//         const course = await CoursesModel.findById(req.body.courseId);
//         console.log(req.body.courseId);
//         if (!course) {
//             return res.status(404).json({ error: 'Course not found' });
//         }

//         // Retrieve user details using token or any other authentication method

//         const user = await User.findById(req.body.userId);
//         console.log(req.body.userId);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         console.log("1233");
//         console.log('Retrieved User:', user);
//         console.log('Retrieved Course:', course);

//         // Check if the user is already enrolled in the course
//         if (user.enrolledCourses.includes(course._id)) {
//             return res.status(400).json({ error: 'User is already enrolled in this course' });
//         }
// console.log("abcdefggg");
//         // Create enrollment with additional details
//         const enrollmentDetails = {
//             userId: user._id,
//             courseId: course._id,
//             instructor: course.instructor,
//             studentName: `${user.firstName} ${user.lastName}`,
//             courseName: course.title,
//             // Add any other fields you need for enrollment details
//         };

      

//         const enrollment = await EnrollmentModel.create(enrollmentDetails);
//         console.log('User updated with enrolled course:', user);
//         // Update user's enrolledCourses field
//         user.enrolledCourses.push(course._id);
//         await user.save();

//         res.status(201).json(enrollment);
//     } catch (error) {
//         console.error('Error creating enrollment:', error);
//         res.status(500).json({ error: 'Failed to create enrollment', details: error.message });
//     }
// });




//display enrolled courses list

// Display enrolled courses list
router.get('/user/:userId/enrolled-courses', async (req, res) => {
    try {
        const userId = req.params.userId; // Corrected variable name
        console.log(userId);

        if (!userId) {
            // Handle the case where userId is null
            return res.status(400).json({ error: 'userId cannot be null' });
        }

       
        const enrolledCourses = await EnrollmentModel.find({ userId })
            .populate('courseId') // Populate the course details
            .exec();

        console.log(enrolledCourses); // Check if the courses are fetched successfully
        res.json(enrolledCourses);
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Cancel enrollment 
router.delete('/cancelenrollment', async (req, res) => {
    try {
        console.log("Cancel backend hereeee")

        const userId = req.body.userId; // Retrieve userId from the request body
        console.log(userId)
        const courseId = req.body.courseId; // Retrieve courseId from the request body
       console.log(courseId)

        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if the user is enrolled in the specified course
        const enrollment = await EnrollmentModel.findOne({ userId, courseId });

        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        // Remove the enrollment record
        await EnrollmentModel.findOneAndDelete({ userId, courseId });
         //await SubmittedAssignmentModel.deleteMany({ courseId: courseId });
         // Remove the courseId from the enrolledCourses array
         user.enrolledCourses = user.enrolledCourses.filter(course => course.toString() !== courseId.toString());
         // Save the user document
         await user.save();
 
        //  res.json({ message: 'Course and related documents deleted successfully' });

        res.status(204).end(); // No content - successful deletion
    } catch (error) {
        console.error('Error canceling enrollment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  

//to display the enrolled student to the instructor...
router.get('/course/:courseId/enrolled-students', async (req, res) => {
    try {
        const courseId = req.params.courseId;

        if (!courseId) {
            return res.status(400).json({ error: 'courseId cannot be null' });
        }

        const enrolledstudent = await EnrollmentModel.find({ courseId })
            .populate({
                path: 'userId',
                select: 'studentName' 
            })
            .exec();
                       
        console.log(enrolledstudent);
        res.json(enrolledstudent);
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;



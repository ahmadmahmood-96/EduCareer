const express = require('express');
const router = express.Router();
const AssModel = require('../models/Assignmnet');
const { User } = require("../models/user");
const multer = require('multer');
const fs = require('fs');
const SubmittedAssignmentModel = require('../models/SubmittedAssignment');
const CourseModel = require('../models/course')
const {QuizScoreModel} = require('../models/quizscore');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = './subfiles';
    console.log('Destination Path:', destinationPath);
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + file.originalname;
    console.log('File Path:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });
//Assignment Grade..

router.post('/submitted-assignments/grades', async (req, res) => {
  //console.log("submit assignment demo demo");
  const { grades } = req.body;

  try {
    // Loop through grades object and update each assignment
    for (const assignmentId in grades) {
      await SubmittedAssignmentModel.findByIdAndUpdate(
        assignmentId,
        { marks: grades[assignmentId] },
        { new: true }
      );
    }

    return res.status(200).json({ message: "Grades updated successfully" });
  } catch (error) {
    console.error("Error updating grades:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Display assignments for enrolled courses
router.get('/user/:userId/enrolled-assignments', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId cannot be null' });
    }

    // Fetch the user from the User model
    const user = await User.findById(userId).populate('enrolledCourses').exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract course IDs from enrolled courses array
    const courseIds = user.enrolledCourses.map((course) => course._id);
    console.log(courseIds)

    // Fetch assignments for the enrolled courses
    const assignments = await AssModel.find({ courseId: { $in: courseIds } })
    // .populate('courseId', 'title') // Populate course title
    .populate({
      path: 'courseId',
      select: ' _id title ' // Add more fields here
  })
    .exec();

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching enrolled assignments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Submit Users response to given assignments
router.post('/submitassignment', upload.single('subfile'), async (req, res) => {
  try {
    const { userId, courseId, assignmentId } = req.body;
    console.log('Submitted assignment', courseId)
    const subfile = req.file.filename; // Get the filename from the uploaded file
    const fileName = req.file.originalname; 
    const submissionTime = new Date(); // Capture the submission time

    // Validate input data (you may add more validation as needed)

    // Check if an entry with the same userId and assignmentId already exists
    const existingSubmission = await SubmittedAssignmentModel.findOne({ userId, assignmentId }).exec();

    if (existingSubmission) {
      // If it exists, update the existing entry with the new submission
      existingSubmission.subfile = subfile;
      existingSubmission.fileName = fileName; 
      existingSubmission.submissionTime = submissionTime; // Update submission time
      await existingSubmission.save();

      return res.status(200).json({ status: 'ok', data: existingSubmission });
    }

    // If it doesn't exist, create a new submitted assignment entry with the uploaded file
    const submittedAssignment = await SubmittedAssignmentModel.create({ userId, courseId, assignmentId, subfile ,fileName });

    res.status(201).json({ status: 'ok', data: submittedAssignment });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// View assignments submitted by students for a specific course and assignment
router.get('/submitted-assignments/:Id', async (req, res) => {
  try {
    // const courseId = req.params.courseId;
    const assignmentId = req.params.Id;

    if ( !assignmentId) {
      return res.status(400).json({ error: 'Assignment ID cannot be null' });
    }

    // Fetch submitted assignments for the given course and assignment
    const submittedAssignments = await SubmittedAssignmentModel.find({ assignmentId })
      .populate('userId', 'firstName lastName') // Populate user's name
      .populate('assignmentId', 'title submissionTime') // Populate assignment title and submissionTime
      .select('userId assignmentId subfile fileName submissionTime') // Select necessary fields including submissionTime
      .exec();

    res.json(submittedAssignments);
  } catch (error) {
    console.error('Error fetching submitted assignments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






// Route to calculate average assignment marks for a specific user and course
router.get('/calculate-average-assignment-marks/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const assignments = await SubmittedAssignmentModel.find({ userId, courseId });
    const totalAssignmentMarks = assignments.reduce((acc, assignment) => acc + assignment.marks, 0);
    const totalAssignmentsCompleted = assignments.length;
    const avgAssignmentMarks = totalAssignmentsCompleted > 0 ? totalAssignmentMarks / totalAssignmentsCompleted : 0;
    res.json({ avgAssignmentMarks });
    console.log(avgAssignmentMarks);
  } catch (error) {
    console.error('Error calculating average assignment marks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/calculate-average-quiz-marks/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const quizzes = await QuizScoreModel.find({ userId, courseId });
    const totalQuizMarks = quizzes.reduce((acc, quiz) => acc + parseInt(quiz.score), 0); // Assuming score is a string
    const totalQuizzesCompleted = quizzes.length;
    const avgQuizMarks = totalQuizzesCompleted > 0 ? totalQuizMarks / totalQuizzesCompleted : 0;
    res.json({ avgQuizMarks });
    console.log(avgQuizMarks);
  } catch (error) {
    console.error('Error calculating average quiz marks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch course completion criteria for a specific course
router.get('/courses/:courseId/completion-criteria', async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const completionCriteria = course.criteria; // Assuming completion criteria is in percentage
    res.json({ completionCriteria });
    console.log(completionCriteria);
  } catch (error) {
    console.error('Error fetching course completion criteria:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



 

module.exports = router;
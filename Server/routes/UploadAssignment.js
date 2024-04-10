const express = require('express');
const router = express.Router();
const AssModel = require('../models/Assignmnet');
const { User } = require("../models/user");
const multer = require('multer');
const fs = require('fs');
const SubmittedAssignmentModel = require('../models/SubmittedAssignment');
const CoursesModel = require('../models/course');

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



 

module.exports = router;
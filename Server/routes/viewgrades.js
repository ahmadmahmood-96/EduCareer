const express = require('express');
const router = express.Router();
const AssModel = require('../models/Assignmnet');
const { User } = require("../models/user");

const SubmittedAssignmentModel = require('../models/SubmittedAssignment');
const CourseModel = require('../models/course')
const {QuizScoreModel} = require('../models/quizscore');
const QuizModel = require('../models/Quiz');

//View assignment grades
router.get('/assignment-grades/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 'userId cannot be null' });
        }

        // Fetch the user from the User model
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch submitted assignments for the user
        const submittedAssignments = await SubmittedAssignmentModel.find({ userId: userId });

        if (!submittedAssignments || submittedAssignments.length === 0) {
            return res.status(404).json({ error: 'No submitted assignments found for this user' });
        }

        // Prepare the response data with assignment details and marks
        const assignmentGrades = await Promise.all(submittedAssignments.map(async (submission) => {
            const assignment = await AssModel.findById(submission.assignmentId);
            const course = await CourseModel.findById(submission.courseId);
            return {
                courseId: submission.courseId,
                courseName: course ? course.title : 'Course not found',
                assFile:assignment.file,
                assignmentTitle: assignment ? assignment.title : 'Assignment not found',
                fileName: submission.fileName,
                submissionTime: submission.submissionTime,
                marks: submission.marks,
                subfile:submission.subfile,
            };
        }));

        res.json(assignmentGrades);
    } catch (error) {
        console.error('Error fetching enrolled assignments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
//get quiz grades
router.get('/quiz-grades/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 'userId cannot be null' });
        }

        // Fetch the user from the User model
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch quiz scores for the user
        const quizzes = await QuizScoreModel.find({ userId: userId });

        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ error: 'No quiz scores found for this user' });
        }

        // Prepare the response data with quiz details and scores
        const quizGrades = await Promise.all(quizzes.map(async (quiz) => {
            const course = await CourseModel.findById(quiz.courseId);
            const quizDetails = await QuizModel.findById(quiz.quizId);
            return {
                courseId: quiz.courseId,
                courseName: course ? course.title : 'Course not found',
                quizTitle: quizDetails ? quizDetails.title : 'Quiz not found',
                total: quiz.totalMarks,
                score: quiz.score,
            };
        }));

        res.json(quizGrades);
    } catch (error) {
        console.error('Error fetching quiz grades:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  

  module.exports = router;
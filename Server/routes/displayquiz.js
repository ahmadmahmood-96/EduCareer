const express = require('express');
const router = express.Router();
const {DisseminationQuizModel} = require('../models/Dissemination');
const { User } = require("../models/user");
// Display quiz for enrolled courses
router.get('/user/:userId/quizzes', async (req, res) => {

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
      const Quiz = await DisseminationQuizModel.find({ courseId: { $in: courseIds } }).exec();
  
      res.json(Quiz);
    } catch (error) {
      console.error('Error fetching enrolled Quizes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  module.exports = router;
const router = require('express').Router();
const {DisseminationQuizModel} = require('../models/Dissemination');

router.post('/disseminate', async (req, res) => {
    try {
        // Destructure the formData from the request body
        const { courseId,title, quizId, date, startTime, endTime } = req.body;
    
        // Create a new dissemination document
        const newDissemination = new DisseminationQuizModel({
          courseId,
          quizId,
          title,
          date,
          startTime,
          endTime
        });
    
        // Save the new dissemination document to the database
        await newDissemination.save();
    
        // Send a success response
        res.status(201).json({ message: 'Quiz disseminated successfully' });
      } catch (error) {
        // Send an error response if any error occurs
        console.error('Error disseminating quiz:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
      }
});


module.exports = router;

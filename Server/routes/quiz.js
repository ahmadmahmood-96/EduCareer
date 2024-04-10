const router = require('express').Router();
const QuizModel = require('../models/Quiz');

router.post('/saveQuestions', async (req, res) => {
    try {
        const { courseId } = req.query; // Extract courseId from URL query params
        const { userId,title, questions } = req.body; // Extract userId and questions from request body
console.log(questions);
        // Validate courseId, userId, and questions
        if (!courseId ||!title|| !userId || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'Invalid request data.' });
        }

        // Create a new Quiz instance
        const quiz = new QuizModel({
            userId,
            courseId,
            title,
            
            questions
        });

        // Save the quiz to the database
        await quiz.save();

        res.status(200).json({ message: 'Quiz saved successfully.' });
    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
//For Teacher Route to disseminate The Quiz .
router.get('/quizzes/course/:courseId', async (req, res) => {
    try {
      const courseId = req.params.courseId;
      // Fetch quizzes from the database based on the provided course ID
      const quizzes = await QuizModel.find({ courseId });
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //student to get Questions for Quiz.
  router.get('/:quizId/questions', async (req, res) => {
    try {
      const { quizId } = req.params;
       console.log("this touched meee")
console.log(quizId);
      const quiz = await QuizModel.findById(quizId); // Fetch quiz by ID from MongoDB
  
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      // Return the questions associated with the quiz
      res.json(quiz.questions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // router.get('quizzes/:quizId', async (req, res) => {
  //   try {
  //     const quiz = await QuizModel.findById(req.params.quizId);
  //     if (!quiz) {
  //       return res.status(404).json({ error: 'Quiz not found' });
  //     }
  //     res.json(quiz);
  //   } catch (error) {
  //     console.error('Error fetching quiz:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });

module.exports = router;

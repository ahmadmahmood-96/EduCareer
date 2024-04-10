const router = require('express').Router();
const {QuizScoreModel} = require('../models/quizscore');
router.post("/scores", async (req, res) => {
    try {
      const { userId, courseId, quizId, score, totalMarks } = req.body;
      const quizScore = new QuizScoreModel({
        
        userId,
        courseId,
        quizId,
        score,
        totalMarks,
      });
      await quizScore.save();
      res.status(201).json({ message: "Quiz score stored successfully" });
    } catch (error) {
      console.error("Error storing quiz score:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;
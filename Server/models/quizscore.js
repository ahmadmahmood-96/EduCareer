const mongoose = require('mongoose');
const QuizScoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    score: { type: String, required: true },
    totalMarks: { type: String, required: true },

});
const QuizScoreModel = mongoose.model("QuizScore", QuizScoreSchema);
module.exports = {QuizScoreModel};
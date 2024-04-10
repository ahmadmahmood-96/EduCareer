const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionNumber: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    questionText: { type: String, required: true },
    wrongOptions: [{ type: String, required: true }]
});

const QuizSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    title:{ type: String, required: true },
    questions: [QuestionSchema]
});

const QuizModel = mongoose.model("Quiz", QuizSchema);

module.exports = QuizModel;

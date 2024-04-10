const mongoose = require('mongoose');
const disseminationSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    title:{type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  });
  const DisseminationQuizModel = mongoose.model('Dissemination', disseminationSchema);
module.exports = {  DisseminationQuizModel };

const mongoose = require('mongoose');

const instructorQuizSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    score: {type: String},
    date: { type: Date,required: true},
});

const InstructorQuizModel = mongoose.model('instructorquizzes', instructorQuizSchema);

module.exports = InstructorQuizModel;
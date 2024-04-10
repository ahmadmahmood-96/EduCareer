const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
    instructor: { type: String, required: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
   
});

const EnrollmentModel = mongoose.model('enrollments', enrollmentSchema);

module.exports = EnrollmentModel;

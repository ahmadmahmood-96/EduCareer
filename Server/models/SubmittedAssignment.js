const mongoose = require('mongoose');

const SubmittedAssignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ass', required: true },
  subfile:{ type: String,required: true},
  fileName: { type: String, required: true }, 
  submissionTime: { type: Date, default: Date.now } ,
  marks :{type:Number,required:false}
});

const SubmittedAssignmentModel = mongoose.model('SubmittedAssignment', SubmittedAssignmentSchema);

module.exports = SubmittedAssignmentModel;

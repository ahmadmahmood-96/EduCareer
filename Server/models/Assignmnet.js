const mongoose = require('mongoose');
const AssignmnetSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true, index: true },
    title: { type: String, required: true },
    file:{ type: String,required: true},
    dueDate: { type: Date,required: true},
    description:{ type: String,required: true},

});
AssignmnetSchema.index({ courseId: 1 });
const AssModel = mongoose.model("ass", AssignmnetSchema);
module.exports = AssModel;
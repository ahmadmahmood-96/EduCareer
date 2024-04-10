const mongoose = require('mongoose');
const ModuleSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true, index: true },
    title: { type: String, required: true },
    file:{ type: String,required: true},
    description:{ type: String,required: true},

});
ModuleSchema.index({ courseId: 1 });
const ModuleModel = mongoose.model("Module", ModuleSchema);
module.exports = ModuleModel;
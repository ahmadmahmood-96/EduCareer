const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    meetingTitle: { type: String, required: true },
    meetingDate: { type: String, required: true },
    meetingTime: { type: String, required: true },
    meetingLink: { type: String, required: true },

});

const MeetingModel = mongoose.model("Meeting", MeetingSchema);

module.exports = MeetingModel;

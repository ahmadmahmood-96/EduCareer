const mongoose = require('mongoose');

const courseschema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    title: String,
    description: String,
    criteria: String,
    instructor: String,
    duration: String,
    category: String,
    preRequisite: String,
    categorypaid: String,
    price: String,
    file:String,
    status : String
});

const CoursesModel = mongoose.model("courses", courseschema);
enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }];
asses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }];
Module: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }],
module.exports = CoursesModel;

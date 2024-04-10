const mongoose = require('mongoose');
//const { User, validate } = require("../models/user");

const profileSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        //required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
       // required: true,
    },
    contactNumber: {
        type: String,
       // required: true,
    },
    profilePicture: {
        type: String,
       // required: true,
    },

    biography: {
      //  type: String,
    },
});

const ProfileModel = mongoose.model('profiles', profileSchema);

module.exports = ProfileModel;
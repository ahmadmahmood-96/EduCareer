const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    accountType: {
        type: String,
        required: true,
        enum: ['student', 'instructor'], 
      },

    verified: {
        type: Boolean,
        default: false
    },

    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }],
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.PRIVATEKEY, { expiresIn: '7d' });
    return token;
};

const User = mongoose.model('user', userSchema);

const complexityOptions = {
    min: 8,  // or your preferred minimum length
    max: 30,  
    lowerCase: 1,
    upperCase: 1,
    number: 1, 
    symbol: 1, 
};

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity(complexityOptions).required().label("Password"),
        accountType: Joi.string().valid('student', 'instructor').required().label("Account Type"),
    });
    return schema.validate(data);
};

module.exports = { User, validate };

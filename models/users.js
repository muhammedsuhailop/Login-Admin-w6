const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    phoneCode: {
        type: String,
        required: false,
        trim: true,
    },
    phoneNumber: {
        type: Number,
        required: false,
        trim: true,
        match: /^\d{7,15}$/,
    },
    country: {
        type: String,
        required: false,
        trim: true,
    },
    stateProvince: {
        type: String,
        required: false,
        trim: true,
    },
    pin: {
        type: String,
        required: false,
        match: /^\d{4,10}$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User

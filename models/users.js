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
        match: /^\d{7,15}$/, // Allows phone numbers between 7 and 15 digits
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
        match: /^\d{4,10}$/, // Allows numeric PIN codes between 4 and 10 digits
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
}, { timestamps: true }); 

const User = mongoose.model('User',userSchema);
module.exports = User

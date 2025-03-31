const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: 'Invalid email format',
        },
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Phone number must be exactly 10 digits',
        },
    },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{5}$/.test(v);
            },
            message: 'Zip code must be exactly 5 digits',
        },
    },
    dateOfBirth: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v <= new Date();
            },
            message: 'Date of birth cannot be in the future',
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user',
    },
    profileImage: {
        type: String,
        validate: {
            validator: function (v) {
                return /\.(jpg|jpeg|png|gif)$/.test(v);
            },
            message: 'Profile image must be a valid URL with .jpg, .jpeg, .png, or .gif extension',
        },
    },
}, { timestamps: true });

const userModel = new mongoose.model("user", userSchema)

//That is validate but for proper message pass to fronted use JOI validation  

module.exports = { userModel };
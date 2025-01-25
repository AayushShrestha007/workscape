
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hasPremium: {
        type: Boolean,
        required: false,
        default: false

    },
    password: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
        required: false,
    },
    resumes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'resumes'
    }],
    applications: [{
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'jobs'
        },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'hired', 'rejected'],
            default: 'applied'
        },
        appliedOn: {
            type: Date,
            default: Date.now
        },
        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'resumes'
        },
    }],
    passwordHistory: {
        type: [String],
        default: []
    },
    passwordUpdatedAt: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailOtp: {
        type: String
    }, // Store hashed OTP
    emailOtpExpires: {
        type: Date
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },

}, {
    timestamps: true
}
);

const User = mongoose.model('users', userSchema);
module.exports = User;






const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true,
    },
    organizationAddress: {
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
    password: {
        type: String,
        required: true,
    },
    employerImage: {
        type: String,
    },
    jobsPosted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobs'
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
    },
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
});

const Employer = mongoose.model('employers', employerSchema);
module.exports = Employer;




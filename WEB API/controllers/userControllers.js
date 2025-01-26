
const path = require('path');

const userModel = require('../models/userModel');

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const fs = require('fs');

const nodemailer = require('nodemailer');


//generate otp
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};


// helper code for sending verification email 
const sendVerificationEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASS, // Your Gmail password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        text: `Your OTP for email verification is ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

//code for sending 2FA otp
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Two-Factor Authentication OTP",
        text: `Your OTP for 2FA login is ${otp}. It will expire in 5 minutes.`,
    };
    await transporter.sendMail(mailOptions);
};


//code for registration
const register = async (req, res) => {
    const validatePassword = (password) => {
        const minLength = 8;
        const maxLength = 20;

        if (password.length < minLength || password.length > maxLength) {
            return `Password must be between ${minLength} and ${maxLength} characters long.`;
        }

        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (!uppercaseRegex.test(password)) {
            return "Password must include at least one uppercase letter.";
        }
        if (!lowercaseRegex.test(password)) {
            return "Password must include at least one lowercase letter.";
        }
        if (!numberRegex.test(password)) {
            return "Password must include at least one number.";
        }
        if (!specialCharRegex.test(password)) {
            return "Password must include at least one special character.";
        }

        return null;
    };

    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Please enter all fields!" });
    }

    const validationError = validatePassword(password);
    if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
    }

    if (!req.files || !req.files.userImage) {
        return res.status(400).json({ success: false, message: 'Please upload an image!' });
    }

    const { userImage } = req.files;
    const imageName = `${Date.now()}-${userImage.name}`;
    const imageUploadPath = path.join(__dirname, `../public/userImage/${imageName}`);

    try {
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const randomSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, randomSalt);

        await userImage.mv(imageUploadPath);

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        const newUser = new userModel({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword,
            userImage: imageName,
            isVerified: false,
            emailOtp: hashedOtp,
            emailOtpExpires: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
            passwordHistory: [hashedPassword],
            passwordUpdatedAt: new Date(),
        });

        await newUser.save();
        await sendVerificationEmail(email, otp);

        res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email to continue.",
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error!" });
    }
};


const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "Email already verified." });
        }

        if (Date.now() > user.emailOtpExpires) {
            return res.status(400).json({ success: false, message: "OTP has expired." });
        }

        const isMatch = await bcrypt.compare(otp, user.emailOtp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        user.isVerified = true;
        user.emailOtp = undefined;
        user.emailOtpExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Email verified successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error!" });
    }
};




//code for login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check email verification
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Email is not verified. Please verify your email first.",
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        // Check for password expiration
        const passwordExpiryDays = 90;
        const passwordAge = Math.floor(
            (Date.now() - new Date(user.passwordUpdatedAt)) / (1000 * 60 * 60 * 24)
        );
        if (passwordAge > passwordExpiryDays) {
            return res.status(403).json({
                success: false,
                message: "Your password has expired. Please update it.",
            });
        }

        // Generate OTP for 2FA
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Save OTP and its expiration to the user's document
        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
        await user.save();

        // Send OTP to email
        await sendOtpEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent to your email for two-factor authentication.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Verify OTP for 2FA
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const findUser = await userModel.findOne({ email: email });
        if (!findUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!findUser.otp || !findUser.otpExpires) {
            return res.status(400).json({ success: false, message: "No OTP generated" });
        }

        // Check if OTP is expired
        if (Date.now() > findUser.otpExpires) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        // Verify OTP
        const isMatch = await bcrypt.compare(otp, findUser.otp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // // Clear OTP from user document after successful verification
        findUser.otp = undefined;
        findUser.otpExpires = undefined;
        await findUser.save();

        // Generate JWT token after successful 2FA
        const token = jwt.sign(
            { id: findUser._id, name: findUser.name, role: "applicant", isAdmin: findUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("session", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            userData: { findUser },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


//code to update applicant
const updateApplicant = async (req, res) => {
    try {
        // Find the user to get the current image name
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if a new image is uploaded
        if (req.files && req.files.userImage) {
            const { userImage } = req.files;

            // Generate new image name
            const imageName = `${Date.now()}-${userImage.name}`;

            // Make an upload path
            const imageUploadPath = path.join(
                __dirname,
                `../public/userImage/${imageName}`
            );

            // Delete the old image if it exists
            if (user.userImage) {
                const oldImagePath = path.join(
                    __dirname,
                    `../public/userImage/${user.userImage}`
                );
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.log('Failed to delete old image:', err);
                    } else {
                        console.log('Old image deleted');
                    }
                });
            }

            // Move the new file to the upload path
            await userImage.mv(imageUploadPath);

            // Add the new image name to the request body
            req.body.userImage = imageName;
        }

        // Check if password needs to be updated and hash it
        if (req.body.newPassword) {
            const newPassword = req.body.newPassword;

            // Check if the new password matches any in the password history
            for (const oldHash of user.passwordHistory) {
                const isMatch = await bcrypt.compare(newPassword, oldHash);
                if (isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "You cannot reuse a recent password.",
                    });
                }
            }

            // Hash the new password
            const randomSalt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, randomSalt);
            req.body.password = hashedPassword;

            // Update password history
            user.passwordHistory.push(user.password); // Add current password to history
            user.passwordUpdatedAt = new Date(); // Update the password timestamp

            // Keep only the last 5 passwords in the history
            if (user.passwordHistory.length > 5) {
                user.passwordHistory.shift(); // Remove the oldest password
            }
        }

        // Update the user
        const updatedApplicant = await userModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'User Updated',
            user: updatedApplicant,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};



//get current user
const getCurrentApplicant = async (req, res) => {
    try {
        // Show current user
        const applicant = await applicant.findById(req.user.id).select("-password");

        res.status(201).json({
            success: true,
            message: "Current applicant retrieved",
            data: applicant
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const updatePassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the new password matches any in the password history
        for (const oldHash of user.passwordHistory) {
            const isMatch = await bcrypt.compare(newPassword, oldHash);
            if (isMatch) {
                return res.status(400).json({ message: "You cannot reuse a recent password." });
            }
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password and add the old one to the history
        user.passwordHistory.push(user.password); // Add current password to history
        user.password = hashedPassword;

        // Keep only the last 5 passwords in the history
        if (user.passwordHistory.length > 5) {
            user.passwordHistory.shift(); // Remove the oldest password
        }

        await user.save();
        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};

const logout = (req, res) => {
    res.clearCookie('session', {
        httpOnly: true, // Matches the original cookie setting
        secure: true,   // Matches the original cookie setting
        sameSite: 'None', // Matches the original cookie setting
        path: '/', // Default path, can be omitted if not explicitly set during login
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

//Exporting the function 
module.exports = {
    register,
    login,
    updateApplicant,
    getCurrentApplicant,
    updatePassword,
    logout,
    verifyEmail,
    verifyOtp,
};

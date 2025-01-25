
const path = require('path');

const employerModel = require('../models/employerModel');

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const fs = require('fs');

const nodemailer = require('nodemailer');

//generate otp
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
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

//code for registration
const register = async (req, res) => {

    //1. Check incoming data
    console.log(req.body);

    //2. Destructure the incoming data
    const { organizationName, organizationAddress, email, phone, password } = req.body;

    //3. Validate the data (if empty, stop the process & send res)
    if (!organizationName || !organizationAddress || !email || !password || !phone) {
        //res.send("please enter all the details")
        return res.status(400).json({
            "success": false,
            "message": "Please enter all fields!"
        })

    }

    // Validating the image
    if (!req.files || !req.files.employerImage) {
        return res.status(400).json({
            success: false,
            message: 'Please upload an image!',
        });
    }

    const { employerImage } = req.files;

    //  Upload the image
    // 1. Generate new image name
    const imageName = `${Date.now()}-${employerImage.name}`;

    // 2. Make a upload path (/path/upload - directory)
    const imageUploadPath = path.join(
        __dirname,
        `../public/employerImage/${imageName}`
    );

    //4. Error handling (try/catch)
    try {
        //5. Check if the employer with this email is already registered or not
        const existingEmployer = await employerModel.findOne({ email: email })
        //5.1 If employer found-> send response 
        //5.1.1 stop the process
        if (existingEmployer) {
            return res.json({
                "success": false,
                "message": "an employer with this email already exists"
            })
        }

        //5.2 if employer is new:
        //5.2.1 Hash the password
        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, randomSalt)



        await employerImage.mv(imageUploadPath);

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        //5.2.2 Save to the database
        const newEmployer = new employerModel({

            organizationName: organizationName,
            organizationAddress: organizationAddress,
            email: email,
            phone: phone,
            password: hashedPassword,
            employerImage: imageName,
            isVerified: false, // Default to false until verified
            passwordHistory: [hashedPassword],
            passwordUpdatedAt: new Date(),
            emailOtp: hashedOtp,
            emailOtpExpires: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
        })

        //save to database
        await newEmployer.save()
        await sendVerificationEmail(email, otp);

        //5.2.3 send successful response
        res.status(201).json({
            success: true,
            message: "Employer registered successfully. Please verify your email to continue.",
        });

    } catch (error) {
        console.log(error)
        res.json({
            "success": false,
            "message": "Internal server error!"
        })
    }
}

const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const employer = await employerModel.findOne({ email });
        if (!employer) {
            return res.status(404).json({ success: false, message: "Employer not found" });
        }

        if (employer.isVerified) {
            return res.status(400).json({ success: false, message: "Email already verified." });
        }

        if (Date.now() > employer.emailOtpExpires) {
            return res.status(400).json({ success: false, message: "OTP has expired." });
        }

        const isMatch = await bcrypt.compare(otp, employer.emailOtp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        employer.isVerified = true;
        employer.emailOtp = undefined;
        employer.emailOtpExpires = undefined;

        await employer.save();

        res.status(200).json({ success: true, message: "Email verified successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error!" });
    }
};


//code for login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please enter all fields!" });
    }

    try {
        const employer = await employerModel.findOne({ email });
        if (!employer) {
            return res.status(404).json({ success: false, message: "Employer not found" });
        }

        if (!employer.isVerified) {
            return res.status(401).json({ success: false, message: "Please verify your email first." });
        }

        const isPasswordValid = await bcrypt.compare(password, employer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        // Generate OTP for 2FA
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        employer.otp = hashedOtp;
        employer.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await employer.save();

        // Send OTP via email
        await sendOtpEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent to your email for two-factor authentication.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

//code for verifying otp
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required." });
    }

    try {
        const findemployer = await employerModel.findOne({ email });
        if (!findemployer) {
            return res.status(404).json({ success: false, message: "Employer not found." });
        }

        if (Date.now() > findemployer.twoFactorOtpExpires) {
            return res.status(400).json({ success: false, message: "OTP has expired." });
        }

        const isOtpValid = await bcrypt.compare(otp, findemployer.otp);
        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        // Clear OTP fields after successful verification
        findemployer.otp = undefined;
        findemployer.otpExpires = undefined;
        await findemployer.save();

        // Generate JWT token for authenticated session
        const token = jwt.sign(
            { id: findemployer._id, role: "employer" },
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
            message: "Login successful.",
            token,
            employerData: { findemployer },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};



// code for updating employer
const updateEmployer = async (req, res) => {
    try {
        const employer = await employerModel.findById(req.params.id);

        if (!employer) {
            return res.status(404).json({
                success: false,
                message: 'Employer not found',
            });
        }

        if (req.files && req.files.employerImage) {
            const { employerImage } = req.files;
            const imageName = `${Date.now()}-${employerImage.name}`;
            const imageUploadPath = path.join(__dirname, `../public/employerImage/${imageName}`);

            if (employer.employerImage) {
                const oldImagePath = path.join(__dirname, `../public/employerImage/${employer.employerImage}`);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.log('Failed to delete old image:', err);
                    } else {
                        console.log('Old image deleted');
                    }
                });
            }

            await employerImage.mv(imageUploadPath);
            req.body.employerImage = imageName;
        }

        if (req.body.newPassword) {

            const newPassword = req.body.newPassword;

            // Check if the new password matches any in the password history
            for (const oldHash of employer.passwordHistory) {
                const isMatch = await bcrypt.compare(newPassword, oldHash);
                if (isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "You cannot reuse a recent password.",
                    });
                }
            }

            const randomSalt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, randomSalt);
            req.body.password = hashedPassword;

            // Update password history
            employer.passwordHistory.push(employer.password); // Add current password to history
            employer.passwordUpdatedAt = new Date(); // Update the password timestamp

            // Keep only the last 5 passwords in the history
            if (employer.passwordHistory.length > 5) {
                employer.passwordHistory.shift(); // Remove the oldest password
            }

        }

        const updatedEmployer = await employerModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });

        res.status(200).json({
            success: true,
            message: 'Employer updated successfully',
            employer: updatedEmployer
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const updatePassword = async (req, res) => {
    const { employerId, newPassword } = req.body;

    try {
        const employer = await employerModel.findById(employerId);
        if (!employer) {
            return res.status(404).json({
                success: false,
                message: "Employer not found"
            });
        }

        // Check if the new password matches any in the password history
        for (const oldHash of employer.passwordHistory) {
            const isMatch = await bcrypt.compare(newPassword, oldHash);
            if (isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot reuse a recent password."
                });
            }
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password and add the old one to the history
        employer.passwordHistory.push(employer.password); // Add current password to history
        employer.password = hashedPassword;

        // Update the passwordUpdatedAt field
        employer.passwordUpdatedAt = new Date();

        // Keep only the last 5 passwords in the history
        if (employer.passwordHistory.length > 5) {
            employer.passwordHistory.shift(); // Remove the oldest password
        }

        // Save the updated employer data
        await employer.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
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
    updateEmployer,
    updatePassword,
    logout,
    verifyEmail,
    verifyOtp
};

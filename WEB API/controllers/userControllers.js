
const path = require('path');

const userModel = require('../models/userModel');

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const fs = require('fs');

//code for registration
const register = async (req, res) => {

    const validatePassword = (password) => {
        const minLength = 8;
        const maxLength = 20;

        // Check length
        if (password.length < minLength || password.length > maxLength) {
            return `Password must be between ${minLength} and ${maxLength} characters long.`;
        }

        // Check complexity
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

        // All checks passed
        return null;
    };


    //1. Check incoming data
    console.log(req.body);

    //2. Destructure the incoming data
    const { name, email, phone, password } = req.body;

    //3. Validate the data (if empty, stop the process & send res)
    if (!name || !email || !password) {
        //res.send("please enter all the details")
        return res.json({
            "success": false,
            "message": "Please enter all fields!"
        })

    }

    const validationError = validatePassword(password);
    if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
    }

    // Validating the image
    if (!req.files || !req.files.userImage) {
        return res.status(400).json({
            success: false,
            message: 'Please upload an image!',
        });
    }

    const { userImage } = req.files;

    //  Upload the image
    // 1. Generate new image name
    const imageName = `${Date.now()}-${userImage.name}`;

    // 2. Make a upload path (/path/upload - directory)
    const imageUploadPath = path.join(
        __dirname,
        `../public/userImage/${imageName}`
    );

    //4. Error handling (try/catch)
    try {
        //5. Check if the user is already registered
        const existingUser = await userModel.findOne({ email: email })
        //5.1 If user found-> send response 
        //5.1.1 stop the process
        if (existingUser) {
            return res.json({
                "success": false,
                "message": "user already exists"
            })
        }

        //5.2 if user is new:
        //5.2.1 Hash the password
        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, randomSalt)

        await userImage.mv(imageUploadPath);

        //5.2.2 Save to the database
        const newUser = new userModel({
            //database fields: client's value

            name: name,
            email: email,
            phone: phone,
            password: hashedPassword,
            userImage: imageName,
            passwordHistory: [hashedPassword],
            passwordUpdatedAt: new Date(),
        })

        //save to database
        await newUser.save()

        //5.2.3 send successful response
        res.status(201).json({
            "success": true,
            "message": "User created successfully"
        }

        )

    } catch (error) {
        console.log(error)
        res.json({
            "success": false,
            "message": "Internal server error!"
        })
    }
}

//code to upload a file
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload a file" });
        }
        res.status(201).json({
            success: true,
            data: req.file.filename,
        });
    } catch (error) {
        // Handle unexpected errors
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



//code for login
const login = async (req, res) => {

    //1. Check incoming data
    console.log(req.body);

    //2. Destructure the incoming data
    const { email, password } = req.body;

    //3. Validate the data (if empty, stop the process & send res)
    if (!email || !password) {
        return res.json({
            "success": false,
            "message": "Please enter all fields!"
        })

    }

    //4. Error handling (try/catch)

    //5.1 If username and password don't match-> send response 
    try {

        // find user 

        const findUser = await userModel.findOne({ email: email });

        if (!findUser) {
            return res.json({
                "success": false,
                "message": "user with this email doesn't exist"
            })
        }



        //compare password
        const isValidPassword = await bcrypt.compare(password, findUser.password)

        if (!isValidPassword) {
            return res.json({
                "success": false,
                "message": "Password doesn't match"
            })
        }

        const passwordExpiryDays = 90;
        const currentDate = new Date();
        const passwordAge = Math.floor((currentDate - findUser.passwordUpdatedAt) / (1000 * 60 * 60 * 24));

        if (passwordAge > passwordExpiryDays) {
            return res.status(403).json({ message: "Your password has expired. Please update it." });
        }

        //token (Generate- User data + key)
        const token = await jwt.sign(
            {
                id: findUser._id,
                role: "applicant"
            },
            process.env.JWT_SECRET
        )

        //5.1 If login successful send response
        //5.1.1 stop the process
        return res.status(201).json({
            "success": true,
            "message": "user login successful",
            "token": token,
            "userData": { findUser }
        })

    } catch (error) {
        console.log(error)
        return res.json({
            "success": false,
            "message": "Internal server error!"
        })
    }
}


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

//Exporting the function 
module.exports = {
    register,
    login,
    updateApplicant,
    getCurrentApplicant,
    uploadImage,
    updatePassword
};

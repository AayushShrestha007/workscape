const userControllers = require("../controllers/userControllers");
const loginLimiter = require('../middleware/loginLimiter');
const router = require('express').Router();

const logActivity = require("../middleware/logActivity");

//Creating user registration route
router.post("/register", userControllers.register)

//Creating email verification route
router.post("/verify-email", userControllers.verifyEmail)

//Creating otp verification route
router.post("/verify-otp", userControllers.verifyOtp)

//Creationg user login route
router.post("/login", loginLimiter, userControllers.login)

//Creationg user logout route
router.post("/logout", userControllers.logout)

//Creationg user logout route
router.post("/logout", logActivity, userControllers.logout)

//Creating user update route
router.put("/update_applicant/:id", logActivity,userControllers.updateApplicant)

//Creating password update route
router.post("/update_password/:id", logActivity,userControllers.updatePassword)


//Creationg route for getting current applicant
router.get("/get_current_applicant", logActivity,userControllers.getCurrentApplicant)

module.exports = router;
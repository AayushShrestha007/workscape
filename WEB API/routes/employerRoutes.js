const employerControllers = require("../controllers/employerControllers");
const loginLimiter = require('../middleware/loginLimiter');
const router = require('express').Router();

//Creating employer registration route
router.post("/register", employerControllers.register)

//Creating employer email verification  route
router.post("/verify-email", employerControllers.verifyEmail)

//Creating employer login route
router.post("/login", loginLimiter, employerControllers.login)


//Creatingg employer  logout route
router.post("/logout", employerControllers.logout)


//Creatingg user logout route
router.post("/logout", employerControllers.logout)


//Creationg employer update route
router.put("/update_employer/:id", employerControllers.updateEmployer)


//Creating password update route for employer
router.post("/update_password_employer/:id", employerControllers.updatePassword)

module.exports = router;
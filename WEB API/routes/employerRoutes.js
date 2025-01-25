const employerControllers = require("../controllers/employerControllers");

const router = require('express').Router();

//Creating user registration route
router.post("/register", employerControllers.register)

//Creating user login route
router.post("/login", employerControllers.login)


//Creatingg user logout route
router.post("/logout", employerControllers.logout)


//Creationg employer update route
router.put("/update_employer/:id", employerControllers.updateEmployer)


//Creating password update route for employer
router.post("/update_password_employer/:id", employerControllers.updatePassword)

module.exports = router;
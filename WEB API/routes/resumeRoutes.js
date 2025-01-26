const resumeControllers = require("../controllers/resumeController");

const router = require('express').Router();

const logActivity = require("../middleware/logActivity");

const { roleGuard } = require('../middleware/authGuard')


//Creating resume cretion route
router.post("/create_resume", roleGuard('applicant'), logActivity, resumeControllers.createResume)

//Creating resume fetching route
router.get("/get_all_resume", roleGuard('applicant'), logActivity, resumeControllers.getResumesByUser)

module.exports = router;
const applicationControllers = require("../controllers/applicationController");

const router = require('express').Router();

const logActivity = require("../middleware/logActivity");

const { roleGuard, authGuard } = require('../middleware/authGuard')

//Creating a route to apply to jobs
router.post("/apply", roleGuard('applicant'), logActivity, applicationControllers.createApplication)


//Creation a route to fetch all the applied job
router.get('/get_all_applications', roleGuard('applicant'), logActivity, applicationControllers.getUserApplications);


//creating a route to fetch all the applications of currently logged in employer
router.get('/get_employer_applications', roleGuard('employer'), logActivity, applicationControllers.getApplicationsByEmployer);

//creating a route to fetch all the hired applications of currently logged in employer
router.get('/get_employer_hired_applications', roleGuard('employer'), logActivity, applicationControllers.getHiredApplicationsByEmployer);

//creating a route to fetch all the complete applications of currently logged in employer
router.get('/get_employer_complete_applications', roleGuard('employer'), logActivity, applicationControllers.getCompleteApplicationsByEmployer);

//creating a route to update status of application
router.put('/update_application_status', authGuard, logActivity, applicationControllers.updateApplicationStatus);

//creating a route to get all offered applications of currently logged in user
router.get('/get_all_offered_applications', roleGuard('applicant'), logActivity, applicationControllers.getUserOfferedApplications);

//creating a route to get hired application of currently logged in user
router.get('/get_hired_application', roleGuard('applicant'), logActivity, applicationControllers.getUserHiredApplication);

//creating a route to get complete application of currently logged in user
router.get('/get_complete_applications', roleGuard('applicant'), logActivity, applicationControllers.getUserCompleteApplication);



module.exports = router;

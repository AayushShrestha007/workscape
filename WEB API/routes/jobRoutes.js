const jobControllers = require("../controllers/jobControllers");

const router = require('express').Router();

const logActivity = require("../middleware/logActivity");

const { roleGuard } = require('../middleware/authGuard')

//Creating job creation route
router.post("/create_job", roleGuard('employer'), logActivity, jobControllers.createJob)

//Creating route for fetching all open jobs by specific employer
router.get('/open_jobs_by_employer', roleGuard('employer'), logActivity, jobControllers.getAllOpenJobsByEmployer);

//Creating job fetching route
router.get("/get_all_open_jobs", roleGuard('applicant'), logActivity, jobControllers.getAllOpenJobs)

//Creating route to fetch job by id
router.get('/get_job_details/:id', roleGuard('applicant'), logActivity, jobControllers.getJobById);

//creating paginatoin route
router.get("/pagination_all_open_jobs", logActivity, jobControllers.paginationAllOpenJobs)

//creating route to get all applicants of a job
router.get('/:jobId', roleGuard('employer'), logActivity, jobControllers.getApplicantsForJob);


module.exports = router;
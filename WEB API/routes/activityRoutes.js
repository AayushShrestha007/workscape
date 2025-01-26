const activityLogController = require("../controllers/activityLogController");

const router = require('express').Router();

const { adminGuard } = require('../middleware/authGuard')

//Creating a route to apply to jobs
router.get("/get_activity_log", adminGuard, activityLogController.getActivityLogs)

module.exports = router;
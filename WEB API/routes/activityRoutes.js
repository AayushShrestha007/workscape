const activityLogController = require("../controllers/activityLogController");

const router = require('express').Router();

const { authGuard, adminGuard } = require('../middleware/authGuard')

//Creating a route to apply to jobs
router.get("/get_activity_log", authGuard, adminGuard, activityLogController.getActivityLogs)

module.exports = router;
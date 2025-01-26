const activityLogModel = require('../models/activityLogModel');

const logActivity = async (req, res, next) => {
    const activity = {
        userId: req.user ? req.user._id : null, // Fallback for unauthenticated requests
        username: req.user?.name || "Unauthenticated",
        endpoint: req.originalUrl,
        method: req.method,
        timestamp: new Date(),
    };

    try {
        await activityLogModel.create(activity);
    } catch (error) {
        console.error("Failed to log activity:", error);
    }

    next();
};

module.exports = logActivity;

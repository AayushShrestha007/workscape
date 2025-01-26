const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false,
    },
    username: {
        type: String,
        required: true, // Always required, even for unauthenticated users
    },
    endpoint: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const activityLogModel = mongoose.model("ActivityLog", activityLogSchema);

module.exports = activityLogModel;

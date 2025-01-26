const getActivityLogs = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only.",
            });
        }

        // Fetch logs from the database
        const logs = await activityLogModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Activity logs retrieved successfully.",
            logs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

//Exporting the function 
module.exports = {
    getActivityLogs
};
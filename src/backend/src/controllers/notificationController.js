const notificationService = require("../services/notificationService");


const list = async (req, res, next) => {
    try {
        const response = await notificationService.list(req.query, req.user.id)
        res.status(201).json({
            success: true,
            message: "Notification Getting successfully",
            data: response,
        });

        // return response;
    } catch (error) {

        console.error("Error in order controller:", error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

module.exports = {
    list
}
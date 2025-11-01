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
        next(error); // forward to centralized error handler
    }
}

module.exports = {
    list
}
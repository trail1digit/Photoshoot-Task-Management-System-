const Notification = require("../models/Notifications");

async function list(query, user_id) {
    try {
        const { page, limit } = query;

        const notifications = await Notification.find({ user_id })
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Notification.countDocuments({ user_id });

        let response = {
            total,
            page: Number(page),
            limit: Number(limit),
            notifications
        };

        return response;
    } catch (err) {
        console.error("Add Order Error:", err);
        const error = new Error("Failed to create order");
        error.statusCode = 500;
        throw error;
    }
}

module.exports = {
    list
}
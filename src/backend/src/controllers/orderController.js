const orderService = require("../services/orderService");

const addOrder = async (req, res, next) => {
    try {
        const response = await orderService.addOrder(req.body, req.user)
        res.status(201).json({
            success: true,
            message: "Order Added successfully",
            data: response,
        });
    } catch (error) {

        console.error("Error in order controller:", error.message);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

const orderSummary = async (req, res, next) => {
    try {
        const response = await orderService.orderSummary(req.query, req.user)
        res.status(201).json({
            success: true,
            message: "Order Getting successfully",
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

const priorityOverview = async (req, res, next) => {
    try {
        const response = await orderService.priorityOverview(req.user)
        res.status(201).json({
            success: true,
            message: "Priority Getting successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error in order controller:", error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}
const delayAnalysis = async (req, res, next) => {
    try {
        const response = await orderService.delayAnalysis(req.user)
        res.status(201).json({
            success: true,
            message: "Priority Getting successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error in order controller:", error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

module.exports = {
    addOrder,
    orderSummary,
    priorityOverview,
    delayAnalysis
}
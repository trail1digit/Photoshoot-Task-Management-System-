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
        next(error); // forward to centralized error handler
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
        next(error); // forward to centralized error handler
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
        next(error); // forward to centralized error handler

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
        next(error); // forward to centralized error handler

    }
}

module.exports = {
    addOrder,
    orderSummary,
    priorityOverview,
    delayAnalysis
}
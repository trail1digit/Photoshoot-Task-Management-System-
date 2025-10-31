const subTaskService = require("../services/subTaskService");

const addSubTask = (req, res, next) => {
    try {
        const response = subTaskService.addSubTask(req.body, req.user.id);
        res.status(201).json({
            success: true,
            message: "Data Added successfully",
            data: response,
        });
    } catch (error) {
        // single try-catch handles all errors
        console.error("Error in subtask controller:", error.message);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

const updateSubTask = (req, res, next) => {
    try {
        const response = subTaskService.updateSubTask(req.params.id, req.body, req.user.id);
        res.status(201).json({
            success: true,
            message: "Data Updated successfully",
            data: response,
        });
    } catch (error) {
        // single try-catch handles all errors
        console.error("Error in subtask controller:", error.message);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

const cancelSubTask = async (req, res, next) => {
    try {
        const response = await subTaskService.cancelSubTask(
            req.params.id,
            req.body,
            req.user.id // if token middleware sets user
        );
        res.status(200).json(response);
    } catch (err) {
        console.error("Cancel Subtask Error:", err);
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const reopenSubTask = async (req, res, next) => {
    try {
        const response = subTaskService.reopenSubTask(req.params.id, req.user.id);
        res.status(201).json({
            success: true,
            message: "Data Updated successfully",
            data: response,
        });
    } catch (error) {
        // single try-catch handles all errors
        console.error("Error in subtask controller:", error.message);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

const completeSubTask = async (req, res, next) => {
    try {
        const response = subTaskService.completeSubTask(req.params.id, req.user.id);
        res.status(201).json({
            success: true,
            message: "Data Updated successfully",
            data: response,
        });
    } catch (error) {
        // single try-catch handles all errors
        console.error("Error in subtask controller:", error.message);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

module.exports = {
    addSubTask,
    updateSubTask,
    cancelSubTask,
    reopenSubTask,
    completeSubTask
}
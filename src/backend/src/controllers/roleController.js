const roleService = require("../services/roleService");

const getModuleData = async (req, res, next) => {
    try {
        const response = await roleService.getModuleData();
        res.status(201).json({
            success: true,
            message: "Data getting successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error in Role controller:", error.message);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

const addModule = async (req, res, next) => {
    try {
        const response = await roleService.addModule(req.body);
        res.status(201).json({
            success: true,
            message: "Data Added successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error in role controller:", error.message);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

const addSubModule = async (req, res, next) => {
    try {
        const response = await roleService.addSubModule(req.body);
        res.status(201).json({
            success: true,
            message: "Data Added successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error in role controller:", error.message);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

const addRole = async (req, res, next) => {
    try {
        const response = await roleService.addRole(req.body)

        res.status(201).json({
            success: true,
            message: "Data Added successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error in role controller:", error.message);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

module.exports = {
    getModuleData,
    addModule,
    addSubModule,
    addRole
}
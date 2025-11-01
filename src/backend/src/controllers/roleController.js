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
        next(error); // forward to centralized error handler
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
        next(error); // forward to centralized error handler
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
        next(error); // forward to centralized error handler
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
        next(error); // forward to centralized error handler
    }
}

module.exports = {
    getModuleData,
    addModule,
    addSubModule,
    addRole
}
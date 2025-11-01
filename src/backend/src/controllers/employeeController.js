const employeeService = require("../services/employeeService");

const register = async (req, res, next) => {
  try {
    const response = await employeeService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: response,
    });

  } catch (error) {
    next(error); // forward to centralized error handler
  }
};


const login = async (req, res, next) => {
  try {
    const response = await employeeService.login(req.body);

    res.status(201).json({
      success: true,
      message: "Employee Login successfully",
      data: response,
    });

  } catch (error) {
    next(error); // forward to centralized error handler
  }
}

const uploadDocument = async (req, res, next) => {
  try {
    const response = await employeeService.uploadDocument(req.body, req.file);

    res.status(201).json({
      success: true,
      message: "Document upload successfully",
      data: response,
    });

  } catch (error) {
    next(error); // forward to centralized error handler
  }
}

const viewDoc = async (req, res, next) => {
  try {
    const response = await employeeService.viewDoc(req.query);

    res.status(201).json({
      success: true,
      message: "Document getting successfully",
      data: response,
    });

  } catch (error) {
    next(error); // forward to centralized error handler
  }
}


module.exports = {
  register,
  login,
  uploadDocument,
  viewDoc
};

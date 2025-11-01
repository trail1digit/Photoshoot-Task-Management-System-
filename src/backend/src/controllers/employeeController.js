const employeeService = require("../services/employeeService");

const register = async (req, res) => {
  try {
    const response = await employeeService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: response,
    });

  } catch (error) {

    console.error("Error in employee controller:", error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
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

    console.error("Error in employee controller:", error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
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
    console.error("Error in employee controller:", error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
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
    console.error("Error in employee controller:", error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}


module.exports = {
  register,
  login,
  uploadDocument,
  viewDoc
};

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
    // single try-catch handles all errors
    console.error("Error in register controller:", error.message);

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
    // single try-catch handles all errors
    console.error("Error in register controller:", error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

module.exports = {
  register,
  login
};

const Employee = require("../models/Employee");
const Permission = require("../models/Permission");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(data) {
  const { role_id, name, address, email, password, phoneno } = data;

  if (!email || !password || !name) {
    const error = new Error("Name, email, and password are required");
    error.statusCode = 400;
    throw error;
  }

  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const employee = new Employee({
    role_id,
    name,
    address,
    email,
    password,
    phoneno,
  });

  await employee.save();

  return {
    id: employee._id,
    name: employee.name,
    email: employee.email,
  };
}

async function login(data) {
  const { email, password } = data;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const employee = await Employee.findOne({ email });
  if (!employee) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: employee._id, role_id: employee.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const permissionData = await Permission.find({ role_id: employee.role_id }).populate([
    { path: "role_id" }, { path: "module_id" }, { path: "submodule_id" }
  ]);
  return {
    token,
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
    },
    permissions: permissionData
  };
}

module.exports = {
  register,
  login,
};

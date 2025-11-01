const Employee = require("../models/Employee");
const EmployeeDoc = require('../models/EmployeeDoc');
const Permission = require("../models/Permission");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

async function register(data) {
  try {
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

  } catch (err) {
    throw err;
  }
}

async function login(data) {
  try {
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
  } catch (err) {
    throw err;
  }
}

async function uploadDocument(data, file) {
  try {
    // const EmployeeDoc = require('./models/EmployeeDoc');
    const { employee_no, employee_id, docType } = data;

    // Get employee_no from Employee table
    // const employee = await Employee.findById(employee_id);

    // if (!employee) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Employee not found'
    //   });
    // }

    // const employee_no = employee.employee_no;
    // Build file path for database
    const filePath = path.join(employee_no, docType, file.filename);

    // Check if document already exists in database
    const existingDoc = await EmployeeDoc.findOne({
      employee_id: employee_id,
      docType: docType
    });

    if (existingDoc) {
      // Update existing document
      existingDoc.image = filePath;
      await existingDoc.save();

      return {
        data: existingDoc
      };
    }

    // Create new document
    const doc = new EmployeeDoc({
      employee_id: employee_id,
      docType: docType,
      image: filePath
    });

    await doc.save();

    return {
      data: doc
    };
  } catch (err) {
    // res.status(500).json({ success: false, error: error.message });
    console.error("Err in delay/stuck analysis:", err);
    // const error = new Error("Failed to create order");
    // error.statusCode = 500;
    throw err;
  }
}

async function viewDoc(query) {
  try {
    const { employee_id, docType } = query;
    let filter = {};
    if ((employee_id || employee_id != "") && employee_id != undefined) {
      filter.employee_id = employee_id;
    }
    if ((docType || docType != "") && docType != undefined) {
      filter.docType = docType;
    }


    const listData = await EmployeeDoc.find(filter)
      .populate("employee_id")
      .sort({ created_at: -1 })

    return {
      list: listData
    };
  } catch (err) {
    throw err;
  }
}
module.exports = {
  register,
  login,
  uploadDocument,
  viewDoc
};

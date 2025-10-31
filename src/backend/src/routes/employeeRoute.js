const express = require("express");
const route = express.Router();
const employeeController = require("../controllers/employeeController");

route.post("/addEmployee", employeeController.register);
route.post("/login", employeeController.login);
module.exports = route;
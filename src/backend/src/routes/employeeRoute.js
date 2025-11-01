const express = require("express");
const route = express.Router();
const employeeController = require("../controllers/employeeController");
const verifyToken = require("../utils/auth");
const upload = require("../utils/upload");

route.post("/addEmployee", employeeController.register);
route.post("/login", employeeController.login);
route.post("/uploadDoc", verifyToken, upload.single('document'), employeeController.uploadDocument);
route.get("/viewDoc", verifyToken, employeeController.viewDoc);

module.exports = route;
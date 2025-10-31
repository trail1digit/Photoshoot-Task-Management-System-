const express = require("express");
const route = express.Router();
const roleController = require("../controllers/roleController");
const verifyToken = require("../utils/auth");

route.post("/addModule", roleController.addModule);
route.post("/addSubModule", roleController.addSubModule);
route.get("/getModules", verifyToken, roleController.getModuleData);
route.post("/addRole", roleController.addRole);

module.exports = route;
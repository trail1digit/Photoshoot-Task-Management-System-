const express = require("express");
const route = express.Router();
const subTaskController = require("../controllers/subTaskController");
const verifyToken = require("../utils/auth");

route.post("/addSubTask", verifyToken, subTaskController.addSubTask);
route.put("/updateSubTask/:id", verifyToken, subTaskController.updateSubTask);
route.put("/cancelSubTask/:id", verifyToken, subTaskController.cancelSubTask);
route.post("/reopenSubTask/:id", verifyToken, subTaskController.reopenSubTask);
route.post("/completeSubTask/:id", verifyToken, subTaskController.completeSubTask);
module.exports = route;
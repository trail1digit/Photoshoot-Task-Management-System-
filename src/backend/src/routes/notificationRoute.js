const express = require("express");
const route = express.Router();
const notificationController = require("../controllers/notificationController");
const verifyToken = require("../utils/auth");

route.get("/list", verifyToken, notificationController.list);

module.exports = route;
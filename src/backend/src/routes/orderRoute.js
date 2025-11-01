const express = require("express");
const route = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../utils/auth");

route.post("/addOrder", verifyToken, orderController.addOrder);
route.get("/orderSummary", verifyToken, orderController.orderSummary);
route.get("/priorityOverview", verifyToken, orderController.priorityOverview);
route.get("/delayAnalysis", verifyToken, orderController.delayAnalysis);

module.exports = route;
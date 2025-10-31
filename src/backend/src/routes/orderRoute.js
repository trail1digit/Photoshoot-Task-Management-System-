const express = require("express");
const route = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../utils/auth");

route.post("/addOrder", verifyToken, orderController.addOrder);
module.exports = route;
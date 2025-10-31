const express = require("express");
const route = express.Router();
const orderController = require("../controllers/orderController");

route.post("/addOrder", orderController.addOrder)
module.exports = route;
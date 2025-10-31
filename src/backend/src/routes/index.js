const express = require("express");
const app = express();

app.use("/role", require("./roleRoute"))
module.exports = app;
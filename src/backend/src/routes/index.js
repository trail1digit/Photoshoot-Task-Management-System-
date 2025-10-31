const express = require("express");
const app = express();

app.use("/role", require("./roleRoute"));
app.use("/employee", require("./employeeRoute"));
app.use("/order", require("./orderRoute"));
app.use("/subTask", require("./subTaskRoute"));
module.exports = app;
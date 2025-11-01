const mongoose = require("mongoose");

const EmployeeDocSchema = new mongoose.Schema({
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  docType: { type: String, enum: ["aadharCard", "panCard", "drivingLicence"], required: true },
  image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("EmployeeDoc", EmployeeDocSchema);

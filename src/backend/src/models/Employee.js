const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const EmployeeSchema = new mongoose.Schema({
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  employeeNo: { type: String, unique: true },
  name: { type: String, required: true },
  address: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneno: { type: String },
  fcm_token: { type: String },
}, { timestamps: true });

// Hash password before saving
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (!this.employeeNo) {
    this.employeeNo = "Employee-" + this._id.toString().slice(-6).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Employee", EmployeeSchema);

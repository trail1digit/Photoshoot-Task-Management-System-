const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  role_name: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Role", RoleSchema);

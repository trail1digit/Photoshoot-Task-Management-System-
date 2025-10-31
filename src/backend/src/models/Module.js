const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  module_name: { type: String, required: true },
  icon: { type: String },
  path: { type: String },
  key: { type: String },
  position: {type: String, unique: true},
}, { timestamps: true });

module.exports = mongoose.model("Module", ModuleSchema);

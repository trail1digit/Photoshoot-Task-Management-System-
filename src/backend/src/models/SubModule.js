const mongoose = require("mongoose");

const SubModuleSchema = new mongoose.Schema({
  module_id: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  submodule_name: { type: String, required: true },
  icon: { type: String },
  path: { type: String },
  key: { type: String },
  position: {type: String, unique: true},
}, { timestamps: true });

module.exports = mongoose.model("SubModule", SubModuleSchema);

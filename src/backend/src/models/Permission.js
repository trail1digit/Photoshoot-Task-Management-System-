const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  module_id: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  submodule_id: { type: mongoose.Schema.Types.ObjectId, ref: "SubModule", required: false },
  create: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  list: { type: Boolean, default: true },
  delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Permission", PermissionSchema);

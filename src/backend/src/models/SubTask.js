const mongoose = require("mongoose");

const SubTaskSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  company: { type: String, required: true },
  shoot_types: [{ type: String }], // e.g., ['Listing', 'Banner']
  is_urgent: { type: Boolean, default: false },
  due_at: { type: Date },
  priority_status: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["pending", "done", "cancelled"], default: "pending" },
  cancel_reason: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  done_by: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  done_at: { type: Date },
  updated_at: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("SubTask", SubTaskSchema);

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  order_no: { type: String, required: true, unique: true },
  gem_type: { type: String },
  jewelry_type: { type: String },
  metal: { type: String },
  tone: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  created_at: { type: Date, default: Date.now },
  status: { type: String, enum: ["open", "completed", "cancelled"], default: "open" },
  completed_at: { type: Date },
  task_id: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);

const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  message: { type: String, required: true },
  read_status: { type: Boolean, default: false },
  subtask_id: { type: mongoose.Schema.Types.ObjectId, ref: "SubTask" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);

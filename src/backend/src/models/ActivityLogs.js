const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: false },
    subtask_id: { type: mongoose.Schema.Types.ObjectId, ref: "SubModule", required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: false },
    action: { type: String, enum: ["created", "edited", "done", "cancelled", "reopened", "marked_urgent", "set_due_date"] },
    details: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", ActivitySchema);

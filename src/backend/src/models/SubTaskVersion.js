const mongoose = require("mongoose");

const SubTaskVersionSchema = new mongoose.Schema({
    subtask_id: { type: mongoose.Schema.Types.ObjectId, ref: "SubTask", required: true },
    version_no: { type: Number, required: true },
    action: { type: String, enum: ["reopened", "done", "cancelled"], required: true },
    details: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SubTaskVersion", SubTaskVersionSchema);

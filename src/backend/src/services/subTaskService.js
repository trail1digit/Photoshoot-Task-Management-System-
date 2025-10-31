const mongoose = require("mongoose");
const SubTask = require("../models/SubTask");
const ActivityLog = require("../models/ActivityLogs");
const SubTaskVersion = require("../models/SubTaskVersion");
const Order = require("../models/Order");

async function addSubTask(data, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { order_id, company, shoot_types, is_urgent, due_at } = data;

    const newSubTask = new SubTask({
      order_id,
      company,
      shoot_types,
      is_urgent,
      due_at,
    });

    const savedSubtask = await newSubTask.save({ session });

    // Activity log entry
    const newActivityLog = new ActivityLog({
      order_id,
      subtask_id: savedSubtask._id,
      user_id: userId || 1,
      action: "created",
      details: "Subtask created",
    });

    await newActivityLog.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Subtask added successfully",
      subtask: savedSubtask,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

async function updateSubTask(subtaskId, data, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shoot_types, is_urgent, due_at } = data;

    const subtask = await SubTask.findById(subtaskId).session(session);
    if (!subtask) {
      const error = new Error("Subtask not found");
      error.statusCode = 404;
      throw error;
    }

    if (subtask.status === "done") {
      const error = new Error("Cannot edit a completed subtask");
      error.statusCode = 400;
      throw error;
    }

    const changes = {};
    if (shoot_types && JSON.stringify(shoot_types) !== JSON.stringify(subtask.shoot_types))
      changes.shoot_types = { old: subtask.shoot_types, new: shoot_types };

    if (typeof is_urgent !== "undefined" && is_urgent !== subtask.is_urgent)
      changes.is_urgent = { old: subtask.is_urgent, new: is_urgent };

    if (due_at && new Date(due_at).toISOString() !== new Date(subtask.due_at).toISOString())
      changes.due_at = { old: subtask.due_at, new: due_at };

    if (Object.keys(changes).length === 0) {
      const error = new Error("No valid changes detected");
      error.statusCode = 400;
      throw error;
    }

    const updatedSubtask = await SubTask.findByIdAndUpdate(
      subtaskId,
      {
        shoot_types,
        is_urgent,
        due_at,
        updated_at: new Date(),
      },
      { new: true, session }
    );

    await ActivityLog.create(
      [{
        order_id: updatedSubtask.order_id,
        subtask_id: updatedSubtask._id,
        user_id: userId,
        action: "edited",
        details: "Subtask updated",
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

async function cancelSubTask(subtaskId, data, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { cancel_reason } = data;

    if (!cancel_reason || cancel_reason.trim() === "") {
      const error = new Error("Cancel reason is required");
      error.statusCode = 400;
      throw error;
    }

    const subtask = await SubTask.findById(subtaskId).session(session);
    if (!subtask) {
      const error = new Error("Subtask not found");
      error.statusCode = 404;
      throw error;
    }

    if (subtask.status === "cancelled") {
      const error = new Error("Subtask already cancelled");
      error.statusCode = 400;
      throw error;
    }

    if (subtask.status === "done") {
      const error = new Error("Cannot cancel a completed subtask");
      error.statusCode = 400;
      throw error;
    }

    const updatedSubtask = await SubTask.findByIdAndUpdate(
      subtaskId,
      {
        status: "cancelled",
        cancel_reason,
        updated_at: new Date(),
      },
      { new: true, session }
    );

    await ActivityLog.create(
      [{
        order_id: updatedSubtask.order_id,
        subtask_id: updatedSubtask._id,
        user_id: userId || 1,
        action: "cancelled",
        details: `Subtask cancelled. Reason: ${cancel_reason}`,
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Subtask cancelled successfully",
      subtask: updatedSubtask,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

async function reopenSubTask(subtaskId, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const subtask = await SubTask.findById(subtaskId).session(session);
    if (!subtask) {
      throw new Error("Subtask not found");
    }

    if (subtask.status !== "cancelled") {
      throw new Error("Only cancelled subtasks can be reopened");
    }

    const lastVersion = await SubTaskVersion
      .findOne({ subtask_id: subtaskId })
      .sort({ version_no: -1 })
      .session(session);

    const newVersionNo = lastVersion ? lastVersion.version_no + 1 : 1;

    await SubTaskVersion.create(
      [{
        subtask_id: subtaskId,
        version_no: newVersionNo,
        action: "reopened",
        details: `Subtask reopened by user ${userId}`,
        created_by: userId,
        created_at: new Date(),
      }],
      { session }
    );

    subtask.status = "pending";
    subtask.cancel_reason = null;
    subtask.updated_at = new Date();
    await subtask.save({ session });

    await ActivityLog.create(
      [{
        order_id: subtask.order_id,
        subtask_id: subtask._id,
        user_id: userId,
        action: "reopened",
        details: `Subtask reopened by user ${userId}`,
        created_at: new Date(),
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Subtask reopened successfully",
      subtask_id: subtaskId,
      new_status: "pending",
      version_no: newVersionNo,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

async function completeSubTask(subtaskId, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subtask = await SubTask.findById(subtaskId).session(session);
    if (!subtask) throw new Error("Subtask not found");

    if (subtask.status === "done") throw new Error("Subtask already completed");
    if (subtask.status === "cancelled") throw new Error("Cancelled subtask cannot be marked as done");

    subtask.status = "done";
    subtask.done_by = userId;
    subtask.done_at = new Date();
    subtask.updated_at = new Date();
    await subtask.save({ session });

    await ActivityLog.create(
      [{
        order_id: subtask.order_id,
        subtask_id: subtask._id,
        user_id: userId,
        action: "done",
        details: `Subtask marked done by user ${userId}`,
        created_at: new Date(),
      }],
      { session }
    );

    const remainingSubtasks = await SubTask.find({
      order_id: subtask.order_id,
      status: { $nin: ["done", "cancelled"] },
    }).session(session);

    if (remainingSubtasks.length === 0) {
      const mainTask = await Order.findById(subtask.order_id).session(session);
      if (mainTask) {
        mainTask.status = "completed";
        mainTask.completed_at = new Date();
        await mainTask.save({ session });

        await ActivityLog.create(
          [{
            order_id: mainTask._id,
            user_id: userId,
            action: "done",
            details: "Main task marked as completed (all subtasks done/cancelled)",
            created_at: new Date(),
          }],
          { session }
        );
      }

    }

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Subtask completed successfully",
      subtask_id: subtaskId,
      status: "done",
      main_task_completed: remainingSubtasks.length === 0,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

module.exports = {
  addSubTask,
  updateSubTask,
  cancelSubTask,
  reopenSubTask,
  completeSubTask
};

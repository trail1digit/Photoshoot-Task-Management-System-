const mongoose = require("mongoose");
const SubTask = require("../models/SubTask");
const ActivityLog = require("../models/ActivityLogs");
const SubTaskVersion = require("../models/SubTaskVersion");
const Order = require("../models/Order");
const { sendNotification } = require("../utils/notification");
const Notification = require("../models/Notifications");

async function notifyUsers(userId, title, message, data = {}) {
  const tokens = [];
  // for (const userId of userIds) {
    const notif = new Notification({
      user_id: userId,
      title,
      message,
      read_status: false,
      timestamp: new Date(),
    });
    await notif.save();

    // if using tokens in User model
    // const user = await User.findById(userId);
    // if (user?.fcm_token) tokens.push(user.fcm_token);
  // }

  if (tokens.length > 0) {
    await sendNotification(tokens, title, message, data);
  }
}

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

    await ActivityLog.create([{
      order_id,
      subtask_id: savedSubtask._id,
      user_id: userId,
      action: "created",
      details: "Subtask created",
    }], { session });

    await session.commitTransaction();
    session.endSession();

    await notifyUsers(
      userId,
      "New Subtask Created",
      `A new subtask (${savedSubtask._id}) has been created for order ${order_id}.`,
      { subtask_id: savedSubtask._id.toString(), order_id: order_id.toString() }
    );

    return {
      message: "Subtask added successfully",
      subtask: savedSubtask,
    };
  } catch (err) {
    console.log(err);
    
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
    if (!subtask) throw new Error("Subtask not found");
    if (subtask.status === "done") throw new Error("Cannot edit a completed subtask");

    const updatedSubtask = await SubTask.findByIdAndUpdate(
      subtaskId,
      { shoot_types, is_urgent, due_at, updated_at: new Date() },
      { new: true, session }
    );

    await ActivityLog.create([{
      order_id: updatedSubtask.order_id,
      subtask_id: updatedSubtask._id,
      user_id: userId,
      action: "edited",
      details: "Subtask updated",
    }], { session });

    await session.commitTransaction();
    session.endSession();

    await notifyUsers(
      [userId],
      "Subtask Updated",
      `Subtask ${updatedSubtask._id} has been updated.`,
      { subtask_id: updatedSubtask._id.toString() }
    );

    return { message: "Subtask updated successfully" };
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
    if (!cancel_reason) throw new Error("Cancel reason is required");

    const subtask = await SubTask.findById(subtaskId).session(session);
    if (!subtask) throw new Error("Subtask not found");
    if (["cancelled", "done"].includes(subtask.status)) throw new Error("Cannot cancel this subtask");

    subtask.status = "cancelled";
    subtask.cancel_reason = cancel_reason;
    subtask.updated_at = new Date();
    await subtask.save({ session });

    await ActivityLog.create([{
      order_id: subtask.order_id,
      subtask_id: subtask._id,
      user_id: userId,
      action: "cancelled",
      details: `Subtask cancelled. Reason: ${cancel_reason}`,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    await notifyUsers(
      [userId],
      "Subtask Cancelled",
      `Subtask ${subtask._id} has been cancelled. Reason: ${cancel_reason}`,
      { subtask_id: subtask._id.toString() }
    );

    return { message: "Subtask cancelled successfully" };
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
    if (["done", "cancelled"].includes(subtask.status)) throw new Error("Invalid subtask status");

    subtask.status = "done";
    subtask.done_by = userId;
    subtask.done_at = new Date();
    subtask.updated_at = new Date();
    await subtask.save({ session });

    await ActivityLog.create([{
      order_id: subtask.order_id,
      subtask_id: subtask._id,
      user_id: userId,
      action: "done",
      details: `Subtask marked done by user ${userId}`,
    }], { session });

    const remaining = await SubTask.find({
      order_id: subtask.order_id,
      status: { $nin: ["done", "cancelled"] },
    }).session(session);

    if (remaining.length === 0) {
      const mainTask = await Order.findById(subtask.order_id).session(session);
      if (mainTask) {
        mainTask.status = "completed";
        mainTask.completed_at = new Date();
        await mainTask.save({ session });

        await ActivityLog.create([{
          order_id: mainTask._id,
          user_id: userId,
          action: "done",
          details: "Main task completed automatically",
        }], { session });

        await notifyUsers(
          [userId],
          "Main Task Completed",
          `All subtasks for order ${mainTask._id} are completed.`,
          { order_id: mainTask._id.toString() }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    await notifyUsers(
      [userId],
      "Subtask Completed",
      `Subtask ${subtask._id} has been completed.`,
      { subtask_id: subtask._id.toString() }
    );

    return { message: "Subtask completed successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

async function reopenSubTask(subtaskId, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subtask = await SubTask.findById(subtaskId).session(session);
    if (!subtask || subtask.status !== "cancelled") throw new Error("Only cancelled subtasks can be reopened");

    const lastVersion = await SubTaskVersion.findOne({ subtask_id: subtaskId })
      .sort({ version_no: -1 })
      .session(session);
    const newVersionNo = lastVersion ? lastVersion.version_no + 1 : 1;

    await SubTaskVersion.create([{
      subtask_id: subtaskId,
      version_no: newVersionNo,
      action: "reopened",
      details: `Subtask reopened by user ${userId}`,
      created_by: userId,
    }], { session });

    subtask.status = "pending";
    subtask.cancel_reason = null;
    subtask.updated_at = new Date();
    await subtask.save({ session });

    await ActivityLog.create([{
      order_id: subtask.order_id,
      subtask_id: subtask._id,
      user_id: userId,
      action: "reopened",
      details: `Subtask reopened by user ${userId}`,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    await notifyUsers(
      [userId],
      "Subtask Reopened",
      `Subtask ${subtask._id} has been reopened.`,
      { subtask_id: subtask._id.toString() }
    );

    return { message: "Subtask reopened successfully" };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

async function markUrgentSubTask(subtaskId, data, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { isUrgent } = data;
    const subtasks = await SubTask.findById(subtaskId).session(session);
    if (!subtasks) {
      const error = new Error("Subtask not found");
      error.statusCode = 404;
      throw error;
    }

    if (subtasks.is_urgent === isUrgent) {
      const error = new Error(
        `Subtask is already marked as ${isUrgent ? "urgent" : "non-urgent"}`
      );
      error.statusCode = 400;
      throw error;
    }

    subtasks.is_urgent = isUrgent;
    subtasks.updated_at = new Date();
    await subtasks.save({ session });


    await ActivityLog.create([{
      order_id: subtasks.order_id,
      subtask_id: subtasks._id,
      user_id: userId,
      action: "marked_urgent",
      details: `Subtask marked as ${isUrgent ? "urgent" : "not urgent"}`,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // const photographyTeamTokens = [
    //   // Replace with actual tokens fetched from DB
    //   "fcm_token_1",
    //   "fcm_token_2",
    // ];

    const title = isUrgent
      ? "Urgent Subtask Assigned"
      : "Subtask Marked as Normal";
    const body = `Subtask ${subtasks._id} has been marked as ${isUrgent ? "URGENT" : "not urgent"
      }. Please check immediately.`;


    await notifyUsers(
      userId,
      title,
      body,
      { subtask_id: subtasks._id.toString() }
    );

    return {
      message: `Subtask marked as ${isUrgent ? "urgent" : "not urgent"} successfully`,
      subtask_id: subtasks._id,
      is_urgent: subtasks.is_urgent,
    };
  } catch (error) {
    console.log(error);
    
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
  completeSubTask,
  markUrgentSubTask,
};

const Order = require("../models/Order");
const ActivityLog = require("../models/ActivityLogs");
const SubTask = require("../models/SubTask");
const mongoose = require("mongoose");

async function addOrder(data, user) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { order_no, gem_type, jewelry_type, metal, tone } = data;

    const newOrder = new Order({
      order_no,
      gem_type,
      jewelry_type,
      metal,
      tone,
      created_by: user.id,
    });

    const savedOrder = await newOrder.save({ session });

    const newActivityLog = new ActivityLog({
      order_id: savedOrder._id,
      subtask_id: undefined,
      user_id: user.id,
      action: "created",
      details: "Task Created",
    });

    await newActivityLog.save({ session });
    await session.commitTransaction();
    session.endSession();

    return {
      message: "Order created successfully",
      order: savedOrder,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Add Order Error:", err);
    throw err;

  }
}

async function orderSummary(query, user) {
  try {
    const { status, type, page, limit } = query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });
    const openOrders = await Order.countDocuments({ status: "open" });

    const totalSubtasks = await SubTask.countDocuments();
    const completedShoots = await SubTask.countDocuments({ status: "done" });
    const pendingShoots = await SubTask.countDocuments({ status: "pending" });
    const cancelledShoots = await SubTask.countDocuments({ status: "cancelled" });


    let filter = {};

    if (status) {
      const normalized = status.toLowerCase();
      if (type === "subtask") {
        if (normalized === "completed") filter.status = "done";
        else if (normalized === "pending") filter.status = "pending";
        else if (normalized === "cancelled") filter.status = "cancelled";
      } else {
        if (["completed", "open", "cancelled"].includes(normalized)) filter.status = normalized;
      }
    }

    let listData = [];
    let totalFiltered = 0;

    if (type === "subtask") {
      totalFiltered = await SubTask.countDocuments(filter);
      listData = await SubTask.find(filter)
        .populate("order_id", "order_no jewelry_type gem_type")
        .populate("created_by", "name email")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum);
    } else {
      totalFiltered = await Order.countDocuments(filter);
      listData = await Order.find(filter)
        .populate("created_by", "name email")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum);
    }

    let response = {
      summary: {
        orders: {
          total: totalOrders,
          open: openOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
        subtasks: {
          total: totalSubtasks,
          completed: completedShoots,
          pending: pendingShoots,
          cancelled: cancelledShoots,
        },
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalFiltered / limitNum),
        totalItems: totalFiltered,
        limit: limitNum,
      },
      filterUsed: { type, status: status || "all" },
      list: listData,
    };

    return response;
  } catch (err) {
    console.error("Error in priority overview:", err);

    throw err;

  }
}

async function priorityOverview() {
  try {
    const now = new Date();

    const urgentCount = await SubTask.countDocuments({ is_urgent: true, status: { $nin: ["done", "cancelled"] } });

    const overdueCount = await SubTask.countDocuments({
      due_at: { $lt: now },
      status: { $nin: ["done", "cancelled"] }
    });

    const normalCount = await SubTask.countDocuments({
      is_urgent: false,
      // due_at: { $gte: now },
      status: { $nin: ["done", "cancelled"] }
    });

    let summary = {
      urgent: urgentCount,
      overdue: overdueCount,
      normal: normalCount
    }

    return summary;
  } catch (err) {
    console.error("Error in priority overview:", err);

    throw err;

  }
}

async function delayAnalysis() {
  try {
    const now = new Date();

    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);

    const next24Hours = new Date(now);
    next24Hours.setHours(now.getHours() + 24);

    const delayedTasks = await SubTask.find({
      due_at: { $lt: now },
      // status: { $nin: ["done", "cancelled"] }
    });

    const dueSoonTasks = await SubTask.find({
      due_at: { $gte: now, $lte: next24Hours },
      status: { $nin: ["done", "cancelled"] }
    });

    const stuckTasks = await SubTask.find({
      updated_at: { $lt: threeDaysAgo },
      status: { $nin: ["done", "cancelled"] }
    });

    let response = {
      summary: {
        delayed: delayedTasks.length,
        due_soon: dueSoonTasks.length,
        stuck: stuckTasks.length
      },
      details: {
        delayed: delayedTasks,
        due_soon: dueSoonTasks,
        stuck: stuckTasks
      }
    };

    return response;
  } catch (err) {
    console.error("Err in delay/stuck analysis:", err);
    throw err;

  }

}

module.exports = {
  addOrder,
  orderSummary,
  priorityOverview,
  delayAnalysis
}
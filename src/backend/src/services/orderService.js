const Order = require("../models/Order");
const ActivityLog = require("../models/ActivityLogs");
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
      subtask_id: '',
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
    const error = new Error("Failed to create order");
    error.statusCode = 500;
    throw error;
  }
}


module.exports = {
  addOrder
}
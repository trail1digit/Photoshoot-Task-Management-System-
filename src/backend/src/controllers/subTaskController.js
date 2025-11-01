const subTaskService = require("../services/subTaskService");

const addSubTask = async (req, res, next) => {
  try {
    const response = await subTaskService.addSubTask(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Subtask added successfully",
      data: response,
    });
  } catch (error) {
    next(error); // forward to centralized error handler
  }
};

const updateSubTask = async (req, res, next) => {
  try {
    const response = await subTaskService.updateSubTask(req.params.id, req.body, req.user.id);
    res.status(200).json({
      success: true,
      message: "Subtask updated successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const cancelSubTask = async (req, res, next) => {
  try {
    const response = await subTaskService.cancelSubTask(req.params.id, req.body, req.user.id);
    res.status(200).json({
      success: true,
      message: "Subtask cancelled successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const reopenSubTask = async (req, res, next) => {
  try {
    const response = await subTaskService.reopenSubTask(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: "Subtask reopened successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const completeSubTask = async (req, res, next) => {
  try {
    const response = await subTaskService.completeSubTask(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: "Subtask completed successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const markAsUrgent = async (req, res, next) => {
  try {
    const response = await subTaskService.markUrgentSubTask(req.params.id, req.body, req.user.id);
    res.status(200).json({
      success: true,
      message: "Subtask urgency updated successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSubTask,
  updateSubTask,
  cancelSubTask,
  reopenSubTask,
  completeSubTask,
  markAsUrgent,
};

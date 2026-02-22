import { Task } from "../models/Task.model.js";

// Create Task (Admin/Manager)
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;
    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      deadline,
    });

    res.status(201).json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Tasks (Employee)
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("assignedBy", "name email");
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Task Status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if task is late
    if (status === "DONE" && new Date() > new Date(task.deadline)) {
      task.status = "LATE";
    } else {
      task.status = status;
    }

    if (status === "DONE" || status === "LATE") {
      task.completedAt = new Date();
    }

    await task.save();
    res.status(200).json({ success: true, message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

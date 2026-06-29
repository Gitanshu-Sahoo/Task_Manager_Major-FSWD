const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

// GET all tasks of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// CREATE task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      completed: req.body.completed || false,
      user: req.user._id,
    });

    const savedTask = await task.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE task
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or access denied",
      });
    }

    task.title = req.body.title ?? task.title;
    task.completed =
      req.body.completed ?? task.completed;
    task.dueDate = req.body.dueDate ?? task.dueDate;
    task.priority =
      req.body.priority ?? task.priority;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or access denied",
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
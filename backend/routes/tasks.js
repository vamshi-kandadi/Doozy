const router = require("express").Router();
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

// CREATE TASK
router.post("/", protect, async (req, res) => {
  const { title, status, priority, dueDate } = req.body;

  const newTask = new Task({
    userId: req.user,
    title,
    status: status || "yet",
    priority: priority || "medium",
    dueDate: dueDate || null,
  });

  await newTask.save();
  res.json(newTask);
});

// GET ALL TASKS
router.get("/", protect, async (req, res) => {
  const tasks = await Task.find({ userId: req.user });
  res.json(tasks);
});

// UPDATE TASK
router.put("/:id", protect, async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedTask);
});

// DELETE TASK
router.delete("/:id", protect, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;
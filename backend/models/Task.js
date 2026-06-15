const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    userId: String,
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["yet", "progress", "completed"],
      default: "yet",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model("Task", TaskSchema);
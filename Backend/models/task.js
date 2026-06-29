const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default:null,
    },
    priority: {
      type: String,
      enum:["High","Medium","Low"],
      default: "Medium",
    },
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Task", TaskSchema);
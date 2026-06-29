const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes.js");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/auth",authRoutes)
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));
// Test Routes
app.get("/", (req, res) => {
  res.send("Task Manager Backend Running Successfully");
});
app.get("/api/test", (req, res) => {
  res.json({
    message: "Frontend and Backend Connected!"
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const tasksRouter = express.Router();
const requireAuth = require("../middleware/auth.middleware");

const tasksController = require("../controllers/tasks.controller");

tasksRouter.get("/", tasksController.getTasks);
tasksRouter.post("/", tasksController.createTask);
tasksRouter.put("/", requireAuth, tasksController.updateTask);
tasksRouter.delete("/:id", requireAuth, tasksController.deleteTask);

module.exports = tasksRouter;

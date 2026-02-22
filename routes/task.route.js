import express from "express";
import { createTask, getAllTasks, getMyTasks, updateTaskStatus, deleteTask } from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/", verifyToken, checkRole("ADMIN", "MANAGER"), createTask);
router.get("/", verifyToken, getAllTasks);
router.get("/my-tasks", verifyToken, getMyTasks);
router.put("/:id", verifyToken, updateTaskStatus);
router.delete("/:id", verifyToken, checkRole("ADMIN", "MANAGER"), deleteTask);

export default router;

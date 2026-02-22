import express from "express";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import { toggleUserStatus } from "../controllers/status.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/", verifyToken, checkRole("ADMIN"), createUser);
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, checkRole("ADMIN"), updateUser);
router.patch("/:id/toggle-status", verifyToken, checkRole("ADMIN"), toggleUserStatus);
router.delete("/:id", verifyToken, checkRole("ADMIN"), deleteUser);

export default router;

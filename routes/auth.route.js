import express from "express";
import { login, logout, getMe, createFirstAdmin } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/setup-admin", createFirstAdmin); // One-time setup

// Private routes
router.get("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);

export default router;

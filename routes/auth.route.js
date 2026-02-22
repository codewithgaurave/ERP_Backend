import express from "express";
import { login, logout, getMe, createFirstAdmin } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/setup-admin", createFirstAdmin);
router.get("/logout", verifyToken, logout);
router.get("/me", verifyToken, getMe);

export default router;

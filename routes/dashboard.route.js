import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", verifyToken, getDashboardData);

export default router;

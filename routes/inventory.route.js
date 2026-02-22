import express from "express";
import { addItem, getAllItems, updateItem, issueItem, returnItem, getAllLogs, getMyLogs } from "../controllers/inventory.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/", verifyToken, checkRole("ADMIN", "INVENTORY"), addItem);
router.get("/", verifyToken, getAllItems);
router.put("/:id", verifyToken, checkRole("ADMIN", "INVENTORY"), updateItem);
router.post("/issue", verifyToken, checkRole("ADMIN", "INVENTORY"), issueItem);
router.post("/return", verifyToken, checkRole("ADMIN", "INVENTORY"), returnItem);
router.get("/logs", verifyToken, getAllLogs);
router.get("/my-logs", verifyToken, getMyLogs);

export default router;

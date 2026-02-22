import express from "express";
import { generatePayroll, getAllPayrolls, getMyPayroll, getPayrollById } from "../controllers/payroll.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/", verifyToken, checkRole("ADMIN", "HR"), generatePayroll);
router.get("/", verifyToken, checkRole("ADMIN", "HR"), getAllPayrolls);
router.get("/my-payroll", verifyToken, getMyPayroll);
router.get("/:id", verifyToken, getPayrollById);

export default router;

import { Payroll } from "../models/Payroll.model.js";
import { Task } from "../models/Task.model.js";
import { User } from "../models/User.model.js";

// Generate Payroll (Admin/HR)
export const generatePayroll = async (req, res) => {
  try {
    const { userId, month, bonus } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Parse month (format: YYYY-MM)
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    // Check for late tasks in the given month
    const lateTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "LATE",
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Convert to numbers
    const baseSalary = Number(user.salary) || 0;
    const bonusAmount = Number(bonus) || 0;
    const deduction = lateTasks * 500; // 500 per late task
    const finalSalary = baseSalary + bonusAmount - deduction;

    const payroll = await Payroll.create({
      userId,
      month,
      salary: baseSalary,
      bonus: bonusAmount,
      deduction,
      finalSalary,
    });

    res.status(201).json({ success: true, message: "Payroll generated successfully", payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Payrolls
export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate("userId", "name email");
    res.status(200).json({ success: true, payrolls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Payroll (Employee)
export const getMyPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find({ userId: req.user._id });
    res.status(200).json({ success: true, payrolls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Payroll by ID
export const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate("userId", "name email");
    if (!payroll) {
      return res.status(404).json({ success: false, message: "Payroll not found" });
    }
    res.status(200).json({ success: true, payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

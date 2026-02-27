import { User } from "../models/User.model.js";
import { Task } from "../models/Task.model.js";
import { Payroll } from "../models/Payroll.model.js";
import { Inventory } from "../models/Inventory.model.js";

export const getDashboardData = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;
    const stats = {
      counts: {},
      taskDistribution: [],
      monthlyTaskChart: [],
      monthlyPayrollChart: [],
      recentActivity: []
    };

    // 1. Basic Counts based on Role
    if (role === 'ADMIN' || role === 'HR') {
      stats.counts.totalUsers = await User.countDocuments();
    }

    if (role === 'ADMIN' || role === 'MANAGER' || role === 'EMPLOYEE') {
      const taskFilter = role === 'EMPLOYEE' ? { assignedTo: userId } : {};
      stats.counts.totalTasks = await Task.countDocuments(taskFilter);

      // Task Distribution by Status
      stats.taskDistribution = await Task.aggregate([
        { $match: taskFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
    }

    if (role === 'ADMIN' || role === 'INVENTORY') {
      stats.counts.totalInventoryItems = await Inventory.countDocuments();
    }

    if (role === 'ADMIN' || role === 'HR' || role === 'EMPLOYEE') {
      const payrollFilter = role === 'EMPLOYEE' ? { userId: userId } : {};
      stats.counts.totalPayrolls = await Payroll.countDocuments(payrollFilter);
    }

    // 2. Monthly Task Chart Data (Last 6-12 months)
    // We'll calculate task counts per month
    const taskAggregationFilter = role === 'EMPLOYEE' ? { assignedTo: userId } : {};
    const taskChartData = await Task.aggregate([
      { $match: taskAggregationFilter },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ]);
    stats.monthlyTaskChart = taskChartData;

    // 3. Monthly Payroll Chart Data (Last 12 months)
    const payrollAggregationFilter = role === 'EMPLOYEE' ? { userId: userId } : {};
    const payrollChartData = await Payroll.aggregate([
      { $match: payrollAggregationFilter },
      {
        $group: {
          _id: "$month", // month is stored as string like "January 2026" or similar? 
          // Let's check Payroll model again.
          totalSalary: { $sum: "$finalSalary" }
        }
      },
      { $limit: 12 }
    ]);
    stats.monthlyPayrollChart = payrollChartData;

    // 4. Recent Activities
    if (role === 'ADMIN') {
      stats.recentActivity = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

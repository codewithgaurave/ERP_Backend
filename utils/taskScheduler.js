import { Task } from "../models/Task.model.js";

// Auto-mark late tasks (run daily via cron or manually)
export const markLateTasks = async () => {
  try {
    const now = new Date();
    const result = await Task.updateMany(
      {
        status: "PENDING",
        deadline: { $lt: now },
      },
      {
        $set: { status: "LATE" },
      }
    );
    console.log(`✅ Marked ${result.modifiedCount} tasks as LATE`);
    return result;
  } catch (error) {
    console.error("❌ Error marking late tasks:", error.message);
  }
};

// Run every day at midnight (optional - can be called manually too)
export const startTaskScheduler = () => {
  setInterval(markLateTasks, 24 * 60 * 60 * 1000); // 24 hours
  console.log("⏰ Task scheduler started - checking for late tasks daily");
};

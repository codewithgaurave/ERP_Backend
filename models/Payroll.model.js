import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    deduction: {
      type: Number,
      default: 0,
    },
    finalSalary: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

payrollSchema.index({ userId: 1, month: 1 }, { unique: true });

export const Payroll = mongoose.model("Payroll", payrollSchema);

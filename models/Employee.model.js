import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      required: true,
    },
    phone: String,
    address: String,
    emergencyContact: String,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    documents: [
      {
        name: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);

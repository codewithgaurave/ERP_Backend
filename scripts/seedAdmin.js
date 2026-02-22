import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Database connected");

    const adminExists = await User.findOne({ role: "ADMIN" });
    if (adminExists) {
      console.log("⚠️ Admin already exists!");
      console.log("📧 Email:", adminExists.email);
      process.exit(0);
    }

    const admin = new User({
      name: "Super Admin",
      email: "admin@erp.com",
      password: "admin123",
      role: "ADMIN",
      salary: 100000,
      status: true,
    });

    await admin.save();

    console.log("🎉 Admin created successfully!");
    console.log("📧 Email: admin@erp.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️ Please change password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();

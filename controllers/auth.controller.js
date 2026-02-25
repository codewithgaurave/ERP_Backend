import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";

// Helper function to generate and send token
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // STEP 8 - Security best practice
  };

  // Set secure cookie in production
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      salary: user.salary,
      status: user.status,
      lastLogin: user.lastLogin,
    },
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // 2. Check user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // 3. Status check
    if (!user.status) {
      return res.status(401).json({ success: false, message: "Your account is deactivated" });
    }

    // 4. Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // 5. Update last login
    user.lastLogin = Date.now();
    await user.save();

    // 6. Send token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user / Clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      salary: user.salary,
      status: user.status,
      lastLogin: user.lastLogin,
    },
  });
};

// For initial setup: Create first Admin (Remove or protect in production)
export const createFirstAdmin = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const { name, email, password } = req.body;
    const admin = await User.create({
      name,
      email,
      password,
      role: "ADMIN",
    });

    sendTokenResponse(admin, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

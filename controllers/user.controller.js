import { User } from "../models/User.model.js";

// Create User (Admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, salary } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role, 
      salary,
      createdBy: req.user._id 
    });
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, message: "User created successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("createdBy", "name email");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { name, role, salary, status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, salary, status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

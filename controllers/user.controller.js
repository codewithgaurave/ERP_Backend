import { User } from "../models/User.model.js";

// Create User (Admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, salary } = req.body;

    // Restriction: ADMIN cannot create another ADMIN
    if (req.user.role === "ADMIN" && role === "ADMIN") {
      return res.status(403).json({ success: false, message: "You are not authorized to create an Admin user" });
    }

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const roleFilter = req.query.role || "";
    const statusFilter = req.query.status || "";

    const query = {};
    const conditions = [];

    // Global Search
    if (search) {
      conditions.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      });
    }

    // Status Filtering
    if (statusFilter !== "") {
      conditions.push({ status: statusFilter === "true" });
    }

    // Role Filtering
    if (roleFilter) {
      conditions.push({ role: roleFilter });
    }

    // CRITICAL: Exclusion logic - If requester is ADMIN, they cannot see ADMINs
    const requesterRole = req.user.role ? req.user.role.toUpperCase() : "";
    const adminRoles = ["ADMIN", "admin", "SUPER_ADMIN", "super_admin"];

    if (requesterRole.includes("ADMIN")) {
      conditions.push({ role: { $nin: adminRoles } });
    }

    if (conditions.length > 0) {
      query.$and = conditions;
    }

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit,
      },
    });
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

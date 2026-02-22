import { User } from "../models/User.model.js";

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.status = !user.status;
    await user.save();

    res.status(200).json({ success: true, message: "Status toggled successfully", user: { _id: user._id, name: user.name, status: user.status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { Inventory } from "../models/Inventory.model.js";
import { InventoryLog } from "../models/InventoryLog.model.js";

// Add Item (Admin/Inventory)
export const addItem = async (req, res) => {
  try {
    const { itemName, quantity } = req.body;
    const item = await Inventory.create({ itemName, quantity });
    res.status(201).json({ success: true, message: "Item added successfully", item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Items
export const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Item
export const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, message: "Item updated successfully", item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Issue Item (Admin/Inventory)
export const issueItem = async (req, res) => {
  try {
    const { itemId, userId, quantity } = req.body;

    const item = await Inventory.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    item.quantity -= quantity;
    await item.save();

    const log = await InventoryLog.create({ itemId, userId, action: "ISSUE", quantity });

    res.status(201).json({ success: true, message: "Item issued successfully", log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Return Item (Admin/Inventory)
export const returnItem = async (req, res) => {
  try {
    const { itemId, userId, quantity } = req.body;

    const item = await Inventory.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    item.quantity += quantity;
    await item.save();

    const log = await InventoryLog.create({ itemId, userId, action: "RETURN", quantity });

    res.status(201).json({ success: true, message: "Item returned successfully", log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Logs
export const getAllLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.find()
      .populate("itemId", "itemName")
      .populate("userId", "name email");
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Logs (Employee)
export const getMyLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.find({ userId: req.user._id })
      .populate("itemId", "itemName");
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

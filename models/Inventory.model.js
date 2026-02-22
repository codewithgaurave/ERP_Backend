import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);

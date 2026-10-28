
import mongoose from "mongoose";

const inventoryHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },

    operation: {
      type: String,
      enum: ["add", "subtract"],
      required: [true, "Operation is required"],
    },

    quantityChanged: {
      type: Number,
      required: [true, "Quantity changed is required"],
      min: [0.01, "Quantity changed must be positive"],
    },

    previousQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    newQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const InventoryHistory = mongoose.model(
  "InventoryHistory",
  inventoryHistorySchema
);

export default InventoryHistory;

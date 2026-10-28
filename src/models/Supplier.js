
import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Supplier email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Supplier phone is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Supplier address is required"],
      trim: true,
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;

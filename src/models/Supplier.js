
import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      match: [
        /^[A-Za-z][A-Za-z .'-]*$/,
        "Supplier name must contain valid letters",
      ],
    },

    email: {
      type: String,
      required: [true, "Supplier email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
  /^[A-Za-z][A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]*@[A-Za-z]+(?:[.-][A-Za-z]+)*\.[A-Za-z]{2,}$/,
  "Please enter a valid email address",
],
    },

    phone: {
      type: String,
      required: [true, "Supplier phone is required"],
      trim: true,
      match: [
        /^\d{11}$/,
        "Phone number must contain exactly 11 digits",
      ],
    },

    address: {
      type: String,
      required: [true, "Supplier address is required"],
      trim: true,
    },

    company: {
  type: String,
  required: [true, "Company name is required"],
  trim: true,
  match: [
    /^[A-Za-z0-9 &.,'-]+$/,
    "Company name contains invalid characters",
  ],
},
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;

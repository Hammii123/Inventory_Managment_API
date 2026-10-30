
import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      match:[/^[A-Za-z]+$/,"Supplier name must contain only letters"],
    },

    email: {
      type: String,
      required: [true, "Supplier email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
  /^[A-Za-z][A-Za-z0-9._$-]*@[A-Za-z]+\.[A-Za-z]{2,}$/,
  "Email must start with a letter, followed by optional numbers or special characters, @, domain letters, dot and extension letters",
],
    },

    phone: {
      type: String,
      required: [true, "Supplier phone is required"],
      trim: true,
      match:[ 
        /^\+?[0-9]+$/,
        "Phone Number must contain only digits with optional + at the beginning",
      ]
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
      match:[
        /^[A-Za-z ]*$/,
        "Company name must contain only letters and spaces",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;

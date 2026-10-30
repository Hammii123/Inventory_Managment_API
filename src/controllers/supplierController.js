
import Supplier from "../models/Supplier.js";
import mongoose from "mongoose";
// CREATE SUPPLIER
export const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, company } = req.body;
const requiredFields = [
  { field: "name", value: name },
  { field: "email", value: email },
  { field: "phone", value: phone },
  { field: "address", value: address },
];

for (const item of requiredFields) {
  if (typeof item.value !== "string") {
    return res.status(400).json({
      success: false,
      field: item.field,
      message: `${item.field} must be a string`,
    });
  }

  if (!item.value.trim()) {
    return res.status(400).json({
      success: false,
      field: item.field,
      message: `${item.field} is required`,
    });
  }
}

if (
  company !== undefined &&
  typeof company !== "string"
) {
  return res.status(400).json({
    success: false,
    field: "company",
    message: "Company must be a string",
  });
}
    const supplier = await Supplier.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      company:
        typeof company === "string" ? company.trim() : "",
    });

    return res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier,
    });
  } catch (error) {

    
  // Mongoose field validation errors
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      errors,
    });
  }

  // Duplicate email error
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      field: Object.keys(error.keyPattern || {})[0],
      message: "Supplier email already exists",
    });
  }

  console.error("Create supplier error:", error.message);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });

  }
};






 
// GET ALL SUPPLIERS
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    console.error("Get suppliers error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};






// GET SUPPLIER BY ID
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID",
      });
    }

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error("Get supplier error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID",
      });
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "address",
      "company",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    for (const field of ["name", "email", "phone", "address", "company"]) {
      if (Object.hasOwn(updates, field)) {
        if (typeof updates[field] !== "string") {
          return res.status(400).json({
            success: false,
            message: `${field} must be a string`,
          });
        }

        updates[field] = updates[field].trim();

        if (
          ["name", "email", "phone", "address"].includes(field) &&
          !updates[field]
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`,
          });
        }
      }
    }

    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: supplier,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Supplier email already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update supplier error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID",
      });
    }

    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
      data: supplier,
    });
  } catch (error) {
    console.error("Delete supplier error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


import Product from "../models/Product.js";
import mongoose from "mongoose";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, sku, quantity, price, category } = req.body;

    // Validate string fields
    const stringFields = [
      { field: "name", value: name },
      { field: "sku", value: sku },
      { field: "category", value: category },
    ];

    for (const item of stringFields) {
      if (typeof item.value !== "string") {
        return res.status(400).json({
          success: false,
          message: `${item.field} must be a string`,
        });
      }

      if (item.value.trim() === "") {
        return res.status(400).json({
          success: false,
          message: `${item.field} is required`,
        });
      }
    }

    // Validate numeric fields
    const numericFields = [
      { field: "price", value: price },
      { field: "quantity", value: quantity },
    ];

    for (const item of numericFields) {
      if (
        typeof item.value !== "number" ||
        !Number.isFinite(item.value) ||
        item.value <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: `${item.field} must be a positive number`,
        });
      }
    }

    const product = await Product.create({
      name: name.trim(),
      sku: sku.trim(),
      quantity,
      price,
      category: category.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "SKU already exists",
      });
    }

    if (error.name === "ValidationError" ||
        error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL PRODUCTS WITH PAGINATION AND SEARCH
export const getAllProducts = async (req, res) => {
  try {
    let {
      page = "1",
      limit = "10",
      search = "",
      category="",
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Page must be positive and limit must be between 1 and 100",
      });
    }

    if (typeof search !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search must be a string",
      });
    }
    search = search.trim();

    if(typeof category !== "string") {
      return res.status(400).json({
        success: false,
        message:"Category must be a atring"
      })
    }
    
    category = category.trim();


    const 

    // Search by product name or SKU
    const filter = search
      ? {
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              sku: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        }
      : {};


  
      if (category) {
  filter.category = {
    $regex: `^${category}$`,
    $options: "i",
  };
}

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts =
      await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        limit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
      },
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const allowedFields = [
      "name",
      "sku",
      "quantity",
      "price",
      "category",
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

    // Validate provided string fields
    for (const field of ["name", "sku", "category"]) {
      if (Object.hasOwn(updates, field)) {
        if (typeof updates[field] !== "string") {
          return res.status(400).json({
            success: false,
            message: `${field} must be a string`,
          });
        }

        if (updates[field].trim() === "") {
          return res.status(400).json({
            success: false,
            message: `${field} is required`,
          });
        }

        updates[field] = updates[field].trim();
      }
    }

    // Validate provided numeric fields
    for (const field of ["price", "quantity"]) {
      if (Object.hasOwn(updates, field)) {
        if (
          typeof updates[field] !== "number" ||
          !Number.isFinite(updates[field]) ||
          updates[field] <= 0
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a positive number`,
          });
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "SKU already exists",
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Delete product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

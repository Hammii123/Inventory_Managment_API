
import Product from "../models/Product.js";
import mongoose from "mongoose";

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

    // Create product after validation
    const product = await Product.create({
      name,
      sku,
      quantity,
      price,
      category,
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

    console.error("Create product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getAllProducts = async(req, res) => {
    try{
        const products = await Product.find();

        return res.status(200).json({
            success:true,
            count:products.length,
            data:products
        });

    } catch(error) {
        console.error("Get products error:", error.message);

        return res.status(500).json({
            success:false,
            message:"Internal server error",
        });
    }
};

export const getProductBYId = async (req, res) =>{
    try{
        const {id} = req.params;

        if (!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid product ID",
            });
        }

        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found",
            });
        }

        return res.status(200).json({
            success:true,
            data:product,
        });
    
    
    }  catch (error)  {
        console.error("get product error:",error.message);

        return res.status(500).json({
            success:false,
            message:"Internal server error",
        });
    }

};

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

export const getProductById = async (req, res) =>{
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


export const updateProduct = async (req,res) => {
  try{
    const {id} = req.params;
    const {name,sku,quantity,price,category} = req.body;

    if(!mongoose.isValidObjectId(id)){
      return res.status(400).json({
        success:false,
        message:"Invalid product ID",
      });
    }


    const allowedFields = [
      "name", "sku" , "quantity", "price","category",
    ];

    const updates = {};

    for(const field of allowedFields) {
      if (Object.hasOwn(req.body , field)){
        updates[field] = req.body[field];
      }
    }

    if(Object.keys(updates).length === 0){
      return res.status(400).json({
        success:false,
        message:"Provide at least one field to update",
      });
    }

    if(
      ("name" in updates && typeof name !== "string") || ("sku" in updates && typeof sku !== "string")|| ("category" in updates && typeof category !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message:"Name, SKU and category must be strings",
      });
    }


    if (
      ("price" in updates && (typeof price !== "number" || !Number.isFinite(price) || price<=0)) || ("quantity" in updates && (typeof quantity !=="number" || !Number.isFinite(quantity) || quantity<= 0))
    ) {
      return res.status(400).json({
        success: false,
        message:"Price and quantity must be positive numbers",
      }); 
       }

       const product = await Product.findByIdAndUpdate(
        id,updates,{
          new:true ,
          runValidators:true,
        }
       );

       if(!product) {
        return res.status(404).json({
          success:false,
          message:"Product not found",
        });
       }

       return res.status(200).json ({
        success:true,
        message:"Product updated successfully",
        data:product,
       });

  }  catch (error){
       if(error.code === 11000){
        return res.status(409).json({
          success:false,
          message:"SKU already exists" ,
        });
       }

       if (error.name === "ValidationError" || error.name === "CastError"){
        return res.status(400).json({
          success:false,
          message:error.message,
        });
       }

       console.error("update product error:",error.message);
       

       return res.status(500).json({
        success:false,
        message:"Internal server error",
       });
  }
};


export const deleteProduct = async (req,res) => {
  try{
    const {id} = req.params;

    if(!mongoose.isValidObjectId(id)){
      return res.status(400).json({
        success:false,
        message:"Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);
    
    
    if(!product){
      return res.status(404).js
    }
  }
}
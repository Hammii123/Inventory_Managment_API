import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Product name is required"],
            trim:true,
            validate:{
                validator: (value) => typeof value === "string", 
                message: "Name must be a string",
            },
        }, 
       
        sku:{
            type:String,
            required:[true,"SKU is required"],
            unique:true,
            trim:true,
            validate:{
                validator:(value) => typeof value === "string",
                message:"SKU must be string",
            },
        },

        quantity:{
            type:Number,
            required:[true,"Quantity is required"],
            min:[0,"Quantity cannot be neagtive"],
            validate:{
                validator:(value)=> typeof value === "number" && Number.isFinite(value),
                message:"Quantity must be a number",
            }
        },

        price:{
            type:Number,
            required:[true,"Price is required"],
            min:[0.01, "Price must be greater than zero"],
            validate:{
                validator:(value)=> typeof value === "number" && Number.isFinite(value),
                message:"Price must be a number",
            },
        },

        category:{
            type:String,
            required:[true,"Category is required"],
            trim: true,
            validate:{
                validator:(value) => typeof value === "string",
                message: "category must be a string",
            },
        },
        
        
       },

       {
         timestamps: true,
       }
    );

const Product = mongoose.model("Product",productSchema);

export default Product;
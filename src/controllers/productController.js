
import Product from "../models/Product.js";
import mongoose from "mongoose";
import InventoryHistory from "../models/InventoryHistory.js";
import Supplier from "../models/Supplier.js";
import  {stringify} from "csv-stringify/sync";


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      quantity,
      price,
      category,
      supplier: supplierDetails,
    } = req.body;

    // Validate required product string fields
    const stringFields = [
      { field: "name", value: name },
      { field: "sku", value: sku },
      { field: "category", value: category },
    ];

    for (const item of stringFields) {
      if (typeof item.value !== "string" || !item.value.trim()) {
        return res.status(400).json({
          success: false,
          message: `${item.field} is required`,
        });
      }
    }

    const productNameRegex = /^[A-Za-z0-9][A-Za-z0-9 &().,'/_+-]*$/;

if (!productNameRegex.test(name.trim())) {
  return res.status(400).json({
    success: false,
    field: "name",
    message: "Product name contains invalid characters",
  });
}

    // Validate quantity
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        field: "quantity",
        message: "Quantity must be a positive integer",
      });
    }

    // Validate price
    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return res.status(400).json({
        success: false,
        field: "price",
        message: "Price must be a positive number",
      });
    }

    // Supplier is required
    if (
      !supplierDetails ||
      typeof supplierDetails !== "object" ||
      Array.isArray(supplierDetails)
    ) {
      return res.status(400).json({
        success: false,
        message: "Supplier information is required",
      });
    }

    const { name: supplierName, email, phone, address, company } =
      supplierDetails;

    // Validate required supplier fields
    const requiredSupplierFields = [
      { field: "supplier name", value: supplierName },
      { field: "supplier email", value: email },
      { field: "supplier phone", value: phone },
      { field: "supplier address", value: address },
    ];

    for (const item of requiredSupplierFields) {
      if (typeof item.value !== "string" || !item.value.trim()) {
        return res.status(400).json({
          success: false,
          message: `${item.field} is required`,
        });
      }
    }

    // Validate supplier email
    const emailRegex =
  /^[A-Za-z][A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]*@[A-Za-z]+(?:[.-][A-Za-z]+)*\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Please enter a valid supplier email",
      });
    }

    // Validate supplier phone
    if (!/^\d{11}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        field: "phone",
        message: "Supplier phone must contain exactly 11 digits",
      });
    }

    // Validate optional company
    if (typeof company !== "string" || !company.trim()) {
  return res.status(400).json({
    success: false,
    field: "company",
    message: "Company name is required",
  });
}
    let supplier = await Supplier.findOne({
      email: email.trim().toLowerCase(),
    });

    if (supplier) {
      // Update existing supplier details with submitted information
      supplier.name = supplierName.trim();
      supplier.phone = phone.trim();
      supplier.address = address.trim();
      supplier.company =
        typeof company === "string" ? company.trim() : "";

      await supplier.save();
    } else {
      supplier = await Supplier.create({
        name: supplierName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        company: typeof company === "string" ? company.trim() : "",
      });
    }

    // Create product
    const product = await Product.create({
      name: name.trim(),
      sku: sku.trim(),
      quantity,
      price,
      category: category.trim(),
      supplier: supplier._id,
    });

    await product.populate("supplier");

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });

  } catch (error) {
    // Mongoose validation errors
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

    // Duplicate SKU or supplier email
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      return res.status(409).json({
        success: false,
        field: duplicateField,
        message:
          duplicateField === "email"
            ? "Supplier email already exists"
            : "SKU already exists",
      });
    }

    console.error("Create product error:", error);

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


    const  allowedSortFields = [
      "name" , "price" , "quantity" , "createdAt",
    ];

    if(!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success:false,
        message:"Invalid sort field",
      });
    }

    if(!["asc", "desc"].includes(order)){
      return res,status(400).json({
        success:false,
        message:"Order must be asc or desc"
      });
    }



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
  .populate("supplier", "name email phone company")
  .sort({
    [sortBy]: order === "asc" ? 1 : -1,
  })
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


const product = await Product.findById(id)
  .populate("supplier", "name email phone company");



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
      "supplier",
    ];

    const updates = {};
    const hasSupplierName = Object.hasOwn(req.body, "supplierName");

if (hasSupplierName) {
  if (
    typeof req.body.supplierName !== "string" ||
    !req.body.supplierName.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Supplier name is required",
    });
  }

  const supplierNameRegex = /^[A-Za-z][A-Za-z .'-]*$/;

  if (!supplierNameRegex.test(req.body.supplierName.trim())) {
    return res.status(400).json({
      success: false,
      message: "Invalid supplier name",
    });
  }
}

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0 && !hasSupplierName) {
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


    if (Object.hasOwn(updates,"supplier")) {
      if(updates.supplier !== null &&  updates.supplier !== ""){
        if(!mongoose.isValidObjectId(updates.supplier)){
          return res.status(400).json({
            success:false,
            message:"Invalid supplier ID",
          });
        }
        const supplierExists = await Supplier.findById(updates.supplier);

        if(!supplierExists){
          return res.status(404).json({
            success:false,
            message:"Supplier not found",
          });
        }
      }
      else {
        updates.supplier=null;
      }
    }




const product = await Product.findById(id);

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}

// Update supplier name if provided
if (hasSupplierName) {
  const supplierId = Object.hasOwn(updates, "supplier")
    ? updates.supplier
    : product.supplier;

  if (!supplierId) {
    return res.status(400).json({
      success: false,
      message: "This product has no supplier to update",
    });
  }

  const supplier = await Supplier.findByIdAndUpdate(
    supplierId,
    { name: req.body.supplierName.trim() },
    { new: true, runValidators: true }
  );

  if (!supplier) {
    return res.status(404).json({
      success: false,
      message: "Supplier not found",
    });
  }
}

// Update product fields
product.set(updates);
await product.save();

await product.populate("supplier");

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



export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive number",
      });
    }

    if (!["add", "subtract"].includes(operation)) {
      return res.status(400).json({
        success: false,
        message: "Operation must be add or subtract",
      });
    }

    // Find the product and check its current stock
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const previousQuantity = product.quantity;

    let newQuantity;

    if (operation === "add") {
      newQuantity = previousQuantity + quantity;
    } else {
      newQuantity = previousQuantity - quantity;

      if (newQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }
    }

    // Update the product's current stock
    product.quantity = newQuantity;
    await product.save();

    // Save the stock change in inventory history
    const history = await InventoryHistory.create({
      product: product._id,
      operation,
      quantityChanged: quantity,
      previousQuantity,
      newQuantity,
    });

    return res.status(200).json({
      success: true,
      message: "Stock updated and history recorded successfully",
      data: {
        product,
        history,
      },
    });
  } catch (error) {
    console.error("Update stock error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const getInventoryHistory = async (req, res) => {
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

    const history = await InventoryHistory.find({
      product: id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error("Get inventory history error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const uploadProductImage = async (req, res, next) => {
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    product.image = req.file.path;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product image uploaded successfully",
      image: product.image,
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const exportProductsCSV = async(req,res,next ) => {
  try{
    const products = await Product.find().populate("supplier","name eamil");


    const csvData = products.map((product) => ({
      id:product._id.toString(),
      name:product.name,
      sku:product.sku,
      quantity:product.price,
      category:product.category,
      supplier:product.supplier?.name || "",
      image:product.image,
      createdAt:product.createdAt,
    }));

    const output = stringify(csvData, {
  header: true,
  columns: [
    "id",
    "name",
    "sku",
    "quantity",
    "price",
    "category",
    "supplier",
    "image",
    "createdAt",
  ],
});

res.setHeader("Content-Type", "text/csv; charset=utf-8");
res.setHeader(
  "Content-Disposition",
  'attachment; filename="products.csv"'
);

res.status(200).send(output);
  } catch (error) {
    next(error);
  }
}
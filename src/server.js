
import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";


const app = express();

app.use("/uploads", express.static("uploads"));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Inventory Management API is running",
  });
});

app.post("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "POST route is working",
  });
});

app.use("/api/products", productRoutes);

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};


app.use("/api/products",productRoutes);

app.use("/api/suppliers",supplierRoutes)
startServer();

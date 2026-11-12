import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";

const app = express();

// CORS must come before the routes
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.64:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

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
app.use("/api/suppliers", supplierRoutes);

const startServer = async () => {
  try {
    await connectDB();

    // Default 3001 so it never clashes with the Next.js frontend on 3000
    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
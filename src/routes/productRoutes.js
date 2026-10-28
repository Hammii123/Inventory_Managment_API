
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  getInventoryHistory
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.put("/:id",updateProduct);
router.delete("/:id",deleteProduct);

router.patch("/:id/stock",updateStock);
router.patch("/:id/history",getInventoryHistory)
export default router;

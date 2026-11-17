"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
}
export default function StockPage() {

  const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");


const [selectedAddProduct, setSelectedAddProduct] = useState("");
const [selectedRemoveProduct, setSelectedRemoveProduct] = useState("");

const [addQuantity, setAddQuantity] = useState("");
const [removeQuantity, setRemoveQuantity] = useState("");

const [message, setMessage] = useState("");
const [updating, setUpdating] = useState(false);

useEffect(() => {
  async function fetchProducts() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=100`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const result: ProductsResponse = await response.json();

      setProducts(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  fetchProducts();
}, []);


async function handleStockUpdate(
  productId: string,
  quantity: number,
  operation: "add" | "subtract"
) {
  if (!productId) {
    setMessage("Please select a product.");
    return;
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    setMessage("Please enter a valid positive quantity.");
    return;
  }

  setUpdating(true);
  setMessage("");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/stock`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          operation,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Stock update failed");
    }

    setMessage(
      operation === "add"
        ? "Stock added successfully!"
        : "Stock removed successfully!"
    );

    const productsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=100`,
      { cache: "no-store" }
    );

    if (productsResponse.ok) {
      const productsResult: ProductsResponse =
        await productsResponse.json();

      setProducts(productsResult.data);
    }

    setAddQuantity("");
    setRemoveQuantity("");
  } catch (error) {
    setMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  } finally {
    setUpdating(false);
  }
}

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Stock Management
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor and manage your product stock.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
  <h2 className="text-xl font-semibold text-green-700">
    Add Stock
  </h2>

  <p className="mt-2 text-slate-500">
    Increase the quantity of an existing product.
  </p>

  <div className="mt-6 space-y-4">
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Select Product
      </label>

      <select
        value={selectedAddProduct}
        onChange={(e) => setSelectedAddProduct(e.target.value)}
        className="w-full rounded-lg border border-slate-300 p-3"
      >
        <option value="">Choose a product</option>

        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name} ({product.sku}) - Stock: {product.quantity}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Quantity to Add
      </label>

      <input
        type="number"
        min="1"
        step="1"
        value={addQuantity}
        onChange={(e) => setAddQuantity(e.target.value)}
        placeholder="Enter quantity"
        className="w-full rounded-lg border border-slate-300 p-3"
      />
    </div>

    <button
      type="button"
      disabled={updating || loading}
      onClick={() =>
        handleStockUpdate(
          selectedAddProduct,
          Number(addQuantity),
          "add"
        )
      }
      className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
    >
      {updating ? "Updating..." : "Add Stock"}
    </button>
  </div>
</div>

       <div className="rounded-xl bg-white p-6 shadow-sm">
  <h2 className="text-xl font-semibold text-red-700">
    Remove Stock
  </h2>

  <p className="mt-2 text-slate-500">
    Decrease the quantity of an existing product.
  </p>

  <div className="mt-6 space-y-4">
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Select Product
      </label>

      <select
        value={selectedRemoveProduct}
        onChange={(e) => setSelectedRemoveProduct(e.target.value)}
        className="w-full rounded-lg border border-slate-300 p-3"
      >
        <option value="">Choose a product</option>

        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name} ({product.sku}) - Stock: {product.quantity}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Quantity to Remove
      </label>

      <input
        type="number"
        min="1"
        step="1"
        value={removeQuantity}
        onChange={(e) => setRemoveQuantity(e.target.value)}
        placeholder="Enter quantity"
        className="w-full rounded-lg border border-slate-300 p-3"
      />
    </div>

    <button
      type="button"
      disabled={updating || loading}
      onClick={() =>
        handleStockUpdate(
          selectedRemoveProduct,
          Number(removeQuantity),
          "subtract"
        )
      }
      className="w-full rounded-lg bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
    >
      {updating ? "Updating..." : "Remove Stock"}
    </button>
  </div>
</div>
      </div>
    </div>
  );
}

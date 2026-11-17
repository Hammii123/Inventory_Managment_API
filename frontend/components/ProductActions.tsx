"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
    image?: string | null;
  supplier?: {
    _id: string;
    name: string;
  } | null;
  
}

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    category: product.category,
    quantity: String(product.quantity),
    price: String(product.price),
    supplierName: product.supplier?.name || "",
  });

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${product.name}?`,
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${product._id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete product");
      }

      setMessage("Deleted successfully!");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    setMessage("Only JPEG, PNG, and WebP images are allowed.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setMessage("Image size must be less than 5 MB.");
    event.target.value = "";
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  setUploading(true);
  setMessage("");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${product._id}/image`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Image upload failed");
    }

    setMessage("Product image uploaded successfully!");
    router.refresh();
  } catch (error) {
    setMessage(
      error instanceof Error ? error.message : "Something went wrong"
    );
  } finally {
    setUploading(false);
    event.target.value = "";
  }
}

  async function handleUpdate() {
    if (
      !formData.name.trim() ||
      !formData.sku.trim() ||
      !formData.category.trim() ||
      !formData.supplierName.trim() ||
      !/^[1-9]\d*$/.test(formData.quantity) ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      setMessage("Please enter valid product information.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  name: formData.name.trim(),
  sku: formData.sku.trim(),
  category: formData.category.trim(),
  quantity: Number(formData.quantity),
  price: Number(formData.price),
  supplierName: formData.supplierName.trim(),
}),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update product");
      }

      setIsEditing(false);
      setMessage("Product updated successfully!");

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>

      
<div className="mt-3">
  <label
    className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg ${
      uploading
        ? "pointer-events-none cursor-not-allowed opacity-60"
        : "cursor-pointer"
    }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>

    {uploading ? "Uploading..." : "Upload Image"}

    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handleImageUpload}
      disabled={uploading}
      className="hidden"
    />
  </label>
</div>


      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-xl font-bold text-slate-800">
              Edit Product
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Product Name"
                className="w-full rounded-lg border p-3"
              />

              <input
                type="text"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                placeholder="SKU"
                className="w-full rounded-lg border p-3"
              />

              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Category"
                className="w-full rounded-lg border p-3"
              />

              <input
                type="text"
                value={formData.supplierName}
                onChange={(e) =>
                  setFormData({ ...formData, supplierName: e.target.value })
                }
                placeholder="Supplier Name"
                className="w-full rounded-lg border p-3"
              />

              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                placeholder="Quantity"
                className="w-full rounded-lg border p-3"
              />

              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Price"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg bg-slate-200 px-4 py-2 text-slate-700"
              >
                Cancel
              </button>

              <button
  type="button"
  onClick={handleUpdate}
  disabled={loading}
  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {loading ? "Saving..." : "Save Changes"}
</button>
            </div>
          </div>
        </div>
      )}

      {message && <p className="mt-2 text-xs text-slate-600">{message}</p>}
    </div>
  );
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: "",
    price: "",
    category: "",
    supplierName: "",
    supplierEmail: "",
    supplierPhone: "",
    supplierAddress: "",
    supplierCompany: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            sku: formData.sku,
            quantity: Number(formData.quantity),
            price: Number(formData.price),
            category: formData.category,
            supplier: {
              name: formData.supplierName,
              email: formData.supplierEmail,
              phone: formData.supplierPhone,
              address: formData.supplierAddress,
              company: formData.supplierCompany,
            },
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add product");
      }

      setMessage("Product added successfully!");

      setFormData({
        name: "",
        sku: "",
        quantity: "",
        price: "",
        category: "",
        supplierName: "",
        supplierEmail: "",
        supplierPhone: "",
        supplierAddress: "",
        supplierCompany: "",
      });

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <h3 className="mb-4 font-semibold text-slate-700">
            Product Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="rounded-lg border p-3" />

            <input name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU" required className="rounded-lg border p-3" />

            <input name="quantity" type="number" min="1" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required className="rounded-lg border p-3" />

            <input name="price" type="number" min="0.01" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price (Rs.)" required className="rounded-lg border p-3" />

            <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="rounded-lg border p-3 md:col-span-2" />
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-slate-700">
            Supplier Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input name="supplierName" value={formData.supplierName} onChange={handleChange} placeholder="Supplier Name" required className="rounded-lg border p-3" />

            <input name="supplierEmail" type="email" value={formData.supplierEmail} onChange={handleChange} placeholder="Supplier Email" required className="rounded-lg border p-3" />

            <input name="supplierPhone" value={formData.supplierPhone} onChange={handleChange} placeholder="Supplier Phone" required className="rounded-lg border p-3" />

            <input name="supplierCompany" value={formData.supplierCompany} onChange={handleChange} placeholder="Company Name" className="rounded-lg border p-3" />

            <input name="supplierAddress" value={formData.supplierAddress} onChange={handleChange} placeholder="Supplier Address" required className="rounded-lg border p-3 md:col-span-2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>

        {message && (
          <p className="text-sm font-medium text-slate-700">
            {message}
          </p>
        )}

      </form>
    </div>
  );
}

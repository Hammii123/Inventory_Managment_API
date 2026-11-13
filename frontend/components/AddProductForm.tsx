
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  // Validation patterns
  const emailRegex =
  /^[A-Za-z][A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]*@[A-Za-z]+(?:[.-][A-Za-z]+)*\.[A-Za-z]{2,}$/;

  const supplierNameRegex = /^[A-Za-z][A-Za-z .'-]*$/;

  const companyRegex = /^[A-Za-z0-9 &.,'-]*$/;

  // Check every field
  const errors: Record<string, string> = {
    name:
  !formData.name.trim()
    ? "Product name is required"
    : !/^[A-Za-z0-9][A-Za-z0-9 &().,'/_+-]*$/.test(formData.name.trim())
      ? "Product name contains invalid characters"
      : "",
    sku: !formData.sku.trim() ? "SKU is required" : "",
    quantity:
      !/^[1-9]\d*$/.test(formData.quantity)
        ? "Quantity must be a positive integer"
        : "",
    price:
      !formData.price.trim() ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
        ? "Price must be a positive number"
        : "",
    category: !formData.category.trim() ? "Category is required" : "",

    supplierName:
      !formData.supplierName.trim()
        ? "Supplier name is required"
        : !supplierNameRegex.test(formData.supplierName.trim())
          ? "Enter a valid supplier name"
          : "",

    supplierEmail:
      !formData.supplierEmail.trim()
        ? "Supplier email is required"
        : !emailRegex.test(formData.supplierEmail.trim())
          ? "Enter a valid email address"
          : "",

    supplierPhone:
      !/^\d{11}$/.test(formData.supplierPhone.replace("-", ""))
        ? "Phone number must contain exactly 11 digits"
        : "",

    supplierAddress:
      !formData.supplierAddress.trim()
        ? "Supplier address is required"
        : "",

   supplierCompany:
  !formData.supplierCompany.trim()
    ? "Company name is required"
    : !/^[A-Za-z0-9 &.,'-]+$/.test(formData.supplierCompany.trim())
      ? "Company name contains invalid characters"
      : "",
  };

  const isFormValid = Object.values(errors).every(
    (error) => error === ""
  );

  // Input styling based on validation
  function getInputClass(field: string) {
    const hasError = errors[field] !== "";
    const hasBeenTouched = touched[field];

    let validationClass = "border-slate-300";

    if (hasBeenTouched) {
      validationClass = hasError
        ? "border-red-500 bg-red-50 focus:border-red-500"
        : "border-green-500 bg-green-50 focus:border-green-500";
    }

    return `w-full rounded-lg border p-3 outline-none transition ${validationClass}`;
  }

  // Display field error
  function getError(field: string) {
    if (touched[field] && errors[field]) {
      return (
        <p className="mt-1 text-xs text-red-600">
          {errors[field]}
        </p>
      );
    }

    return null;
  }

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    let updatedValue = value;

    // Phone formatting
    if (name === "supplierPhone") {
      const digits = value.replace(/\D/g, "").slice(0, 11);

      updatedValue =
        digits.length > 4
          ? `${digits.slice(0, 4)}-${digits.slice(4)}`
          : digits;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: updatedValue,
    }));

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));

    setMessage("");
  }

  // Mark field as touched when user leaves it
  function handleBlur(field: string) {
    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Safety check before API request
    if (!isFormValid) {
      return;
    }

    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            sku: formData.sku.trim(),
            quantity: Number(formData.quantity),
            price: Number(formData.price),
            category: formData.category.trim(),
            supplier: {
              name: formData.supplierName.trim(),
              email: formData.supplierEmail.trim(),
              phone: formData.supplierPhone.replace(/\D/g, ""),
              address: formData.supplierAddress.trim(),
              company: formData.supplierCompany.trim(),
            },
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = "Something went wrong";

        if (Array.isArray(result.errors) && result.errors.length > 0) {
          errorMessage = result.errors
            .map(
              (error: { field: string; message: string }) =>
                `${error.field}: ${error.message}`
            )
            .join("\n");
        } else if (result.message) {
          errorMessage = result.message;
        }

        throw new Error(errorMessage);
      }

      setIsSuccess(true);
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

      setTouched({});
      router.refresh();

    } catch (error) {
      setIsSuccess(false);

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

        {/* Product Information */}
        <div>
          <h3 className="mb-4 font-semibold text-slate-700">
            Product Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                placeholder="Product Name"
                className={getInputClass("name")}
              />
              {getError("name")}
            </div>

            <div>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                onBlur={() => handleBlur("sku")}
                placeholder="SKU"
                className={getInputClass("sku")}
              />
              {getError("sku")}
            </div>

            <div>
              <input
                name="quantity"
                type="text"
                inputMode="numeric"
                value={formData.quantity}
                onChange={handleChange}
                onBlur={() => handleBlur("quantity")}
                placeholder="Quantity"
                className={getInputClass("quantity")}
              />
              {getError("quantity")}
            </div>

            <div>
              <input
                name="price"
                type="text"
                inputMode="decimal"
                value={formData.price}
                onChange={handleChange}
                onBlur={() => handleBlur("price")}
                placeholder="Price (Rs.)"
                className={getInputClass("price")}
              />
              {getError("price")}
            </div>

            <div className="md:col-span-2">
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={() => handleBlur("category")}
                placeholder="Category"
                className={getInputClass("category")}
              />
              {getError("category")}
            </div>

          </div>
        </div>

        {/* Supplier Information */}
        <div>
          <h3 className="mb-4 font-semibold text-slate-700">
            Supplier Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <input
                name="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
                onBlur={() => handleBlur("supplierName")}
                placeholder="Supplier Name"
                className={getInputClass("supplierName")}
              />
              {getError("supplierName")}
            </div>

            <div>
              <input
                name="supplierEmail"
                type="text"
                value={formData.supplierEmail}
                onChange={handleChange}
                onBlur={() => handleBlur("supplierEmail")}
                placeholder="Supplier Email"
                className={getInputClass("supplierEmail")}
              />
              {getError("supplierEmail")}
            </div>

            <div>
              <input
                name="supplierPhone"
                type="tel"
                inputMode="numeric"
                value={formData.supplierPhone}
                onChange={handleChange}
                onBlur={() => handleBlur("supplierPhone")}
                placeholder="0300-1234567"
                className={getInputClass("supplierPhone")}
              />
              {getError("supplierPhone")}
            </div>

            <div>
              <input
                name="supplierCompany"
                value={formData.supplierCompany}
                onChange={handleChange}
                onBlur={() => handleBlur("supplierCompany")}
                placeholder="Company Name"
                className={getInputClass("supplierCompany")}
              />
              {getError("supplierCompany")}
            </div>

            <div className="md:col-span-2">
              <input
                name="supplierAddress"
                value={formData.supplierAddress}
                onChange={handleChange}
                onBlur={() => handleBlur("supplierAddress")}
                placeholder="Supplier Address"
                className={getInputClass("supplierAddress")}
              />
              {getError("supplierAddress")}
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>

        {/* Success / Error Notification */}
        {message && (
          <div
            className={`rounded-lg p-4 text-sm font-medium ${
              isSuccess
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}

      </form>
    </div>
  );
}

"use client";

import SupplierActions from "@/components/SupplierActions";
import { useEffect, useRef, useState } from "react";


interface Supplier {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
}

interface Product {
    _id: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    category: string;
    supplier: string | { _id: string } | null;
}

interface Props {
    suppliers: Supplier[];
    products: Product[];
}

export default function SupplierSearch({ suppliers, products }: Props) {
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const selectedSupplier =
        suppliers.find((supplier) => supplier._id === selectedId) || null;

    const suggestions = search.trim()
        ? suppliers
            .filter((supplier) =>
                [supplier.name, supplier.email, supplier.company].some((value) =>
                    value.toLowerCase().includes(search.toLowerCase()),
                ),
            )
            .slice(0, 8)
        : [];

    const selectSupplier = (supplier: Supplier) => {
        setSelectedId(supplier._id);
        setSearch(supplier.name);
    };

    const supplierProducts = selectedSupplier
        ? products.filter((product) => {
            if (typeof product.supplier === "string") {
                return product.supplier === selectedSupplier._id;
            }

            return product.supplier?._id === selectedSupplier._id;
        })
        : [];

    const totalProducts = supplierProducts.length;

    const totalStock = supplierProducts.reduce(
        (total, product) => total + product.quantity,
        0,
    );

    const totalStockValue = supplierProducts.reduce(
        (total, product) => total + product.quantity * product.price,
        0,
    );
    const searchRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

    return (
        <div>
            {/* SEARCH BAR */}
            <div ref={searchRef} className="relative mb-10">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setSelectedId(null);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => {
                        if (search.trim()) setShowSuggestions(true);

                    }}
                    placeholder="Search by supplier name, email, or company..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-4 outline-none focus:border-blue-500"
                />

                {showSuggestions &&
                    suggestions.length > 0 && (
                        <div className="absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">
                            {suggestions.map((supplier) => (
                                <button
                                    type="button"
                                    key={supplier._id}
                                    onClick={() => {
                                        setSelectedId(supplier._id);
                                        setSearch(supplier.name);
                                        setShowSuggestions(false);
                                    }}
                                    className="block w-full border-b p-4 text-left hover:bg-slate-50"
                                >
                                    <p className="font-semibold text-slate-800">{supplier.name}</p>
                                    <p className="text-sm text-slate-500">{supplier.email}</p>
                                    <p className="text-sm text-slate-500">{supplier.company}</p>
                                </button>
                            ))}
                        </div>
                    )}

                {search.trim() !== "" &&
                    suggestions.length === 0 &&
                    !selectedSupplier && (
                        <p className="mt-2 text-sm text-slate-500">
                            No matching suppliers found.
                        </p>
                    )}
            </div>

            {/* SUPPLIER DIRECTORY */}
            <div className="mb-10">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">
                        Supplier Directory
                    </h2>
                    <span className="text-sm text-slate-500">
                        {suppliers.length} suppliers
                    </span>
                </div>

                <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-sm text-slate-600">
                            <tr>
                                <th className="p-4">Supplier Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Company</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {suppliers.map((supplier) => (
                                <tr
                                    key={supplier._id}
                                    className={`border-t hover:bg-slate-50 ${selectedId === supplier._id ? "bg-blue-50" : ""
                                        }`}
                                >
                                    <td className="p-4 font-medium text-slate-800">
                                        {supplier.name}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {supplier.email}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {supplier.company}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {supplier.phone}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => {
                                                setSelectedId(supplier._id);
                                                setShowSuggestions(false);
                                            }}
                                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                        >
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {suppliers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-500">
                                        No suppliers available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SELECTED SUPPLIER PROFILE */}
            {selectedSupplier && (
                <div>
                    <h2 className="mb-5 text-xl font-bold text-slate-800">
                        Supplier Profile
                    </h2>

                    {/* STATISTICS */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total Products</p>
                            <h3 className="mt-2 text-2xl font-bold text-slate-800">
                                {totalProducts}
                            </h3>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total Stock Quantity</p>
                            <h3 className="mt-2 text-2xl font-bold text-slate-800">
                                {totalStock.toLocaleString()}
                            </h3>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total Stock Value</p>
                            <h3 className="mt-2 text-2xl font-bold text-slate-800">
                                Rs. {totalStockValue.toLocaleString("en-PK")}
                            </h3>
                        </div>
                    </div>

                    {/* SUPPLIER DETAILS */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b p-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    {selectedSupplier.name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {selectedSupplier.company}
                                </p>
                                <p className="mt-3 text-sm text-slate-600">
                                    {selectedSupplier.email}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {selectedSupplier.phone}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {selectedSupplier.address}
                                </p>
                            </div>

                            <SupplierActions supplier={selectedSupplier} />
                        </div>

                        {/* SUPPLIED PRODUCTS */}
                        <div className="p-6">
                            <h3 className="mb-4 font-semibold text-slate-800">
                                Supplied Products ({supplierProducts.length})
                            </h3>

                            {supplierProducts.length === 0 ? (
                                <p className="text-sm text-slate-500">
                                    No products assigned to this supplier.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-sm text-slate-600">
                                            <tr>
                                                <th className="p-3">Product</th>
                                                <th className="p-3">SKU</th>
                                                <th className="p-3">Category</th>
                                                <th className="p-3">Quantity</th>
                                                <th className="p-3">Price</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {supplierProducts.map((product) => (
                                                <tr key={product._id} className="border-t">
                                                    <td className="p-3">{product.name}</td>
                                                    <td className="p-3">{product.sku}</td>
                                                    <td className="p-3">{product.category}</td>
                                                    <td className="p-3">{product.quantity}</td>
                                                    <td className="p-3">
                                                        Rs. {product.price.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

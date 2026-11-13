"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Supplier {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string
}

export default function SupplierActions({ supplier, }: { supplier: Supplier; }) {


    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");


    const [form, setForm] = useState({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        company: supplier.company,

    });





    async function handleUpdate() {
        if (Object.values(form).some((value) => !value.trim())) {
            setMessage("All fields are required.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${supplier._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            setEditing(false);
            setMessage("supplier updated successfully!");
            router.refresh();

        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Update failed");

        } finally {
            setLoading(false);
        }


    }


    async function handleDelete() {
        if (!window.confirm(`Delete ${supplier.name}? Its products will remain unassigned.`))
            setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${supplier._id}`,
                { method: "DELETE" }
            );

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            router.refresh();

        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Delete failed");
        } finally {
            setLoading(false);
        }
    }
    const fields = [
        ["name", "Suppier Name"],
        ["company", "Company Name"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["address", "Address"],
    ] as const;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <button
                onClick={() => {
                    setForm({
                        name: supplier.name,
                        email: supplier.email,
                        phone: supplier.phone,
                        address: supplier.address,
                        company: supplier.company,
                    });

                    setMessage("");
                    setEditing(true);
                }}
                className="rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue"
            >
                Edit
            </button>

            <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-100 px-3 py-2 text-sm text-sm text-red-700 disabled:opacity-50"
            >
                Delete
            </button>

            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6">
                        <h2 className="mb-4 text-xl font-bold">Edit Supplier</h2>

                        <div className="space-y-3">
                            {(
                                ["name", "email", "phone", "address", "company"] as const
                            ).map((key) => (
                                <input
                                    key={key}
                                    value={form[key]}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            [key]: e.target.value,
                                        })
                                    }
                                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                    className="w-full rounded-lg border p-3"
                                />
                            ))}
                        </div>
                        <p className="mt-3 text-sm text-red-600">{message}</p>

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setEditing(false)}
                                className="rounded-lg bg-slate-200 px-4 py-2">Cancel</button>

                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-while disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button></div>
                    </div>
                </div>
            )}

            {message && !editing && (
                <p className="w-full text-xs text-slate-600">{message}</p>
            )}
        </div>
    );

}
import {Suspense} from "react";
import AddProductForm from "@/components/AddProductForm";


interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  supplier: Supplier | null;
}

interface ProductsResponse {
  success: boolean;
  pagination: {
    currentPage: number;
    limit: number;
    totalProducts: number;
    totalPages: number;
  };
  data: Product[];
}

 async function ProductsContent() {
  let products: Product[] = [];
  let error = "";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result: ProductsResponse = await response.json();

    products = result.data;
  } catch (err) {
    error = "Unable to load products. Please check your backend.";
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Products
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your inventory products here.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-100 p-4 text-red-600">
          {error}
        </p>
      ) : (
        <>
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Products
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {products.length}
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Supplier</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-slate-100"
                  >
                    <td className="p-4 font-medium text-slate-800">
                      {product.name}
                    </td>

                    <td className="p-4 text-slate-600">
                      {product.sku}
                    </td>

                    <td className="p-4 text-slate-600">
                      {product.category}
                    </td>

                    <td className="p-4 text-slate-600">
                      {product.quantity}
                    </td>

                    <td className="p-4 text-slate-600">
                      Rs. {product.price.toLocaleString()}
                    </td>

                    <td className="p-4 text-slate-600">
                      {product.supplier?.name || "No Supplier"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}


export default function ProductsPage() {
    return (
        <Suspense 
        fallback ={
            <div className="p-8 text-slate-500">
                Loading products...
            </div>
        }
        >
            <ProductsContent />

        </Suspense>
    );
}
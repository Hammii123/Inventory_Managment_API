import { Suspense } from "react";
import Link from "next/link";
import AddProductForm from "@/components/AddProductForm";
import ProductActions from "@/components/ProductActions";
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

interface Pagination {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

interface ProductsResponse {
  success: boolean;
  pagination: Pagination;
  data: Product[];
}

const PAGE_SIZE = 10;

function getPageNumbers(current: number, total: number): number[] {
  const windowSize = 5;
  let start = Math.max(1, current - Math.floor(windowSize / 2));
  const end = Math.min(total, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  let products: Product[] = [];
  let pagination: Pagination | null = null;
  let error = "";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${currentPage}&limit=${PAGE_SIZE}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result: ProductsResponse = await response.json();

    products = result.data;
    pagination = result.pagination;
  } catch (err) {
    console.error(err);
    error = "Unable to load products. Please check your backend.";
  }

  const totalPages = pagination?.totalPages ?? 1;
  const totalProducts = pagination?.totalProducts ?? 0;
  const activePage = pagination?.currentPage ?? currentPage;

  return (
    <div className="p-8">
      <AddProductForm />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Products</h1>
        <p className="mt-2 text-slate-500">
          Manage your inventory products here.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-100 p-4 text-red-600">{error}</p>
      ) : (
        <>
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Products</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {totalProducts.toLocaleString()}
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
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
  {products.map((product) => (
    <tr key={product._id} className="border-t border-slate-100">
      <td className="p-4 font-medium text-slate-800">
        {product.name}
      </td>

      <td className="p-4 text-slate-600">{product.sku}</td>

      <td className="p-4 text-slate-600">{product.category}</td>

      <td className="p-4 text-slate-600">{product.quantity}</td>

      <td className="p-4 text-slate-600">
        Rs. {product.price.toLocaleString()}
      </td>

      <td className="p-4 text-slate-600">
        {product.supplier?.name || "No Supplier"}
      </td>

      <td className="p-4">
        <ProductActions product={product} />
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Page {activePage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                {activePage > 1 ? (
                  <Link
                    href={`/products?page=${activePage - 1}`}
                    className="rounded-lg border bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded-lg border bg-slate-100 px-4 py-2 text-sm text-slate-400">
                    Previous
                  </span>
                )}

                {getPageNumbers(activePage, totalPages).map((p) => (
                  <Link
                    key={p}
                    href={`/products?page=${p}`}
                    className={`rounded-lg border px-4 py-2 text-sm ${
                      p === activePage
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </Link>
                ))}

                {activePage < totalPages ? (
                  <Link
                    href={`/products?page=${activePage + 1}`}
                    className="rounded-lg border bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="rounded-lg border bg-slate-100 px-4 py-2 text-sm text-slate-400">
                    Next
                  </span>
                )}
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <Suspense
      fallback={<div className="p-8 text-slate-500">Loading products...</div>}
    >
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}
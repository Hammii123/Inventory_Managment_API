export const instant = false;
interface Product {
  _id: string;
  quantity: number;
}

interface ProductsResponse {
  success: boolean;
  pagination: {
    totalProducts: number;
  };
  data: Product[];
}

interface SuppliersResponse {
  success: boolean;
  count: number;
}

export default async function Home() {
  let totalProducts = 0;
  let totalSuppliers = 0;
  let lowStockProducts = 0;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [productsResponse, suppliersResponse] = await Promise.all([
      fetch(`${API_URL}/api/products?limit=100`, {
        cache: "no-store",
      }),

      fetch(`${API_URL}/api/suppliers`, {
        cache: "no-store",
      }),
    ]);

   if (!productsResponse.ok) {
  throw new Error(
    `Products API failed: ${productsResponse.status}`
  );
}

if (!suppliersResponse.ok) {
  throw new Error(
    `Suppliers API failed: ${suppliersResponse.status}`
  );
}

    const productsResult: ProductsResponse =
      await productsResponse.json();

    const suppliersResult: SuppliersResponse =
      await suppliersResponse.json();

    totalProducts = productsResult.pagination.totalProducts;
    totalSuppliers = suppliersResult.count;

    lowStockProducts = productsResult.data.filter(
      (product) => product.quantity < 5
    ).length;

  } catch (error) {
    console.error("Dashboard error:", error);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h2>

          <p className="mt-2 text-slate-500">
            Welcome to your Inventory Management System.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Products</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">
              {totalProducts}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Suppliers</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">
              {totalSuppliers}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Low Stock Products</p>
            <h3 className="mt-2 text-3xl font-bold text-red-500">
              {lowStockProducts}
            </h3>
          </div>
        </section>

        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">
            Recent Inventory Activity
          </h3>

          <p className="mt-4 text-slate-500">
            No inventory activity to display yet.
          </p>
        </section>
      </main>
    </div>
  );
}


export default function StockPage() {
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
          <h2 className="text-xl font-semibold text-slate-800">
            Add Stock
          </h2>
          <p className="mt-2 text-slate-500">
            Increase the quantity of an existing product.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            Remove Stock
          </h2>
          <p className="mt-2 text-slate-500">
            Decrease the quantity of an existing product.
          </p>
        </div>
      </div>
    </div>
  );
}

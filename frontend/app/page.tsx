import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
    
      {/* Main Content */}
      <main className="p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h2>
          <p className="mt-2 text-slate-500">
            Welcome to your Inventory Management System.
          </p>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Products</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">0</h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Suppliers</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">0</h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Low Stock Products</p>
            <h3 className="mt-2 text-3xl font-bold text-red-500">0</h3>
          </div>
        </section>

        {/* Recent Activity */}
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

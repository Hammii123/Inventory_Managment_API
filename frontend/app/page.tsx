
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 p-6 text-white">
        <h1 className="mb-10 text-2xl font-bold">
          Inventory<span className="text-blue-400">Pro</span>
        </h1>

        <nav className="space-y-3">
          <div className="rounded-lg bg-blue-600 px-4 py-3">
            Dashboard
          </div>
          <div className="rounded-lg px-4 py-3 hover:bg-slate-800">
            Products
          </div>
          <div className="rounded-lg px-4 py-3 hover:bg-slate-800">
            Suppliers
          </div>
          <div className="rounded-lg px-4 py-3 hover:bg-slate-800">
            Stock Management
          </div>
          <div className="rounded-lg px-4 py-3 hover:bg-slate-800">
            Inventory History
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
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

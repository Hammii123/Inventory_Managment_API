
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Suppliers", path: "/suppliers" },
    { name: "Stock Management", path: "/stock" },
    { name: "Inventory History", path: "/history" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 p-6 text-white">
      <h1 className="mb-10 text-2xl font-bold">
        Inventory<span className="text-blue-400">Pro</span>
      </h1>

      <nav className="space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block rounded-lg px-4 py-3 transition-colors ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

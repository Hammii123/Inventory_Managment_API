
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Manage products, suppliers and inventory stock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <div className="ml-64 min-h-screen bg-slate-100">
          {children}
        </div>
      </body>
    </html>
  );
}


import { Suspense } from "react";
import SupplierActions from "@/components/SupplierActions";

import SupplierSearch from "@/components/SupplierSearch";



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



// async function SuppliersContent() {
//   let suppliers: Supplier[] = [];
//   let products: Product[] = [];
//   let error = "";

//   try {
//     const [supplierResponse, productResponse] = await Promise.all([
//       fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`, {
//         cache: "no-store",
//       }),
//       fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=100`, {
//         cache: "no-store",
//       }),
//     ]);

//     if (!supplierResponse.ok || !productResponse.ok) {
//       throw new Error("Failed to fetch supplier information");
//     }

//     const supplierResult = await supplierResponse.json();
//     const productResult = await productResponse.json();

//     suppliers = supplierResult.data;
//     products = productResult.data;
//   } catch (err) {
//     console.error(err);
//     error = "Unable to load suppliers. Check your backend.";
//   }

//   return (
//     <div className="p-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-slate-800">Suppliers</h1>
//         <p className="mt-2 text-slate-500">
//           Manage suppliers and their products.
//         </p>
//       </div>

//       {error ? (
//         <p className="rounded-lg bg-red-100 p-4 text-red-600">{error}</p>
//       ) : (
//         <>
//           <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
//             <p className="text-sm text-slate-500">Total Suppliers</p>
//             <h2 className="mt-2 text-3xl font-bold text-slate-800">
//               {suppliers.length}
//             </h2>
//           </div>

//           <div className="space-y-6">
//             {suppliers.map((supplier) => {
//               const supplierProducts = products.filter(
//                 (product) =>
//                   product.supplier === supplier._id ||
//                   (typeof product.supplier === "object" &&
//                     product.supplier?._id === supplier._id)
//               );

//               return (
//                 <div
//                   key={supplier._id}
//                   className="overflow-hidden rounded-xl bg-white shadow-sm"
//                 >
//                   <div className="flex flex-wrap items-start justify-between gap-4 border-b p-6">
//                     <div>
//                       <h2 className="text-xl font-bold text-slate-800">
//                         {supplier.name}
//                       </h2>
//                       <p className="mt-1 text-sm text-slate-500">
//                         {supplier.company}
//                       </p>
//                       <p className="mt-3 text-sm text-slate-600">
//                         {supplier.email}
//                       </p>
//                       <p className="text-sm text-slate-600">
//                         {supplier.phone}
//                       </p>
//                       <p className="text-sm text-slate-600">
//                         {supplier.address}
//                       </p>
//                     </div>

//                     <SupplierActions supplier={supplier} />
//                   </div>

//                   <div className="p-6">
//                     <h3 className="mb-4 font-semibold text-slate-800">
//                       Supplied Products ({supplierProducts.length})
//                     </h3>

//                     {supplierProducts.length === 0 ? (
//                       <p className="text-sm text-slate-500">
//                         No products assigned to this supplier.
//                       </p>
//                     ) : (
//                       <div className="overflow-x-auto">
//                         <table className="w-full text-left">
//                           <thead className="bg-slate-50 text-sm text-slate-600">
//                             <tr>
//                               <th className="p-3">Product</th>
//                               <th className="p-3">SKU</th>
//                               <th className="p-3">Category</th>
//                               <th className="p-3">Quantity</th>
//                               <th className="p-3">Price</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {supplierProducts.map((product) => (
//                               <tr
//                                 key={product._id}
//                                 className="border-t border-slate-100"
//                               >
//                                 <td className="p-3">{product.name}</td>
//                                 <td className="p-3">{product.sku}</td>
//                                 <td className="p-3">{product.category}</td>
//                                 <td className="p-3">{product.quantity}</td>
//                                 <td className="p-3">
//                                   Rs. {product.price.toLocaleString()}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default function SuppliersPage() {
//   return (
//     <Suspense fallback={<div className="p-8">Loading suppliers...</div>}>
//       <SuppliersContent />
//     </Suspense>
//   );
// }


async function SuppliersContent() {
  let suppliers: Supplier[] = [];
  let products: Product[] = [];
  let error = "";

  try {
    const [supplierResponse, productResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`, {
        cache: "no-store",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=100`, {
        cache: "no-store",
      }),
    ]);

    if (!supplierResponse.ok || !productResponse.ok) {
      throw new Error("Failed to fetch supplier information");
    }

    const supplierResult = await supplierResponse.json();
    const productResult = await productResponse.json();

    suppliers = supplierResult.data;
    products = productResult.data;
  } catch (err) {
    console.error(err);
    error = "Unable to load suppliers. Check your backend.";
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Suppliers
        </h1>
        <p className="mt-2 text-slate-500">
          Search and manage your suppliers.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-100 p-4 text-red-600">
          {error}
        </p>
      ) : (
        <SupplierSearch
          suppliers={suppliers}
          products={products}
        />
      )}
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading suppliers...</div>}>
      <SuppliersContent />
    </Suspense>
  );
}

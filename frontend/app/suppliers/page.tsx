export default function SuppliersPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className= "text-3xl font-bold text-slate-800">
                    Suppliers
                </h1>

                <p className= "mt-2 text-slate-500">
                    Manage your inventory suppliers here.
                </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-800">
                    Supplier Information
                </h2>

                <p className="mt-3 text-slate-500">
                    your supplier records will appear here.
                </p>
            </div>
        </div>
    );
}
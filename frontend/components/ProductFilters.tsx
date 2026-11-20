"use client";
import {useEffect,useState} from  "react";
import {useRouter} from "next/navigation";

export default function ProductFilters()
 {


    const [search, setSearch] = useState("");
const [category, setCategory] = useState("");
const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");

const router = useRouter();

const [suggestions, setSuggestions] = useState<{_id: string; name:string; sku:string}[]>([]);

const [showSuggestions , setShowSuggestions] = useState(false);


useEffect(() => {
    const timer = setTimeout(async() => {
        if(!search.trim()){
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?search=${encodeURIComponent(search)}&
            limit=5`);

           if (!response.ok) {
  const errorText = await response.text();

  console.log("API Status:", response.status);
  console.log("API Error:", errorText);

  throw new Error("Failed to fetch suggestions");
}
            const result = await response.json();

            setSuggestions(result.data);
            setShowSuggestions(true);
            

        } catch (error) {
           console.error("Search suggestions error:", error);
           setSuggestions([]);
        }
    },300);
    return ()=> clearTimeout(timer);
},[search]);


const handleApplyFilters = () =>{
    const params = new URLSearchParams();

    params.set("page","1");

    if(search.trim()) params.set("search",search.trim());
    if(category) params.set("category",category);
   if (minPrice) params.set("minPrice", minPrice);
if (maxPrice) params.set("maxPrice", maxPrice);

    setShowSuggestions(false);

    router.push(`/products?${params.toString()}`);
};

const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSuggestions([]);
    setShowSuggestions(false);

    router.push("/products");
}



  
return (
  <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
    <h2 className="mb-3 text-lg font-semibold text-slate-800">
      Search & Filters
    </h2>

    <div className="flex flex-wrap items-end gap-3">

      {/* Search */}
      <div className="relative min-w-[220px] flex-[2]">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Search Product
        </label>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            if (search.trim()) setShowSuggestions(true);
          }}
          placeholder="Search by name or SKU..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border bg-white shadow-lg">
            {suggestions.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => {
                  setSearch(product.name);
                  setShowSuggestions(false);
                }}
                className="block w-full border-b px-4 py-3 text-left hover:bg-slate-50"
              >
                <p className="font-medium text-slate-800">
                  {product.name}
                </p>
                <p className="text-sm text-slate-500">
                  SKU: {product.sku}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="min-w-[140px] flex-1">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing">Clothing</option>
        </select>
      </div>

      {/* Minimum Price */}
      <div className="min-w-[130px] flex-1">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Min Price
        </label>

        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Minimum"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
        />
      </div>

      {/* Maximum Price */}
      <div className="min-w-[130px] flex-1">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Max Price
        </label>

        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Maximum"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleApplyFilters}
          className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={handleResetFilters}
          className="whitespace-nowrap rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

    </div>
  </div>
);

}
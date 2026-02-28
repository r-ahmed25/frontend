// src/pages/products/ProductListGuest.jsx
import { useEffect, useState } from "react";
import { API_URL } from "../../api/client";
import { Link } from "react-router-dom";

export default function ProductListGuest() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const itemsPerPage = 12;

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/public/categories`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  // Load products
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const url = selectedCategory
          ? `${API_URL}/public/products?category=${encodeURIComponent(selectedCategory)}`
          : `${API_URL}/public/products`;
        const res = await fetch(url, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load products");
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
    setCurrentPage(1);
  }, [selectedCategory]);

  const filtered = products.filter((p) =>
    [p.name, p.sku, p.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Star rating helper
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.round(rating || 0)
            ? "fill-amber-400 text-amber-400"
            : "fill-slate-200 text-slate-200"
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-kashmiri-dal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-kashmiri-dal-500 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  /* ================= PAGE ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-kashmiri-dal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 sm:px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500">
            Our Products
          </h1>

          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-kashmiri-dal-500/50 focus:border-kashmiri-dal-500 transition-all duration-200"
          />
        </div>

        {/* CATEGORIES - Dropdown on mobile, buttons on desktop */}
        {!loadingCategories && categories.length > 0 && (
          <div className="w-full">
            {/* Mobile Dropdown */}
            <div className="md:hidden w-full">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-kashmiri-dal-50 to-kashmiri-pashmina-50 dark:from-kashmiri-dal-900/30 dark:to-kashmiri-pashmina-900/30 border border-kashmiri-dal-200 dark:border-kashmiri-dal-700 text-kashmiri-dal-900 dark:text-kashmiri-dal-100 font-medium focus:outline-none focus:ring-2 focus:ring-kashmiri-dal-500/50 focus:border-kashmiri-dal-500 appearance-none cursor-pointer pr-10"
                >
                  <option value="">
                    All Categories (
                    {categories.reduce((acc, c) => acc + c.count, 0)})
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-kashmiri-dal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === ""
                    ? "bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 text-white shadow-lg shadow-kashmiri-dal-500/25"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-kashmiri-dal-50 dark:hover:bg-kashmiri-dal-900/30"
                }`}
              >
                All ({categories.reduce((acc, c) => acc + c.count, 0)})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === cat.name
                      ? "bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 text-white shadow-lg shadow-kashmiri-dal-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-kashmiri-dal-50 dark:hover:bg-kashmiri-dal-900/30"
                  }`}
                >
                  {cat.name}
                  <span className="text-xs opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCT GRID - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {paginated.map((p) => (
            <div
              key={p._id}
              className="
                relative
                bg-white dark:bg-slate-900
                rounded-2xl
                border border-slate-200/50 dark:border-slate-800/50
                shadow-lg
                hover:shadow-xl
                transition-all duration-300
                p-6
                flex flex-col items-center
                cursor-pointer
              "
              onClick={() => setSelectedProduct(p)}
            >
              {/* SEGMENT TAG */}
                {p.segment && (
                <span
                  className={`
                    absolute top-4 right-4
                    text-[10px] font-bold tracking-wide
                    px-2 py-1 rounded-full
                    ${
                      p.segment === "CONSUMER"
                        ? "bg-kashmiri-dal-100 text-kashmiri-dal-700 dark:bg-kashmiri-dal-900/50 dark:text-kashmiri-dal-300"
                        : "bg-emerald-100 text-emerald-700"
                    }
                  `}
                >
                  {p.segment}
                </span>
              )}
              {p.category && (
                <span
                  className="
                    absolute top-4 left-4
                    text-[10px] font-semibold
                    bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300
                    px-2 py-1 rounded-full
                "
                >
                  {p.category}
                </span>
              )}

              {/* IMAGE */}
              <div
                className="
                  w-full h-40
                  bg-slate-50 dark:bg-slate-800
                  rounded-xl
                  flex items-center justify-center
                  p-4
                "
              >
                {p.images?.[0]?.url ? (
                  <img
                    src={p.images[0].url}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No Image</span>
                )}
              </div>

              {/* NAME */}
              <h3 className="mt-4 text-sm font-semibold text-center text-slate-900 dark:text-white line-clamp-2">
                {p.name}
              </h3>

              {/* RATING */}
              {p.rating?.count > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {renderStars(p.rating.average)}
                  <span className="text-xs text-slate-500 ml-1">
                    ({p.rating.average.toFixed(1)})
                  </span>
                </div>
              )}

              {/* CTA */}
              <Link
                to={`/products-guest/${p._id}`}
                className="
                  mt-4
                  text-xs
                  bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 text-white
                  hover:from-kashmiri-dal-600 hover:to-kashmiri-pashmina-600
                  shadow-lg shadow-kashmiri-dal-500/25
                  px-5 py-3
                  rounded-lg
                  font-semibold
                  w-full text-center
                "
                onClick={(e) => e.stopPropagation()}
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-md mx-auto gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 text-white px-5 py-3 rounded-xl disabled:opacity-50 shadow-lg shadow-kashmiri-dal-500/25"
            >
              Prev
            </button>

            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 text-white px-5 py-3 rounded-xl disabled:opacity-50 shadow-lg shadow-kashmiri-dal-500/25"
            >
              Next
            </button>
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  ×
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="w-full h-40 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  {selectedProduct.images?.[0]?.url ? (
                    <img
                      src={selectedProduct.images[0].url}
                      alt={selectedProduct.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No Image</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Category</h3>
                  <p className="text-xs text-slate-600">
                    {selectedProduct.category}
                  </p>
                </div>
                {/* Rating in Modal */}
                {selectedProduct.rating?.count > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Rating</h3>
                    <div className="flex items-center gap-2">
                      {renderStars(selectedProduct.rating.average)}
                      <span className="text-xs text-slate-600">
                        {selectedProduct.rating.average.toFixed(1)} (
                        {selectedProduct.rating.count} reviews)
                      </span>
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-sm mb-1 text-slate-900 dark:text-white">Description</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {selectedProduct.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1 text-slate-900 dark:text-white">Price</h3>
                  <p className="text-xs font-semibold text-kashmiri-dal-600 dark:text-kashmiri-dal-400">
                    ₹{selectedProduct.price}
                  </p>
                </div>
                <Link
                  to={`/products-guest/${selectedProduct._id}`}
                  className="w-full py-2 rounded-xl font-semibold text-sm bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 text-white shadow-lg shadow-kashmiri-dal-500/25 hover:shadow-xl transition-all"
                  onClick={() => setSelectedProduct(null)}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Grid,
  List,
} from "lucide-react";

export default function ProductList() {
  const { accessToken, user } = useAuthStore();
  const isGovt = user?.clientType === "PUBLIC";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const itemsPerPage = 12;

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [accessToken]);

  const filtered = products.filter((p) =>
    [p.name, p.description, p.sku, p.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center animate-pulse">
            <Package className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Products
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Browse our collection of quality products
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full sm:w-80 pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {paginated.length} of {filtered.length} products
          </p>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {paginated.map((product, index) => (
              <motion.div
                key={product._id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Product Image */}
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 relative z-10">
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {product.description || "No description available"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {isGovt ? (
                        <span className="text-sm text-slate-500">
                          Price on request
                        </span>
                      ) : (
                        `₹${product.price?.toLocaleString() || "N/A"}`
                      )}
                    </div>

                    <Link
                      to={`/products/${product._id}`}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      View
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <motion.div
            className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {paginated.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {product.name}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {isGovt
                            ? "Price on request"
                            : `₹${product.price?.toLocaleString()}`}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/products/${product._id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all duration-200"
                        >
                          View
                          <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Mobile Cards (Always visible on mobile) */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paginated.map((product) => (
            <motion.div
              key={product._id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedProduct(product)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
                <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-300">
                  {product.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 text-sm">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isGovt
                    ? "Price on request"
                    : `₹${product.price?.toLocaleString()}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Product Details Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedProduct.name}
                  </h2>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
                  {/* Product Image */}
                  <div className="aspect-video rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {selectedProduct.images?.[0]?.url ? (
                      <img
                        src={selectedProduct.images[0].url}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Category
                      </h3>
                      <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {selectedProduct.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Description
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        {selectedProduct.description ||
                          "No description available"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Price
                      </h3>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isGovt
                          ? "Price on request"
                          : `₹${selectedProduct.price?.toLocaleString()}`}
                      </p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/products/${selectedProduct._id}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
                    onClick={() => setSelectedProduct(null)}
                  >
                    View Full Details
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

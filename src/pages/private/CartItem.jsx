import { Plus, Minus, Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { product, quantity } = item;
  console.log(product);
  const lowStock =
    typeof product?.stock === "number" &&
    product.stock > 0 &&
    product.stock <= 5;

  const outOfStock = typeof product?.stock === "number" && product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-4 sm:p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          {product?.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-slate-200 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
              <span className="text-slate-400 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-slate-900 truncate">
            {product.name}
          </h3>
          <p className="text-indigo-600 font-semibold text-lg mt-1">
            ₹{product.price?.toLocaleString("en-IN")}
          </p>

          {lowStock && (
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-2">
              <AlertTriangle size={12} />
              Only {product.stock} left in stock
            </p>
          )}

          {outOfStock && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
              <AlertTriangle size={12} />
              Out of stock
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between sm:flex-col sm:justify-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1">
            <button
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="h-9 w-9 rounded-lg flex items-center justify-center bg-white border border-slate-200 shadow-sm hover:bg-slate-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Minus size={16} className="text-slate-600" />
            </button>

            <span className="font-semibold min-w-[40px] text-center text-slate-900">
              {quantity}
            </span>

            <button
              onClick={onIncrease}
              disabled={outOfStock}
              className="h-9 w-9 rounded-lg flex items-center justify-center bg-white border border-slate-200 shadow-sm hover:bg-slate-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Plus size={16} className="text-slate-600" />
            </button>
          </div>

          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                     text-red-600 bg-red-50 border border-red-200
                     hover:bg-red-100 hover:shadow-md transition-all duration-200"
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}

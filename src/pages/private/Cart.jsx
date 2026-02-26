import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RoleGate from "../../components/RoleGate";
import CartItem from "./CartItem";
import { useCartStore } from "../../store/cartStore";
import { ShoppingBag, Trash2 } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p>Loading cart…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <RoleGate allow={["PRIVATE"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-kashmiri-dal-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <p className="text-slate-500">Review your items before checkout</p>
          </motion.div>

          {!cart?.items?.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-xl shadow-slate-200/50 p-12 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg mb-6">Your cart is empty.</p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2
                            px-6 py-3 rounded-xl font-semibold
                            bg-gradient-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500
                            text-white shadow-lg shadow-kashmiri-dal-500/25
                            hover:shadow-xl hover:shadow-kashmiri-pashmina-500/30
                            hover:-translate-y-0.5 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </Link>
            </motion.div>
          )}

          <div className="space-y-4 mb-8">
            {cart?.items?.map((item, index) => (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CartItem
                  item={item}
                  onIncrease={() => updateQuantity(item.product._id, 1)}
                  onDecrease={() => updateQuantity(item.product._id, -1)}
                  onRemove={() => removeItem(item.product._id)}
                />
              </motion.div>
            ))}
          </div>

          {cart?.items?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={clearCart}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                          bg-slate-100 text-slate-700 border border-slate-200
                          hover:bg-slate-200 hover:shadow-md transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                          bg-gradient-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500
                          text-white shadow-lg shadow-kashmiri-dal-500/25
                          hover:shadow-xl hover:shadow-kashmiri-pashmina-500/30
                          hover:-translate-y-0.5 transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}

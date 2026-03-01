import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, User, LogOut, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isInit = useAuthStore((state) => state.isInit);
  const cart = useCartStore((state) => state.cart);

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Prevent flicker before auth hydration
  if (!isInit) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    setMobileMenuOpen(false);
  };

  const cartCount = cart?.items?.length || 0;

  // Load wishlist count
  useEffect(() => {
    async function loadWishlistCount() {
      if (!user) {
        setWishlistCount(0);
        return;
      }
      try {
        const { getWishlist } = await import("../api/wishlist");
        const data = await getWishlist();
        setWishlistCount(data.wishlist?.length || 0);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      }
    }
    loadWishlistCount();
  }, [user]);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <motion.header
      className="sticky top-0 z-50 mx-1 sm:mx-2"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
          {/* Logo / Brand */}
          <Link
            to={user ? "/" : "/login"}
            className="flex items-center gap-3 group"
          >
            <motion.div
              className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/25"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-xl">CE</span>
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Cutting Edge
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
                Enterprises
              </div>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart - PRIVATE authenticated users only */}
            {user && user.clientType === "PRIVATE" && (
              <>
                <motion.button
                  onClick={() => navigate("/wishlist")}
                  className="relative p-2.5 sm:p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Wishlist"
                >
                  <Heart size={20} strokeWidth={2} />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[22px] h-5 flex items-center justify-center px-1.5 shadow-lg"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  onClick={() => navigate("/cart")}
                  className="relative p-2.5 sm:p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Cart"
                >
                  <ShoppingCart size={20} strokeWidth={2} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[22px] h-5 flex items-center justify-center px-1.5 shadow-lg"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </>
            )}

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* User Avatar - Desktop */}
                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] lg:max-w-[140px] truncate">
                    {user.name}
                  </span>
                </div>

                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={16} strokeWidth={2} />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            ) : (
              /* Guest: show Login ONLY if not already on auth page */
              !isAuthPage && (
                <motion.div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-2xl bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <User size={16} strokeWidth={2} />
                    Login
                  </Link>
                </motion.div>
              )
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 sm:p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <X size={20} strokeWidth={2} />
              ) : (
                <Menu size={20} strokeWidth={2} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden mx-2 mt-1"
          >
            <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 px-4 py-5 space-y-3">
              {/* User Info - Mobile */}
              {user && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-base">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}

              {/* Logout - Mobile */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-sm font-semibold transition-all duration-200"
                >
                  <LogOut size={18} strokeWidth={2} />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

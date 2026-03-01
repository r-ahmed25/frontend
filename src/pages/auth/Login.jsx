import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Building2,
  Users,
} from "lucide-react";

import {
  authPageVariants,
  formSideVariants,
  buttonHoverVariants,
} from "../../utils/animations";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Check for expired session on mount
  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      setSessionExpired(true);
      // Clear the query param
      window.history.replaceState({}, "", "/login");
    }
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginApi({
        email: email.trim().toLowerCase(),
        password,
      });

      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      if (data.verificationRequired) {
        navigate("/verify-account", { replace: true });
      } else if (data.user?.roles?.includes("admin")) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const features = [
    { icon: Shield, text: "Secure Authentication" },
    { icon: Building2, text: "Government & Enterprise Ready" },
    { icon: Users, text: "Role-based Access" },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 sm:px-6"
      variants={authPageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12">
        {/* LEFT - Brand Section */}
        <motion.div
          className="hidden lg:flex flex-col justify-center"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <span className="text-white font-bold text-2xl">CE</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Cutting Edge
              </h1>
              <p className="text-slate-500 dark:text-slate-400">Enterprises</p>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            Welcome to{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Cutting Edge
            </span>{" "}
            Enterprises
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg">
            Your trusted partner for government procurement, enterprise
            solutions, and professional services.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT - Login Form */}
        <motion.div className="flex justify-center" variants={formSideVariants}>
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <span className="text-white font-bold text-lg">CE</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Cutting Edge
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enterprises
                </p>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 p-8 sm:p-10 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Sign in to your account
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Secure access for registered customers & government users
                </p>
              </div>

              {/* Session Expired Alert */}
              <AnimatePresence>
                {sessionExpired && (
                  <motion.div
                    className="mb-6 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 flex items-center gap-2"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Shield className="w-4 h-4" />
                    Your session has expired. Please log in again.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="mb-6 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Security Note */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Shield className="w-4 h-4" />
                <span>Secure login · Role-based access · GeM-ready</span>
              </div>

              {/* Guest CTA - Browse without login */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Or continue without login
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/products-guest"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Browse Products
                  </Link>
                  <Link
                    to="/services"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Explore Services
                  </Link>
                </div>
              </div>

              {/* Register Link */}
              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline underline-offset-2 transition-all duration-200"
                >
                  Create one
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

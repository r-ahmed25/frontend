import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registerApi } from "../../api/auth";
import {
  User,
  Mail,
  Lock,
  Building2,
  ArrowRight,
  Shield,
  CheckCircle2,
  Users,
} from "lucide-react";

import {
  authPageVariants,
  formSideVariants,
  buttonHoverVariants,
} from "../../utils/animations";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientType, setClientType] = useState("PRIVATE");
  const [orgName, setOrgName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { name, email, password, clientType };

      if (clientType === "PUBLIC") {
        payload.departmentName = orgName;
        payload.officialEmail = officialEmail;
      }

      await registerApi(payload);
      setSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const features = [
    { icon: Shield, text: "Secure Account Protection" },
    { icon: CheckCircle2, text: "Instant Account Setup" },
    { icon: Users, text: "Private & Government Accounts" },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 sm:px-6 py-12"
      variants={authPageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
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
            Join{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Cutting Edge
            </span>{" "}
            Today
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg">
            Create your account to access premium products, professional
            services, and government procurement solutions.
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

        {/* RIGHT - Register Form */}
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
                  Create your account
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Register as a private customer or government user
                </p>
              </div>

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

                {/* Success Alert */}
                {success && (
                  <motion.div
                    className="mb-6 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 flex items-center gap-2"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name & Email Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email
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
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
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
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Client Type Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setClientType("PRIVATE")}
                      className={`px-4 py-3.5 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        clientType === "PRIVATE"
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Private
                    </button>

                    <button
                      type="button"
                      onClick={() => setClientType("PUBLIC")}
                      className={`px-4 py-3.5 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        clientType === "PUBLIC"
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Government
                    </button>
                  </div>
                </div>

                {/* Government Fields */}
                {clientType === "PUBLIC" && (
                  <motion.div
                    className="grid sm:grid-cols-2 gap-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Department
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          placeholder="Department Name"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Official Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          placeholder="official@gov.in"
                          value={officialEmail}
                          onChange={(e) => setOfficialEmail(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>

                {/* Government Account Note */}
                {clientType === "PUBLIC" && (
                  <motion.p
                    className="text-xs text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Shield className="w-4 h-4 text-indigo-500" />
                    Government accounts require verification before activation.
                  </motion.p>
                )}
              </form>

              {/* Guest CTA - Browse without registering */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Or continue without registering
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

              {/* Login Link */}
              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline underline-offset-2 transition-all duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

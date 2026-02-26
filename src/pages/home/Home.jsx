import useSnapNavigation from "../../hooks/useSnapNavigation";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import BrandTrustStrip from "../../components/BrandTrustStrip";

import {
  ShoppingCart,
  PackageSearch,
  ClipboardList,
  Wrench,
  Quote,
  Inbox,
  FileCheck,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Headphones,
  Mountain,
  Leaf,
  MapPin,
  Heart,
  Star,
  Trees,
  Waves,
  TrendingUp,
  CheckCircle,
  Award,
} from "lucide-react";

import { fadeInVariants, containerVariants } from "../../utils/animations";

import LayoutContainer from "../../components/LayoutContainer";
import gemLogo from "../../assets/images/gem_logo.webp";
import genuineProducts from "../../assets/images/genuine.png";

/* ---------------- HERO CONTENT ---------------- */

const HERO_CONTENT = {
  PUBLIC: {
    badge: "Government & Institutional Procurement",
    heading: "Compliant Procurement & Professional Services",
    subText:
      "Procure products, manage quotations, and request professional services — aligned with government norms and institutional requirements.",
    tagline: "From the valleys of Kashmir to institutions across India",
    seo: {
      title:
        "Government Procurement & Institutional Services | Cutting Edge Enterprises",
      description:
        "Trusted partner for government procurement, institutional IT supply, professional services, compliant quotations, and structured delivery.",
    },
  },

  PRIVATE: {
    badge: "Business & Individual Solutions",
    heading: "Shopping & Professional Services Made Simple",
    subText:
      "Buy genuine products, Book service requests — trusted by individuals and growing businesses.",
    tagline: "From the valleys of Kashmir to institutions across India",
    seo: {
      title: "Buy Products & Professional Services | Cutting Edge Enterprises",
      description:
        "Shop genuine products, manage orders, request quotations, and access professional services for businesses and individuals.",
    },
  },

  DEFAULT: {
    badge: "Unified Commerce Platform",
    heading: "Products, Quotations & Professional Services",
    subText:
      "A trusted platform to purchase products, manage quotations, and deliver professional services for private and government clients.",
    tagline: "From the valleys of Kashmir to institutions across India",
    seo: {
      title:
        "Products, Quotations & Professional Services | Cutting Edge Enterprises",
      description:
        "Unified platform for product procurement, quotation management, and professional services for private and government customers.",
    },
  },
};

/* ---------------- FEATURE CARDS ---------------- */
const FEATURES = [
  {
    icon: Shield,
    title: "Genuine Products",
    description: "100% authentic products with manufacturer warranty",
    color: "from-kashmiri-dal-500 to-blue-600",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Quick turnaround with real-time tracking",
    color: "from-kashmiri-pashmina-500 to-purple-600",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Dedicated support for all your queries",
    color: "from-kashmiri-saffron-500 to-orange-600",
  },
  {
    icon: Sparkles,
    title: "Quality Service",
    description: "Professional installation and maintenance",
    color: "from-kashmiri-chinar-500 to-red-600",
  },
];

/* ---------------- KASHMIRI CULTURAL ELEMENTS ---------------- */
const KASHMIRI_HERITAGE = {
  tagline: "From the valleys of Kashmir to institutions across India",
  patterns: {
    papierMache: "Intricate designs inspired by Kashmiri papier-mâché artistry",
    pashmina: "Quality that reflects the heritage of Pashmina craftsmanship",
    chinar: "Rooted in tradition, growing towards excellence",
  },
  colors: {
    dal: "#2d5a87", // Dal Lake blue
    saffron: "#c2410c", // Kashmiri Saffron
    pashmina: "#7c3aed", // Royal Pashmina purple
    chinar: "#dc2626", // Chinar red
  },
};

/* ---------------- TRUST METRICS ---------------- */

/* ---------------- KASHMIR HERITAGE SECTION CONTENT ---------------- */
const KASHMIR_HERITAGE_CONTENT = {
  title: "Rooted in Kashmir, Serving India",
  subtitle: "A legacy of craftsmanship and trust from the Paradise on Earth",
  description:
    "Our journey began in the serene valleys of Kashmir, where tradition meets innovation. Like the majestic Chinar trees that symbolize our homeland, we stand tall in our commitment to quality and service.",
  values: [
    {
      icon: Trees,
      title: "Chinar Spirit",
      description:
        "Like the iconic Chinar trees of Kashmir, we provide shade and support to institutions across India",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Star,
      title: "Pashmina Excellence",
      description:
        "Emulating the intricate craftsmanship of Pashmina, we weave quality into every service",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Waves,
      title: "Dal Lake Serenity",
      description:
        "Calm and reliable like the waters of Dal Lake, ensuring smooth procurement experiences",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Heart,
      title: "Kashmiriyat",
      description:
        "The spirit of hospitality and warmth that defines Kashmir guides our customer relations",
      color: "from-rose-500 to-pink-500",
    },
  ],
  crafts: [
    {
      name: "Papier-mâché Art",
      description:
        "Known for intricate hand-painted designs, representing patience and precision",
    },
    {
      name: "Pashmina Weaving",
      description:
        "World-renowned for its softness and warmth, a symbol of luxury and quality",
    },
    {
      name: "Walnut Wood Carving",
      description:
        "Intricate geometric patterns reflecting Kashmir's artistic heritage",
    },
    {
      name: "Kashmiri Saffron",
      description:
        "The world's finest saffron, representing purity and excellence",
    },
  ],
};

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const clientType = user?.clientType;
  const hero = HERO_CONTENT[clientType] || HERO_CONTENT.DEFAULT;
  const navigate = useNavigate();
  const TRUST_METRICS = [
    { icon: TrendingUp, value: "100+", label: "Products" },
    { icon: Award, value: "2+", label: "Years Experience" },
    { icon: CheckCircle, value: "100%", label: "Authentic" },
    {
      icon: Shield,
      value: clientType === "PUBLIC" ? "GeM" : "Satisfied",
      label: clientType === "PUBLIC" ? "Registered" : "Customers",
    },
  ];

  useEffect(() => {
    if (user && user.roles?.includes("admin") && !user.clientType) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  useSnapNavigation();

  /* ---------------- QUICK ACCESS CARD BASE ---------------- */
  const cardBase = `
    group relative overflow-hidden
    bg-white dark:bg-slate-900 
    border border-slate-200 dark:border-slate-700 
    rounded-2xl shadow-sm hover:shadow-xl
    p-5 sm:p-6 lg:p-8
    flex flex-col justify-between
    min-h-[180px] sm:min-h-[200px] lg:min-h-[220px]
    transition-all duration-300
    hover:-translate-y-1
    hover:border-blue-500/50 dark:hover:border-blue-400/50
  `;

  return (
    <LayoutContainer>
      <motion.div
        className="space-y-12 sm:space-y-16 lg:space-y-24 overflow-x-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <Helmet>
          <title>{hero.seo.title}</title>
          <meta name="description" content={hero.seo.description} />
        </Helmet>

        {/* ================= MODERN HERO SECTION ================= */}
        <motion.section
          data-section
          className="relative overflow-hidden"
          variants={containerVariants}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* LEFT - Main Content */}
              <div className="lg:col-span-7 text-center lg:text-left">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-kashmiri-dal-100 dark:bg-kashmiri-dal-900/30 text-kashmiri-dal-700 dark:text-kashmiri-dal-300 mb-4 sm:mb-6"
                >
                  <Sparkles size={12} className="text-kashmiri-dal-500" />
                  {hero.badge}
                </motion.div>

                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight"
                >
                  {hero.heading}
                </motion.h1>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0"
                >
                  {hero.subText}
                </motion.p>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-2 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center lg:justify-start gap-2"
                >
                  <Mountain size={14} className="text-kashmiri-dal-500" />
                  <span>{hero.tagline}</span>
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center lg:justify-start"
                >
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
                  >
                    <PackageSearch size={18} />
                    Browse Products
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 w-full sm:w-auto"
                  >
                    <Wrench size={18} />
                    Explore Services
                  </Link>
                </motion.div>

                {/* Trust Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4"
                >
                  {TRUST_METRICS.map((metric, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kashmiri-dal-500 to-kashmiri-pashmina-500 flex items-center justify-center shadow-md">
                        <metric.icon size={14} className="text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {metric.value}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
                          {metric.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* RIGHT - Visual */}
              <motion.div
                className="lg:col-span-5 hidden lg:block"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-100 dark:border-slate-700">
                    <img
                      src={clientType === "PUBLIC" ? gemLogo : genuineProducts}
                      alt="Trusted Partner"
                      className="w-24 mb-4 object-contain"
                    />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-kashmiri-dal-500 to-kashmiri-pashmina-600 flex items-center justify-center">
                          <PackageSearch size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                            {clientType === "PUBLIC"
                              ? "Government Procurement"
                              : "Product Catalog"}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {clientType === "PUBLIC"
                              ? "GeM compliant purchasing"
                              : "100+ genuine products"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                          <Wrench size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                            Professional Services
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Installation, repairs & AMC
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-3 -left-3 w-16 h-16 bg-gradient-to-br from-kashmiri-dal-200 to-kashmiri-pashmina-200 dark:from-kashmiri-dal-800 dark:to-kashmiri-pashmina-800 rounded-xl opacity-40 blur-lg" />
                </div>
              </motion.div>

              {/* Mobile Visual */}
              <motion.div
                className="lg:hidden mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={clientType === "PUBLIC" ? gemLogo : genuineProducts}
                      alt="Trusted"
                      className="w-14 object-contain"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {clientType === "PUBLIC"
                          ? "GeM Registered Seller"
                          : "Authorized Reseller"}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Trusted by customers
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {TRUST_METRICS.map((metric, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-center"
                      >
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {metric.value}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ================= BRAND TRUST SECTION ================= */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-4 sm:px-6 lg:px-8"
        >
          <BrandTrustStrip clientType={clientType} />
        </motion.section>

        {/* ================= FEATURES SECTION ================= */}
        <motion.section
          className="px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-3`}
                >
                  <feature.icon className="text-white" size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ================= KASHMIR HERITAGE SECTION ================= */}

        {/* ================= QUICK ACCESS SECTION ================= */}
        <motion.section
          data-section
          className="max-w-7xl mx-auto px-4 sm:px-0"
          variants={containerVariants}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-4 sm:p-8 lg:p-12">
            {/* Section Header */}
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-kashmiri-dal-100 to-kashmiri-pashmina-100 dark:from-kashmiri-dal-950/50 dark:to-kashmiri-pashmina-950/50 text-kashmiri-dal-700 dark:text-kashmiri-dal-300">
                Quick Access Panel
              </span>
              <h3 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                Continue Where You Left Off
              </h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Shortcuts tailored to your account & activity
              </p>
            </div>

            {/* PRIVATE User Cards */}
            <RoleGate allow={["PRIVATE"]}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12">
                <div className={cardBase}>
                  <div className="absolute inset-0 bg-gradient-to-br from-kashmiri-dal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kashmiri-dal-500 to-kashmiri-pashmina-600 flex items-center justify-center shadow-lg shadow-kashmiri-dal-500/25 mb-4">
                      <ShoppingCart className="text-white" size={22} />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                      Shopping Cart
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Review items and proceed to checkout
                    </p>
                  </div>
                  <Link
                    to="/cart"
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    View Cart
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className={cardBase}>
                  <div className="absolute inset-0 bg-gradient-to-br from-kashmiri-pashmina-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kashmiri-pashmina-500 to-kashmiri-saffron-600 flex items-center justify-center shadow-lg shadow-kashmiri-pashmina-500/25 mb-4">
                      <ClipboardList className="text-white" size={22} />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                      My Orders
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Track your orders and view history
                    </p>
                  </div>
                  <Link
                    to="/orders"
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-kashmiri-pashmina-500 to-kashmiri-saffron-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    My Orders
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </RoleGate>

            {/* PUBLIC User Cards */}
            <RoleGate allow={["PUBLIC"]}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12">
                <div className={cardBase}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
                      <Inbox className="text-white" size={22} />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                      My Enquiries
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Track submitted procurement enquiries
                    </p>
                  </div>
                  <Link
                    to="/enquiries"
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    View Enquiries
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className={cardBase}>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-4">
                      <Quote className="text-white" size={22} />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                      My Quotes
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Review quotations and pricing proposals
                    </p>
                  </div>
                  <Link
                    to="/quotes"
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    View Quotes
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </RoleGate>

            {/* SERVICE MANAGEMENT Section */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-6 flex items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                  <Wrench className="text-white" size={20} />
                </div>
                Service Management
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
                <div className={cardBase}>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25 mb-4">
                      <Inbox className="text-white" size={22} />
                    </div>
                    <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                      My Service Enquiries
                    </h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Track submitted service requests and AMC calls
                    </p>
                  </div>
                  <Link
                    to="/service-enquiries"
                    className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    View Enquiries
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className={cardBase}>
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/25 mb-4">
                      <FileCheck className="text-white" size={22} />
                    </div>
                    <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                      My Service Quotes
                    </h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Review quotations & service pricing proposals
                    </p>
                  </div>
                  <Link
                    to="/service-quotes"
                    className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    View Quotes
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </LayoutContainer>
  );
}

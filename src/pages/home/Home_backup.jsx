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
    p-6 sm:p-8
    flex flex-col justify-between
    min-h-[200px] sm:min-h-[220px]
    transition-all duration-300
    hover:-translate-y-1
    hover:border-blue-500/50 dark:hover:border-blue-400/50
  `;

  return (
    <LayoutContainer>
      <motion.div
        className="space-y-16 sm:space-y-24"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <Helmet>
          <title>{hero.seo.title}</title>
          <meta name="description" content={hero.seo.description} />
        </Helmet>

        {/* ================= HERO SECTION ================= */}
        <motion.section
          data-section
          className="relative overflow-hidden"
          variants={containerVariants}
        >
          {/* Background Gradient - reduced opacity for subtlety */}
          <div className="absolute inset-0 bg-gradient-to-br from-kashmiri-dal-50 via-white to-kashmiri-pashmina-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          {/* Kashmiri decorative overlay */}
          <div className="absolute inset-0 kashmir-papier-mache opacity-20" />

          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/30">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 px-8 py-14 sm:px-12 sm:py-18 lg:p-20">
              {/* LEFT - Hero Content */}
              <motion.div
                className="flex flex-col items-center lg:items-start text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Badge */}
                <motion.span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-kashmiri-dal-100 to-kashmiri-pashmina-100 dark:from-kashmiri-dal-950/50 dark:to-kashmiri-pashmina-950/50 text-kashmiri-dal-700 dark:text-kashmiri-dal-300 border border-kashmiri-dal-200/50 dark:border-kashmiri-dal-700/50"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles size={14} className="text-kashmiri-dal-500" />
                  {hero.badge}
                </motion.span>

                {/* Heading */}
                <motion.h1
                  className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-transparent bg-clip-text kashmir-gradient-text">
                    {hero.heading}
                  </span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                  className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {hero.subText}
                </motion.p>

                {/* Kashmiri Tagline */}
                <motion.p
                  className="mt-3 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center lg:justify-start gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <Mountain
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <span className="italic">{hero.tagline}</span>
                </motion.p>

                {/* Trust Stats Bar - Professional credibility indicators */}
                <motion.div
                  className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.48 }}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">100+ Products</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">2+ Years</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">100% Authentic</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{clientType === "PUBLIC" ? "GeM Registered" : "Satisfied Customers"}</span>
                  </div>
                </motion.div>

                {/* Brand Trust Strip - Before CTA for credibility */}
                <motion.div
                  className="mt-4 w-full lg:w-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.52 }}
                >
                  <BrandTrustStrip clientType={clientType} />
                </motion.div>

                {/* CTA Buttons - Enhanced with glow effects */}
                <motion.div
                  className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <Link
                    to="/products"
                    className="flex-1 group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500 text-white font-semibold shadow-lg shadow-kashmiri-dal-500/25 hover:shadow-2xl hover:shadow-kashmiri-pashmina-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] text-nowrap relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <PackageSearch size={20} className="relative z-10" />
                    <span className="relative z-10">Browse Products</span>
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform relative z-10"
                    />
                  </Link>

                  <Link
                    to="/services"
                    className="flex-1 group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:border-kashmiri-pashmina-400 dark:hover:border-kashmiri-pashmina-400 hover:shadow-lg hover:shadow-kashmiri-pashmina-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] text-nowrap"
                  >
                    <Wrench size={20} />
                    Explore Services
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </motion.div>
              </motion.div>

              {/* RIGHT - Feature Cards */}
              <motion.div
                className="hidden lg:flex relative items-center justify-center"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
              >
                {/* Trust Badge */}
                <motion.img
                  src={clientType === "PUBLIC" ? gemLogo : genuineProducts}
                  alt="Trust badge"
                  className="absolute top-0 right-0 w-32 object-contain opacity-90"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                />

                <div className="relative w-full max-w-md space-y-6">
                  {/* Feature Card 1 */}
                  <motion.div
                    className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kashmiri-dal-500 to-kashmiri-pashmina-600 flex items-center justify-center shadow-lg shadow-kashmiri-dal-500/25">
                        <PackageSearch className="text-white" size={22} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-lg">
                          {clientType === "PUBLIC"
                            ? "Government Procurement"
                            : "Enterprise Procurement"}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {clientType === "PUBLIC"
                            ? "GeM compliant institutional purchasing"
                            : "Diverse products with competitive pricing"}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                          {clientType === "PUBLIC"
                            ? "Structured listings and enquiry-driven procurement."
                            : "Product purchases and order management."}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Feature Card 2 */}
                  <motion.div
                    className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <Wrench className="text-white" size={22} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-lg">
                          Installation, Repairs & AMC
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Services for products & enterprise solutions
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                          Expert-led installation, maintenance, and SLA-backed
                          support.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ================= FEATURES SECTION ================= */}
        <motion.section
          className="px-4 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-4`}
                >
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
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
          className="max-w-7xl mx-auto"
          variants={containerVariants}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-8 sm:p-12">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
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

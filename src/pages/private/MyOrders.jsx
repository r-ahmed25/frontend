import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";
import RoleGate from "../../components/RoleGate";
import { API_URL } from "../../api/client";
import { useNavigate, Link } from "react-router-dom";
import { canReviewProduct } from "../../api/reviews";
import {
  Package,
  Calendar,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  MessageSquare,
  Star,
} from "lucide-react";
import ReviewForm from "../../components/ReviewForm";

const statusConfig = {
  PLACED: {
    label: "Order Placed",
    color:
      "bg-indigo-100/80 text-indigo-700 border-indigo-200",
    icon: ShoppingBag,
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-amber-100/80 text-amber-700 border-amber-200",
    icon: Clock,
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-100/80 text-purple-700 border-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100/80 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100/80 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const getStatusConfig = (status) => statusConfig[status] || statusConfig.PLACED;

export default function MyOrders() {
  const { accessToken, user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [reviewableProducts, setReviewableProducts] = useState({});

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/orders/my`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (r) => {
        if (!r.ok) {
          if (r.status === 401) {
            navigate("/login");
          }
          throw new Error(`Failed to fetch orders: ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [accessToken, navigate]);

  // Check which products can be reviewed
  useEffect(() => {
    async function checkReviewableProducts() {
      const reviewable = {};
      for (const order of orders) {
        if (order.status === "DELIVERED") {
          for (const item of order.items || []) {
            if (item.product?._id) {
              try {
                const data = await canReviewProduct(item.product._id);
                if (data.canReview) {
                  reviewable[item.product._id] = {
                    canReview: true,
                    orderId: data.orderId || order._id,
                  };
                }
              } catch (err) {
                // Product cannot be reviewed or already reviewed
              }
            }
          }
        }
      }
      setReviewableProducts(reviewable);
    }

    if (orders.length > 0) {
      checkReviewableProducts();
    }
  }, [orders]);

  const getProductImage = (item) => {
    if (item.product?.images && item.product.images.length > 0) {
      return item.product.images[0].url;
    }
    return null;
  };

  const handleWriteReview = (product, orderId) => {
    setReviewProduct(product);
    setReviewOrderId(orderId);
    setShowReviewForm(true);
  };

  const handleReviewSuccess = () => {
    // Refresh reviewable products
    setReviewableProducts((prev) => {
      const updated = { ...prev };
      if (reviewProduct?._id) {
        delete updated[reviewProduct._id];
      }
      return updated;
    });
  };

  if (loading) {
    return (
      <RoleGate allow={["PRIVATE"]}>
        <div className="min-h-screen bg-surface py-8">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-slate-500">Loading your orders...</p>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (error) {
    return (
      <RoleGate allow={["PRIVATE"]}>
        <div className="min-h-screen bg-surface py-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-xl p-6 text-center theme-card bg-surface border border-white/40 shadow-lg">
              <XCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <h3 className="text-lg font-semibold mb-2 text-slate-900">
                Error Loading Orders
              </h3>
              <p className="text-slate-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-lg font-medium btn-theme-primary animate-gradient"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  return (
    <RoleGate allow={["PRIVATE"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">
              My Orders
            </h2>
            <p className="text-slate-500">Track and manage your orders</p>
          </motion.div>

          {orders.length === 0 ? (
            <div className="rounded-2xl p-12 text-center theme-card bg-surface border border-white/40 shadow-lg">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-slate-100">
                <Package className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                No orders yet
              </h3>
              <p className="mb-6 max-w-md mx-auto text-slate-500">
                You haven't placed any orders yet. Start shopping to see your
                orders here.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 rounded-xl font-medium btn-theme-primary animate-gradient"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const status = getStatusConfig(order.status);
                const StatusIcon = status.icon;
                const firstItem = order.items?.[0];
                const firstImage = getProductImage(firstItem);
                const totalItems =
                  order.items?.reduce((sum, item) => sum + item.quantity, 0) ||
                  0;

                // Check if any product in this order can be reviewed
                const reviewableItems = (order.items || []).filter(
                  (item) =>
                    order.status === "DELIVERED" &&
                    item.product?._id &&
                    reviewableProducts[item.product._id]?.canReview,
                );

                return (
                  <div
                    key={order._id}
                    className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50 theme-card bg-surface border border-white/40 shadow-lg hover:-translate-y-1"
                  >
                    {/* Order Header */}
                    <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-slate-100 border-b border-slate-200">
                      <div className="flex items-center gap-6 flex-wrap">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Order ID
                          </p>
                          <p className="font-mono font-medium text-slate-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Order Date
                          </p>
                          <div className="flex items-center gap-1 text-slate-900">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Total Amount
                          </p>
                          <p className="font-semibold text-slate-900">
                            ₹
                            {order.pricing?.grandTotal?.toLocaleString(
                              "en-IN",
                            ) || order.totalAmount?.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {firstImage ? (
                            <div className="relative">
                              <img
                                src={firstImage}
                                alt={firstItem?.product?.name || "Product"}
                                className="w-24 h-24 object-cover rounded-xl border border-slate-200"
                              />
                              {order.items?.length > 1 && (
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shadow-md bg-indigo-600 text-white">
                                  +{order.items.length - 1}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-xl flex items-center justify-center bg-slate-100 border border-slate-200">
                              <Package className="w-10 h-10 text-slate-400" />
                            </div>
                          )}
                        </div>

                        {/* Order Details */}
                        <div className="flex-grow min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate text-slate-900">
                            {firstItem?.product?.name || "Product"}
                          </h3>
                          <p className="mb-3 text-slate-500">
                            {totalItems} item{totalItems !== 1 ? "s" : ""} in
                            this order
                          </p>

                          {/* Items Preview */}
                          {order.items && order.items.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {order.items.slice(0, 3).map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-900"
                                >
                                  {item.quantity}×{" "}
                                  {item.product?.name?.slice(0, 20)}
                                  {item.product?.name?.length > 20 ? "..." : ""}
                                </span>
                              ))}
                              {order.items.length > 3 && (
                                <span className="text-xs px-2 py-1 text-slate-500">
                                  +{order.items.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-4 flex-wrap">
                            <Link
                              to={`/orders/${order._id}`}
                              className="inline-flex items-center font-medium text-sm group text-indigo-600 hover:opacity-80 transition-colors"
                            >
                              View Order Details
                              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </Link>

                            {/* Write Review Button */}
                            {reviewableItems.length > 0 && (
                              <button
                                onClick={() =>
                                  handleWriteReview(
                                    reviewableItems[0].product,
                                    reviewableProducts[
                                      reviewableItems[0].product._id
                                    ]?.orderId || order._id,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                                  bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                              >
                                <Star className="w-4 h-4" />
                                Write Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reviewable Products List for Delivered Orders */}
                      {order.status === "DELIVERED" &&
                        reviewableItems.length > 1 && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <p className="text-sm text-slate-600 mb-2">
                              Products available for review:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {reviewableItems.map((item, idx) => (
                                <button
                                  key={idx}
                                  onClick={() =>
                                    handleWriteReview(
                                      item.product,
                                      reviewableProducts[item.product._id]
                                        ?.orderId || order._id,
                                    )
                                  }
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                                  bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50
                                  transition-all group"
                                >
                                  {item.product?.images?.[0]?.url && (
                                    <img
                                      src={item.product.images[0].url}
                                      alt=""
                                      className="w-6 h-6 rounded object-cover"
                                    />
                                  )}
                                  <span className="text-slate-700 group-hover:text-indigo-700">
                                    {item.product?.name?.slice(0, 25)}
                                    {item.product?.name?.length > 25
                                      ? "..."
                                      : ""}
                                  </span>
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && reviewProduct && (
        <ReviewForm
          productId={reviewProduct._id}
          orderId={reviewOrderId}
          onClose={() => {
            setShowReviewForm(false);
            setReviewProduct(null);
            setReviewOrderId(null);
          }}
          onSuccess={handleReviewSuccess}
        />
      )}
    </RoleGate>
  );
}

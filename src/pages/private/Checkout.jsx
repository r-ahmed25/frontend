import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RoleGate from "../../components/RoleGate";
import AddressManager from "../../components/AddressManager";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import OrderSummary from "../../components/OrderSummary";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import {
  fetchRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../api/payments";
import { MapPin, CreditCard, Package } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();

  const { cart, pricing, fetchCart, clearCart } = useCartStore();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "online"
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Ensure cart is loaded (in case user refreshes checkout page)
  useEffect(() => {
    if (!cart) fetchCart();
  }, []);

  // Handle Cash on Delivery order
  async function placeCODOrder() {
    if (!cart?.items?.length) return;
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "cod",
          shippingAddress: `${selectedAddress.label}: ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}, Phone: ${selectedAddress.phone}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order failed");

      clearCart();
      navigate("/order-success", {
        replace: true,
        state: { orderId: data.orderId, paymentMethod: "cod" },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  // Handle Razorpay payment
  async function handleRazorpayPayment() {
    if (!cart?.items?.length) return;
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    setPlacing(true);
    setError("");

    // Format shipping address
    const shippingAddress = `${selectedAddress.label}: ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}, Phone: ${selectedAddress.phone}`;

    try {
      // Load Razorpay script
      const Razorpay = await loadRazorpayScript();

      // Get Razorpay key
      const razorpayKey = await fetchRazorpayKey();

      // Create order on server
      const orderData = await createRazorpayOrder();

      // Configure Razorpay options
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CuttingEdge Commercial",
        description: "Order Payment",
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment on server
            const verifyData = await verifyRazorpayPayment(
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              shippingAddress,
            );

            // Clear cart and redirect to success
            clearCart();
            navigate("/order-success", {
              replace: true,
              state: {
                orderId: verifyData.orderId,
                paymentMethod: "online",
                paymentId: response.razorpay_payment_id,
              },
            });
          } catch (verifyErr) {
            setError(verifyErr.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#4f46e5", // Indigo-600
        },
        modal: {
          ondismiss: function () {
            setPlacing(false);
          },
        },
      };

      // Open Razorpay checkout
      const rzp = new Razorpay(options);

      rzp.on("payment.failed", function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setPlacing(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || "Payment initialization failed");
      setPlacing(false);
    }
  }

  // Handle order placement based on payment method
  function handlePlaceOrder() {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }
    if (paymentMethod === "cod") {
      placeCODOrder();
    } else {
      handleRazorpayPayment();
    }
  }

  return (
    <RoleGate allow={["PRIVATE"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-6">
          {/* LEFT: ITEMS */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                Checkout
              </h2>
              <p className="text-slate-500 mt-1">Complete your order</p>
            </motion.div>

            {!cart?.items?.length && (
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg p-8 text-center">
                <p className="text-slate-600">Your cart is empty.</p>
              </div>
            )}

            {/* Cart Items Preview */}
            {cart?.items?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-200/50 p-6"
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-900">
                  <Package className="w-5 h-5 text-slate-400" />
                  Order Items ({cart.items.length})
                </h3>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-slate-50"
                    >
                      {item.product.images?.[0]?.url && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        ₹
                        {(item.product.price * item.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Delivery Address Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-200/50 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Delivery Address
                </h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {selectedAddress ? "Change" : "+ Add New Address"}
                </button>
              </div>

              {selectedAddress ? (
                <div className="border-2 border-indigo-600 bg-indigo-50/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {selectedAddress.label}
                    </span>
                    {selectedAddress.isDefault && (
                      <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.street}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.city}, {selectedAddress.state} -{" "}
                    {selectedAddress.pincode}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {selectedAddress.phone}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-slate-300 rounded-xl">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p>Please select a delivery address</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Select Address
                  </button>
                </div>
              )}
            </motion.div>

            {/* Payment Method Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-200/50 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Payment Method
              </h3>
              <div className="space-y-3">
                {/* Online Payment Option */}
                <label
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    paymentMethod === "online"
                      ? "border-indigo-600 bg-indigo-50/50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        Online Payment
                      </span>
                      <span className="text-sm text-gray-500">
                        Cards, UPI, NetBanking
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Secure payment via Razorpay
                    </p>
                  </div>
                </label>

                {/* COD Option */}
                <label
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    paymentMethod === "cod"
                      ? "border-indigo-600 bg-indigo-50/50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        Cash on Delivery
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <OrderSummary />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              disabled={placing || !cart?.items?.length || !selectedAddress}
              onClick={handlePlaceOrder}
              className="w-full py-4 rounded-xl font-semibold
                        bg-indigo-600
                        text-white shadow-lg shadow-indigo-500/25
                        hover:shadow-xl hover:shadow-indigo-600/30
                        hover:-translate-y-0.5 transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {placing
                ? "Processing..."
                : paymentMethod === "cod"
                  ? "Place Order (COD)"
                  : "Pay Now"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh]overflow-hidden"
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <AddressManager
                showSelector={true}
                selectedAddressId={selectedAddress?._id}
                onSelectAddress={(address) => {
                  setSelectedAddress(address);
                  setShowAddressModal(false);
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </RoleGate>
  );
}

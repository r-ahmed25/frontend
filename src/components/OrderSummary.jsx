import { useCartStore } from "../store/cartStore";
import { motion } from "framer-motion";

export default function OrderSummary() {
  const { pricing } = useCartStore();

  const { baseAmount, discountAmount, cgst, sgst, totalTax, grandTotal } =
    pricing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-xl shadow-slate-200/50 p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-slate-900">Order Summary</h3>

      <div className="space-y-3">
        <Row label="Price (Incl. GST)" value={grandTotal} />
        <Row label="Taxable Value (Included)" value={baseAmount} subtle />

        {discountAmount > 0 && (
          <Row label="Coupon Discount" value={-discountAmount} highlight />
        )}

        <Row label="CGST @9% (Included)" value={cgst} />
        <Row label="SGST @9% (Included)" value={sgst} />

        <div className="border-t border-slate-200 pt-3">
          <Row label="Total Tax" value={totalTax} />
        </div>

        <div className="border-t border-slate-200 pt-4">
          <Row label="Amount Payable" value={grandTotal} primary />
        </div>
      </div>

      <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
        * GST charged as per Indian tax regulations.
      </p>
    </motion.div>
  );
}

function Row({ label, value, highlight, primary, subtle }) {
  return (
    <div className="flex justify-between text-sm">
      <span
        className={
          primary
            ? "text-kashmiri-dal-600 font-semibold"
            : highlight
              ? "text-green-600"
              : subtle
                ? "text-slate-400"
                : "text-slate-600"
        }
      >
        {label}
      </span>
      <span
        className={`font-medium ${primary ? "text-kashmiri-dal-600" : "text-slate-900"}`}
      >
        ₹
        {typeof value === "number" && !isNaN(value) ? value.toFixed(2) : "0.00"}
      </span>
    </div>
  );
}

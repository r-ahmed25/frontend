import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import RoleGate from "../../components/RoleGate";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, XCircle, ArrowRight, Inbox, Calendar, DollarSign } from "lucide-react";

export default function MyServiceQuotes() {
  const { accessToken } = useAuthStore();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadQuotes() {
    try {
      const res = await fetch(`${API_URL}/services/quote/my`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load quotes");

      setQuotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  if (loading) {
    return (
      <RoleGate allow={["PRIVATE", "PUBLIC"]}>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (error) {
    return (
      <RoleGate allow={["PRIVATE", "PUBLIC"]}>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </motion.div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (!quotes.length)
    return (
      <RoleGate allow={["PRIVATE", "PUBLIC"]}>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 p-8 md:p-12 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-kashmiri-pashmina-100 to-kashmiri-saffron-100 dark:from-kashmiri-pashmina-900/30 dark:to-kashmiri-saffron-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Inbox className="w-10 h-10 text-kashmiri-pashmina-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                No Service Quotes Yet
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                You haven't received any service quotes yet. Submit an enquiry to receive quotes from our team.
              </p>
              <a
                href="/service-enquiries"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500 text-white font-semibold rounded-xl shadow-lg shadow-kashmiri-dal-500/25 hover:shadow-xl hover:shadow-kashmiri-pashmina-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                View My Enquiries
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </RoleGate>
    );

  const isExpired = (validityDate) => new Date(validityDate) < new Date();

  const getStatusBadge = (quote) => {
    if (isExpired(quote.validityDate) && quote.status === "SENT") {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    }
    const styles = {
      SENT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
      EXPIRED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    };
    return styles[quote.status] || styles.EXPIRED;
  };

  const getStatusIcon = (status) => {
    const icons = {
      SENT: Clock,
      APPROVED: CheckCircle,
      REJECTED: XCircle,
      EXPIRED: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <RoleGate allow={["PRIVATE", "PUBLIC"]}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 md:mb-8"
          >
            <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold uppercase tracking-widest text-kashmiri-pashmina-600 dark:text-kashmiri-pashmina-400 bg-kashmiri-pashmina-50 dark:bg-kashmiri-pashmina-900/30 rounded-full">
              Service Quotes
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              My Service Quotes
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              View and manage your service quotations
            </p>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-lg border border-slate-200/50 dark:border-slate-800/50 p-4 text-center transition-all duration-200 hover:-translate-y-1">
              <div className="text-2xl font-bold bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 bg-clip-text text-transparent">
                {quotes.length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Total Quotes</div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-lg border border-slate-200/50 dark:border-slate-800/50 p-4 text-center transition-all duration-200 hover:-translate-y-1">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {
                  quotes.filter(
                    (q) => q.status === "SENT" && !isExpired(q.validityDate),
                  ).length
                }
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Pending</div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-lg border border-slate-200/50 dark:border-slate-800/50 p-4 text-center transition-all duration-200 hover:-translate-y-1">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {quotes.filter((q) => q.status === "APPROVED").length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Approved</div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-lg border border-slate-200/50 dark:border-slate-800/50 p-4 text-center transition-all duration-200 hover:-translate-y-1">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {
                  quotes.filter(
                    (q) =>
                      q.status === "REJECTED" ||
                      (q.status === "SENT" && isExpired(q.validityDate)),
                  ).length
                }
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Expired/Rejected</div>
            </div>
          </motion.div>

          {/* Quotes List */}
          <div className="space-y-4">
            {quotes.map((quote, index) => {
              const expired = isExpired(quote.validityDate);

              return (
                <motion.div
                  key={quote._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                    expired && quote.status === "SENT"
                      ? "border-red-300 dark:border-red-800"
                      : "border-slate-200/50 dark:border-slate-800/50"
                  }`}
                >
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Service Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                            expired && quote.status === "SENT"
                              ? "bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/25"
                              : "bg-gradient-to-br from-kashmiri-pashmina-500 to-kashmiri-saffron-500 shadow-kashmiri-pashmina-500/25"
                          }`}>
                            <FileText className="w-7 h-7 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                              {quote.enquiry?.service?.name ||
                                quote.enquiry?.serviceNameSnapshot ||
                                "Service Quote"}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              Quote Date:{" "}
                              {new Date(quote.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusBadge(quote)}`}
                        >
                          {getStatusIcon(quote.status)}
                          {expired && quote.status === "SENT" ? "EXPIRED" : quote.status}
                        </span>
                      </div>
                    </div>

                    {/* Quote Details */}
                    <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Amount</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            ₹{quote.estimatedAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          expired 
                            ? "bg-red-100 dark:bg-red-900/30" 
                            : "bg-blue-100 dark:bg-blue-900/30"
                        }`}>
                          <Calendar className={`w-5 h-5 ${
                            expired 
                              ? "text-red-600 dark:text-red-400" 
                              : "text-blue-600 dark:text-blue-400"
                          }`} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Valid Until</p>
                          <p className={`text-sm font-semibold ${
                            expired ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"
                          }`}>
                            {new Date(quote.validityDate).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quote ID</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            #{quote._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <a
                        href={`/service-quotes/${quote._id}`}
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500 text-white font-semibold rounded-xl shadow-lg shadow-kashmiri-dal-500/25 hover:shadow-xl hover:shadow-kashmiri-pashmina-500/30 hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <FileText className="w-4 h-4" />
                        View Quote Details
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}

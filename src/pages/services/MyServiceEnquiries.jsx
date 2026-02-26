import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../api/client";
import RoleGate from "../../components/RoleGate";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Inbox,
} from "lucide-react";

export default function MyServiceEnquiries() {
  const { accessToken } = useAuthStore();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEnquiries() {
    try {
      const res = await fetch(`${API_URL}/services/enquiry/my`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load enquiries");

      setEnquiries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
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
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md"
                  ></div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
                  >
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
              <p className="text-red-700 dark:text-red-400 font-medium">
                {error}
              </p>
            </motion.div>
          </div>
        </div>
      </RoleGate>
    );
  }

  if (!enquiries.length)
    return (
      <RoleGate allow={["PRIVATE", "PUBLIC"]}>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 p-8 md:p-12 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-kashmiri-dal-100 to-kashmiri-pashmina-100 dark:from-kashmiri-dal-900/30 dark:to-kashmiri-pashmina-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Inbox className="w-10 h-10 text-kashmiri-dal-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                No Service Enquiries Yet
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                You haven't submitted any service enquiries. Browse our services
                to get started.
              </p>
              <a
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500 text-white font-semibold rounded-xl shadow-lg shadow-kashmiri-dal-500/25 hover:shadow-xl hover:shadow-kashmiri-pashmina-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                Browse Services
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </RoleGate>
    );

  const getStatusBadge = (status) => {
    const styles = {
      NEW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
      IN_PROGRESS:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      QUOTED:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      COMPLETED:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      CLOSED:
        "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    };
    return styles[status] || styles.NEW;
  };

  const getStatusIcon = (status) => {
    const icons = {
      NEW: Clock,
      IN_PROGRESS: FileText,
      QUOTED: CheckCircle,
      COMPLETED: CheckCircle,
      CLOSED: XCircle,
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
            <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold uppercase tracking-widest text-kashmiri-dal-600 dark:text-kashmiri-dal-400 bg-kashmiri-dal-50 dark:bg-kashmiri-dal-900/30 rounded-full">
              Service Enquiries
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              My Service Enquiries
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Track your service enquiries and quotes
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
                {enquiries.length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Total Enquiries
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-lg border border-slate-200/50 dark:border-slate-800/50 p-4 text-center transition-all duration-200 hover:-translate-y-1">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {
                  enquiries.filter(
                    (e) => e.status === "NEW" || e.status === "IN_PROGRESS",
                  ).length
                }
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Pending
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-lg border border-slate-200/50 dark:border-slate-800/50 p-4 text-center transition-all duration-200 hover:-translate-y-1">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {enquiries.filter((e) => e.status === "QUOTED").length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Quoted
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-lg border border-slate-200/50 dark:border-slate-800/50 p-4 text-center transition-all duration-200 hover:-translate-y-1">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {enquiries.filter((e) => e.status === "COMPLETED").length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Completed
              </div>
            </div>
          </motion.div>

          {/* Enquiries List */}
          <div className="space-y-4">
            {enquiries.map((enq, index) => (
              <motion.div
                key={enq._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-kashmiri-dal-500 to-kashmiri-pashmina-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-kashmiri-dal-500/25">
                          <FileText className="w-7 h-7 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                            {enq.serviceNameSnapshot ||
                              enq.service?.name ||
                              "Service Enquiry"}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Submitted:{" "}
                            {new Date(enq.createdAt).toLocaleDateString(
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
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusBadge(enq.status)}`}
                      >
                        {getStatusIcon(enq.status)}
                        {enq.status}
                      </span>
                    </div>
                  </div>

                  {/* Requirement Preview */}
                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      Requirements
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {enq.requirementDetails}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                    {enq.status === "QUOTED" ? (
                      <a
                        href={`/service-quotes/enquiry/${enq._id}`}
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500 text-white font-semibold rounded-xl shadow-lg shadow-kashmiri-dal-500/25 hover:shadow-xl hover:shadow-kashmiri-pashmina-500/30 hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <CheckCircle className="w-4 h-4" />
                        View Quote
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        Awaiting admin response
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}

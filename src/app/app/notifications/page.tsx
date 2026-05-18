"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  CheckCheck,
  Award,
  BookOpen,
  Clock,
  ChevronRight,
  Inbox,
  Loader2
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { notifications } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch live notifications
  const { data: listData, loading, refetch } = useApi(() => notifications.list(), [user?.id]);

  const sortedNotifications = useMemo(() => {
    return [...(listData || [])].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [listData]);

  const unreadCount = useMemo(() => {
    return sortedNotifications.filter((n) => !n.is_read).length;
  }, [sortedNotifications]);

  // Handler to mark a single notification as read
  const handleMarkAsRead = async (id: string) => {
    setActionLoading(id);
    try {
      await notifications.read(id);
      await refetch();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handler to mark all notifications as read
  const handleMarkAllAsRead = async () => {
    setActionLoading("all");
    try {
      await notifications.readAll();
      await refetch();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center shadow-lg shadow-aegis-cyan/10">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-aegis-red text-white font-mono font-semibold animate-pulse">
                  {unreadCount} NEW
                </span>
              )}
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Command inbox & trainee certification request alerts
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={actionLoading !== null}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-aegis-cyan/10 hover:bg-aegis-cyan/25 border border-aegis-cyan/30 text-aegis-cyan transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {actionLoading === "all" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5" />
            )}
            Mark all as read
          </button>
        )}
      </motion.div>

      {/* Main List */}
      <motion.div variants={fadeInUp} className="space-y-4">
        {loading ? (
          <GlassPanel animated={false}>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-10 h-10 text-aegis-cyan animate-spin mb-4" />
              <p className="text-sm text-aegis-mist font-heading tracking-wider">
                Retrieving secure operational inbox...
              </p>
            </div>
          </GlassPanel>
        ) : sortedNotifications.length === 0 ? (
          <GlassPanel animated={false}>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-5">
                <BellOff className="w-7 h-7 text-aegis-slate" />
              </div>
              <h2 className="font-heading text-base font-bold text-aegis-cloud tracking-wide">
                Clear Operations Inbox
              </h2>
              <p className="text-xs text-aegis-mist mt-2 max-w-md leading-relaxed">
                There are currently no active alerts or pending subject completion notifications. All trainee logs are fully audited.
              </p>
              <div className="mt-5">
                <StatusBadge label="SYSTEM NOMINAL" variant="synced" />
              </div>
            </div>
          </GlassPanel>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sortedNotifications.map((notif) => {
                const isUnread = !notif.is_read;
                const isCertAction =
                  notif.extra_data?.action === "issue_certificate" &&
                  (user?.role === "instructor" || user?.role === "evaluator");

                return (
                  <motion.div
                    key={notif.id}
                    layoutId={notif.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className={`relative rounded-xl border transition-all duration-300 ${
                      isUnread
                        ? "bg-slate-900/50 border-aegis-cyan/30 shadow-lg shadow-aegis-cyan/5"
                        : "bg-white/[0.02] border-white/5 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icon based on notification purpose */}
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mt-0.5 shrink-0 ${
                            isUnread
                              ? "bg-aegis-cyan/15 text-aegis-cyan"
                              : "bg-white/[0.04] text-aegis-slate"
                          }`}
                        >
                          {notif.type === "doctrine_update" ? (
                            <BookOpen className="w-5 h-5" />
                          ) : isCertAction ? (
                            <Award className="w-5 h-5 text-amber-400" />
                          ) : (
                            <Inbox className="w-5 h-5" />
                          )}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-heading text-sm font-bold text-aegis-white tracking-wide">
                              {notif.title}
                            </span>
                            {isUnread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-aegis-cyan animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-aegis-mist leading-relaxed font-body whitespace-pre-line pr-4">
                            {notif.body}
                          </p>
                          <div className="flex items-center gap-2.5 text-[10px] text-aegis-slate pt-2 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(notif.created_at)}
                            <span className="text-white/10">•</span>
                            <span className="uppercase text-slate-400">{notif.type}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Panel */}
                      <div className="flex flex-wrap md:flex-col items-end gap-2.5 shrink-0 pl-14 md:pl-0">
                        {isCertAction && (
                          <button
                            onClick={() => {
                              // If there's an unread notification, mark it as read before jumping
                              if (isUnread) handleMarkAsRead(notif.id);
                              router.push("/app/certifications");
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 transition-all duration-200 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5" />
                            Issue Certificate
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isUnread && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            disabled={actionLoading === notif.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-aegis-cloud transition-all duration-200 cursor-pointer disabled:opacity-50"
                          >
                            {actionLoading === notif.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCheck className="w-3.5 h-3.5" />
                            )}
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

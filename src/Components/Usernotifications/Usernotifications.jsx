"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

// ── Icons ──
const CheckAllIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <polyline points="20 6 9 17 4 12" />
    <line x1="8" y1="19" x2="22" y2="6" />
  </svg>
);
const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
const FilterIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const RefreshIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

// ── Config ──
const TYPE_CONFIG = {
  announcement: {
    label: "Announcement",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: "📢",
    ring: "ring-blue-200",
    accent: "#3b82f6",
  },
  exam: {
    label: "Exam",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: "📝",
    ring: "ring-red-200",
    accent: "#ef4444",
  },
  holiday: {
    label: "Holiday",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    icon: "🎉",
    ring: "ring-green-200",
    accent: "#22c55e",
  },
  fee: {
    label: "Fee",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    icon: "💰",
    ring: "ring-yellow-200",
    accent: "#eab308",
  },
  assignment: {
    label: "Assignment",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: "📚",
    ring: "ring-purple-200",
    accent: "#a855f7",
  },
  leave: {
    label: "Leave",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    icon: "🌴",
    ring: "ring-orange-200",
    accent: "#f97316",
  },
  result: {
    label: "Result",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    icon: "🏆",
    ring: "ring-teal-200",
    accent: "#14b8a6",
  },
  general: {
    label: "General",
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: "🔔",
    ring: "ring-slate-200",
    accent: "#64748b",
  },
};

const PRIORITY_BADGE = {
  high: "bg-red-100 text-red-600",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-500",
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

// ── Helper: userId localStorage se nikalo ──
// FIX: localStorage mein JSON object store hai, usse parse karke _id ya id nikalo
function getUserId() {
  if (typeof window === "undefined") return null;

  // Sabse pehle direct string keys check karo
  const directKeys = ["userId", "user_id", "uid"];
  for (const key of directKeys) {
    const val = localStorage.getItem(key);
    if (val) {
      // Agar value JSON object hai toh parse karo
      try {
        const parsed = JSON.parse(val);
        if (typeof parsed === "object") {
          const id = parsed?._id || parsed?.id || parsed?.userId;
          if (id) return id;
        }
      } catch (_) {}
      // Plain string hai toh directly return karo
      return val;
    }
  }

  // JSON object wali keys check karo (jaise "user", "userData", "currentUser" etc.)
  const objectKeys = [
    "user",
    "userData",
    "user_data",
    "currentUser",
    "authUser",
    "userInfo",
    "loginUser",
    "loggedUser",
  ];
  for (const key of objectKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
          // _id pehle try karo (MongoDB default), phir id
          const id =
            parsed?._id || parsed?.id || parsed?.userId || parsed?.user_id;
          if (id) return id;
        }
      }
    } catch (_) {}
  }

  return null;
}

function NotificationCard({ notification, onRead, onDelete, isRead }) {
  const tc = TYPE_CONFIG[notification.type] || TYPE_CONFIG.general;
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
    if (!isRead) onRead(notification._id);
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
        isRead ? "border-slate-100" : "border-slate-200 shadow-sm"
      }`}
      style={!isRead ? { borderLeftColor: tc.accent, borderLeftWidth: 4 } : {}}
      onClick={handleClick}
    >
      {!isRead && (
        <div className="absolute top-4 right-4">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block animate-pulse"
            style={{ backgroundColor: tc.accent }}
          />
        </div>
      )}

      <div className="p-5 flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-2xl ${tc.bg} border ${tc.border} flex items-center justify-center text-2xl flex-shrink-0 ring-2 ring-offset-1 ${
            isRead ? "ring-transparent" : tc.ring
          }`}
        >
          {tc.icon}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3
              className={`text-sm font-bold ${isRead ? "text-slate-600" : "text-slate-900"}`}
            >
              {notification.title}
            </h3>
            {notification.priority === "high" && (
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${PRIORITY_BADGE.high}`}
              >
                🔴 Urgent
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tc.bg} ${tc.text} ${tc.border}`}
            >
              {tc.label}
            </span>
          </div>

          <p
            className={`text-sm leading-relaxed ${isRead ? "text-slate-400" : "text-slate-600"} ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {notification.message}
          </p>

          {/* ── FIX: <a> tag properly closed ── */}
          {expanded && notification.link && (
            <a
              href={notification.link}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: tc.accent }}
            >
              View Details <ArrowRightIcon />
            </a>
          )}

          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-slate-400">
              {timeAgo(notification.createdAt)}
            </span>
            {notification.expiresAt &&
              new Date(notification.expiresAt) > new Date() && (
                <span className="text-[11px] text-orange-400 font-medium">
                  ⏱ Expires{" "}
                  {new Date(notification.expiresAt).toLocaleDateString()}
                </span>
              )}
            {isRead && (
              <span className="text-[11px] text-slate-300 font-medium">
                ✓ Read
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div
          className="px-5 pb-4 flex justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onDelete(notification._id)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all font-semibold"
          >
            <TrashIcon /> Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default function UserNotifications() {
  const [userId, setUserId] = useState(null);
  const [userIdError, setUserIdError] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [toast, setToast] = useState(null);

  // userId mount pe detect karo
  useEffect(() => {
    const id = getUserId();
    if (id) {
      console.log("✅ userId mila:", id);
      setUserId(id);
    } else {
      console.warn(
        "⚠️ userId nahi mila. Available localStorage keys:",
        Object.keys(localStorage),
      );
      setUserIdError(true);
      setLoading(false);
    }
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/notifications/user/${userId}`,
      );
      setNotifications(res.data);
      const ids = new Set(
        res.data.filter((n) => n.readBy?.includes(userId)).map((n) => n._id),
      );
      setReadIds(ids);
    } catch (e) {
      console.error(
        "Notification fetch error:",
        e.response?.status,
        e.response?.data,
      );
      showToast(`Error: ${e.response?.status || "Network error"}`, "error");
      setNotifications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const markRead = async (id) => {
    if (readIds.has(id)) return;
    try {
      await axios.put(`${BASE_URL}/api/notifications/${id}/read`, { userId });
      setReadIds((prev) => new Set([...prev, id]));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${BASE_URL}/api/notifications/mark-all-read`, {
        userId,
      });
      setReadIds(new Set(notifications.map((n) => n._id)));
      showToast("All notifications marked as read");
    } catch (e) {
      setReadIds(new Set(notifications.map((n) => n._id)));
      showToast("All marked as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/notifications/${id}/user/${userId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      showToast("Notification removed");
    } catch (e) {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      showToast("Removed");
    }
  };

  const clearAll = async () => {
    if (!confirm("Remove all notifications?")) return;
    setNotifications([]);
    showToast("All notifications cleared");
  };

  const filtered = notifications.filter((n) => {
    if (filterType !== "all" && n.type !== filterType) return false;
    if (showUnreadOnly && readIds.has(n._id)) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !readIds.has(n._id)).length;

  const grouped = filtered.reduce((acc, n) => {
    const d = new Date(n.createdAt);
    const now = new Date();
    let label = d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const diff = now - d;
    if (diff < 86400000) label = "Today";
    else if (diff < 172800000) label = "Yesterday";
    if (!acc[label]) acc[label] = [];
    acc[label].push(n);
    return acc;
  }, {});

  // ── userId nahi mila ──
  if (userIdError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-red-200 p-10 max-w-md text-center shadow-lg">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-red-600 mb-2">
            User ID nahi mila
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            localStorage mein userId nahi hai. Pehle login karo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-indigo-50/20">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold border ${
            toast.type === "error"
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}
          />
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/60 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f4c5c] to-[#2596be] flex items-center justify-center text-white text-lg shadow-sm">
              🔔
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-xs text-[#1e88a8] font-semibold">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifications}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-[#1e88a8] hover:border-[#1e88a8] transition-all"
            >
              <RefreshIcon />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f4c5c] text-white text-xs font-semibold hover:opacity-90 shadow-sm"
              >
                <CheckAllIcon /> Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold hover:border-red-300 hover:text-red-400 transition-all"
              >
                <TrashIcon /> Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
        {/* ── Summary chips ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
            <span className="text-2xl font-bold text-slate-800">
              {notifications.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">Total</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0f4c5c]/10 border border-[#1e88a8]/20 rounded-xl px-4 py-2.5">
            <span className="text-2xl font-bold text-[#0f4c5c]">
              {unreadCount}
            </span>
            <span className="text-xs text-[#1e88a8] font-semibold">Unread</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
            <span className="text-2xl font-bold text-emerald-700">
              {notifications.length - unreadCount}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Read</span>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className="bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 flex-wrap shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-slate-400">
            <FilterIcon />
            <span className="text-xs font-semibold">Filter</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "all"
                  ? "bg-[#0f4c5c] text-white"
                  : "bg-slate-100 text-slate-500 hover:text-slate-700"
              }`}
            >
              All
            </button>
            {Object.entries(TYPE_CONFIG).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setFilterType(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === k
                    ? "bg-[#0f4c5c] text-white"
                    : "bg-slate-100 text-slate-500 hover:text-slate-700"
                }`}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 ml-auto cursor-pointer">
            <div
              className={`w-9 h-5 rounded-full transition-all relative ${showUnreadOnly ? "bg-[#1e88a8]" : "bg-slate-200"}`}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              <div
                className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
                style={{ left: showUnreadOnly ? "18px" : "2px" }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Unread only
            </span>
          </label>
        </div>

        {/* ── Notification list ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-[3px] border-teal-100 border-t-[#1e88a8] rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">
              Loading your notifications…
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white/60 rounded-3xl border border-slate-200 backdrop-blur-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-4xl">
              🔕
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-500">
                {showUnreadOnly
                  ? "No unread notifications!"
                  : "You're all caught up!"}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {showUnreadOnly
                  ? "Toggle off 'Unread only' to see all."
                  : "New notifications will appear here."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {dateLabel}
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400">
                    {items.length} notification{items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((n) => (
                    <NotificationCard
                      key={n._id}
                      notification={n}
                      onRead={markRead}
                      onDelete={deleteNotification}
                      isRead={readIds.has(n._id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

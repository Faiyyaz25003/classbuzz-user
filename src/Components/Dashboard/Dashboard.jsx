"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

// fmtTime — chat timestamps ke liye
const fmtTime = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

// Compare sirf dates (time ignore karo)
const daysFromToday = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
};

const dayLabel = (days) => {
  if (days === null) return null;
  if (days === 0) return { text: "Today", color: "amber" };
  if (days === 1) return { text: "Tomorrow", color: "blue" };
  if (days < 0) return { text: "Over", color: "gray" };
  return {
    text: `${days} days left`,
    color: days <= 5 ? "amber" : days <= 10 ? "blue" : "green",
  };
};

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

// ─────────────────────────────────────────────────────────────
// Shared UI
// ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, subColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && (
        <p className={`text-xs mt-1 ${subColor || "text-gray-400"}`}>{sub}</p>
      )}
    </div>
  );
}

const tagStyles = {
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  gray: "bg-gray-100 text-gray-600",
};
function Tag({ color = "gray", children }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${tagStyles[color]}`}
    >
      {children}
    </span>
  );
}

function AttBar({ pct }) {
  const color =
    pct >= 75 ? "bg-green-500" : pct >= 60 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 min-w-[36px] text-right">
        {pct}%
      </span>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );
}

function ErrorBox({ msg, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
      <p className="text-sm text-red-600 mb-3">{msg}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-red-700 font-semibold underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LIVE MESSAGES WIDGET — dashboard pe real-time new messages
// ─────────────────────────────────────────────────────────────
function LiveMessagesWidget({ onNavigate }) {
  const user = getUser();
  const [newMsgs, setNewMsgs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [convs, setConvs] = useState({});
  const [unreadTotal, setUnreadTotal] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user._id) return;

    // load conversations
    const loadData = async () => {
      try {
        const usersRes = await axios.get(`${API}/users`);
        const users = usersRes.data?.users || usersRes.data || [];
        setAllUsers(users.filter((u) => u._id !== user._id));

        const convRes = await axios.get(
          `${API}/messages/conversations/${user._id}`,
        );
        const map = {};
        let total = 0;
        (convRes.data?.conversations || []).forEach((c) => {
          if (c.user?.id) {
            map[c.user.id.toString()] = c;
            total += c.unread || 0;
          }
        });
        setConvs(map);
        setUnreadTotal(total);
      } catch {}
    };
    loadData();

    // socket — listen for new messages
    try {
      const { io } = require("socket.io-client");
      const s = io(SOCKET_URL, { transports: ["websocket"] });
      socketRef.current = s;
      s.emit("user:join", user._id);

      s.on("message:receive", ({ message }) => {
        const msgId = String(
          message._id || message.id || `${message.sender}_${Date.now()}`,
        );
        // allUsers ka latest value ref se lo — setState ke bahar
        setAllUsers((users) => {
          const sender = users.find(
            (u) => u._id?.toString() === message.sender?.toString(),
          );
          const senderName = sender?.name || "Someone";
          const senderPic = sender?.profilePic || null;
          // duplicate avoid karo — same id wala toast mat dikhao
          setNewMsgs((prev) => {
            if (prev.some((m) => m.id === msgId)) return prev;
            const newMsg = {
              id: msgId,
              senderName,
              senderPic,
              text: message.text || "New message",
              time: new Date().toISOString(),
              senderId: message.sender,
            };
            return [newMsg, ...prev].slice(0, 5);
          });
          setUnreadTotal((p) => p + 1);
          return users; // state change nahi
        });
        // refresh convs
        setTimeout(() => {
          axios
            .get(`${API}/messages/conversations/${user._id}`)
            .then((res) => {
              const map = {};
              let total = 0;
              (res.data?.conversations || []).forEach((c) => {
                if (c.user?.id) {
                  map[c.user.id.toString()] = c;
                  total += c.unread || 0;
                }
              });
              setConvs(map);
              setUnreadTotal(total);
            })
            .catch(() => {});
        }, 300);
      });
      return () => s.disconnect();
    } catch {}
  }, [user._id]);

  const dismiss = (id) => setNewMsgs((p) => p.filter((m) => m.id !== id));
  const initials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  const avatarColors = [
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-amber-100 text-amber-700",
    "bg-pink-100 text-pink-700",
  ];

  // recent conversations from convs
  const recentConvs = Object.entries(convs)
    .filter(([, c]) => c.lastMessage)
    .sort(([, a], [, b]) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const router = useRouter();
  const goToChat = () => router.push("/chatMain");

  // 10 second baad automatically toast dismiss karo
  useEffect(() => {
    if (newMsgs.length === 0) return;
    const timers = newMsgs.map((msg) =>
      setTimeout(() => dismiss(msg.id), 10000),
    );
    return () => timers.forEach(clearTimeout);
  }, [newMsgs]);

  return (
    <div className="mt-6">
      {/* Toast notifications — fixed top-right, 300px width, auto dismiss 10s */}
      {newMsgs.length > 0 && (
        <div
          className="fixed top-4 right-4 z-[9999] flex flex-col gap-2"
          style={{ width: 300 }}
        >
          {newMsgs.map((msg, i) => (
            <div
              key={`toast_${msg.id}_${i}`}
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
              style={{ animation: "slideInRight 0.3s ease", width: 300 }}
            >
              {/* progress bar — 10s mein khatam */}
              <div style={{ height: 3, background: "#ede9fe" }}>
                <div
                  style={{
                    height: "100%",
                    background: "#7c3aed",
                    animation: "shrink 10s linear forwards",
                    transformOrigin: "left",
                  }}
                />
              </div>
              <div className="p-3 flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden ${avatarColors[i % avatarColors.length]}`}
                >
                  {msg.senderPic ? (
                    <img
                      src={`http://localhost:5000/${msg.senderPic}`}
                      className="w-full h-full rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    initials(msg.senderName)
                  )}
                </div>
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    dismiss(msg.id);
                    goToChat();
                  }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold text-gray-800">
                      {msg.senderName}
                    </p>
                    <span className="text-xs text-gray-400 ml-2 shrink-0">
                      now
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {msg.text}
                  </p>
                  <p className="text-xs text-purple-600 font-semibold mt-1">
                    Tap to reply →
                  </p>
                </div>
                <button
                  onClick={() => dismiss(msg.id)}
                  className="text-gray-300 hover:text-gray-500 shrink-0 mt-0.5"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent messages card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-700">
              Recent Messages
            </h2>
            {unreadTotal > 0 && (
              <span className="bg-purple-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {unreadTotal}
              </span>
            )}
          </div>
          <button
            onClick={goToChat}
            className="text-xs text-purple-600 font-semibold hover:underline"
          >
            Open Messages →
          </button>
        </div>

        {recentConvs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mb-2 text-gray-300"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-sm">Koi message nahi hai abhi</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentConvs.map(([userId, conv], i) => {
              const u = allUsers.find((u) => u._id?.toString() === userId);
              return (
                <button
                  key={userId}
                  onClick={goToChat}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 transition"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 overflow-hidden ${avatarColors[i % avatarColors.length]}`}
                  >
                    {u?.profilePic ? (
                      <img
                        src={`http://localhost:5000/${u.profilePic}`}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      initials(u?.name || conv.user?.name || "?")
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {u?.name || conv.user?.name || "Unknown"}
                      </p>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {fmtTime(conv.updatedAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {conv.lastMessage?.text || "Tap to chat"}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-purple-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 1 — DASHBOARD
// ═════════════════════════════════════════════════════════════
function Dashboard({ onNavigate }) {
  const user = getUser();
  const [attData, setAttData] = useState([]);
  const [exams, setExams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const userRes = await axios.get(`${API}/users`);
        const loginUser = userRes.data.find?.((u) => u._id === user._id);
        const dept = loginUser?.departments?.[0];
        const sem = loginUser?.semester;

        if (dept && sem) {
          const courseRes = await axios.get(`${API}/course`);
          const course = courseRes.data.find((c) => c.name === dept);
          const semData = course?.semesters?.find(
            (s) => String(s.semester) === String(sem),
          );
          const subList = semData?.subjects || [];

          const attResults = await Promise.allSettled(
            subList.map((sub) =>
              axios
                .get(`${API}/attendance-record/student`, {
                  params: { userId: user._id, subjectId: sub.name },
                })
                .then((r) => ({
                  subject: sub.name,
                  summary: r.data?.summary || {},
                }))
                .catch(() => ({ subject: sub.name, summary: {} })),
            ),
          );
          setAttData(
            attResults.map((r) =>
              r.status === "fulfilled" ? r.value : { subject: "", summary: {} },
            ),
          );
        }

        const examRes = await axios
          .get(`${API}/exam-timetable`)
          .catch(() => ({ data: [] }));
        const allExams = (examRes.data || []).flatMap((t) =>
          (t.timetable || []).map((row) => ({
            ...row,
            courseName: t.course?.name,
          })),
        );
        setExams(allExams.slice(0, 3));

        const annRes = await axios
          .get(`${API}/announcements/all`)
          .catch(() => ({ data: [] }));
        setAnnouncements((annRes.data || []).slice(0, 4));

        const userId = user._id || user.id;
        if (userId) {
          const feeRes = await axios
            .get(`${API}/fees/user/${userId}`)
            .catch(() => ({ data: [] }));
          setFees(feeRes.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loader />;

  const totalPaid = fees.reduce((a, f) => a + Number(f.amount || 0), 0);
  const installmentsPaid = [1, 2, 3].filter((n) =>
    fees.some((f) => f.installment === n),
  ).length;
  const avgAtt =
    attData.length > 0
      ? Math.round(
          attData.reduce((a, d) => a + (d.summary?.percentage || 0), 0) /
            attData.length,
        )
      : 0;
  const annTypeColor = {
    Holiday: "green",
    Exam: "blue",
    Workshop: "purple",
    Seminar: "blue",
    Notice: "amber",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0] || "Student"} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {user?.departments?.[0]} · Semester {user?.semester} · Roll No:{" "}
          {user?.rollNo}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Avg Attendance"
          value={`${avgAtt}%`}
          sub={avgAtt < 75 ? "Below 75% target" : "Good standing"}
          subColor={avgAtt < 75 ? "text-amber-500" : "text-green-600"}
        />
        <StatCard
          label="Upcoming Exams"
          value={exams.length}
          sub="From timetable"
        />
        <StatCard
          label="Fees Paid"
          value={`${installmentsPaid} / 3`}
          sub="Installments"
        />
        <StatCard
          label="Total Paid"
          value={`Rs ${totalPaid.toLocaleString()}`}
          subColor="text-green-600"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Subject Attendance
          </h2>
          {attData.length === 0 ? (
            <p className="text-sm text-gray-400">
              No attendance records found.
            </p>
          ) : (
            attData.map((d) => (
              <div
                key={d.subject}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-sm text-gray-700">{d.subject}</span>
                <AttBar pct={d.summary?.percentage || 0} />
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Upcoming Exams
          </h2>
          {exams.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming exams found.</p>
          ) : (
            exams.map((e, i) => {
              const days = daysFromToday(e.date);
              const dl = dayLabel(days);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {e.subject}
                    </p>
                    <p className="text-xs text-gray-400">
                      {e.date ? fmtDate(e.date) : "—"}
                      {e.time ? ` · ${e.time}` : ""}
                      {e.room ? ` · ${e.room}` : ""}
                    </p>
                  </div>
                  {dl && <Tag color={dl.color}>{dl.text}</Tag>}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Recent Announcements
          </h2>
          {announcements.length === 0 ? (
            <p className="text-sm text-gray-400">No announcements yet.</p>
          ) : (
            announcements.map((a) => (
              <div
                key={a._id}
                className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0 gap-2"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {a.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.type} · {fmtDate(a.startDate || a.createdAt)}
                  </p>
                </div>
                <Tag color={annTypeColor[a.type] || "gray"}>{a.type}</Tag>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Fee Summary
          </h2>
          {[1, 2, 3].map((n) => {
            const f = fees.find((x) => x.installment === n);
            return (
              <div
                key={n}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <span className="text-sm text-gray-700">Installment {n}</span>
                <div className="flex items-center gap-3">
                  {f && (
                    <span className="text-sm font-semibold text-gray-800">
                      Rs {Number(f.amount).toLocaleString()}
                    </span>
                  )}
                  <Tag color={f ? "green" : "amber"}>
                    {f ? "Paid" : "Pending"}
                  </Tag>
                </div>
              </div>
            );
          })}
          <p className="text-sm text-gray-400 mt-3">
            Total paid:{" "}
            <strong className="text-gray-700">
              Rs {totalPaid.toLocaleString()}
            </strong>
          </p>
        </div>
      </div>

      {/* ── LIVE MESSAGES WIDGET ── */}
      <LiveMessagesWidget onNavigate={onNavigate} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 2 — ATTENDANCE
// ═════════════════════════════════════════════════════════════
function Attendance() {
  const user = getUser();
  const [attData, setAttData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userRes = await axios.get(`${API}/users`);
      const loginUser = userRes.data.find?.((u) => u._id === user._id);
      const dept = loginUser?.departments?.[0];
      const sem = loginUser?.semester;
      const courseRes = await axios.get(`${API}/course`);
      const course = courseRes.data.find((c) => c.name === dept);
      const semData = course?.semesters?.find(
        (s) => String(s.semester) === String(sem),
      );
      const subList = semData?.subjects || [];

      const results = await Promise.allSettled(
        subList.map((sub) =>
          axios
            .get(`${API}/attendance-record/student`, {
              params: { userId: user._id, subjectId: sub.name },
            })
            .then((r) => ({
              subject: sub.name,
              summary: r.data?.summary || {},
              records: r.data?.data || [],
            }))
            .catch(() => ({ subject: sub.name, summary: {}, records: [] })),
        ),
      );
      setAttData(
        results.map((r) =>
          r.status === "fulfilled"
            ? r.value
            : { subject: "", summary: {}, records: [] },
        ),
      );
    } catch {
      setError("Attendance data load nahi ho saka.");
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loader />;
  if (error) return <ErrorBox msg={error} onRetry={fetchData} />;

  const avgAtt =
    attData.length > 0
      ? Math.round(
          attData.reduce((a, d) => a + (d.summary?.percentage || 0), 0) /
            attData.length,
        )
      : 0;
  const lowCount = attData.filter(
    (d) => (d.summary?.percentage || 0) < 75,
  ).length;
  const best =
    attData.length > 0
      ? Math.max(...attData.map((d) => d.summary?.percentage || 0))
      : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Attendance Tracker
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Avg Attendance" value={`${avgAtt}%`} />
        <StatCard label="Subjects" value={attData.length} />
        <StatCard
          label="Low Attendance"
          value={lowCount}
          sub="Below 75%"
          subColor="text-red-500"
        />
        <StatCard
          label="Best Subject"
          value={`${best}%`}
          subColor="text-green-600"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Subject-wise Attendance
        </h2>
        {attData.length === 0 ? (
          <p className="text-sm text-gray-400">No records found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="text-left pb-3">Subject</th>
                <th className="text-center pb-3">Present</th>
                <th className="text-center pb-3">Total</th>
                <th className="text-center pb-3">Absent</th>
                <th className="text-right pb-3">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attData.map((d) => (
                <tr
                  key={d.subject}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="py-3 text-gray-800 font-medium">
                    {d.subject}
                  </td>
                  <td className="py-3 text-center text-green-600 font-semibold">
                    {d.summary?.present || 0}
                  </td>
                  <td className="py-3 text-center text-gray-500">
                    {d.summary?.total || 0}
                  </td>
                  <td className="py-3 text-center text-red-500">
                    {d.summary?.absent || 0}
                  </td>
                  <td className="py-3 text-right">
                    <AttBar pct={d.summary?.percentage || 0} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {attData
        .filter((d) => (d.summary?.percentage || 0) < 75)
        .map((d) => {
          const needed = Math.max(
            0,
            Math.ceil(
              (0.75 * (d.summary?.total || 0) - (d.summary?.present || 0)) /
                0.25,
            ),
          );
          return (
            <div
              key={d.subject}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3"
            >
              <p className="text-sm font-semibold text-red-700 mb-1">
                ⚠️ Low Attendance — {d.subject}
              </p>
              <p className="text-sm text-red-600">
                Current: {d.summary?.percentage || 0}%. Attend at least{" "}
                <strong>{needed}</strong> more consecutive classes to reach 75%.
              </p>
            </div>
          );
        })}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 3 — SCHEDULE
// ═════════════════════════════════════════════════════════════
const SLOT_COLORS = [
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-red-100 text-red-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
  "bg-indigo-100 text-indigo-700",
];

function Schedule() {
  const user = getUser();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/schedule`);
      const formatted = (res.data || []).map((t) => ({
        courseName: t.courseId?.name || t.courseId,
        semester: t.semester,
        timetable: t.timetable || [],
        subjects: t.subjects || [],
      }));
      setTimetables(formatted);
      const dept = user?.departments?.[0];
      const match = formatted.find((f) => f.courseName === dept);
      setSelectedCourse(
        match ? match.courseName : formatted[0]?.courseName || "",
      );
    } catch {
      setError("Schedule load nahi ho saka.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loader />;
  if (error) return <ErrorBox msg={error} onRetry={fetchData} />;

  const courses = [...new Set(timetables.map((t) => t.courseName))];
  const filtered = timetables.filter((t) => t.courseName === selectedCourse);

  const getSlotColor = (subjectName, subjects) => {
    if (!subjectName || subjectName === "--") return "bg-gray-50 text-gray-300";
    const idx = subjects.findIndex((s) => s.name === subjectName);
    return SLOT_COLORS[(idx >= 0 ? idx : 0) % SLOT_COLORS.length];
  };

  const getSlots = (timetable) => {
    if (!timetable?.length) return [];
    return Object.keys(timetable[0]).filter((k) => k !== "day");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Weekly Schedule</h1>
      <p className="text-sm text-gray-400 mb-6">
        Course ka timetable dekhne ke liye select karo
      </p>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none"
        >
          {courses.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {selectedCourse && (
          <button
            onClick={() => setSelectedCourse("")}
            className="px-4 py-2.5 bg-red-100 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-200 transition"
          >
            Reset
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">Koi timetable nahi mila.</p>
      ) : (
        filtered.map((t, idx) => {
          const slots = getSlots(t.timetable);
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6"
            >
              <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700">
                  {t.courseName} — Semester {t.semester}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Day
                      </th>
                      {slots.map((s) => (
                        <th
                          key={s}
                          className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          {s}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.timetable.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-semibold text-gray-700">
                          {row.day}
                        </td>
                        {slots.map((s) => (
                          <td key={s} className="px-5 py-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${getSlotColor(row[s], t.subjects)}`}
                            >
                              {row[s] || "—"}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 4 — RECORDED LECTURES
// ═════════════════════════════════════════════════════════════
function RecordedLectures() {
  const user = getUser();
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [attMap, setAttMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [deptSem, setDeptSem] = useState({ dept: "", sem: "" });

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const userRes = await axios.get(`${API}/users`);
        const loginUser = userRes.data.find?.((u) => u._id === user._id);
        const dept = loginUser?.departments?.[0];
        const sem = loginUser?.semester;
        setDeptSem({ dept, sem });
        const courseRes = await axios.get(`${API}/course`);
        const course = courseRes.data.find((c) => c.name === dept);
        const semData = course?.semesters?.find(
          (s) => String(s.semester) === String(sem),
        );
        const subList = semData?.subjects || [];
        setSubjects(subList);

        const results = await Promise.allSettled(
          subList.map((sub) =>
            axios
              .get(`${API}/attendance-record/student`, {
                params: { userId: user._id, subjectId: sub.name },
              })
              .then((r) => ({ subName: sub.name, records: r.data?.data || [] }))
              .catch(() => ({ subName: sub.name, records: [] })),
          ),
        );
        const map = {};
        results.forEach((r) => {
          if (r.status === "fulfilled") map[r.value.subName] = r.value.records;
        });
        setAttMap(map);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const openSubject = async (subName) => {
    setSelected(subName);
    setLecLoading(true);
    try {
      const res = await axios.get(`${API}/lectures`, {
        params: {
          department: deptSem.dept,
          semester: deptSem.sem,
          subject: subName,
        },
      });
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.lectures || [];
      setLectures(data.filter((l) => String(l.subject) === String(subName)));
    } catch {
      setLectures([]);
    } finally {
      setLecLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (selected) {
    const records = attMap[selected] || [];
    const dateStatus = {};
    records.forEach((r) => {
      if (r.date) dateStatus[r.date] = r.status;
    });

    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-6 transition"
        >
          ← Back to Subjects
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{selected}</h1>
        <p className="text-sm text-gray-400 mb-6">
          {lectures.length} lecture(s) found
        </p>

        {lecLoading ? (
          <Loader />
        ) : lectures.length === 0 ? (
          <p className="text-sm text-gray-400">
            Koi recorded lecture nahi mila.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {lectures.map((lec) => {
              const lecDate = lec.date?.includes("T")
                ? lec.date.split("T")[0]
                : lec.date;
              const status = lecDate ? dateStatus[lecDate] : null;
              const isAbsent = status === "Absent";
              const isPresent = status === "Present";
              const ytMatch = lec.youtubeUrl?.match(
                /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/,
              );
              const ytId = ytMatch?.[1];

              return (
                <div
                  key={lec._id}
                  className={`bg-white rounded-xl border shadow-sm p-5 relative overflow-hidden ${isAbsent ? "border-red-300" : "border-gray-200"}`}
                >
                  <span
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                    style={{
                      background: isAbsent
                        ? "#ef4444"
                        : isPresent
                          ? "#22c55e"
                          : "#e5e7eb",
                    }}
                  />
                  <div className="flex items-start justify-between mb-3 pl-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {lec.lectureTitle || "Untitled Lecture"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {lec.date ? fmtDate(lec.date) : "No date"}
                      </p>
                    </div>
                    {status && (
                      <Tag color={isAbsent ? "red" : "green"}>{status}</Tag>
                    )}
                  </div>
                  {lec.summaryGeneratedByAI && (
                    <div className="pl-2 mb-2">
                      <Tag color="purple">✦ AI Summary</Tag>
                    </div>
                  )}
                  {lec.summary?.trim() && (
                    <p className="text-xs text-gray-500 leading-relaxed pl-2 mb-3 line-clamp-3">
                      {lec.summary}
                    </p>
                  )}
                  {ytId && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${ytId}`}
                        title={lec.lectureTitle}
                        allowFullScreen
                      />
                    </div>
                  )}
                  {lec.videoFile && (
                    <video
                      controls
                      className="w-full mt-3 rounded-xl max-h-52 bg-black"
                      src={`http://localhost:5000/${lec.videoFile}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Recorded Lectures
      </h1>
      <div className="flex flex-col gap-4">
        {subjects.map((sub, i) => {
          const records = attMap[sub.name] || [];
          const todayStatus =
            records.find((r) => r.date === today)?.status || null;
          const absentCount = records.filter(
            (r) => r.status === "Absent",
          ).length;
          return (
            <div
              key={i}
              onClick={() => openSubject(sub.name)}
              className={`bg-white rounded-xl border-2 shadow-sm p-5 flex items-center justify-between cursor-pointer hover:shadow-md transition ${todayStatus === "Absent" ? "border-red-300" : todayStatus === "Present" ? "border-green-300" : "border-gray-200"}`}
            >
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {sub.name}
                </h3>
                {todayStatus === "Absent" && (
                  <p className="text-xs text-red-500 mt-0.5">
                    ⚠️ Aaj absent the — missed lecture dekho
                  </p>
                )}
                {todayStatus === "Present" && (
                  <p className="text-xs text-green-600 mt-0.5">
                    ✅ Aaj present the
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {absentCount > 0 && (
                  <div className="flex flex-col items-center bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
                    <span className="text-base font-bold text-red-500">
                      {absentCount}
                    </span>
                    <span className="text-xs text-red-400">Absent</span>
                  </div>
                )}
                <span className="text-sm text-gray-400 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50">
                  View →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 5 — EXAMS
// ═════════════════════════════════════════════════════════════
function Exams() {
  const user = getUser();
  const [courses, setCourses] = useState([]);
  const [allTimetables, setAllTimetables] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [cRes, tRes] = await Promise.all([
          axios.get(`${API}/course`),
          axios.get(`${API}/exam-timetable`),
        ]);
        setCourses(cRes.data || []);
        const tables = tRes.data || [];
        setAllTimetables(tables);
        const merged = tables.flatMap((t) =>
          (t.timetable || []).map((row) => ({
            ...row,
            courseId: t.course?._id,
            courseName: t.course?.name,
            semester: t.semester,
          })),
        );
        const dept = user?.departments?.[0];
        const matchCourse = cRes.data?.find((c) => c.name === dept);
        if (matchCourse) {
          setSelectedCourse(matchCourse._id);
          const filtered = tables
            .filter((t) => t.course?._id === matchCourse._id)
            .flatMap((t) =>
              (t.timetable || []).map((row) => ({
                ...row,
                courseId: t.course?._id,
                courseName: t.course?.name,
                semester: t.semester,
              })),
            );
          setTimetable(filtered);
        } else {
          setTimetable(merged);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedSemester("");
    if (!courseId) {
      setTimetable(
        allTimetables.flatMap((t) =>
          (t.timetable || []).map((row) => ({
            ...row,
            courseId: t.course?._id,
            courseName: t.course?.name,
            semester: t.semester,
          })),
        ),
      );
      return;
    }
    setTimetable(
      allTimetables
        .filter((t) => t.course?._id === courseId)
        .flatMap((t) =>
          (t.timetable || []).map((row) => ({
            ...row,
            courseId: t.course?._id,
            courseName: t.course?.name,
            semester: t.semester,
          })),
        ),
    );
  };

  const handleSemesterSelect = (sem) => {
    setSelectedSemester(sem);
    setTimetable(
      allTimetables
        .filter(
          (t) =>
            t.course?._id === selectedCourse &&
            String(t.semester) === String(sem),
        )
        .flatMap((t) =>
          (t.timetable || []).map((row) => ({
            ...row,
            courseId: t.course?._id,
            courseName: t.course?.name,
            semester: t.semester,
          })),
        ),
    );
  };

  const grouped = timetable.reduce((acc, item) => {
    const key = `${item.courseName} — Semester ${item.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Exam Timetable</h1>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => handleCourseSelect(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => handleSemesterSelect(e.target.value)}
            disabled={!selectedCourse}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none disabled:opacity-50"
          >
            <option value="">All Semesters</option>
            {selectedCourse &&
              courses
                .find((c) => c._id === selectedCourse)
                ?.semesters?.map((s) => (
                  <option key={s.semester} value={s.semester}>
                    Semester {s.semester}
                  </option>
                ))}
          </select>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-gray-400">Koi exam timetable nahi mila.</p>
      ) : (
        Object.entries(grouped).map(([group, rows]) => (
          <div
            key={group}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6"
          >
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-purple-700">{group}</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Subject</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Time</th>
                  <th className="px-5 py-3 text-left">Room</th>
                  <th className="px-5 py-3 text-right">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e, i) => {
                  const days = daysFromToday(e.date);
                  const dl = dayLabel(days);
                  return (
                    <tr
                      key={i}
                      className="border-t border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-5 py-3 font-semibold text-gray-800">
                        {e.subject}
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {e.date ? fmtDate(e.date) : "—"}
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {e.time || "—"}
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {e.room || "—"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {dl ? <Tag color={dl.color}>{dl.text}</Tag> : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 6 — MY FEES
// ═════════════════════════════════════════════════════════════
function MyFees() {
  const user = getUser();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  const fetchFees = useCallback(async () => {
    setLoading(true);
    setError(null);
    const userId = user._id || user.id;
    if (!userId) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API}/fees/user/${userId}`);
      setFees(res.data || []);
    } catch {
      setError("Fee records load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  if (loading) return <Loader />;
  if (error) return <ErrorBox msg={error} onRetry={fetchFees} />;

  const totalPaid = fees.reduce((a, f) => a + Number(f.amount || 0), 0);
  const installmentsPaid = [1, 2, 3].filter((n) =>
    fees.some((f) => f.installment === n),
  ).length;
  const filtered =
    filter === "All"
      ? fees
      : fees.filter((f) => f.installment === Number(filter));
  const methodIcon = { Cash: "💵", UPI: "📱", Online: "🏦" };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Fees</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Paid"
          value={`Rs ${totalPaid.toLocaleString()}`}
          subColor="text-green-600"
        />
        <StatCard label="Installments Paid" value={`${installmentsPaid} / 3`} />
        <StatCard label="Transactions" value={fees.length} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Installment Status
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => {
            const paid = fees.some((f) => f.installment === n);
            return (
              <div
                key={n}
                className={`rounded-xl p-4 text-center border-2 ${paid ? "bg-green-50 border-green-300 text-green-700" : "bg-gray-50 border-gray-200 text-gray-400"}`}
              >
                <div className="text-2xl mb-1">{paid ? "✅" : "⏳"}</div>
                <p className="text-sm font-semibold">Installment {n}</p>
                <p className="text-xs mt-0.5">{paid ? "Paid" : "Pending"}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {["All", 1, 2, 3].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-1.5 text-xs font-semibold border rounded-full transition ${filter === item ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            {item === "All"
              ? "All Records"
              : `Installment ${item} (${fees.filter((f) => f.installment === item).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 text-left">Installment</th>
              <th className="px-5 py-3 text-left">Amount</th>
              <th className="px-5 py-3 text-left">Method</th>
              <th className="px-5 py-3 text-left">Transaction ID</th>
              <th className="px-5 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((f) => (
                <tr
                  key={f._id}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="px-5 py-3">
                    <Tag color="purple">Installment {f.installment}</Tag>
                  </td>
                  <td className="px-5 py-3 font-semibold text-green-600">
                    Rs {Number(f.amount).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {methodIcon[f.paymentMethod] || ""} {f.paymentMethod}
                  </td>
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">
                    {f.paymentName || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {fmtDate(f.feeDate)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 7 — ANNOUNCEMENTS
// ═════════════════════════════════════════════════════════════
function Announcements() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/announcements/all`);
      setList(res.data || []);
    } catch {
      setError("Announcements load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loader />;
  if (error) return <ErrorBox msg={error} onRetry={fetchData} />;

  const types = ["All", ...new Set(list.map((a) => a.type).filter(Boolean))];
  const filtered =
    typeFilter === "All" ? list : list.filter((a) => a.type === typeFilter);
  const annTypeColor = {
    Holiday: "green",
    Exam: "blue",
    Workshop: "purple",
    Seminar: "blue",
    Notice: "amber",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Announcements</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-1.5 text-xs font-semibold border rounded-full transition ${typeFilter === t ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">Koi announcement nahi mila.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Tag color={annTypeColor[a.type] || "gray"}>{a.type}</Tag>
                <span className="text-xs text-gray-400">
                  {fmtDate(a.startDate || a.createdAt)}
                </span>
                {a.department && (
                  <span className="text-xs text-gray-400">
                    · {a.department}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {a.title}
              </p>
              <p className="text-sm text-gray-500">{a.description}</p>
              {a.file && (
                <a
                  href={`http://localhost:5000/uploads/${a.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-purple-600 underline mt-2 inline-block"
                >
                  View Attachment
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 8 — JOBS
// ═════════════════════════════════════════════════════════════
function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/jobs/all`);
      setJobs(res.data || []);
    } catch {
      setError("Jobs load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (loading) return <Loader />;
  if (error) return <ErrorBox msg={error} onRetry={fetchJobs} />;

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `${j.title} ${j.company} ${j.skills} ${j.location}`
        .toLowerCase()
        .includes(q);
    const matchType =
      typeFilter === "All" ||
      j.type?.toLowerCase() === typeFilter.toLowerCase();
    const matchMode =
      modeFilter === "All" ||
      j.mode?.toLowerCase() === modeFilter.toLowerCase();
    return matchSearch && matchType && matchMode;
  });

  const modeColor = { Remote: "green", Hybrid: "blue", "On-site": "amber" };
  const typeColor = {
    Internship: "purple",
    "Full Time": "red",
    "Part Time": "gray",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Internship & Job Opportunities
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Listings" value={jobs.length} />
        <StatCard
          label="Internships"
          value={
            jobs.filter((j) => j.type?.toLowerCase() === "internship").length
          }
        />
        <StatCard
          label="Full Time"
          value={
            jobs.filter((j) => j.type?.toLowerCase() === "full time").length
          }
        />
        <StatCard
          label="Remote"
          value={jobs.filter((j) => j.mode?.toLowerCase() === "remote").length}
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 flex-1 min-w-[200px]">
          <svg
            className="w-4 h-4 text-gray-400 mr-2 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, company, skills..."
            className="w-full py-2.5 text-sm outline-none bg-transparent text-gray-700"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none"
        >
          <option>All</option>
          <option>Internship</option>
          <option>Full Time</option>
          <option>Part Time</option>
        </select>
        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none"
        >
          <option>All</option>
          <option>Remote</option>
          <option>Hybrid</option>
          <option>On-site</option>
        </select>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        Showing {filtered.length} of {jobs.length} listings
      </p>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">Koi job nahi mila.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-0.5">
                {job.title}
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                {job.company} · {job.location}
              </p>
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {job.type && (
                  <Tag color={typeColor[job.type] || "gray"}>{job.type}</Tag>
                )}
                {job.mode && (
                  <Tag color={modeColor[job.mode] || "gray"}>{job.mode}</Tag>
                )}
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                {job.salary && (
                  <p>
                    <span className="font-medium text-gray-700">Salary:</span>{" "}
                    {job.salary}
                  </p>
                )}
                {job.skills && (
                  <p>
                    <span className="font-medium text-gray-700">Skills:</span>{" "}
                    {job.skills}
                  </p>
                )}
                {job.cgpa && (
                  <p>
                    <span className="font-medium text-gray-700">CGPA:</span>{" "}
                    {job.cgpa}
                  </p>
                )}
                {job.openings && (
                  <p>
                    <span className="font-medium text-gray-700">Openings:</span>{" "}
                    {job.openings}
                  </p>
                )}
                {job.deadline && (
                  <p>
                    <span className="font-medium text-gray-700">Deadline:</span>{" "}
                    {job.deadline}
                  </p>
                )}
                {job.email && (
                  <p>
                    <span className="font-medium text-gray-700">Contact:</span>{" "}
                    {job.email}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 9 — MESSAGES (Full TalkifyChat)
// ═════════════════════════════════════════════════════════════

// ── Chat helpers ─────────────────────────────────────────
const ChatAvatar = ({ src, name, size = 40, online }) => (
  <div style={{ position: "relative", flexShrink: 0 }}>
    {src ? (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    ) : (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `hsl(${((name?.charCodeAt(0) || 65) * 5) % 360},55%,50%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: size * 0.38,
        }}
      >
        {name?.[0]?.toUpperCase() || "?"}
      </div>
    )}
    {online !== undefined && (
      <span
        style={{
          position: "absolute",
          bottom: 1,
          right: 1,
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: "50%",
          background: online ? "#25D366" : "#aaa",
          border: "2px solid #111b21",
        }}
      />
    )}
  </div>
);

const StatusTick = ({ status, light }) => {
  const col = light ? "rgba(255,255,255,0.85)" : "#8696a0";
  if (status === "read")
    return (
      <span style={{ color: "#53bdeb", fontSize: 13, fontWeight: 700 }}>
        ✓✓
      </span>
    );
  if (status === "delivered")
    return <span style={{ color: col, fontSize: 13 }}>✓✓</span>;
  return <span style={{ color: col, fontSize: 13 }}>✓</span>;
};

const TextBubble = ({ msg, isMine, prevSame }) => {
  const br = isMine
    ? prevSame
      ? "8px"
      : "8px 0 8px 8px"
    : prevSame
      ? "8px"
      : "0 8px 8px 8px";
  const time = fmtTime(msg.createdAt);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        marginBottom: prevSame ? 1 : 6,
      }}
    >
      <div
        style={{
          maxWidth: "65%",
          padding: "7px 12px 6px",
          borderRadius: br,
          background: isMine ? "#005c4b" : "#202c33",
          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        <p
          style={{
            fontSize: 14.5,
            lineHeight: 1.5,
            wordBreak: "break-word",
            color: "#e9edef",
            whiteSpace: "pre-line",
          }}
        >
          {msg.text}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            justifyContent: "flex-end",
            marginTop: 2,
          }}
        >
          <span style={{ fontSize: 11, color: "#8696a0" }}>{time}</span>
          {isMine && <StatusTick status={msg.status} />}
        </div>
      </div>
    </div>
  );
};

function Messages({ onNavigate }) {
  const user = getUser();
  const [allUsers, setAllUsers] = useState([]);
  const [conversations, setConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showEmoji, setShowEmoji] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimer = useRef(null);

  // load users
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/users`);
        const users = res.data?.users || res.data || [];
        setAllUsers(users.filter((u) => u._id !== user._id));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  const loadConvs = useCallback(async () => {
    if (!user._id) return;
    try {
      const res = await axios.get(`${API}/messages/conversations/${user._id}`);
      const map = {};
      (res.data?.conversations || []).forEach((c) => {
        if (c.user?.id) map[c.user.id.toString()] = c;
      });
      setConversations(map);
    } catch {}
  }, [user._id]);

  useEffect(() => {
    loadConvs();
  }, [loadConvs]);

  // socket
  useEffect(() => {
    if (!user._id) return;
    let s;
    try {
      const { io } = require("socket.io-client");
      s = io(SOCKET_URL, { transports: ["websocket"] });
      setSocket(s);
      s.emit("user:join", user._id);
      s.on("user:online", ({ userId }) =>
        setOnlineUsers((p) => new Set([...p, userId])),
      );
      s.on("user:offline", ({ userId }) =>
        setOnlineUsers((p) => {
          const n = new Set(p);
          n.delete(userId);
          return n;
        }),
      );
      s.on("typing:start", ({ userId }) =>
        setTypingUsers((p) => new Set([...p, userId])),
      );
      s.on("typing:stop", ({ userId }) =>
        setTypingUsers((p) => {
          const n = new Set(p);
          n.delete(userId);
          return n;
        }),
      );
      s.on("message:receive", ({ message }) => {
        setSelectedUser((sel) => {
          if (sel && message.sender?.toString() === sel._id?.toString()) {
            setMessages((prev) =>
              prev.find((m) => m._id === message._id)
                ? prev
                : [...prev, message],
            );
            axios
              .put(`${API}/messages/read/${user._id}/${sel._id}`)
              .catch(() => {});
            s.emit("message:read", {
              messageId: message._id,
              userId: user._id,
            });
          }
          return sel;
        });
        loadConvs();
      });
      s.on("message:sent", ({ message }) => {
        setMessages((prev) => {
          const i = prev.findIndex(
            (m) => m._tempId && m._tempId === message._tempId,
          );
          if (i !== -1) {
            const u = [...prev];
            u[i] = { ...message };
            return u;
          }
          return prev;
        });
        loadConvs();
      });
      s.on("message:read", ({ messageId }) =>
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, status: "read" } : m)),
        ),
      );
    } catch (e) {
      console.error("Socket error:", e);
    }
    return () => s?.disconnect();
  }, [user._id, loadConvs]);

  // load messages on select
  useEffect(() => {
    if (!selectedUser || !user._id) return;
    (async () => {
      setMsgLoading(true);
      try {
        const res = await axios.get(
          `${API}/messages/${user._id}/${selectedUser._id}`,
        );
        setMessages(res.data?.messages || []);
        await axios
          .put(`${API}/messages/read/${user._id}/${selectedUser._id}`)
          .catch(() => {});
        loadConvs();
      } catch {
        setMessages([]);
      }
      setMsgLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    })();
  }, [selectedUser, user._id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = () => {
    const val = inputText.trim();
    if (!val || !selectedUser || !socket) return;
    const tempId = `temp_${Date.now()}`;
    setMessages((p) => [
      ...p,
      {
        _id: tempId,
        _tempId: tempId,
        sender: user._id,
        text: val,
        msgType: "text",
        status: "sent",
        createdAt: new Date().toISOString(),
      },
    ]);
    socket.emit("message:send", {
      senderId: user._id,
      receiverId: selectedUser._id,
      text: val,
      messageType: "text",
      _tempId: tempId,
    });
    setInputText("");
    setShowEmoji(false);
    socket.emit("typing:stop", {
      senderId: user._id,
      receiverId: selectedUser._id,
    });
    clearTimeout(typingTimer.current);
  };

  const handleTyping = (e) => {
    setInputText(e.target.value);
    if (!socket || !selectedUser) return;
    socket.emit("typing:start", {
      senderId: user._id,
      receiverId: selectedUser._id,
    });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () =>
        socket.emit("typing:stop", {
          senderId: user._id,
          receiverId: selectedUser._id,
        }),
      1500,
    );
  };

  const filtered = allUsers
    .filter((u) => {
      const ok =
        !searchQuery ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const c = conversations[u._id?.toString()];
      return (
        ok && (activeTab === "all" || (activeTab === "unread" && c?.unread > 0))
      );
    })
    .sort((a, b) => {
      const ca = conversations[a._id?.toString()],
        cb = conversations[b._id?.toString()];
      if (ca && cb) return new Date(cb.updatedAt) - new Date(ca.updatedAt);
      if (ca) return -1;
      if (cb) return 1;
      return a.name?.localeCompare(b.name);
    });

  const isTyping =
    selectedUser && typingUsers.has(selectedUser._id?.toString());
  const isOnline =
    selectedUser && onlineUsers.has(selectedUser._id?.toString());

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#111b21",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #25D366",
            borderTop: "3px solid transparent",
            borderRadius: "50%",
            animation: "spin .8s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        fontFamily: "'DM Sans',sans-serif",
        background: "#111b21",
        overflow: "hidden",
        borderRadius: 16,
        minHeight: 520,
      }}
    >
      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#2a3942;border-radius:4px;}
        .chat-user:hover{background:#2a3942 !important;}
        .chat-user.active{background:#2a3942 !important;}
        .send-btn:hover{background:#1ea952 !important;transform:scale(1.05);}
        .icon-btn-chat:hover{background:#2a3942 !important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .msg-anim{animation:fadeUp .15s ease;}
        .dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#25D366;margin:0 2px;animation:pulse 1.2s infinite;}
        .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      {/* ── SIDEBAR ── */}
      <div
        style={{
          width: 340,
          background: "#111b21",
          borderRight: "1px solid #222d34",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 18px",
            background: "#202c33",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ChatAvatar
              src={user?.profilePic}
              name={user?.name}
              size={38}
              online={true}
            />
            <p style={{ fontWeight: 600, fontSize: 14, color: "#e9edef" }}>
              {user?.name}
            </p>
          </div>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#aebac1"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #222d34",
            padding: "0 14px",
          }}
        >
          {[
            ["all", "All"],
            ["unread", "Unread"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setActiveTab(v)}
              style={{
                padding: "10px 14px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                color: activeTab === v ? "#25D366" : "#8696a0",
                borderBottom:
                  activeTab === v
                    ? "2px solid #25D366"
                    : "2px solid transparent",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ padding: "8px 12px" }}>
          <div
            style={{
              position: "relative",
              background: "#202c33",
              borderRadius: 8,
            }}
          >
            <svg
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8696a0"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              style={{
                width: "100%",
                padding: "9px 10px 9px 34px",
                border: "none",
                background: "transparent",
                fontSize: 13,
                color: "#e9edef",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* User list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 16px",
                color: "#8696a0",
              }}
            >
              <p style={{ fontSize: 28 }}>🔍</p>
              <p style={{ fontSize: 12, marginTop: 6 }}>No users found</p>
            </div>
          ) : (
            filtered.map((u) => {
              const conv = conversations[u._id?.toString()];
              const isActive = selectedUser?._id === u._id;
              return (
                <button
                  key={u._id}
                  className={`chat-user ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedUser(u)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "10px 16px",
                    border: "none",
                    background: isActive ? "#2a3942" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    borderBottom: "1px solid #1a2529",
                  }}
                >
                  <ChatAvatar
                    src={u.profilePic}
                    name={u.name}
                    size={46}
                    online={onlineUsers.has(u._id?.toString())}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#e9edef",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {u.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: conv?.unread > 0 ? "#25D366" : "#8696a0",
                          flexShrink: 0,
                          marginLeft: 4,
                        }}
                      >
                        {conv ? fmtTime(conv.updatedAt) : ""}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "#8696a0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 180,
                        }}
                      >
                        {typingUsers.has(u._id?.toString()) ? (
                          <span style={{ color: "#25D366" }}>typing...</span>
                        ) : conv?.lastMessage ? (
                          conv.lastMessage.text
                        ) : (
                          <span style={{ color: "#566b76", fontSize: 11 }}>
                            Tap to chat
                          </span>
                        )}
                      </span>
                      {conv?.unread > 0 && (
                        <span
                          style={{
                            background: "#25D366",
                            color: "#111b21",
                            borderRadius: 12,
                            padding: "1px 6px",
                            fontSize: 10,
                            fontWeight: 700,
                            flexShrink: 0,
                            minWidth: 18,
                            textAlign: "center",
                          }}
                        >
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#0b141a",
          position: "relative",
        }}
      >
        {/* bg pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
            pointerEvents: "none",
          }}
        />

        {selectedUser ? (
          <>
            {/* Chat header */}
            <div
              style={{
                padding: "10px 18px",
                background: "#202c33",
                display: "flex",
                alignItems: "center",
                gap: 12,
                zIndex: 10,
                borderBottom: "1px solid #222d34",
              }}
            >
              <ChatAvatar
                src={selectedUser.profilePic}
                name={selectedUser.name}
                size={40}
                online={isOnline}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 15, color: "#e9edef" }}>
                  {selectedUser.name}
                </p>
                <p style={{ fontSize: 11 }}>
                  {isTyping ? (
                    <span
                      style={{
                        color: "#25D366",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                      <span style={{ marginLeft: 4 }}>typing</span>
                    </span>
                  ) : isOnline ? (
                    <span style={{ color: "#25D366" }}>online</span>
                  ) : (
                    <span style={{ color: "#8696a0" }}>offline</span>
                  )}
                </p>
              </div>
            </div>

            {/* Messages area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px 48px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                position: "relative",
                zIndex: 1,
              }}
            >
              {msgLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      border: "3px solid #25D366",
                      borderTop: "3px solid transparent",
                      borderRadius: "50%",
                      animation: "spin .8s linear infinite",
                    }}
                  />
                </div>
              ) : messages.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      background: "#182229",
                      padding: "10px 22px",
                      borderRadius: 12,
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: 12, color: "#8696a0" }}>
                      🔒 End-to-end encrypted
                    </p>
                    <p style={{ fontSize: 11, color: "#556b76", marginTop: 4 }}>
                      Say hello to{" "}
                      <strong style={{ color: "#e9edef" }}>
                        {selectedUser.name}
                      </strong>
                      !
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine =
                    msg.sender === user._id || msg.sender?._id === user._id;
                  const showDate =
                    idx === 0 ||
                    new Date(msg.createdAt).toDateString() !==
                      new Date(messages[idx - 1]?.createdAt).toDateString();
                  const prevSame =
                    idx > 0 &&
                    (messages[idx - 1].sender === msg.sender ||
                      messages[idx - 1].sender?._id === msg.sender?._id);
                  return (
                    <div key={msg._id || idx} className="msg-anim">
                      {showDate && (
                        <div style={{ textAlign: "center", margin: "10px 0" }}>
                          <span
                            style={{
                              fontSize: 11,
                              color: "#e9edef",
                              background: "#182229",
                              padding: "4px 12px",
                              borderRadius: 8,
                            }}
                          >
                            {new Date(msg.createdAt).toLocaleDateString([], {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                      <TextBubble
                        msg={msg}
                        isMine={isMine}
                        prevSame={prevSame}
                      />
                    </div>
                  );
                })
              )}
              <div ref={endRef} />
            </div>

            {/* Input bar */}
            <div
              style={{
                padding: "8px 16px",
                background: "#202c33",
                display: "flex",
                alignItems: "center",
                gap: 8,
                zIndex: 10,
              }}
            >
              <div style={{ flex: 1, background: "#2a3942", borderRadius: 22 }}>
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={handleTyping}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    (e.preventDefault(), sendMsg())
                  }
                  placeholder="Type a message"
                  style={{
                    width: "100%",
                    padding: "11px 18px",
                    border: "none",
                    background: "transparent",
                    fontSize: 14,
                    color: "#e9edef",
                    outline: "none",
                    borderRadius: 22,
                  }}
                />
              </div>
              <button
                className="send-btn"
                onClick={sendMsg}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "none",
                  background: "#25D366",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all .2s",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "2px solid #222d34",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#222d34"
                strokeWidth="1.5"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#e9edef",
                  marginBottom: 6,
                }}
              >
                Talkify
              </p>
              <p style={{ fontSize: 13, color: "#8696a0" }}>
                Select a contact to start messaging
              </p>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#8696a0",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8696a0"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              End-to-end encrypted
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 10 — LEAVE
// ═════════════════════════════════════════════════════════════
function Leave() {
  const user = getUser();
  const [approvers, setApprovers] = useState([]);
  const [form, setForm] = useState({
    userName: user?.name || "",
    email: user?.email || "",
    fromDate: "",
    toDate: "",
    leaveType: "",
    approver: "",
    reason: "",
    attachment: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/users`)
      .then((res) => {
        const users = res.data?.users || res.data || [];
        setApprovers(
          users.map(
            (u) =>
              `${u.name} (${u.positions?.[0] || u.departments?.[0] || "Staff"})`,
          ),
        );
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (
      !form.userName ||
      !form.email ||
      !form.leaveType ||
      !form.approver ||
      !form.reason.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (form.reason.length < 24) {
      alert("Reason must be at least 24 characters.");
      return;
    }
    setSubmitting(true);
    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v && k !== "attachment") payload.append(k, v);
    });
    if (form.attachment) payload.append("attachment", form.attachment);
    try {
      await axios.post(`${API}/leave`, payload);
      setSubmitted(true);
    } catch {
      alert("Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setForm({
      userName: user?.name || "",
      email: user?.email || "",
      fromDate: "",
      toDate: "",
      leaveType: "",
      approver: "",
      reason: "",
      attachment: null,
    });
  };

  if (submitted)
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Application Submitted!
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Your leave request has been sent to the approver.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
        >
          Apply Again
        </button>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Apply for Leave</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {[
            ["userName", "Your Name", "text", "Enter your full name"],
            ["email", "Email", "email", "Enter your email"],
          ].map(([name, label, type, ph]) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                placeholder={ph}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400"
              />
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {[
            ["fromDate", "From Date"],
            ["toDate", "To Date"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {label}
              </label>
              <input
                name={name}
                type="date"
                value={form[name]}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400"
              />
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 bg-white"
            >
              <option value="">Select Leave Type</option>
              {[
                "Sick Leave",
                "Casual Leave",
                "Earned Leave",
                "Maternity Leave",
                "Paternity Leave",
                "Emergency Leave",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Approver <span className="text-red-500">*</span>
            </label>
            <select
              name="approver"
              value={form.approver}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 bg-white"
            >
              <option value="">Select Approver</option>
              {approvers.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Attachment (Optional)
          </label>
          <input
            type="file"
            onChange={(e) =>
              setForm((p) => ({ ...p, attachment: e.target.files[0] }))
            }
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="w-full border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Reason for Leave <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={4}
            placeholder="Please provide a detailed reason..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 resize-none"
          />
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-400">Minimum 24 characters</span>
            <span
              className={
                form.reason.length < 24 ? "text-red-500" : "text-green-600"
              }
            >
              {form.reason.length} / 24
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE 11 — ID CARD
// ═════════════════════════════════════════════════════════════
function IDCard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get(`${API}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(res.data);
        } else {
          setUserData(getUser());
        }
      } catch {
        setUserData(getUser());
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <Loader />;
  if (!userData?._id && !userData?.name)
    return <ErrorBox msg="User not found. Please login again." />;

  const u = userData;
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My ID Card</h1>
      <div className="flex justify-center">
        <div className="w-72 bg-white rounded-2xl overflow-hidden border-2 border-purple-600 shadow-xl">
          <div className="bg-purple-900 text-white px-5 py-4 flex items-center justify-between">
            <span className="text-base font-bold">ClassBuzz</span>
            <span className="text-xs opacity-70">Institute ID</span>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start gap-3 mb-4">
              <div className="w-20 h-24 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                {u.profilePic ? (
                  <img
                    src={`http://localhost:5000/${u.profilePic}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-purple-300">
                    {(u.name || "")
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <div className="w-20 h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <rect x="0" y="0" width="18" height="18" fill="#1e1b4b" />
                  <rect x="42" y="0" width="18" height="18" fill="#1e1b4b" />
                  <rect x="0" y="42" width="18" height="18" fill="#1e1b4b" />
                  <rect x="4" y="4" width="10" height="10" fill="white" />
                  <rect x="46" y="4" width="10" height="10" fill="white" />
                  <rect x="4" y="46" width="10" height="10" fill="white" />
                  <rect x="22" y="0" width="4" height="4" fill="#1e1b4b" />
                  <rect x="28" y="6" width="4" height="4" fill="#1e1b4b" />
                  <rect x="22" y="12" width="4" height="4" fill="#1e1b4b" />
                  <rect x="0" y="22" width="4" height="4" fill="#1e1b4b" />
                  <rect x="8" y="28" width="4" height="4" fill="#1e1b4b" />
                  <rect x="22" y="22" width="4" height="4" fill="#1e1b4b" />
                  <rect x="34" y="28" width="4" height="4" fill="#1e1b4b" />
                  <rect x="44" y="22" width="4" height="4" fill="#1e1b4b" />
                  <rect x="50" y="34" width="4" height="4" fill="#1e1b4b" />
                  <rect x="28" y="42" width="4" height="4" fill="#1e1b4b" />
                  <rect x="40" y="50" width="4" height="4" fill="#1e1b4b" />
                  <rect x="52" y="54" width="4" height="4" fill="#1e1b4b" />
                </svg>
              </div>
            </div>
            <p className="text-center text-base font-bold text-purple-900 mb-4">
              {(u.name || "").toUpperCase()}
            </p>
            <div className="space-y-2">
              {[
                ["Email", u.email],
                ["Roll No", u.rollNo],
                ["Department", u.departments?.join(", ")],
                ["Position", u.positions?.join(", ")],
                ["Semester", u.semester],
                ["Gender", u.gender],
                ["Phone", u.phone],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between text-xs border-b border-gray-100 pb-1.5"
                  >
                    <span className="text-gray-400">{k}</span>
                    <span className="text-gray-700 font-semibold text-right max-w-[60%] truncate">
                      {v}
                    </span>
                  </div>
                ))}
            </div>
            <div
              className="mt-4 h-8 rounded"
              style={{
                background:
                  "repeating-linear-gradient(90deg, #1e1b4b 0, #1e1b4b 3px, white 3px, white 6px)",
                opacity: 0.6,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═════════════════════════════════════════════════════════════
export const NAV_PAGES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "attendance", label: "Attendance" },
  { key: "schedule", label: "Schedule" },
  { key: "lectures", label: "Recorded Lectures" },
  { key: "exams", label: "Exams" },
  { key: "fees", label: "My Fees" },
  { key: "announcements", label: "Announcements" },
  { key: "jobs", label: "Jobs" },
  { key: "messages", label: "Messages" },
  { key: "leave", label: "Leave" },
  { key: "idcard", label: "ID Card" },
];

export default function StudentDashboardContent({
  activePage = "dashboard",
  onNavigate,
}) {
  // Messages page — full width with its own layout
  if (activePage === "messages" || activePage === "chatMain") {
    return (
      <div className="ml-[300px] mt-[50px] min-h-screen bg-gray-50">
        <Messages onNavigate={onNavigate} />
      </div>
    );
  }

  const pages = {
    dashboard: <Dashboard onNavigate={onNavigate} />,
    attendance: <Attendance />,
    schedule: <Schedule />,
    lectures: <RecordedLectures />,
    exams: <Exams />,
    fees: <MyFees />,
    announcements: <Announcements />,
    jobs: <Jobs />,
    leave: <Leave />,
    idcard: <IDCard />,
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 ml-[300px] mt-[50px]">
      {pages[activePage] || <Dashboard onNavigate={onNavigate} />}
    </div>
  );
}

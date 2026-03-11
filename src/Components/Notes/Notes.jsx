"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function fileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
}

// ─── Icons ───
const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const DownIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
const LockIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const RefreshIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);
const SearchIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const XIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Password Modal ───
function PasswordModal({ note, onClose }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null); // "view" | "download"

  const verify = async (mode) => {
    if (!input.trim()) {
      setError("Please enter the password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/api/notes/verify/${note._id}`, {
        password: input.trim(),
      });
      const url = fileUrl(res.data.fileUrl);
      if (mode === "view") {
        window.open(url, "_blank", "noreferrer");
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = res.data.name || "note";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || "Incorrect password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.65)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: "modalIn 0.2s cubic-bezier(.22,.68,0,1.2)" }}
      >
        <div className="bg-gradient-to-r from-teal-500 to-indigo-500 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <LockIcon />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-[15px]">Enter Password</h2>
            <p className="text-white/80 text-xs mt-0.5 truncate">{note.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <XIcon />
          </button>
        </div>

        <div className="px-6 py-6 space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="e.g. A3F9BC"
            maxLength={6}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center font-mono text-lg tracking-widest font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400"
          />
          {error && (
            <p className="text-xs text-red-500 text-center font-medium">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => verify("view")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            >
              <EyeIcon /> View
            </button>
            <button
              onClick={() => verify("download")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            >
              <DownIcon /> Download
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.94) translateY(10px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Note Row ───
function NoteRow({ note, onDelete, actionLoading }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <PasswordModal note={note} onClose={() => setShowModal(false)} />
      )}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-white border-slate-100 shadow-sm hover:shadow hover:border-teal-200 transition-all">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700 truncate">
            {note.name}
          </p>
          <p className="text-[11px] text-slate-400">By: {note.teacherName}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="flex items-center gap-1 font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg text-xs tracking-widest mr-2">
            <LockIcon /> {note.password}
          </span>
          <button
            onClick={() => setShowModal(true)}
            title="View / Download (Password Protected)"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all"
          >
            <EyeIcon />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            disabled={actionLoading === note._id}
            title="Delete"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-40"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Admin Page ───
export default function NotesAdmin() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/notes`);
      setNotes(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    setActionLoading(id);
    try {
      await axios.delete(`${BASE_URL}/api/notes/${id}`);
      setNotes((p) => p.filter((n) => n._id !== id));
    } catch (e) {
      alert("Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  // Group by teacher
  const grouped = notes.reduce((acc, note) => {
    const key = note.teacherName || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {});

  const filtered = Object.entries(grouped).filter(([teacher]) =>
    teacher.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen ml-[300px] mt-[50px] bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-7 h-7"
                stroke="white"
                strokeWidth={1.8}
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="12" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-teal-600 tracking-tight">
                Notes Manager
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                View and manage password-protected notes
              </p>
            </div>
          </div>
          <button
            onClick={fetchNotes}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm"
          >
            <RefreshIcon /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              label: "Total Notes",
              value: notes.length,
              color: "text-slate-800",
              bg: "bg-white",
              border: "border-slate-200",
            },
            {
              label: "Teachers",
              value: Object.keys(grouped).length,
              color: "text-teal-700",
              bg: "bg-teal-50",
              border: "border-teal-100",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-2xl border ${s.border} px-5 py-4`}
            >
              <p className="text-xs text-slate-500 font-medium mb-0.5">
                {s.label}
              </p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-sm">
          <div className="relative ml-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search by teacher name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 w-64 transition-all"
            />
          </div>
        </div>

        {/* Notes */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-[3px] border-teal-100 border-t-teal-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Loading notes…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <p className="text-sm font-semibold text-slate-500">
              No notes found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(([teacher, teacherNotes]) => (
              <div
                key={teacher}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="px-5 pt-5 pb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {teacher
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-slate-800">
                      {teacher}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {teacherNotes.length} notes uploaded
                    </p>
                  </div>
                </div>
                <div className="h-px bg-slate-100 mx-5" />
                <div className="px-4 py-4 flex flex-col gap-2">
                  {teacherNotes.map((note) => (
                    <NoteRow
                      key={note._id}
                      note={note}
                      onDelete={handleDelete}
                      actionLoading={actionLoading}
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

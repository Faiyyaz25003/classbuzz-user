import React, { useState, useEffect } from "react";
import axios from "axios";

// ─── Medal Config ────────────────────────────────────────────────
const medalConfig = {
  gold: {
    borderHex: "#f97316",
    hex1: "#fbbf24",
    hex2: "#ca8a04",
    outerBg: "linear-gradient(135deg, #fff7ed, #ffedd5)",
    badge: "🥇",
    label: "Gold",
    labelCls: "bg-amber-100 text-amber-700 border border-amber-300",
  },
  silver: {
    borderHex: "#94a3b8",
    hex1: "#cbd5e1",
    hex2: "#64748b",
    outerBg: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    badge: "🥈",
    label: "Silver",
    labelCls: "bg-slate-100 text-slate-600 border border-slate-300",
  },
  bronze: {
    borderHex: "#ea580c",
    hex1: "#fb923c",
    hex2: "#b45309",
    outerBg: "linear-gradient(135deg, #fff7ed, #fed7aa)",
    badge: "🥉",
    label: "Bronze",
    labelCls: "bg-orange-100 text-orange-700 border border-orange-300",
  },
};

// ─── Print Helper ────────────────────────────────────────────────
const printCertificate = (cert) => {
  const medal = medalConfig[cert.medalColor] || medalConfig.gold;
  const formattedDate = cert.date
    ? new Date(cert.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const win = window.open("", "_blank");
  win.document.write(`
    <!DOCTYPE html><html><head>
    <title>Certificate – ${cert.studentName}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;
        -webkit-print-color-adjust:exact!important;
        print-color-adjust:exact!important;}
      body{font-family:'Segoe UI',sans-serif;display:flex;align-items:center;
        justify-content:center;min-height:100vh;padding:20px;background:#f1f5f9;}
      @media print{body{padding:0;}@page{size:A4 landscape;margin:10mm;}
        .no-print{display:none!important;}}
      .btn{position:fixed;top:20px;right:20px;background:#3b82f6;color:#fff;
        border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;}
      .outer{border:10px solid ${medal.borderHex};border-radius:16px;padding:24px;
        background:${medal.outerBg};width:850px;max-width:100%;}
      .inner{border:4px solid #e2e8f0;background:#fff;padding:48px 56px;
        text-align:center;min-height:480px;border-radius:4px;}
      .circle{width:72px;height:72px;border-radius:50%;
        background:linear-gradient(135deg,${medal.hex1},${medal.hex2});
        display:flex;align-items:center;justify-content:center;
        margin:0 auto 24px;box-shadow:0 4px 15px rgba(0,0,0,.2);}
      .title{font-size:34px;font-weight:900;text-transform:uppercase;letter-spacing:4px;
        margin-bottom:16px;color:${medal.hex2};
        background:linear-gradient(135deg,${medal.hex1},${medal.hex2});
        -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
      .line{width:80px;height:3px;background:linear-gradient(135deg,${medal.hex1},${medal.hex2});
        margin:0 auto 24px;border-radius:2px;}
      .sub{font-size:13px;color:#64748b;font-style:italic;margin-bottom:24px;}
      .name{font-size:34px;font-weight:800;color:#0f172a;margin-bottom:10px;}
      .details{font-size:13px;color:#374151;margin-bottom:24px;
        display:flex;justify-content:center;gap:40px;}
      .remarks{font-size:14px;color:#475569;max-width:520px;margin:0 auto;line-height:1.7;}
      .footer{display:flex;justify-content:space-between;align-items:flex-end;
        margin-top:48px;padding:0 10px;}
      .lbl{font-size:11px;color:#94a3b8;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;}
      .iname{font-size:17px;font-weight:700;color:#0f172a;}
      .idate{font-size:12px;color:#64748b;margin-top:4px;}
      .sigline{border-top:2px solid #0f172a;width:130px;margin-top:32px;margin-left:auto;}
      .sigimg{height:54px;margin-top:8px;margin-left:auto;display:block;max-width:150px;object-fit:contain;}
    </style></head><body>
    <button class="btn no-print" onclick="window.print()">🖨️ Print Certificate</button>
    <div class="outer"><div class="inner">
      <div class="circle">
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"
          fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      </div>
      <div class="title">${cert.title || "Certificate of Achievement"}</div>
      <div class="line"></div>
      <div class="sub">This certificate is proudly presented to</div>
      <div class="name">${cert.studentName}</div>
      ${
        cert.class || cert.rollNo
          ? `<div class="details">
        ${cert.class ? `<span>Class: <strong>${cert.class}</strong></span>` : ""}
        ${cert.rollNo ? `<span>Roll No: <strong>${cert.rollNo}</strong></span>` : ""}
      </div>`
          : ""
      }
      <div class="remarks">${cert.remarks || "For outstanding performance and dedication to excellence."}</div>
      <div class="footer">
        <div>
          <div class="lbl">Issued By</div>
          <div class="iname">${cert.issuedBy || "School Admin"}</div>
          ${formattedDate ? `<div class="idate">Date: ${formattedDate}</div>` : ""}
        </div>
        <div style="text-align:right">
          <div class="lbl">Authorized Signature</div>
          ${
            cert.signature
              ? `<img src="${cert.signature}" class="sigimg" alt="Signature"/>`
              : `<div class="sigline"></div>`
          }
        </div>
      </div>
    </div></div>
    <script>window.onafterprint=function(){window.close();}</script>
    </body></html>
  `);
  win.document.close();
};

// ─── Certificate Card ────────────────────────────────────────────
const CertCard = ({ cert, onDelete, idx }) => {
  const medal = medalConfig[cert.medalColor] || medalConfig.gold;
  const date = cert.date
    ? new Date(cert.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{
        animationName: "fadeUp",
        animationDuration: "0.5s",
        animationTimingFunction: "ease",
        animationFillMode: "both",
        animationDelay: `${idx * 80}ms`,
      }}
    >
      {/* Coloured top bar */}
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${medal.hex1}, ${medal.hex2})`,
        }}
      />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{medal.badge}</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${medal.labelCls}`}
            >
              {medal.label}
            </span>
          </div>
          {date && (
            <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              {date}
            </span>
          )}
        </div>

        {/* Mini certificate preview */}
        <div
          className="rounded-xl p-4 mb-4 text-center"
          style={{
            background: medal.outerBg,
            border: `3px solid ${medal.borderHex}`,
          }}
        >
          {/* medal circle */}
          <div
            className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md"
            style={{
              background: `linear-gradient(135deg, ${medal.hex1}, ${medal.hex2})`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>

          <p
            className="text-xs font-black uppercase tracking-widest mb-1"
            style={{ color: medal.hex2 }}
          >
            {cert.title || "Certificate of Achievement"}
          </p>
          <div
            className="w-8 h-0.5 mx-auto mb-2 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${medal.hex1}, ${medal.hex2})`,
            }}
          />
          <p className="text-[10px] text-slate-400 italic mb-1">
            proudly presented to
          </p>
          <p className="text-base font-extrabold text-slate-800 tracking-wide">
            {cert.studentName}
          </p>
          {(cert.class || cert.rollNo) && (
            <div className="flex justify-center gap-4 text-[10px] text-slate-500 mt-1">
              {cert.class && (
                <span>
                  Class: <strong>{cert.class}</strong>
                </span>
              )}
              {cert.rollNo && (
                <span>
                  Roll: <strong>{cert.rollNo}</strong>
                </span>
              )}
            </div>
          )}
          {cert.remarks && (
            <p className="text-[10px] text-slate-500 mt-2 leading-snug line-clamp-2 italic">
              {cert.remarks}
            </p>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div>
            <span className="text-slate-400">Issued by</span>{" "}
            <span className="font-semibold text-slate-700">
              {cert.issuedBy || "—"}
            </span>
          </div>
          {cert.signature && (
            <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Signed
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => printCertificate(cert)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / PDF
          </button>
          <button
            onClick={() => onDelete(cert._id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold border border-red-200 transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────
export default function GetCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterMedal, setFilterMedal] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch
  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/certificates");
      setCertificates(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load certificates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/certificates/${id}`);
      setCertificates((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("❌ Could not delete certificate.");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Filter + Search
  const filtered = certificates.filter((c) => {
    const matchSearch =
      c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      c.issuedBy?.toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase());
    const matchMedal = filterMedal === "all" || c.medalColor === filterMedal;
    return matchSearch && matchMedal;
  });

  return (
    <>
      {/* Keyframe */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="min-h-screen mt-[70px] ml-[350px] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        {/* ── Header ── */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">
                  All Certificates
                </h1>
                <p className="text-xs text-slate-400">
                  {loading
                    ? "Loading…"
                    : `${filtered.length} of ${certificates.length} certificates`}
                </p>
              </div>
            </div>

            <button
              onClick={fetchCertificates}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 transition"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* ── Search + Filter Bar ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search by student, title, or issuer…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-slate-400"
              />
            </div>

            {/* Medal Filter */}
            <div className="flex gap-2">
              {["all", "gold", "silver", "bronze"].map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMedal(m)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition capitalize ${
                    filterMedal === m
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {m === "all"
                    ? "All"
                    : m === "gold"
                      ? "🥇"
                      : m === "silver"
                        ? "🥈"
                        : "🥉"}{" "}
                  {m === "all" ? "" : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── States ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-400 rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Fetching certificates…</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-32 text-red-500">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-base font-semibold mb-2">
                Something went wrong
              </p>
              <p className="text-sm text-slate-500 mb-4">{error}</p>
              <button
                onClick={fetchCertificates}
                className="px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold border border-red-200 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <div className="text-6xl mb-4">🎖️</div>
              <p className="text-lg font-bold text-slate-600 mb-1">
                No certificates found
              </p>
              <p className="text-sm">
                {search || filterMedal !== "all"
                  ? "Try clearing the filters."
                  : "Create your first certificate!"}
              </p>
            </div>
          )}

          {/* ── Grid ── */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((cert, i) => (
                <CertCard
                  key={cert._id}
                  cert={cert}
                  idx={i}
                  onDelete={(id) => setDeleteConfirm(id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Delete Confirm Modal ── */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
              <div className="text-5xl mb-3">🗑️</div>
              <h2 className="text-lg font-black text-slate-800 mb-1">
                Delete Certificate?
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. The certificate will be
                permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

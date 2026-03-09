"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

const BASE_URL = "http://localhost:5000/api";

const api = {
  getAllBooks: async (search = "", category = "All") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "All") params.append("category", category);
    const res = await fetch(`${BASE_URL}/books?${params}`);
    return res.json();
  },
  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/books/categories`);
    return res.json();
  },
  getMyBooks: async () => {
    const res = await fetch(`${BASE_URL}/issued/my-books`);
    return res.json();
  },
  getExpiringBooks: async () => {
    const res = await fetch(`${BASE_URL}/issued/expiring`);
    return res.json();
  },
  issueBook: async (payload) => {
    const res = await fetch(`${BASE_URL}/issued`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};

/* ─── PDF VIEWER ───────────────────────────────────────────────── */
function PDFViewer({ book, onClose }) {
  const [full, setFull] = useState(false);
  const raw = book.file || book.pdf || book.pdfFile || "";
  const url = raw.startsWith("http")
    ? raw
    : raw
      ? `http://localhost:5000/uploads/${raw}`
      : "";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1500,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: full ? 0 : 18,
          width: full ? "100vw" : "min(95vw,1080px)",
          height: full ? "100vh" : "min(92vh,800px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
          transition: "all 0.3s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "13px 18px",
            borderBottom: "1.5px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: book.bg || "#eef2ff",
                border: `1.5px solid ${book.color || "#6366f1"}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
              }}
            >
              📚
            </div>
            <div>
              {/* ✅ Subject as primary title */}
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#0f172a",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {book.subject || book.name || book.bookName}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontSize: 10,
                    color: book.color || "#6366f1",
                    background: book.bg || "#eef2ff",
                    padding: "2px 8px",
                    borderRadius: 20,
                    fontWeight: 600,
                  }}
                >
                  {book.category}
                </span>
                {/* ✅ Book name as secondary */}
                {book.subject && (
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>
                    {book.name || book.bookName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setFull((f) => !f)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              {full ? "⊡" : "⛶"}
            </button>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "#fef2f2",
                border: "1.5px solid #fecaca",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>
        <div style={{ flex: 1, background: "#f8fafc" }}>
          <iframe
            src={url}
            title={book.name || book.bookName}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── GET BOOK MODAL ───────────────────────────────────────────── */
function GetBookModal({ book, onClose, onSuccess }) {
  const [form, setForm] = useState({
    studentName: "",
    department: "",
    issueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const endDate = form.issueDate
    ? (() => {
        const d = new Date(form.issueDate);
        d.setDate(d.getDate() + 14);
        return d.toISOString().split("T")[0];
      })()
    : "";

  const submit = async () => {
    if (!form.studentName || !form.department || !form.issueDate) {
      setError("All fields required");
      return;
    }
    setError("");
    setLoading(true);
    const r = await api.issueBook({ bookId: book._id, ...form });
    setLoading(false);
    if (r.success) {
      setDone(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1600);
    } else setError(r.message || "Failed to issue book");
  };

  const col = book.color || "#6366f1";
  const inp = {
    width: "100%",
    background: "#f8fafc",
    border: "1.5px solid #e8eaf0",
    borderRadius: 10,
    padding: "11px 14px",
    color: "#1a1f36",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 22,
          width: "min(92vw,460px)",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${col}, ${col}cc)`,
            padding: "22px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              📚
            </div>
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 16,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Get Book
              </div>
              {/* ✅ Subject as subtitle in modal header */}
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
                {book.subject || book.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {done ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#0f172a",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Book Issued!
              </div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 6 }}>
                Successfully issued to{" "}
                <span style={{ color: col, fontWeight: 600 }}>
                  {form.studentName}
                </span>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
                Return by:{" "}
                <span style={{ color: "#10b981", fontWeight: 600 }}>
                  {endDate}
                </span>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: 9,
                    padding: "9px 14px",
                    color: "#ef4444",
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}

              {[
                {
                  label: "YOUR NAME",
                  key: "studentName",
                  ph: "Enter your full name",
                },
                {
                  label: "DEPARTMENT",
                  key: "department",
                  ph: "e.g. Computer Science",
                },
              ].map(({ label, key, ph }) => (
                <div key={key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#94a3b8",
                      letterSpacing: "1px",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </label>
                  <input
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    placeholder={ph}
                    style={inp}
                    onFocus={(e) => {
                      e.target.style.borderColor = col;
                      e.target.style.boxShadow = `0 0 0 3px ${col}18`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e8eaf0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              ))}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#94a3b8",
                      letterSpacing: "1px",
                      marginBottom: 6,
                    }}
                  >
                    ISSUE DATE
                  </label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, issueDate: e.target.value }))
                    }
                    style={inp}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#94a3b8",
                      letterSpacing: "1px",
                      marginBottom: 6,
                    }}
                  >
                    END DATE <span style={{ color: "#10b981" }}>(Auto)</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    readOnly
                    style={{
                      ...inp,
                      background: "#f0fdf4",
                      borderColor: "#bbf7d0",
                      color: "#16a34a",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "1px",
                    marginBottom: 6,
                  }}
                >
                  BOOK
                </label>
                {/* ✅ Subject as primary in book field */}
                <div
                  style={{
                    background: `${col}10`,
                    border: `1.5px solid ${col}30`,
                    borderRadius: 10,
                    padding: "11px 14px",
                    color: col,
                    fontWeight: 600,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>📚</span>
                  {book.subject || book.name}
                  {book.subject && (
                    <span
                      style={{
                        fontSize: 11,
                        color: `${col}99`,
                        fontWeight: 500,
                      }}
                    >
                      ({book.name})
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={submit}
                disabled={loading}
                style={{
                  background: loading
                    ? "#c7d2fe"
                    : `linear-gradient(135deg,${col},${col}bb)`,
                  border: "none",
                  borderRadius: 11,
                  padding: "13px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: loading ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: loading ? "none" : `0 4px 14px ${col}44`,
                  transition: "all 0.3s",
                  marginTop: 4,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {loading ? "⏳ Issuing..." : "✅ Confirm Issue"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── BOOK CARD ─────────────────────────────────────────────────── */
function BookCard({ book, onClick, onGetBook, showDays }) {
  const [hov, setHov] = useState(false);
  const col = book.color || "#6366f1";
  const dl = book.daysLeft;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hov ? col : "#eaecf4"}`,
        borderRadius: 14,
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
        boxShadow: hov
          ? `0 12px 32px rgba(0,0,0,0.09), 0 0 0 1px ${col}22`
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hov ? "translateY(-3px)" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: col,
          borderRadius: "14px 14px 0 0",
        }}
      />

      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 11,
          background: book.bg || "#eef2ff",
          fontSize: 21,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${col}22`,
        }}
      >
        📚
      </div>

      <div>
        {/* ✅ Subject as main title */}
        <div
          style={{
            color: "#0f172a",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: 1.35,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {book.subject || book.name || book.bookName}
        </div>
        <span
          style={{
            marginTop: 5,
            fontSize: 11,
            color: col,
            background: book.bg || "#eef2ff",
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 20,
            fontWeight: 600,
            border: `1px solid ${col}22`,
          }}
        >
          {book.category}
        </span>
      </div>

      {/* ✅ Book name · course as subtitle */}
      <div style={{ fontSize: 11, color: "#94a3b8" }}>
        {book.name || book.bookName}
        {book.course ? ` · ${book.course}` : ""}
      </div>

      {showDays && dl !== undefined && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            fontWeight: 700,
            color: dl <= 3 ? "#ef4444" : dl <= 7 ? "#f59e0b" : "#10b981",
            background: dl <= 3 ? "#fef2f2" : dl <= 7 ? "#fffbeb" : "#f0fdf4",
            padding: "4px 10px",
            borderRadius: 8,
            width: "fit-content",
            border: `1px solid ${dl <= 3 ? "#fecaca" : dl <= 7 ? "#fde68a" : "#bbf7d0"}`,
          }}
        >
          ⏰ {dl < 0 ? "Expired" : `${dl}d left`}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: "auto",
        }}
      >
        <div
          style={{
            flex: 1,
            fontSize: 11,
            color: "#cbd5e1",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          📄 Click to open PDF
        </div>
        {onGetBook && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGetBook(book);
            }}
            style={{
              background: `linear-gradient(135deg,${col},${col}bb)`,
              border: "none",
              borderRadius: 8,
              padding: "6px 13px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 11,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: `0 3px 10px ${col}44`,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            + Get Book
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── MY BOOK CARD (issued) ────────────────────────────────────── */
function MyBookCard({ book, onClick }) {
  const [hov, setHov] = useState(false);
  const col = book.color || "#6366f1";
  const dl = book.daysLeft;
  const exp = dl < 0;
  const crit = !exp && dl <= 3;
  const sc = exp
    ? "#ef4444"
    : crit
      ? "#f97316"
      : dl <= 7
        ? "#f59e0b"
        : "#10b981";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hov ? sc : "#eaecf4"}`,
        borderRadius: 14,
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
        boxShadow: hov
          ? `0 12px 32px rgba(0,0,0,0.09)`
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hov ? "translateY(-3px)" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: sc,
          borderRadius: "14px 14px 0 0",
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 11,
            background: book.bg || "#eef2ff",
            fontSize: 21,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${col}22`,
            flexShrink: 0,
          }}
        >
          📚
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* ✅ Subject as primary title in My Books card */}
          <div
            style={{
              color: "#0f172a",
              fontWeight: 700,
              fontSize: 14,
              lineHeight: 1.3,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {book.subject || book.bookName}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: col,
                background: book.bg || "#eef2ff",
                display: "inline-block",
                padding: "2px 9px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              {book.category}
            </span>
            {/* ✅ bookName as secondary */}
            {book.subject && (
              <span style={{ fontSize: 10, color: "#94a3b8" }}>
                {book.bookName}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 11, color: "#94a3b8" }}>
          Due:{" "}
          <span style={{ color: "#64748b", fontWeight: 600 }}>
            {new Date(book.endDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: sc,
            background: `${sc}12`,
            padding: "4px 10px",
            borderRadius: 8,
            border: `1px solid ${sc}28`,
          }}
        >
          {exp ? "⚠ Expired" : `⏰ ${dl}d left`}
        </div>
      </div>
    </div>
  );
}

/* ─── ALL BOOKS SECTION ────────────────────────────────────────── */
function AllBooksSection({ onOpenPDF, onGetBook }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const r = await api.getAllBooks(search, category);
    if (r.success) setBooks(r.data);
    setLoading(false);
  }, [search, category]);

  useEffect(() => {
    const t = setTimeout(fetchBooks, 350);
    return () => clearTimeout(t);
  }, [fetchBooks]);

  useEffect(() => {
    api.getCategories().then((r) => {
      if (r.success) setCategories(r.data);
    });
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 22,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 380 }}>
          <span
            style={{
              position: "absolute",
              left: 13,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books..."
            style={{
              width: "100%",
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 11,
              padding: "11px 16px 11px 38px",
              color: "#1a1f36",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>
        <div style={{ position: "relative" }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              appearance: "none",
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 11,
              padding: "11px 36px 11px 16px",
              color: "#1a1f36",
              fontSize: 13,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              minWidth: 160,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              pointerEvents: "none",
              fontSize: 12,
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {loading ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}
        >
          ⏳ Loading...
        </div>
      ) : books.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}
        >
          <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>No books found</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {books.map((b) => (
            <BookCard
              key={b._id}
              book={b}
              onClick={() => onOpenPDF(b)}
              onGetBook={onGetBook}
            />
          ))}
        </div>
      )}
    </>
  );
}

/* ─── MY BOOKS SECTION ─────────────────────────────────────────── */
function MyBooksSection({ onOpenPDF, refreshTrigger }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const r = await api.getMyBooks();
    if (r.success) setBooks(r.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks, refreshTrigger]);

  const getPdfUrl = (b) => {
    const raw = b.file || b.pdf || b.pdfFile || "";
    if (!raw) return "";
    if (raw.startsWith("http")) return raw;
    return `http://localhost:5000/uploads/${raw}`;
  };

  const filtered = useMemo(
    () =>
      books.filter((b) =>
        // ✅ Search by subject or bookName
        (b.subject || b.bookName || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [books, search],
  );

  return (
    <>
      <div style={{ position: "relative", maxWidth: 380, marginBottom: 22 }}>
        <span
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
          }}
        >
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          style={{
            width: "100%",
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 11,
            padding: "11px 16px 11px 38px",
            color: "#1a1f36",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#ec4899")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
      </div>

      {loading ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}
        >
          ⏳ Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}
        >
          <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>No books found</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: 16,
          }}
        >
          {filtered.map((b) => (
            <MyBookCard
              key={b._id}
              book={b}
              onClick={() =>
                onOpenPDF({ ...b, name: b.bookName, file: getPdfUrl(b) })
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

/* ─── EXPIRING SECTION ─────────────────────────────────────────── */
function ExpiringSoonSection({ onOpenPDF }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getExpiringBooks().then((r) => {
      if (r.success) setBooks(r.data);
      setLoading(false);
    });
  }, []);

  const getPdfUrl = (b) => {
    const raw = b.file || b.pdf || b.pdfFile || "";
    if (!raw) return "";
    if (raw.startsWith("http")) return raw;
    return `http://localhost:5000/uploads/${raw}`;
  };

  const filtered = useMemo(
    () =>
      books.filter((b) =>
        // ✅ Search by subject or bookName
        (b.subject || b.bookName || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [books, search],
  );

  return (
    <>
      <div style={{ position: "relative", maxWidth: 380, marginBottom: 22 }}>
        <span
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
          }}
        >
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          style={{
            width: "100%",
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 11,
            padding: "11px 16px 11px 38px",
            color: "#1a1f36",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
      </div>

      {loading ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}
        >
          ⏳ Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}
        >
          <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>No books found</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: 16,
          }}
        >
          {filtered.map((b) => (
            <MyBookCard
              key={b._id}
              book={b}
              onClick={() =>
                onOpenPDF({ ...b, name: b.bookName, file: getPdfUrl(b) })
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

/* ─── MAIN USER PAGE ───────────────────────────────────────────── */
const SECTIONS = [
  {
    key: "all",
    label: "All Books",
    sublabel: (c) => `${c} titles`,
    icon: "📚",
    color: "#6366f1",
    lightBg: "#eef2ff",
    border: "#c7d2fe",
    grad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },
  {
    key: "my",
    label: "My Books",
    sublabel: (c) => `${c} borrowed`,
    icon: "🔖",
    color: "#ec4899",
    lightBg: "#fdf2f8",
    border: "#fbcfe8",
    grad: "linear-gradient(135deg,#ec4899,#f43f5e)",
  },
  {
    key: "expire",
    label: "Expiring Soon",
    sublabel: (c) => `${c} expiring`,
    icon: "⏰",
    color: "#f59e0b",
    lightBg: "#fffbeb",
    border: "#fde68a",
    grad: "linear-gradient(135deg,#f59e0b,#f97316)",
  },
];

export default function UserLibraryPage() {
  const [active, setActive] = useState(null);
  const [openBook, setOpenBook] = useState(null);
  const [getBookTarget, setGetBookTarget] = useState(null);
  const [myBooksRefresh, setMyBooksRefresh] = useState(0);
  const [counts, setCounts] = useState({ all: 0, my: 0, expire: 0 });

  useEffect(() => {
    Promise.all([
      api.getAllBooks().then((r) => (r.success ? r.count : 0)),
      api.getMyBooks().then((r) => (r.success ? r.count : 0)),
      api.getExpiringBooks().then((r) => (r.success ? r.count : 0)),
    ]).then(([all, my, expire]) => setCounts({ all, my, expire }));
  }, [myBooksRefresh]);

  const cfg = SECTIONS.find((s) => s.key === active);
  const countMap = { all: counts.all, my: counts.my, expire: counts.expire };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6fb",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
        color: "#1a1f36",
        padding: "36px 48px",
        marginLeft: "300px",
        marginTop: "20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #cbd5e1; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.5; }
        select option { background: #fff; }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            }}
          >
            📖
          </div>
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                margin: 0,
                color: "#0f172a",
                letterSpacing: "-0.4px",
              }}
            >
              User Library
            </h1>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: 13 }}>
              Browse and borrow your educational resources
            </p>
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #eaecf4",
            borderRadius: 10,
            padding: "8px 16px",
            fontSize: 12,
            color: "#64748b",
            fontWeight: 500,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          📅{" "}
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </div>

      {/* ── Home: Section Cards ── */}
      {!active && (
        <>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: "1.5px",
              marginBottom: 14,
            }}
          >
            BROWSE COLLECTION
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {SECTIONS.map((s) => (
              <div
                key={s.key}
                onClick={() => setActive(s.key)}
                style={{
                  background: "#fff",
                  border: `1.5px solid ${s.border}`,
                  borderRadius: 20,
                  padding: "28px 26px",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.09)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.04)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: s.grad,
                    borderRadius: "20px 20px 0 0",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    background: s.lightBg,
                    opacity: 0.7,
                  }}
                />
                <div style={{ fontSize: 42, marginBottom: 18 }}>{s.icon}</div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 4,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}
                >
                  {s.sublabel(countMap[s.key])}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: s.lightBg,
                    border: `1px solid ${s.border}`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: s.color,
                  }}
                >
                  Browse →
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Section View ── */}
      {active && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <button
              onClick={() => setActive(null)}
              style={{
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 9,
                padding: "8px 16px",
                color: "#64748b",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              ← Back
            </button>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>
                {cfg?.label}
              </div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>
                {countMap[active]} books found
              </div>
            </div>
          </div>

          {active === "all" && (
            <AllBooksSection
              onOpenPDF={(b) => setOpenBook(b)}
              onGetBook={(b) => setGetBookTarget(b)}
            />
          )}
          {active === "my" && (
            <MyBooksSection
              onOpenPDF={(b) => setOpenBook(b)}
              refreshTrigger={myBooksRefresh}
            />
          )}
          {active === "expire" && (
            <ExpiringSoonSection onOpenPDF={(b) => setOpenBook(b)} />
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {openBook && (
        <PDFViewer book={openBook} onClose={() => setOpenBook(null)} />
      )}
      {getBookTarget && (
        <GetBookModal
          book={getBookTarget}
          onClose={() => setGetBookTarget(null)}
          onSuccess={() => setMyBooksRefresh((n) => n + 1)}
        />
      )}
    </div>
  );
}

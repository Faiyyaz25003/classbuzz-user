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

// ─── PDF Viewer ─────────────────────────────────────────────────────
function PDFViewer({ book, onClose }) {
  const [isFull, setIsFull] = useState(false);
  const pdfUrl =
    book.file ||
    book.pdf ||
    (book.pdfFile ? `http://localhost:5000/uploads/${book.pdfFile}` : "");

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.9)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1500,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f1629",
          border: "1px solid #1e3a5f",
          borderRadius: isFull ? 0 : 20,
          width: isFull ? "100vw" : "min(95vw, 1100px)",
          height: isFull ? "100vh" : "min(92vh, 820px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #1e3a5f",
            background: "#0a1020",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: `${book.color || "#6366f1"}18`,
                border: `1px solid ${book.color || "#6366f1"}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              📚
            </div>
            <div>
              <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14 }}>
                {book.name || book.bookName}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: book.color || "#6366f1",
                  background: `${book.color || "#6366f1"}15`,
                  padding: "2px 8px",
                  borderRadius: 20,
                  fontWeight: 600,
                }}
              >
                {book.category}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setIsFull((f) => !f)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid #1e3a5f",
                color: "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isFull ? "⊡" : "⛶"}
            </button>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>
        <div style={{ flex: 1, background: "#060d1a" }}>
          <iframe
            src={pdfUrl}
            title={book.name || book.bookName}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
        <div
          style={{
            padding: "8px 20px",
            background: "#0a1020",
            borderTop: "1px solid #1e3a5f",
            fontSize: 11,
            color: "#334155",
          }}
        >
          📄 Click outside or press ✕ to close
        </div>
      </div>
    </div>
  );
}

// ─── Get Book / Issue Modal ─────────────────────────────────────────
function GetBookModal({ book, onClose, onSuccess }) {
  const [form, setForm] = useState({
    studentName: "",
    department: "",
    issueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const endDate = form.issueDate
    ? (() => {
        const d = new Date(form.issueDate);
        d.setDate(d.getDate() + 14);
        return d.toISOString().split("T")[0];
      })()
    : "";

  const handleSubmit = async () => {
    if (!form.studentName || !form.department || !form.issueDate) {
      setError("All fields are required");
      return;
    }
    setError("");
    setLoading(true);
    const result = await api.issueBook({ bookId: book._id, ...form });
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 1800);
    } else setError(result.message || "Failed to issue book");
  };

  const col = book.color || "#6366f1";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f1629",
          border: "1px solid #1e3a5f",
          borderRadius: 24,
          width: "min(92vw, 480px)",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px",
            position: "relative",
            background: `linear-gradient(135deg, ${col}22, ${col}08)`,
            borderBottom: "1px solid #1e3a5f",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(circle at 80% 50%, ${col}12, transparent 70%)`,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `${col}20`,
                border: `1px solid ${col}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              📚
            </div>
            <div>
              <div style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 18 }}>
                Get This Book
              </div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>
                {book.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 18,
              right: 20,
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "26px 28px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#f1f5f9" }}>
                Book Issued!
              </div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>
                Successfully issued to{" "}
                <span style={{ color: "#60a5fa" }}>{form.studentName}</span>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: "#334155" }}>
                Return by: <span style={{ color: "#34d399" }}>{endDate}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {error && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#f87171",
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}

              {[
                {
                  label: "Your Name",
                  key: "studentName",
                  placeholder: "Enter your full name",
                },
                {
                  label: "Department",
                  key: "department",
                  placeholder: "e.g. Computer Science",
                },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#475569",
                      marginBottom: 6,
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    placeholder={placeholder}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid #1e3a5f",
                      borderRadius: 10,
                      padding: "11px 14px",
                      color: "#e2e8f0",
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = col;
                      e.target.style.boxShadow = `0 0 0 3px ${col}15`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#1e3a5f";
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
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#475569",
                      marginBottom: 6,
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                    }}
                  >
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, issueDate: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid #1e3a5f",
                      borderRadius: 10,
                      padding: "11px 14px",
                      color: "#e2e8f0",
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#475569",
                      marginBottom: 6,
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                    }}
                  >
                    Due Date <span style={{ color: "#10b981" }}>(Auto)</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    readOnly
                    style={{
                      width: "100%",
                      background: "rgba(16,185,129,0.06)",
                      border: "1px solid rgba(16,185,129,0.25)",
                      borderRadius: 10,
                      padding: "11px 14px",
                      color: "#34d399",
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#475569",
                    marginBottom: 6,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                  }}
                >
                  Book
                </label>
                <div
                  style={{
                    background: `${col}10`,
                    border: `1px solid ${col}30`,
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
                  <span>📚</span> {book.name}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: loading
                    ? `${col}44`
                    : `linear-gradient(135deg, ${col}, ${col}bb)`,
                  border: "none",
                  borderRadius: 12,
                  padding: "14px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: loading ? "default" : "pointer",
                  marginTop: 4,
                  boxShadow: loading ? "none" : `0 6px 20px ${col}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
              >
                {loading ? "⏳ Processing..." : "✅ Get Book"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Book Card ──────────────────────────────────────────────────────
function BookCard({ book, showDays, onClick, onGetBook }) {
  const [hovered, setHovered] = useState(false);
  const col = book.color || "#6366f1";
  const daysLeft = book.daysLeft;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#0d1829" : "#0a1020",
        border: `1px solid ${hovered ? col : "#1e3a5f"}`,
        borderRadius: 16,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${col}22`
          : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: hovered
            ? `linear-gradient(90deg, ${col}, ${col}44)`
            : "transparent",
          transition: "all 0.2s",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: `${col}15`,
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${col}25`,
          }}
        >
          📚
        </div>
        {showDays && daysLeft !== undefined && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 8,
              color: daysLeft <= 3 ? "#f87171" : "#fbbf24",
              background:
                daysLeft <= 3
                  ? "rgba(239,68,68,0.12)"
                  : "rgba(251,191,36,0.12)",
              border: `1px solid ${daysLeft <= 3 ? "rgba(239,68,68,0.25)" : "rgba(251,191,36,0.25)"}`,
            }}
          >
            ⏰ {daysLeft}d
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            color: "#e2e8f0",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: 1.3,
          }}
        >
          {book.name || book.bookName}
        </div>
        <div
          style={{
            marginTop: 5,
            fontSize: 11,
            color: col,
            background: `${col}12`,
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 20,
            fontWeight: 600,
          }}
        >
          {book.category}
        </div>
      </div>

      {book.course && (
        <div style={{ fontSize: 11, color: "#334155" }}>
          {book.course} · {book.subject}
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
            color: "#1e3a5f",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span>📄</span> Click to view PDF
        </div>
        {onGetBook && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGetBook(book);
            }}
            style={{
              background: `linear-gradient(135deg, ${col}, ${col}99)`,
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 11,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: `0 3px 10px ${col}44`,
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

// ─── My Books Card (for issued books) ───────────────────────────────
function MyBookCard({ book, onClick }) {
  const [hovered, setHovered] = useState(false);
  const col = book.color || "#6366f1";
  const dl = book.daysLeft;
  const expired = dl < 0;
  const critical = !expired && dl <= 3;
  const sc = expired
    ? "#ef4444"
    : critical
      ? "#f97316"
      : dl <= 7
        ? "#f59e0b"
        : "#10b981";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#0d1829" : "#0a1020",
        border: `1px solid ${hovered ? sc : "#1e3a5f"}`,
        borderRadius: 16,
        padding: "20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.4)` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${sc}, transparent)`,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 11,
            flexShrink: 0,
            background: `${col}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            border: `1px solid ${col}25`,
          }}
        >
          📚
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: 14,
              lineHeight: 1.3,
            }}
          >
            {book.bookName}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              color: col,
              background: `${col}12`,
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: 20,
              fontWeight: 600,
            }}
          >
            {book.category}
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
        <div style={{ fontSize: 11, color: "#334155" }}>
          Due:{" "}
          <span style={{ color: "#64748b" }}>
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
            padding: "4px 10px",
            borderRadius: 8,
            color: sc,
            background: `${sc}12`,
            border: `1px solid ${sc}25`,
          }}
        >
          {expired ? "⚠ Expired" : `⏰ ${dl}d left`}
        </div>
      </div>
    </div>
  );
}

// ─── Section: All Books ─────────────────────────────────────────────
function AllBooksSection({ onOpenPDF, onGetBook }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const r = await api.getAllBooks(search, category);
    if (r.success) setBooks(r.data);
    setLoading(false);
  }, [search, category]);

  useEffect(() => {
    const t = setTimeout(fetch, 350);
    return () => clearTimeout(t);
  }, [fetch]);
  useEffect(() => {
    api.getCategories().then((r) => {
      if (r.success) setCategories(r.data);
    });
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 24,
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
              color: "#334155",
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
              background: "#0a1020",
              border: "1px solid #1e3a5f",
              borderRadius: 12,
              padding: "11px 16px 11px 38px",
              color: "#e2e8f0",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#1e3a5f")}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            background: "#0a1020",
            border: "1px solid #1e3a5f",
            borderRadius: 12,
            padding: "11px 16px",
            color: "#e2e8f0",
            fontSize: 13,
            outline: "none",
            cursor: "pointer",
            minWidth: 150,
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}
        >
          <div style={{ fontSize: 36 }}>⏳</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onClick={() => onOpenPDF(book)}
              onGetBook={onGetBook}
            />
          ))}
          {books.length === 0 && (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "80px 0",
                color: "#334155",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                No books found
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Section: My Books ──────────────────────────────────────────────
function MyBooksSection({ refreshTrigger, onOpenPDF }) {
  const [books, setBooks] = useState([]);
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

  const getPdfUrl = (book) =>
    book.file ||
    book.pdf ||
    (book.pdfFile ? `http://localhost:5000/uploads/${book.pdfFile}` : "");

  return (
    <div>
      {loading ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}
        >
          <div style={{ fontSize: 36 }}>⏳</div>
        </div>
      ) : books.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔖</div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#475569",
              marginBottom: 8,
            }}
          >
            No books yet
          </div>
          <div style={{ fontSize: 13 }}>
            Browse the collection and get your first book!
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {books.map((book) => (
            <MyBookCard
              key={book._id}
              book={book}
              onClick={() =>
                onOpenPDF({
                  ...book,
                  name: book.bookName,
                  file: getPdfUrl(book),
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Expiring Soon ─────────────────────────────────────────
function ExpiringSoonSection({ onOpenPDF }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getExpiringBooks().then((r) => {
      if (r.success) setBooks(r.data);
      setLoading(false);
    });
  }, []);

  const getPdfUrl = (book) =>
    book.file ||
    book.pdf ||
    (book.pdfFile ? `http://localhost:5000/uploads/${book.pdfFile}` : "");

  return (
    <div>
      {loading ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}
        >
          <div style={{ fontSize: 36 }}>⏳</div>
        </div>
      ) : books.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#475569" }}>
            No expiring books!
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {books.map((book) => (
            <MyBookCard
              key={book._id}
              book={book}
              onClick={() =>
                onOpenPDF({
                  ...book,
                  name: book.bookName,
                  file: getPdfUrl(book),
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main User Page ─────────────────────────────────────────────────
const navItems = [
  { key: "all", icon: "📚", label: "All Books", desc: "Browse collection" },
  { key: "my", icon: "🔖", label: "My Books", desc: "Borrowed books" },
  {
    key: "expire",
    icon: "⏰",
    label: "Expiring Soon",
    desc: "Due within 3 days",
  },
];

export default function UserLibraryPage() {
  const [tab, setTab] = useState("all");
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

  const handleIssueSuccess = () => {
    setMyBooksRefresh((n) => n + 1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060d1a",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#e2e8f0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #1e3a5f; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        select option { background: #0f1629; color: #e2e8f0; }
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-track { background: #0a1020; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 240,
          background: "#0a1020",
          borderRight: "1px solid #1e3a5f",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
        }}
      >
        <div style={{ padding: "28px 20px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 4px 14px rgba(139,92,246,0.4)",
              }}
            >
              📖
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#e2e8f0" }}>
                LibraryOS
              </div>
              <div style={{ fontSize: 11, color: "#334155" }}>
                Student Portal
              </div>
            </div>
          </div>

          {/* Count pills */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 20,
            }}
          >
            {[
              { label: "Total Books", val: counts.all, col: "#3b82f6" },
              { label: "My Books", val: counts.my, col: "#8b5cf6" },
              { label: "Expiring", val: counts.expire, col: "#f59e0b" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                  background: `${s.col}08`,
                  borderRadius: 8,
                  border: `1px solid ${s.col}15`,
                }}
              >
                <span style={{ fontSize: 11, color: "#475569" }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.col }}>
                  {s.val}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#1e3a5f",
              letterSpacing: "1.5px",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Browse
          </div>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background:
                  tab === item.key ? "rgba(139,92,246,0.12)" : "transparent",
                color: tab === item.key ? "#a78bfa" : "#475569",
                fontWeight: tab === item.key ? 700 : 500,
                fontSize: 13,
                cursor: "pointer",
                marginBottom: 4,
                textAlign: "left",
                borderLeft:
                  tab === item.key
                    ? "2px solid #8b5cf6"
                    : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <div>
                <div>{item.label}</div>
                <div style={{ fontSize: 10, opacity: 0.6 }}>{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div
        style={{ marginLeft: 240, padding: "40px 48px", minHeight: "100vh" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                margin: 0,
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
              }}
            >
              {navItems.find((n) => n.key === tab)?.icon}{" "}
              {navItems.find((n) => n.key === tab)?.label}
            </h1>
            <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 13 }}>
              {navItems.find((n) => n.key === tab)?.desc}
            </p>
          </div>
          <div
            style={{
              background: "#0a1020",
              border: "1px solid #1e3a5f",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 12,
              color: "#334155",
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

        {/* Tab indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              style={{
                padding: "7px 16px",
                borderRadius: 20,
                background:
                  tab === item.key ? "rgba(139,92,246,0.15)" : "transparent",
                border:
                  tab === item.key
                    ? "1px solid rgba(139,92,246,0.4)"
                    : "1px solid #1e3a5f",
                color: tab === item.key ? "#a78bfa" : "#475569",
                fontWeight: tab === item.key ? 700 : 500,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Sections */}
        {tab === "all" && (
          <AllBooksSection
            onOpenPDF={(b) => setOpenBook(b)}
            onGetBook={(b) => setGetBookTarget(b)}
          />
        )}
        {tab === "my" && (
          <MyBooksSection
            refreshTrigger={myBooksRefresh}
            onOpenPDF={(b) => setOpenBook(b)}
          />
        )}
        {tab === "expire" && (
          <ExpiringSoonSection onOpenPDF={(b) => setOpenBook(b)} />
        )}
      </div>

      {/* Modals */}
      {openBook && (
        <PDFViewer book={openBook} onClose={() => setOpenBook(null)} />
      )}
      {getBookTarget && (
        <GetBookModal
          book={getBookTarget}
          onClose={() => setGetBookTarget(null)}
          onSuccess={handleIssueSuccess}
        />
      )}
    </div>
  );
}

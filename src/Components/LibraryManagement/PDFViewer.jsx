"use client";

import { useState } from "react";

// ─── PDF Viewer Modal ───────────────────────────────────────────────
export function PDFViewer({ book, onClose }) {
  const [isFull, setIsFull] = useState(false);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: isFull ? 0 : 20,
          width: isFull ? "100vw" : "min(92vw, 1000px)",
          height: isFull ? "100vh" : "min(90vh, 780px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          animation: "slideUp 0.25s ease",
          transition:
            "width 0.3s ease, height 0.3s ease, border-radius 0.3s ease",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1.5px solid #f1f5f9",
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: book.bg,
                border: `1.5px solid ${book.color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              📚
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                {book.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: book.color,
                  fontWeight: 600,
                  background: book.bg,
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 20,
                  border: `1px solid ${book.color}33`,
                }}
              >
                {book.category}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href={book.pdf}
              download
              title="Download"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eef2ff";
                e.currentTarget.style.color = "#6366f1";
                e.currentTarget.style.borderColor = "#c7d2fe";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 16, height: 16 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </a>
            <button
              title={isFull ? "Exit Fullscreen" : "Fullscreen"}
              onClick={() => setIsFull((f) => !f)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eef2ff";
                e.currentTarget.style.color = "#6366f1";
                e.currentTarget.style.borderColor = "#c7d2fe";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              {isFull ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 16, height: 16 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 16, height: 16 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={onClose}
              title="Close"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#fef2f2",
                border: "1.5px solid #fecaca",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ef4444",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fee2e2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fef2f2";
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ width: 15, height: 15 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF iframe */}
        <div style={{ flex: 1, background: "#f1f5f9", position: "relative" }}>
          <iframe
            src={book.pdf}
            title={book.name}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            padding: "10px 20px",
            background: "#f8fafc",
            borderTop: "1.5px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            📄 PDF Viewer — Click outside or press ✕ to close
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: book.color,
              background: book.bg,
              padding: "3px 10px",
              borderRadius: 20,
              border: `1px solid ${book.color}33`,
            }}
          >
            {book.name}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Get Book Modal (Issue Form) ────────────────────────────────────
export function GetBookModal({ book, onClose, onIssueBook }) {
  const [form, setForm] = useState({
    studentName: "",
    department: "",
    issueDate: "",
    endDate: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleIssueDate = (val) => {
    const issue = new Date(val);
    const end = new Date(issue);
    end.setDate(end.getDate() + 14);
    const endStr = end.toISOString().split("T")[0];
    setForm((f) => ({ ...f, issueDate: val, endDate: endStr }));
  };

  const handleSubmit = () => {
    if (!form.studentName || !form.department || !form.issueDate) return;
    if (onIssueBook) onIssueBook(book); // ← add to My Books
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 24,
          width: "min(92vw, 480px)",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${book.color}, ${book.color}cc)`,
            padding: "24px 28px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              📚
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>
                Issue Book
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                {book.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ width: 14, height: 14 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "28px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
                Book Issued!
              </div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 6 }}>
                Successfully issued to {form.studentName}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  label: "Student Name",
                  key: "studentName",
                  placeholder: "Enter full name",
                  type: "text",
                },
                {
                  label: "Department",
                  key: "department",
                  placeholder: "e.g. Computer Science",
                  type: "text",
                },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      marginBottom: 6,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {label.toUpperCase()}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      background: "#f8fafc",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "11px 14px",
                      fontSize: 14,
                      color: "#1e293b",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = book.color;
                      e.target.style.boxShadow = `0 0 0 3px ${book.color}18`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
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
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      marginBottom: 6,
                      letterSpacing: "0.5px",
                    }}
                  >
                    ISSUE DATE
                  </label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => handleIssueDate(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#f8fafc",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "11px 14px",
                      fontSize: 14,
                      color: "#1e293b",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = book.color;
                      e.target.style.boxShadow = `0 0 0 3px ${book.color}18`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      marginBottom: 6,
                      letterSpacing: "0.5px",
                    }}
                  >
                    END DATE{" "}
                    <span style={{ color: "#10b981", fontWeight: 600 }}>
                      (Auto)
                    </span>
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    readOnly
                    style={{
                      width: "100%",
                      background: "#f0fdf4",
                      border: "1.5px solid #bbf7d0",
                      borderRadius: 12,
                      padding: "11px 14px",
                      fontSize: 14,
                      color: "#15803d",
                      outline: "none",
                      boxSizing: "border-box",
                      cursor: "default",
                    }}
                  />
                </div>
              </div>

              {/* Book name (readonly) */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: 6,
                    letterSpacing: "0.5px",
                  }}
                >
                  BOOK NAME
                </label>
                <input
                  value={book.name}
                  readOnly
                  style={{
                    width: "100%",
                    background: book.bg,
                    border: `1.5px solid ${book.color}44`,
                    borderRadius: 12,
                    padding: "11px 14px",
                    fontSize: 14,
                    color: book.color,
                    fontWeight: 600,
                    outline: "none",
                    boxSizing: "border-box",
                    cursor: "default",
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                style={{
                  background: `linear-gradient(135deg, ${book.color}, ${book.color}cc)`,
                  border: "none",
                  borderRadius: 12,
                  padding: "13px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  marginTop: 4,
                  boxShadow: `0 6px 20px ${book.color}44`,
                  transition: "opacity 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                ✅ Confirm Issue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Book Card ──────────────────────────────────────────────────────
export function BookCard({ book, showDays, onClick, onGetBook }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 16,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 16px 36px rgba(0,0,0,0.1)`;
        e.currentTarget.style.borderColor = book.color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: book.color,
          borderRadius: "16px 16px 0 0",
        }}
      />

      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: book.bg,
          fontSize: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${book.color}33`,
        }}
      >
        📚
      </div>

      <div>
        <div
          style={{
            color: "#1e293b",
            fontWeight: 600,
            fontSize: 15,
            lineHeight: 1.3,
          }}
        >
          {book.name}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: book.color,
            background: book.bg,
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 20,
            fontWeight: 600,
            border: `1px solid ${book.color}33`,
          }}
        >
          {book.category}
        </div>
      </div>

      {showDays && book.days && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: book.days <= 3 ? "#ef4444" : "#f59e0b",
            fontSize: 12,
            fontWeight: 700,
            background: book.days <= 3 ? "#fef2f2" : "#fffbeb",
            padding: "4px 10px",
            borderRadius: 8,
            width: "fit-content",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 13, height: 13 }}
          >
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 6v6l4 2" />
          </svg>
          {book.days} day{book.days > 1 ? "s" : ""} left
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
        {/* Open PDF hint */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: "#94a3b8",
            flex: 1,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 12, height: 12 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
          Click to open PDF
        </div>

        {/* Get Book button (only when onGetBook provided) */}
        {onGetBook && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGetBook(book);
            }}
            style={{
              background: `linear-gradient(135deg, ${book.color}, ${book.color}bb)`,
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 11,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: `0 3px 10px ${book.color}44`,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            + Get Book
          </button>
        )}
      </div>
    </div>
  );
}

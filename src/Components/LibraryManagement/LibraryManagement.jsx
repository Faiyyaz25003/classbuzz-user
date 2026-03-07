"use client";

import { useState } from "react";

const allBooks = [
  {
    id: 1,
    name: "Math Book",
    category: "Science",
    color: "#f59e0b",
    bg: "#fffbeb",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 2,
    name: "Physics Book",
    category: "Science",
    color: "#3b82f6",
    bg: "#eff6ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 3,
    name: "Chemistry Book",
    category: "Science",
    color: "#10b981",
    bg: "#ecfdf5",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 4,
    name: "Biology Book",
    category: "Science",
    color: "#ef4444",
    bg: "#fef2f2",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 5,
    name: "English Grammar",
    category: "Language",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 6,
    name: "Computer Science",
    category: "Tech",
    color: "#06b6d4",
    bg: "#ecfeff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 7,
    name: "JavaScript Guide",
    category: "Tech",
    color: "#f59e0b",
    bg: "#fffbeb",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 8,
    name: "React Handbook",
    category: "Tech",
    color: "#3b82f6",
    bg: "#eff6ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 9,
    name: "NextJS Basics",
    category: "Tech",
    color: "#6366f1",
    bg: "#eef2ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 10,
    name: "Tailwind CSS",
    category: "Tech",
    color: "#14b8a6",
    bg: "#f0fdfa",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
];

const myBooks = [
  {
    id: 1,
    name: "Math Book",
    category: "Science",
    color: "#f59e0b",
    bg: "#fffbeb",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 2,
    name: "Physics Book",
    category: "Science",
    color: "#3b82f6",
    bg: "#eff6ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 3,
    name: "JavaScript Guide",
    category: "Tech",
    color: "#f59e0b",
    bg: "#fffbeb",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 4,
    name: "React Handbook",
    category: "Tech",
    color: "#3b82f6",
    bg: "#eff6ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 5,
    name: "NextJS Basics",
    category: "Tech",
    color: "#6366f1",
    bg: "#eef2ff",
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
];

const expireBooks = [
  {
    id: 1,
    name: "Math Book",
    category: "Science",
    color: "#f59e0b",
    bg: "#fffbeb",
    days: 2,
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 2,
    name: "Physics Book",
    category: "Science",
    color: "#3b82f6",
    bg: "#eff6ff",
    days: 5,
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
  {
    id: 3,
    name: "React Handbook",
    category: "Tech",
    color: "#3b82f6",
    bg: "#eff6ff",
    days: 7,
    pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
  },
];

const cardConfigs = [
  {
    key: "all",
    label: "All Books",
    sublabel: `${allBooks.length} titles`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: 34, height: 34 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
    color: "#6366f1",
    lightBg: "#eef2ff",
    border: "#c7d2fe",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  },
  {
    key: "my",
    label: "My Books",
    sublabel: `${myBooks.length} borrowed`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: 34, height: 34 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    ),
    color: "#ec4899",
    lightBg: "#fdf2f8",
    border: "#fbcfe8",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
  },
  {
    key: "expire",
    label: "Expiring Soon",
    sublabel: "Within 7 days",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: 34, height: 34 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "#f59e0b",
    lightBg: "#fffbeb",
    border: "#fde68a",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
  },
];

// ─── PDF Viewer Modal ───────────────────────────────────────────────
function PDFViewer({ book, onClose }) {
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
          {/* Left: book info */}
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

          {/* Right: action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Download */}
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

            {/* Fullscreen toggle */}
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

            {/* Close */}
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

// ─── Book Card ──────────────────────────────────────────────────────
function BookCard({ book, showDays, onClick }) {
  return (
    <div
      onClick={onClick}
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

      {/* Open hint */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 11,
          color: "#94a3b8",
          marginTop: "auto",
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
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────
export default function LibraryPage() {
  const [active, setActive] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [openBook, setOpenBook] = useState(null);

  const getBooks = () => {
    if (active === "all") return allBooks;
    if (active === "my") return myBooks;
    if (active === "expire") return expireBooks;
    return [];
  };

  const activeConfig = cardConfigs.find((c) => c.key === active);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => setUploading(false), 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#1e293b",
              padding: "40px 48px",
              marginTop: "30px",
        marginLeft: "300px",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 36,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: 12,
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
              }}
            >
              📖
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                margin: 0,
                color: "#0f172a",
                letterSpacing: "-0.5px",
              }}
            >
              User Library
            </h1>
          </div>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>
            Manage, browse and upload your educational resources
          </p>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 12,
            padding: "8px 16px",
            fontSize: 13,
            color: "#64748b",
            fontWeight: 500,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
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

      {/* Upload Section */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #e0e7ff",
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 36,
          boxShadow: "0 2px 12px rgba(99,102,241,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "#eef2ff",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              style={{ width: 16, height: 16 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 14 }}>
            Upload New Resource
          </span>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {["Course", "Subject", "Book Name"].map((placeholder) => (
            <input
              key={placeholder}
              placeholder={placeholder}
              style={{
                flex: "1 1 180px",
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                padding: "11px 16px",
                color: "#1e293b",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
              }}
            />
          ))}
          <button
            onClick={handleUpload}
            style={{
              background: uploading
                ? "#c7d2fe"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: 12,
              padding: "11px 28px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              boxShadow: uploading ? "none" : "0 4px 14px rgba(99,102,241,0.3)",
              transition: "all 0.2s",
            }}
          >
            {uploading ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    width: 16,
                    height: 16,
                    animation: "spin 1s linear infinite",
                  }}
                >
                  <path
                    d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                    strokeLinecap="round"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              <>
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
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Upload PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Cards */}
      {!active && (
        <>
          <div
            style={{
              marginBottom: 16,
              color: "#94a3b8",
              fontSize: 12,
              letterSpacing: "1.5px",
              fontWeight: 700,
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
            {cardConfigs.map((cfg) => (
              <div
                key={cfg.key}
                onClick={() => setActive(cfg.key)}
                style={{
                  background: "#fff",
                  border: `1.5px solid ${cfg.border}`,
                  borderRadius: 20,
                  padding: "28px 26px",
                  cursor: "pointer",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.05)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: cfg.gradient,
                    borderRadius: "20px 20px 0 0",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: cfg.lightBg,
                  }}
                />
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: cfg.lightBg,
                    color: cfg.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                    border: `1.5px solid ${cfg.border}`,
                    position: "relative",
                  }}
                >
                  {cfg.icon}
                </div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 4,
                  }}
                >
                  {cfg.label}
                </div>
                <div
                  style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}
                >
                  {cfg.sublabel}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: cfg.lightBg,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: cfg.color,
                  }}
                >
                  Browse →
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Books Grid */}
      {active && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <button
              onClick={() => setActive(null)}
              style={{
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                padding: "8px 18px",
                color: "#64748b",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.color = "#1e293b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#64748b";
              }}
            >
              ← Back
            </button>
            <div>
              <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a" }}>
                {activeConfig?.label}
              </div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>
                {getBooks().length} books found
              </div>
            </div>
          </div>

          {/* Search */}
          <div
            style={{ position: "relative", marginBottom: 24, maxWidth: 380 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 16,
                height: 16,
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            <input
              placeholder="Search books..."
              style={{
                width: "100%",
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                padding: "11px 16px 11px 40px",
                color: "#1e293b",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = activeConfig?.color || "#6366f1";
                e.target.style.boxShadow = `0 0 0 3px ${activeConfig?.color || "#6366f1"}18`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {getBooks().map((book) => (
              <BookCard
                key={book.id}
                book={book}
                showDays={active === "expire"}
                onClick={() => setOpenBook(book)}
              />
            ))}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {openBook && (
        <PDFViewer book={openBook} onClose={() => setOpenBook(null)} />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        input::placeholder { color: #cbd5e1; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

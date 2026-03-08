// "use client";

import { useState, useMemo } from "react";
import { BookCard, PDFViewer, GetBookModal } from "./PDFViewer";

const allBooks = [
  { id: 1, name: "Math Book", category: "Science", color: "#f59e0b", bg: "#fffbeb", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 2, name: "Physics Book", category: "Science", color: "#3b82f6", bg: "#eff6ff", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 3, name: "Chemistry Book", category: "Science", color: "#10b981", bg: "#ecfdf5", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 4, name: "Biology Book", category: "Science", color: "#ef4444", bg: "#fef2f2", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 5, name: "English Grammar", category: "Language", color: "#8b5cf6", bg: "#f5f3ff", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 6, name: "Computer Science", category: "Tech", color: "#06b6d4", bg: "#ecfeff", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 7, name: "JavaScript Guide", category: "Tech", color: "#f59e0b", bg: "#fffbeb", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 8, name: "React Handbook", category: "Tech", color: "#3b82f6", bg: "#eff6ff", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 9, name: "NextJS Basics", category: "Tech", color: "#6366f1", bg: "#eef2ff", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 10, name: "Tailwind CSS", category: "Tech", color: "#14b8a6", bg: "#f0fdfa", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
];

const initialMyBooks = [
  { id: 1, name: "Math Book", category: "Science", color: "#f59e0b", bg: "#fffbeb", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 2, name: "Physics Book", category: "Science", color: "#3b82f6", bg: "#eff6ff", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 3, name: "JavaScript Guide", category: "Tech", color: "#f59e0b", bg: "#fffbeb", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 4, name: "React Handbook", category: "Tech", color: "#3b82f6", bg: "#eff6ff", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 5, name: "NextJS Basics", category: "Tech", color: "#6366f1", bg: "#eef2ff", pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
];

const expireBooks = [
  { id: 1, name: "Math Book", category: "Science", color: "#f59e0b", bg: "#fffbeb", days: 2, pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 2, name: "Physics Book", category: "Science", color: "#3b82f6", bg: "#eff6ff", days: 5, pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
  { id: 3, name: "React Handbook", category: "Tech", color: "#3b82f6", bg: "#eff6ff", days: 7, pdf: "https://www.w3.org/WAI/WCAG21/wcag21.pdf" },
];

const cardConfigs = [
  {
    key: "all", label: "All Books", sublabel: `${allBooks.length} titles`,
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 34, height: 34 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>),
    color: "#6366f1", lightBg: "#eef2ff", border: "#c7d2fe",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  },
  {
    key: "my", label: "My Books", sublabel: `borrowed`,
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 34, height: 34 }}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>),
    color: "#ec4899", lightBg: "#fdf2f8", border: "#fbcfe8",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
  },
  {
    key: "expire", label: "Expiring Soon", sublabel: "Within 7 days",
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 34, height: 34 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
    color: "#f59e0b", lightBg: "#fffbeb", border: "#fde68a",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
  },
];

// ─── Section View (with search + category filter) ───────────────────
function SectionView({ sectionKey, books, config, onBack, onOpenPDF, onGetBook }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const categories = useMemo(() => {
    const cats = [...new Set(books.map((b) => b.category))];
    return ["All", ...cats];
  }, [books]);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "All" || b.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [books, search, catFilter]);

  return (
    <div>
      {/* Back + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <button
          onClick={onBack}
          style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "8px 18px", color: "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#1e293b"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#64748b"; }}
        >
          ← Back
        </button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a" }}>{config?.label}</div>
          <div style={{ color: "#94a3b8", fontSize: 13 }}>{filtered.length} books found</div>
        </div>
      </div>

      {/* Search + Filter Row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 380 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16 }}>
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "11px 16px 11px 40px", color: "#1e293b", fontSize: 14, outline: "none", boxSizing: "border-box", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "border-color 0.2s, box-shadow 0.2s" }}
            onFocus={(e) => { e.target.style.borderColor = config?.color || "#6366f1"; e.target.style.boxShadow = `0 0 0 3px ${config?.color || "#6366f1"}18`; }}
            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
          />
        </div>

        {/* Category Dropdown */}
        <div style={{ position: "relative" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, pointerEvents: "none" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
          </svg>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{ appearance: "none", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "11px 36px 11px 36px", color: "#1e293b", fontSize: 13, fontWeight: 600, outline: "none", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", minWidth: 150, transition: "border-color 0.2s" }}
            onFocus={(e) => { e.target.style.borderColor = config?.color || "#6366f1"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
          >
            {categories.map((c) => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, pointerEvents: "none" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Books Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>No books found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Try a different search or category</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              showDays={sectionKey === "expire"}
              onClick={() => onOpenPDF(book)}
              onGetBook={sectionKey === "all" ? onGetBook : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────
export default function LibraryPage() {
  const [active, setActive] = useState(null);
  const [openBook, setOpenBook] = useState(null);
  const [getBookTarget, setGetBookTarget] = useState(null);
  const [myBooks, setMyBooks] = useState(initialMyBooks);

  const handleIssueBook = (book) => {
    // Add to myBooks if not already present
    setMyBooks((prev) => {
      const alreadyExists = prev.some((b) => b.name === book.name);
      if (alreadyExists) return prev;
      return [...prev, { ...book, id: Date.now() }];
    });
  };

  const getBooksForSection = (key) => {
    if (key === "all") return allBooks;
    if (key === "my") return myBooks;
    if (key === "expire") return expireBooks;
    return [];
  };

  const activeConfig = cardConfigs.find((c) => c.key === active);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', sans-serif", color: "#1e293b", padding: "40px 48px", marginTop: "30px", marginLeft: "300px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 42, height: 42, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 12, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}>📖</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: "#0f172a", letterSpacing: "-0.5px" }}>User Library</h1>
          </div>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>Manage, browse and upload your educational resources</p>
        </div>
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "8px 16px", fontSize: 13, color: "#64748b", fontWeight: 500, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          📅 {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* Category Cards */}
      {!active && (
        <>
          <div style={{ marginBottom: 16, color: "#94a3b8", fontSize: 12, letterSpacing: "1.5px", fontWeight: 700 }}>BROWSE COLLECTION</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {cardConfigs.map((cfg) => (
              <div
                key={cfg.key}
                onClick={() => setActive(cfg.key)}
                style={{ background: "#fff", border: `1.5px solid ${cfg.border}`, borderRadius: 20, padding: "28px 26px", cursor: "pointer", transition: "transform 0.25s ease, box-shadow 0.25s ease", position: "relative", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: cfg.gradient, borderRadius: "20px 20px 0 0" }} />
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: cfg.lightBg }} />
                <div style={{ width: 52, height: 52, borderRadius: 14, background: cfg.lightBg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, border: `1.5px solid ${cfg.border}`, position: "relative" }}>{cfg.icon}</div>
                <div style={{ fontSize: 21, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{cfg.label}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>{cfg.key === "my" ? `${myBooks.length} borrowed` : cfg.sublabel}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: cfg.lightBg, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: cfg.color }}>Browse →</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Section View */}
      {active && (
        <SectionView
          sectionKey={active}
          books={getBooksForSection(active)}
          config={activeConfig}
          onBack={() => setActive(null)}
          onOpenPDF={setOpenBook}
          onGetBook={setGetBookTarget}
        />
      )}

      {/* PDF Viewer Modal */}
      {openBook && <PDFViewer book={openBook} onClose={() => setOpenBook(null)} />}

      {/* Get Book Modal */}
      {getBookTarget && <GetBookModal book={getBookTarget} onClose={() => setGetBookTarget(null)} onIssueBook={handleIssueBook} />}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        input::placeholder { color: #cbd5e1; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
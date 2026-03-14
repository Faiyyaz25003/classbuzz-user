import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ISOLATION WRAPPER
// Ye wrapper ClassBuzz ke sidebar/navbar ko protect karta hai.
// .cb-student-root ke andar hi sari CSS apply hogi — bahar kuch nahi jayega.
// ─────────────────────────────────────────────────────────────────────────────
const Isolated = ({ children }) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
      .cb-student-root { all: initial; display: block; font-family: 'DM Sans', sans-serif; }
      .cb-student-root *, .cb-student-root *::before, .cb-student-root *::after { box-sizing: border-box; }
      .cb-student-root button,
      .cb-student-root input { font-family: 'DM Sans', sans-serif; }
      .cb-student-root ::-webkit-scrollbar { width: 4px; }
      .cb-student-root ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
      @keyframes cb-pulse2 { 0%,100%{opacity:1} 50%{opacity:.4} }
    `}</style>
    <div className="cb-student-root">{children}</div>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
];
const avatarColor = (n) =>
  AVATAR_COLORS[
    (n.charCodeAt(0) + (n.charCodeAt(1) || 0)) % AVATAR_COLORS.length
  ];
const initials = (n) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Reusable inline style objects — koi global class nahi
const S = {
  page: {
    minHeight: "100vh",
    background: "#f0f0ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    border: "1.5px solid #e5e7eb",
    padding: 14,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1.5px solid #e5e7eb",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
    color: "#1e1b4b",
    display: "block",
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    display: "block",
    marginBottom: 5,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 28 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: avatarColor(name),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 700,
      fontSize: size * 0.36,
      flexShrink: 0,
    }}
  >
    {initials(name)}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_CHAT = [
  {
    id: 1,
    author: "Mentor",
    role: "mentor",
    text: "Aaj hum Quadratic Equations padhenge 📚",
  },
  { id: 2, author: "Riya Sharma", role: "student", text: "Sir ready hoon! 🙋" },
  {
    id: 3,
    author: "Aman Mehta",
    role: "student",
    text: "Mujhe step 2 samajh nahi aata",
  },
  {
    id: 4,
    author: "Mentor",
    role: "mentor",
    text: "Aman, abhi whiteboard pe explain karta hoon",
  },
];
const MOCK_PARTICIPANTS = [
  { id: 1, name: "Riya Sharma", muted: false },
  { id: 2, name: "Aman Mehta", muted: true },
  { id: 3, name: "Priya Kaur", muted: false },
];
const MOCK_FILES = [
  "Notes_Quadratic.pdf",
  "Practice_Set_3.pdf",
  "Formula_Sheet.pdf",
];

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 1 — JOIN ROOM
// ─────────────────────────────────────────────────────────────────────────────
function JoinRoom({ onJoined }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (!name.trim()) {
      setError("Apna naam likhein");
      return;
    }
    if (code.trim().length < 4) {
      setError("Valid room code likhein");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate API — replace with real call
    setTimeout(() => {
      setLoading(false);
      onJoined({
        code: code.toUpperCase().trim(),
        studentName: name.trim(),
        subject: "Mathematics",
        topic: "Quadratic Equations",
      });
    }, 1200);
  };

  return (
    <div style={S.page}>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #e5e7eb",
          padding: "36px 32px",
          width: "100%",
          maxWidth: 420,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 26,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            🚪
          </div>
          <div>
            <p
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#1e1b4b",
                margin: 0,
              }}
            >
              Room Join Karein
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
              Student / User Panel
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 12,
              color: "#dc2626",
              marginBottom: 16,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Name */}
          <div>
            <label style={S.label}>👤 Aapka Naam *</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Riya Sharma"
              style={S.input}
            />
          </div>

          {/* Code */}
          <div>
            <label style={S.label}>🔑 Room Code *</label>
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="MATH-4X9K"
              maxLength={9}
              style={{
                ...S.input,
                fontSize: 24,
                fontWeight: 800,
                fontFamily: "monospace",
                letterSpacing: 4,
                textAlign: "center",
                color: "#4338ca",
                border: "2px solid #c7d2fe",
                padding: "14px 12px",
              }}
            />
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>
              Mentor ne jo code share kiya hai wo yahan daalen
            </p>
          </div>

          {/* Join btn */}
          <button
            onClick={handleJoin}
            disabled={loading}
            style={{
              padding: "13px",
              borderRadius: 10,
              background: loading ? "#a5b4fc" : "#6366f1",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 4,
            }}
          >
            {loading ? "⏳ Room Dhundh Raha Hoon..." : "🚀 Room Join Karein"}
          </button>
        </div>

        {/* Demo hint */}
        <div
          style={{
            marginTop: 22,
            background: "#fef9c3",
            border: "1px solid #fde68a",
            borderRadius: 10,
            padding: "10px 14px",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#92400e",
              marginBottom: 3,
            }}
          >
            💡 Demo ke liye
          </p>
          <p style={{ fontSize: 11, color: "#78350f", margin: 0 }}>
            Koi bhi naam aur code daalo — e.g. <b>MATH-4X9K</b>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — STUDENT ROOM
// ─────────────────────────────────────────────────────────────────────────────
function StudentRoom({ room, onLeaveRoom }) {
  const [chat, setChat] = useState(MOCK_CHAT);
  const [msg, setMsg] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [dots, setDots] = useState([]);

  const sendMsg = () => {
    if (!msg.trim()) return;
    setChat((c) => [
      ...c,
      { id: Date.now(), author: room.studentName, role: "student", text: msg },
    ]);
    setMsg("");
  };
  const wbClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setDots((d) => [...d, { x: e.clientX - r.left, y: e.clientY - r.top }]);
  };

  return (
    <div style={{ background: "#f0f0ff", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1.5px solid #e5e7eb",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          marginTop: "70px",
          marginLeft: "300px",
          gap: 12,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: "#22c55e",
            flexShrink: 0,
          }}
        />
        <div>
          <p
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: "#1e1b4b",
              margin: 0,
            }}
          >
            Room: {room.subject}
          </p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
            Topic: {room.topic} · 12 students online
          </p>
        </div>
        {/* Room code pill */}
        <div
          style={{
            background: "#f5f3ff",
            border: "1px solid #c7d2fe",
            borderRadius: 20,
            padding: "5px 16px",
            fontSize: 14,
            fontWeight: 800,
            color: "#4338ca",
            fontFamily: "monospace",
            letterSpacing: 3,
          }}
        >
          {room.code}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={() => setMicOn((m) => !m)}
            style={{
              padding: "6px 13px",
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              background: micOn ? "#f9fafb" : "#fee2e2",
              color: micOn ? "#374151" : "#ef4444",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {micOn ? "🎙 Mute" : "🔇 Muted"}
          </button>
          <button
            onClick={() => setCamOn((c) => !c)}
            style={{
              padding: "6px 13px",
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              background: camOn ? "#f9fafb" : "#fee2e2",
              color: camOn ? "#374151" : "#ef4444",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {camOn ? "📷 On" : "📷 Off"}
          </button>
          <button
            onClick={onLeaveRoom}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "1.5px solid #fca5a5",
              background: "#fff",
              color: "#ef4444",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: "flex", gap: 14, padding: "14px 18px" }}>
        {/* MAIN */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
            marginLeft: "300px",
          }}
        >
          {/* Whiteboard */}
          <div
            style={{
              ...S.card,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 13, color: "#1e1b4b" }}>
                Whiteboard
              </span>
              <span
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #86efac",
                  color: "#15803d",
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 5,
                  padding: "2px 7px",
                }}
              >
                Live
              </span>
              {["✏️ Pen", "◻ Shapes", "T Text", "🗑 Clear"].map((t) => (
                <button
                  key={t}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1.5px solid #e5e7eb",
                    background: "#f9fafb",
                    fontSize: 11,
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            {/* Canvas */}
            <div
              onClick={wbClick}
              style={{
                background: "#fafafa",
                borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                flex: 1,
                minHeight: 230,
                position: "relative",
                cursor: "crosshair",
                overflow: "hidden",
              }}
            >
              <svg
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.05,
                  pointerEvents: "none",
                }}
              >
                <defs>
                  <pattern
                    id="cbdg2"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r="1" fill="#6366f1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cbdg2)" />
              </svg>
              <div style={{ padding: "16px 20px", position: "relative" }}>
                <p
                  style={{
                    fontSize: 11,
                    color: "#9ca3af",
                    fontFamily: "monospace",
                    marginBottom: 8,
                  }}
                >
                  {room.topic} — Mentor presenting
                </p>
                <div
                  style={{
                    background: "#fef3c7",
                    border: "2px solid #f59e0b",
                    borderRadius: 8,
                    display: "inline-block",
                    padding: "5px 14px",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 14,
                      color: "#1e1b4b",
                      fontWeight: 700,
                    }}
                  >
                    x = (−b ± √(b²−4ac)) / 2a
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    fontFamily: "monospace",
                  }}
                >
                  Example: x² + 5x + 6 = 0
                </p>
              </div>
              {dots.map((d, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: d.x - 3,
                    top: d.y - 3,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#f59e0b",
                    pointerEvents: "none",
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "#dcfce7",
                  border: "1px solid #86efac",
                  borderRadius: 20,
                  padding: "3px 9px",
                  fontSize: 10,
                  color: "#15803d",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                    animation: "cb-pulse2 1.5s infinite",
                  }}
                />
                Live sync
              </div>
            </div>
          </div>

          {/* Chat + Resources */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* Chat */}
            <div
              style={{
                ...S.card,
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#1e1b4b",
                  marginBottom: 10,
                }}
              >
                Room Chat
              </p>
              <div
                style={{
                  height: 110,
                  overflowY: "auto",
                  marginBottom: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {chat.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      gap: 7,
                      alignItems: "flex-start",
                    }}
                  >
                    <Avatar name={m.author} size={22} />
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color:
                            m.role === "mentor"
                              ? "#6366f1"
                              : m.author === room.studentName
                                ? "#10b981"
                                : "#f59e0b",
                        }}
                      >
                        {m.author === room.studentName ? "You" : m.author}
                      </span>
                      <p
                        style={{ fontSize: 12, color: "#374151", marginTop: 1 }}
                      >
                        {m.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                  placeholder="Message ya doubt type karo..."
                  style={{ ...S.input, padding: "8px 11px", fontSize: 12 }}
                />
                <button
                  onClick={sendMsg}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: "#6366f1",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </div>
            </div>

            {/* Resources */}
            <div style={{ ...S.card, width: 210 }}>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#1e1b4b",
                  marginBottom: 10,
                }}
              >
                Screen / Resources
              </p>
              <div
                style={{
                  background: "#1e1b4b",
                  borderRadius: 8,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 10, color: "#a78bfa" }}>
                  🖥 Mentor's screen — live
                </span>
              </div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 7,
                }}
              >
                Shared Files
              </p>
              {MOCK_FILES.map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#374151" }}>
                    📄 {f.length > 18 ? f.slice(0, 18) + "…" : f}
                  </span>
                  <button
                    style={{
                      fontSize: 12,
                      color: "#6366f1",
                      fontWeight: 700,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    ↓
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div
          style={{
            width: 210,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flexShrink: 0,
          }}
        >
          {/* Mentor tile */}
          <div
            style={{
              background: "#1e1b4b",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 110,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar name="Mentor" size={52} />
            </div>
            <div
              style={{
                background: "rgba(0,0,0,0.4)",
                padding: "7px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>
                Room Mentor
              </span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
            </div>
            <p
              style={{
                fontSize: 11,
                textAlign: "center",
                color: "#a78bfa",
                padding: "4px 0 8px",
                margin: 0,
              }}
            >
              Mentor
            </p>
          </div>

          {/* Participants */}
          <div style={{ ...S.card, flex: 1 }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#1e1b4b",
                marginBottom: 10,
              }}
            >
              Participants
            </p>
            {/* Self */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <Avatar name={room.studentName} size={26} />
              <span
                style={{
                  fontSize: 12,
                  color: "#374151",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {room.studentName}
              </span>
              <span
                style={{
                  fontSize: 10,
                  background: "#dcfce7",
                  color: "#15803d",
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontWeight: 600,
                }}
              >
                You
              </span>
            </div>
            {MOCK_PARTICIPANTS.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Avatar name={s.name} size={26} />
                <span
                  style={{
                    fontSize: 12,
                    color: "#374151",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.name}
                </span>
                <span style={{ fontSize: 10 }}>{s.muted ? "🔇" : "✏️"}</span>
              </div>
            ))}
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
              +9 more
            </p>
          </div>

          {/* Mic + Cam */}
          <div
            style={{
              ...S.card,
              flexDirection: "row",
              display: "flex",
              gap: 8,
              padding: 12,
            }}
          >
            <button
              onClick={() => setMicOn((m) => !m)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                border: "1.5px solid #e5e7eb",
                background: micOn ? "#f9fafb" : "#fee2e2",
                color: micOn ? "#374151" : "#ef4444",
                fontWeight: 600,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {micOn ? "🎙 Mute" : "🔇 Muted"}
            </button>
            <button
              onClick={() => setCamOn((c) => !c)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                border: "1.5px solid #e5e7eb",
                background: camOn ? "#f9fafb" : "#fee2e2",
                color: camOn ? "#374151" : "#ef4444",
                fontWeight: 600,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {camOn ? "📷 On" : "📷 Off"}
            </button>
          </div>

          {/* Raise Hand */}
          <button
            onClick={() => setHandRaised((h) => !h)}
            style={{
              padding: "13px",
              borderRadius: 12,
              border: `2px solid ${handRaised ? "#f59e0b" : "#e5e7eb"}`,
              background: handRaised ? "#fef3c7" : "#fff",
              fontWeight: 700,
              fontSize: 12,
              color: handRaised ? "#d97706" : "#374151",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {handRaised ? "✋ Hand Raised!" : "🖐 Raise Hand / Doubt"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — StudentApp
// Pura app Isolated wrapper ke andar — ClassBuzz sidebar safe rahega
// ─────────────────────────────────────────────────────────────────────────────
export default function StudentApp() {
  const [screen, setScreen] = useState("join");
  const [room, setRoom] = useState(null);

  return (
    <Isolated>
      {screen === "join" && (
        <JoinRoom
          onJoined={(rd) => {
            setRoom(rd);
            setScreen("room");
          }}
        />
      )}
      {screen === "room" && (
        <StudentRoom
          room={room}
          onLeaveRoom={() => {
            setRoom(null);
            setScreen("join");
          }}
        />
      )}
    </Isolated>
  );
}

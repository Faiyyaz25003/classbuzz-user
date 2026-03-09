
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

const API = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

// ── Helpers ───────────────────────────────────────────────
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

// ── Avatar ────────────────────────────────────────────────
const Avatar = ({ src, name, size = 40, online }) => (
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
          fontFamily: "'DM Sans', sans-serif",
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

// ── Status Tick ───────────────────────────────────────────
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

// ── Poll Bubble ───────────────────────────────────────────
const PollBubble = ({
  pollData,
  isMine,
  time,
  status,
  messageId,
  currentUserId,
  socket,
}) => {
  const [votes, setVotes] = useState(pollData?.votes || {});
  const [myVotes, setMyVotes] = useState(new Set());

  // Sync if pollData.votes updated from server
  useEffect(() => {
    if (pollData?.votes) setVotes(pollData.votes);
    if (pollData?.voters && currentUserId && pollData.voters[currentUserId]) {
      setMyVotes(new Set(pollData.voters[currentUserId]));
    }
  }, [pollData]);

  const total = Object.values(votes).reduce((a, b) => Number(a) + Number(b), 0);

  const handleVote = (idx) => {
    if (!pollData.allowMultiple) {
      if (myVotes.has(idx)) return;
      const prev = [...myVotes][0];
      setVotes((p) => {
        const n = { ...p };
        if (prev !== undefined)
          n[prev] = Math.max(0, (Number(n[prev]) || 1) - 1);
        n[idx] = (Number(n[idx]) || 0) + 1;
        return n;
      });
      setMyVotes(new Set([idx]));
    } else {
      if (myVotes.has(idx)) return;
      setVotes((p) => ({ ...p, [idx]: (Number(p[idx]) || 0) + 1 }));
      setMyVotes((p) => new Set([...p, idx]));
    }
    // Emit vote to backend
    socket?.emit("poll:vote", {
      messageId,
      userId: currentUserId,
      optionIndex: idx,
    });
  };

  const pct = (idx) =>
    total === 0 ? 0 : Math.round(((Number(votes[idx]) || 0) / total) * 100);

  return (
    <div
      style={{
        background: isMine ? "#d9fdd3" : "#fff",
        borderRadius: 10,
        minWidth: 260,
        maxWidth: 320,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ padding: "14px 16px 10px" }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#111b21",
            lineHeight: 1.4,
            marginBottom: 6,
          }}
        >
          {pollData.question}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#25D366"
            strokeWidth="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ fontSize: 12, color: "#667781" }}>
            {pollData.allowMultiple ? "Select multiple" : "Select one"}
          </span>
        </div>
      </div>

      <div style={{ height: 1, background: isMine ? "#b2dfb0" : "#e9e9e9" }} />

      <div style={{ padding: "4px 0" }}>
        {pollData.options.map((opt, idx) => {
          const voted = myVotes.has(idx);
          const p = pct(idx);
          return (
            <div
              key={idx}
              onClick={() => handleVote(idx)}
              style={{
                padding: "6px 16px",
                cursor: "pointer",
                position: "relative",
                marginBottom: 2,
              }}
            >
              {total > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    top: 4,
                    bottom: 4,
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${p}%`,
                      height: "100%",
                      background: voted
                        ? "rgba(37,211,102,0.22)"
                        : "rgba(0,0,0,0.06)",
                      transition: "width 0.4s ease",
                      borderRadius: 6,
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  zIndex: 1,
                  padding: "4px 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${voted ? "#25D366" : "#b2b9bf"}`,
                      background: voted ? "#25D366" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.18s",
                    }}
                  >
                    {voted && (
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      color: "#111b21",
                      fontWeight: voted ? 600 : 400,
                    }}
                  >
                    {opt}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: "#667781",
                    fontWeight: 500,
                    marginLeft: 8,
                    flexShrink: 0,
                  }}
                >
                  {Number(votes[idx]) || 0}
                </span>
              </div>
              {total > 0 && (
                <div
                  style={{
                    height: 2.5,
                    borderRadius: 2,
                    background: "rgba(0,0,0,0.07)",
                    overflow: "hidden",
                    marginTop: 2,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: `${p}%`,
                      height: "100%",
                      background: voted ? "#25D366" : "#a8c9a0",
                      transition: "width 0.4s ease",
                      borderRadius: 2,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ height: 1, background: isMine ? "#b2dfb0" : "#e9e9e9" }} />
      <div
        style={{
          padding: "7px 16px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "#667781" }}>
          {total > 0
            ? `${total} vote${total !== 1 ? "s" : ""}`
            : "No votes yet"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: "#667781" }}>{time}</span>
          {isMine && <StatusTick status={status} />}
        </div>
      </div>
    </div>
  );
};

// ── Photo Bubble ──────────────────────────────────────────
const PhotoBubble = ({ src, isMine, time, status }) => {
  const [fs, setFs] = useState(false);
  return (
    <>
      <div
        style={{
          borderRadius: isMine ? "8px 0 8px 8px" : "0 8px 8px 8px",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          maxWidth: 280,
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
        onClick={() => setFs(true)}
      >
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            display: "block",
            maxHeight: 320,
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: 8,
            display: "flex",
            alignItems: "center",
            gap: 3,
            background: "rgba(0,0,0,0.45)",
            borderRadius: 10,
            padding: "2px 7px",
          }}
        >
          <span style={{ fontSize: 11, color: "#fff" }}>{time}</span>
          {isMine && <StatusTick status={status} light />}
        </div>
      </div>
      {fs && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.96)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setFs(false)}
        >
          <button
            onClick={() => setFs(false)}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.13)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <img
            src={src}
            alt=""
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

// ── Document Bubble ───────────────────────────────────────
const DocumentBubble = ({ docData, isMine, time, status }) => {
  const ext = docData.name?.split(".").pop()?.toUpperCase() || "FILE";
  const colorMap = {
    PDF: ["#fde8e8", "#c62828"],
    DOC: ["#e3f0ff", "#1565c0"],
    DOCX: ["#e3f0ff", "#1565c0"],
    XLS: ["#e8f5e9", "#2e7d32"],
    XLSX: ["#e8f5e9", "#2e7d32"],
    PPT: ["#fff3e0", "#e65100"],
    PPTX: ["#fff3e0", "#e65100"],
    MP3: ["#fce4ec", "#880e4f"],
    MP4: ["#e8eaf6", "#283593"],
    PNG: ["#f3e5f5", "#6a1b9a"],
    JPG: ["#f3e5f5", "#6a1b9a"],
    JPEG: ["#f3e5f5", "#6a1b9a"],
  };
  const [bg, col] = colorMap[ext] || ["#eceff1", "#455a64"];
  const sizeStr =
    docData.size < 1024 * 1024
      ? `${Math.round(docData.size / 1024)} KB`
      : `${(docData.size / (1024 * 1024)).toFixed(1)} MB`;

  const download = () => {
    if (docData.dataUrl) {
      const a = document.createElement("a");
      a.href = docData.dataUrl;
      a.download = docData.name;
      a.click();
    }
  };

  return (
    <div
      style={{
        background: isMine ? "#005c4b" : "#202c33",
        borderRadius: isMine ? "8px 0 8px 8px" : "0 8px 8px 8px",
        padding: "10px 12px",
        minWidth: 230,
        maxWidth: 300,
        boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 8,
            background: bg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            gap: 1,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              fill={bg}
              stroke={col}
              strokeWidth="1.8"
            />
            <polyline
              points="14 2 14 8 20 8"
              stroke={col}
              strokeWidth="1.8"
              fill="none"
            />
          </svg>
          <span
            style={{
              fontSize: 7,
              fontWeight: 800,
              color: col,
              letterSpacing: 0.2,
            }}
          >
            {ext}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: "#e9edef",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginBottom: 2,
            }}
          >
            {docData.name}
          </p>
          <p style={{ fontSize: 11, color: "#8696a0" }}>
            {ext} · {sizeStr}
          </p>
        </div>
        <button
          onClick={download}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.13)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background .2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.13)")
          }
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e9edef"
            strokeWidth="2.2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 4,
          marginTop: 7,
        }}
      >
        <span style={{ fontSize: 11, color: "#8696a0" }}>{time}</span>
        {isMine && <StatusTick status={status} />}
      </div>
    </div>
  );
};

// ── Voice Bubble ──────────────────────────────────────────
const VoiceBubble = ({ voiceData, isMine, time, status }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const fmtD = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const bars = Array(28)
    .fill(0)
    .map((_, i) => 4 + Math.abs(Math.sin(i * 0.7)) * 18 + (i % 3) * 3);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div
      style={{
        background: isMine ? "#005c4b" : "#202c33",
        borderRadius: isMine ? "8px 0 8px 8px" : "0 8px 8px 8px",
        padding: "8px 12px",
        minWidth: 220,
        boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={toggle}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "#25D366",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {playing ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
            height: 28,
          }}
        >
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 2.5,
                height: h,
                borderRadius: 2,
                background: playing ? "#25D366" : "#8696a0",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 11, color: "#8696a0", flexShrink: 0 }}>
          {fmtD(voiceData.duration || 0)}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 4,
          marginTop: 4,
        }}
      >
        <span style={{ fontSize: 11, color: "#8696a0" }}>{time}</span>
        {isMine && <StatusTick status={status} />}
      </div>
      {voiceData.blobUrl && (
        <audio
          ref={audioRef}
          src={voiceData.blobUrl}
          onEnded={() => setPlaying(false)}
          style={{ display: "none" }}
        />
      )}
    </div>
  );
};

// ── Message Renderer ──────────────────────────────────────
const MessageRenderer = ({ msg, isMine, prevSame, currentUserId, socket }) => {
  const time = fmtTime(msg.createdAt);
  const br = isMine
    ? prevSame
      ? "8px"
      : "8px 0 8px 8px"
    : prevSame
      ? "8px"
      : "0 8px 8px 8px";

  const wrap = (child) => (
    <div
      className="msg-bubble"
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        marginBottom: prevSame ? 1 : 6,
      }}
    >
      {child}
    </div>
  );

  const type = msg.msgType || msg.messageType;

  if (type === "poll" && msg.pollData)
    return wrap(
      <PollBubble
        pollData={msg.pollData}
        isMine={isMine}
        time={time}
        status={msg.status}
        messageId={msg._id}
        currentUserId={currentUserId}
        socket={socket}
      />,
    );
  if ((type === "photo" || type === "image") && msg.photoSrc)
    return wrap(
      <PhotoBubble
        src={msg.photoSrc}
        isMine={isMine}
        time={time}
        status={msg.status}
      />,
    );
  if ((type === "document" || type === "file") && msg.docData)
    return wrap(
      <DocumentBubble
        docData={msg.docData}
        isMine={isMine}
        time={time}
        status={msg.status}
      />,
    );
  if (type === "voice" && msg.voiceData)
    return wrap(
      <VoiceBubble
        voiceData={msg.voiceData}
        isMine={isMine}
        time={time}
        status={msg.status}
      />,
    );

  return wrap(
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
    </div>,
  );
};

// ── Document Picker Modal ─────────────────────────────────
const DocumentPickerModal = ({ onClose, onSend }) => {
  const [file, setFile] = useState(null);
  const ref = useRef(null);
  const ext = file?.name?.split(".").pop()?.toUpperCase() || "FILE";
  const colorMap = {
    PDF: ["#fde8e8", "#c62828"],
    DOC: ["#e3f0ff", "#1565c0"],
    DOCX: ["#e3f0ff", "#1565c0"],
    XLS: ["#e8f5e9", "#2e7d32"],
    XLSX: ["#e8f5e9", "#2e7d32"],
    MP3: ["#fce4ec", "#880e4f"],
    PNG: ["#f3e5f5", "#6a1b9a"],
    JPG: ["#f3e5f5", "#6a1b9a"],
  };
  const [bg, col] = colorMap[ext] || ["#eceff1", "#455a64"];
  const fmtSize = (b) =>
    b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;

  const send = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      onSend({
        type: "document",
        name: file.name,
        size: file.size,
        dataUrl: e.target.result,
      });
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.76)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#202c33",
          borderRadius: 16,
          width: 420,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          animation: "modalIn .2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid #2a3942",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#F0EDFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7B61FF"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#e9edef" }}>
              Send Document
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "none",
              background: "#2a3942",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8696a0"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div style={{ padding: 24 }}>
          {!file ? (
            <div
              onClick={() => ref.current?.click()}
              style={{
                border: "2px dashed #2a3942",
                borderRadius: 14,
                padding: "44px 24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#25D366";
                e.currentTarget.style.background = "rgba(37,211,102,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a3942";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ fontSize: 46, marginBottom: 14 }}>📂</div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#e9edef",
                  marginBottom: 6,
                }}
              >
                Choose a file
              </p>
              <p style={{ fontSize: 13, color: "#8696a0", marginBottom: 18 }}>
                PDF, Word, Excel, Images, Audio & more
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "9px 28px",
                  background: "#25D366",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111b21",
                }}
              >
                Browse Files
              </div>
            </div>
          ) : (
            <div
              style={{ background: "#111b21", borderRadius: 12, padding: 16 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: bg,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    gap: 2,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      fill={bg}
                      stroke={col}
                      strokeWidth="1.8"
                    />
                    <polyline
                      points="14 2 14 8 20 8"
                      stroke={col}
                      strokeWidth="1.8"
                      fill="none"
                    />
                  </svg>
                  <span style={{ fontSize: 7, fontWeight: 800, color: col }}>
                    {ext}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#e9edef",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </p>
                  <p style={{ fontSize: 12, color: "#8696a0", marginTop: 3 }}>
                    {ext} · {fmtSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    border: "none",
                    background: "#2a3942",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8696a0"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <input
            ref={ref}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div
          style={{
            padding: "10px 22px 18px",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "1px solid #2a3942",
              background: "transparent",
              color: "#8696a0",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={send}
            disabled={!file}
            style={{
              padding: "9px 26px",
              borderRadius: 10,
              border: "none",
              background: file ? "#25D366" : "#2a3942",
              color: file ? "#111b21" : "#566b76",
              fontSize: 14,
              fontWeight: 600,
              cursor: file ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Camera Modal ──────────────────────────────────────────
const CameraModal = ({ onClose, onSend }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(null);
  const [error, setError] = useState(null);
  const [facing, setFacing] = useState("user");

  useEffect(() => {
    start();
    return () => stop();
  }, [facing]);

  const stop = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
  };
  const start = async () => {
    try {
      stop();
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setError(null);
    } catch {
      setError("Camera access denied");
    }
  };

  const capture = () => {
    const v = videoRef.current,
      c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    if (facing === "user") {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0);
    setCaptured(c.toDataURL("image/jpeg", 0.92));
    stop();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "14px 20px",
          background: "linear-gradient(rgba(0,0,0,0.55),transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <p
          style={{
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Camera
        </p>
        {!captured ? (
          <button
            onClick={() =>
              setFacing((p) => (p === "user" ? "environment" : "user"))
            }
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "none",
              background: "rgba(0,0,0,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            >
              <path d="M1 4v6h6" />
              <path d="M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
          </button>
        ) : (
          <div style={{ width: 38 }} />
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {error ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>📷</div>
            <p style={{ color: "#aaa" }}>{error}</p>
          </div>
        ) : captured ? (
          <img
            src={captured}
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "100vh",
              objectFit: "contain",
            }}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100vh",
              objectFit: "cover",
              transform: facing === "user" ? "scaleX(-1)" : "none",
            }}
          />
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px 48px 38px",
          background: "linear-gradient(transparent,rgba(0,0,0,0.6))",
          display: "flex",
          alignItems: "center",
          justifyContent: captured ? "space-between" : "center",
        }}
      >
        {captured ? (
          <>
            <button
              onClick={() => {
                setCaptured(null);
                start();
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.14" />
                </svg>
              </div>
              <span
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Retake
              </span>
            </button>
            <button
              onClick={() => onSend({ type: "photo", src: captured })}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: "#25D366",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <span
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Send
              </span>
            </button>
          </>
        ) : (
          <button
            onClick={capture}
            disabled={!!error}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "transparent",
              border: "4px solid #fff",
              cursor: error ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform .1s",
            }}
            onMouseDown={(e) => {
              if (!error) e.currentTarget.style.transform = "scale(0.91)";
            }}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: error ? "#555" : "#fff",
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
};

// ── Voice Recorder Modal ──────────────────────────────────
const VoiceRecorderModal = ({ onClose, onSend }) => {
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [wf, setWf] = useState(Array(40).fill(4));
  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const timer = useRef(null);
  const audio = useRef(null);
  const anim = useRef(null);

  useEffect(
    () => () => {
      stopRec();
      clearInterval(timer.current);
      cancelAnimationFrame(anim.current);
    },
    [],
  );

  const animate = () => {
    setWf(
      Array(40)
        .fill(0)
        .map(() => Math.random() * 26 + 4),
    );
    anim.current = requestAnimationFrame(animate);
  };

  const startRec = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(s);
      mrRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        setBlob(new Blob(chunksRef.current, { type: "audio/webm" }));
        s.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecording(true);
      setDur(0);
      timer.current = setInterval(() => setDur((p) => p + 1), 1000);
      animate();
    } catch {}
  };

  const stopRec = () => {
    if (mrRef.current?.state === "recording") mrRef.current.stop();
    setRecording(false);
    clearInterval(timer.current);
    cancelAnimationFrame(anim.current);
  };

  const fmtD = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const togglePlay = () => {
    if (!audio.current) return;
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      audio.current.play();
      setPlaying(true);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.76)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#202c33",
          borderRadius: 20,
          width: 400,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          animation: "modalIn .2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid #2a3942",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: 700, fontSize: 15, color: "#e9edef" }}>
            Voice Message
          </p>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "none",
              background: "#2a3942",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8696a0"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div style={{ padding: "28px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 60,
              gap: 2,
              marginBottom: 18,
            }}
          >
            {wf.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: h,
                  borderRadius: 2,
                  background: recording
                    ? `hsl(${145 + i * 2},60%,${40 + (h / 30) * 28}%)`
                    : blob
                      ? "#25D366"
                      : "#2a3942",
                }}
              />
            ))}
          </div>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <p
              style={{
                fontSize: 38,
                fontWeight: 700,
                color: recording ? "#F4511E" : "#e9edef",
                fontFamily: "monospace",
              }}
            >
              {fmtD(dur)}
            </p>
            <p style={{ fontSize: 12, color: "#8696a0", marginTop: 4 }}>
              {recording
                ? "● Recording..."
                : blob
                  ? "Recording complete"
                  : "Press record to start"}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            {!recording && !blob && (
              <button
                onClick={startRec}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "none",
                  background: "#F4511E",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(244,81,30,0.4)",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                    fill="#fff"
                  />
                  <path
                    d="M19 10v2a7 7 0 0 1-14 0v-2"
                    stroke="#fff"
                    fill="none"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="19"
                    x2="12"
                    y2="23"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            )}
            {recording && (
              <button
                onClick={stopRec}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "none",
                  background: "#F4511E",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "rPulse 1s infinite",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    background: "#fff",
                  }}
                />
              </button>
            )}
            {blob && (
              <>
                <button
                  onClick={() => {
                    setBlob(null);
                    setDur(0);
                    setWf(Array(40).fill(4));
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "none",
                    background: "#2a3942",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8696a0"
                    strokeWidth="2"
                  >
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.14" />
                  </svg>
                </button>
                <button
                  onClick={togglePlay}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    border: "none",
                    background: "#25D366",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {playing ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#111b21"
                    >
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#111b21"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() =>
                    onSend({
                      type: "voice",
                      blob,
                      blobUrl: URL.createObjectURL(blob),
                      duration: dur,
                    })
                  }
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "none",
                    background: "#005c4b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#25D366"
                    strokeWidth="2.5"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        {blob && (
          <audio
            ref={audio}
            src={URL.createObjectURL(blob)}
            onEnded={() => setPlaying(false)}
            style={{ display: "none" }}
          />
        )}
      </div>
      <style>{`@keyframes rPulse{0%,100%{box-shadow:0 0 0 0 rgba(244,81,30,.5)}50%{box-shadow:0 0 0 14px rgba(244,81,30,0)}}`}</style>
    </div>
  );
};

// ── Poll Creator Modal ────────────────────────────────────
const PollModal = ({ onClose, onSend }) => {
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState(["", ""]);
  const [multi, setMulti] = useState(false);
  const ok = q.trim() && opts.filter((o) => o.trim()).length >= 2;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.76)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#202c33",
          borderRadius: 18,
          width: 460,
          maxHeight: "85vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          animation: "modalIn .2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "15px 22px",
            borderBottom: "1px solid #2a3942",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#FFF3E0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F57C00"
                strokeWidth="2"
              >
                <rect x="3" y="13" width="4" height="8" rx="1" />
                <rect x="10" y="9" width="4" height="12" rx="1" />
                <rect x="17" y="5" width="4" height="16" rx="1" />
              </svg>
            </div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "#e9edef" }}>
              Create Poll
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "none",
              background: "#2a3942",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8696a0"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ padding: "18px 22px", overflowY: "auto", flex: 1 }}>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#8696a0",
                letterSpacing: 0.6,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              Question
            </label>
            <textarea
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask a question..."
              rows={2}
              style={{
                width: "100%",
                padding: "11px 15px",
                background: "#111b21",
                border: "1px solid #2a3942",
                borderRadius: 12,
                color: "#e9edef",
                fontSize: 15,
                outline: "none",
                resize: "none",
                fontFamily: "'DM Sans', sans-serif",
                transition: "border .2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#25D366")}
              onBlur={(e) => (e.target.style.borderColor = "#2a3942")}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#8696a0",
                letterSpacing: 0.6,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              Options
            </label>
            {opts.map((o, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "2px solid #2a3942",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#8696a0",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <input
                  value={o}
                  onChange={(e) =>
                    setOpts((p) =>
                      p.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                  placeholder={`Option ${i + 1}`}
                  style={{
                    flex: 1,
                    padding: "10px 13px",
                    background: "#111b21",
                    border: "1px solid #2a3942",
                    borderRadius: 10,
                    color: "#e9edef",
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border .2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#25D366")}
                  onBlur={(e) => (e.target.style.borderColor = "#2a3942")}
                />
                {opts.length > 2 && (
                  <button
                    onClick={() => setOpts((p) => p.filter((_, j) => j !== i))}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      border: "none",
                      background: "#2a3942",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8696a0"
                      strokeWidth="2.5"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {opts.length < 10 && (
              <button
                onClick={() => setOpts((p) => [...p, ""])}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 13px",
                  background: "transparent",
                  border: "1px dashed #2a3942",
                  borderRadius: 10,
                  color: "#25D366",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                  fontFamily: "'DM Sans', sans-serif",
                  marginTop: 4,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(37,211,102,.05)";
                  e.currentTarget.style.borderColor = "#25D366";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#2a3942";
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Option
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "11px 15px",
              background: "#111b21",
              borderRadius: 12,
            }}
          >
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#e9edef" }}>
                Allow multiple answers
              </p>
              <p style={{ fontSize: 12, color: "#8696a0", marginTop: 2 }}>
                Voters can pick more than one option
              </p>
            </div>
            <button
              onClick={() => setMulti((p) => !p)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                background: multi ? "#25D366" : "#2a3942",
                cursor: "pointer",
                position: "relative",
                transition: "background .25s",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  transition: "left .25s",
                  left: multi ? 23 : 3,
                }}
              />
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "13px 22px",
            borderTop: "1px solid #2a3942",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              border: "1px solid #2a3942",
              background: "transparent",
              color: "#8696a0",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() =>
              ok &&
              onSend({
                type: "poll",
                question: q.trim(),
                options: opts.filter((o) => o.trim()),
                allowMultiple: multi,
              })
            }
            disabled={!ok}
            style={{
              padding: "9px 24px",
              borderRadius: 10,
              border: "none",
              background: ok ? "#25D366" : "#2a3942",
              color: ok ? "#111b21" : "#566b76",
              fontSize: 14,
              fontWeight: 600,
              cursor: ok ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Send Poll
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Attach Items ──────────────────────────────────────────
const ATTACH_ITEMS = [
  {
    label: "Document",
    bg: "#F0EDFF",
    modal: "document",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 4a2 2 0 0 1 2-2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z"
          stroke="#7B61FF"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M14 2v4h4"
          stroke="#7B61FF"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8 10h8M8 13h6M8 16h4"
          stroke="#7B61FF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Camera",
    bg: "#FDE8F3",
    modal: "camera",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
          stroke="#E91E8C"
          strokeWidth="1.8"
          fill="none"
        />
        <circle
          cx="12"
          cy="13"
          r="4"
          stroke="#E91E8C"
          strokeWidth="1.8"
          fill="none"
        />
        <circle cx="12" cy="13" r="1.5" fill="#E91E8C" />
      </svg>
    ),
  },
  {
    label: "Gallery",
    bg: "#E3F0FF",
    modal: "gallery",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          stroke="#1976D2"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M3 15l5-5 4 4 3-3 6 6"
          stroke="#1976D2"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="8.5" cy="8.5" r="1.5" fill="#1976D2" />
      </svg>
    ),
  },
  {
    label: "Audio",
    bg: "#FFF0EC",
    modal: "voice",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 18v-6a9 9 0 0 1 18 0v6"
          stroke="#F4511E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
          stroke="#F4511E"
          strokeWidth="1.8"
          fill="none"
        />
      </svg>
    ),
  },
  {
    label: "Poll",
    bg: "#FFF3E0",
    modal: "poll",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="13"
          width="4"
          height="8"
          rx="1"
          fill="#F57C00"
          fillOpacity="0.3"
          stroke="#F57C00"
          strokeWidth="1.5"
        />
        <rect
          x="10"
          y="9"
          width="4"
          height="12"
          rx="1"
          fill="#F57C00"
          fillOpacity="0.3"
          stroke="#F57C00"
          strokeWidth="1.5"
        />
        <rect
          x="17"
          y="5"
          width="4"
          height="16"
          rx="1"
          fill="#F57C00"
          fillOpacity="0.3"
          stroke="#F57C00"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    label: "Location",
    bg: "#E0F5F3",
    modal: null,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
          stroke="#00897B"
          strokeWidth="1.8"
          fill="none"
        />
        <circle
          cx="12"
          cy="10"
          r="3"
          stroke="#00897B"
          strokeWidth="1.8"
          fill="#00897B"
          fillOpacity="0.2"
        />
      </svg>
    ),
  },
  {
    label: "Contact",
    bg: "#E3F2FD",
    modal: null,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          stroke="#1E88E5"
          strokeWidth="1.8"
          fill="none"
        />
        <circle
          cx="12"
          cy="7"
          r="4"
          stroke="#1E88E5"
          strokeWidth="1.8"
          fill="none"
        />
      </svg>
    ),
  },
  {
    label: "Event",
    bg: "#FCE4EC",
    modal: null,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          stroke="#D81B60"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M16 2v4M8 2v4M3 10h18"
          stroke="#D81B60"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="8" cy="15" r="1.5" fill="#D81B60" />
        <circle cx="12" cy="15" r="1.5" fill="#D81B60" />
        <circle cx="16" cy="15" r="1.5" fill="#D81B60" />
      </svg>
    ),
  },
];

// ── Gallery Picker Modal ──────────────────────────────────
const GalleryModal = ({ onClose, onSend }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const ref = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const send = () => {
    if (preview) onSend({ type: "photo", src: preview });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.76)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#202c33",
          borderRadius: 16,
          width: 420,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          animation: "modalIn .2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid #2a3942",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#E3F0FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1976D2"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M3 15l5-5 4 4 3-3 6 6" strokeLinejoin="round" />
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="1.5"
                  fill="#1976D2"
                  stroke="none"
                />
              </svg>
            </div>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#e9edef" }}>
              Send Photo
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "none",
              background: "#2a3942",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8696a0"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div style={{ padding: 24 }}>
          {!preview ? (
            <div
              onClick={() => ref.current?.click()}
              style={{
                border: "2px dashed #2a3942",
                borderRadius: 14,
                padding: "44px 24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#25D366";
                e.currentTarget.style.background = "rgba(37,211,102,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a3942";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ fontSize: 46, marginBottom: 14 }}>🖼️</div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#e9edef",
                  marginBottom: 6,
                }}
              >
                Choose a photo
              </p>
              <p style={{ fontSize: 13, color: "#8696a0", marginBottom: 18 }}>
                JPG, PNG, GIF, WEBP
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "9px 28px",
                  background: "#25D366",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111b21",
                }}
              >
                Browse Gallery
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <img
                src={preview}
                alt=""
                style={{
                  width: "100%",
                  maxHeight: 280,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.55)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <input
            ref={ref}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
        <div
          style={{
            padding: "10px 22px 18px",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "1px solid #2a3942",
              background: "transparent",
              color: "#8696a0",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={send}
            disabled={!preview}
            style={{
              padding: "9px 26px",
              borderRadius: 10,
              border: "none",
              background: preview ? "#25D366" : "#2a3942",
              color: preview ? "#111b21" : "#566b76",
              fontSize: 14,
              fontWeight: 600,
              cursor: preview ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Export ───────────────────────────────────────────
export default function TalkifyChat() {
  const [currentUser, setCurrentUser] = useState(null);
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
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const endRef = useRef(null);
  const typingTimer = useRef(null);
  const inputRef = useRef(null);
  const emojiRef = useRef(null);
  const attachRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const h = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target))
        setShowEmoji(false);
      if (attachRef.current && !attachRef.current.contains(e.target))
        setShowAttach(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Load users on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/users`);
        const users = res.data?.users || res.data || [];
        setAllUsers(users);
        const stored = localStorage.getItem("talkify_userId");
        const me = stored ? users.find((u) => u._id === stored) : users[0];
        if (me) {
          setCurrentUser(me);
          localStorage.setItem("talkify_userId", me._id);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  // Load conversations
  const loadConvs = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(
        `${API}/messages/conversations/${currentUser._id}`,
      );
      const map = {};
      (res.data?.conversations || []).forEach((c) => {
        if (c.user?.id) map[c.user.id.toString()] = c;
      });
      setConversations(map);
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    loadConvs();
  }, [loadConvs]);

  // Socket setup
  useEffect(() => {
    if (!currentUser) return;
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(s);
    s.emit("user:join", currentUser._id);

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

    // Receive a new message
    s.on("message:receive", ({ message }) => {
      setSelectedUser((sel) => {
        if (sel && message.sender?.toString() === sel._id?.toString()) {
          setMessages((prev) => {
            if (prev.find((m) => m._id === message._id)) return prev;
            return [...prev, message];
          });
          axios
            .put(`${API}/messages/read/${currentUser._id}/${sel._id}`)
            .catch(() => {});
          s.emit("message:read", {
            messageId: message._id,
            userId: currentUser._id,
          });
        }
        return sel;
      });
      loadConvs();
    });

    // Sender gets confirmation with full message (including rich data)
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

    // Real-time poll vote updates
    s.on("poll:updated", ({ messageId, pollData }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, pollData } : m)),
      );
    });

    return () => s.disconnect();
  }, [currentUser, loadConvs]);

  // Load messages when user is selected
  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    (async () => {
      setMsgLoading(true);
      try {
        const res = await axios.get(
          `${API}/messages/${currentUser._id}/${selectedUser._id}`,
        );
        setMessages(res.data?.messages || []);
        await axios.put(
          `${API}/messages/read/${currentUser._id}/${selectedUser._id}`,
        );
        loadConvs();
      } catch {}
      setMsgLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    })();
  }, [selectedUser, currentUser]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Build optimistic message object
  const buildMsg = (data) => {
    const id = `temp_${Date.now()}`;
    const base = {
      _id: id,
      _tempId: id,
      sender: currentUser._id,
      receiver: selectedUser._id,
      status: "sent",
      createdAt: new Date().toISOString(),
    };
    if (data.type === "poll")
      return {
        ...base,
        msgType: "poll",
        messageType: "poll",
        text: `📊 Poll: ${data.question}`,
        pollData: {
          question: data.question,
          options: data.options,
          allowMultiple: data.allowMultiple,
          votes: {},
          voters: {},
        },
      };
    if (data.type === "photo")
      return {
        ...base,
        msgType: "photo",
        messageType: "photo",
        text: "📷 Photo",
        photoSrc: data.src,
      };
    if (data.type === "document")
      return {
        ...base,
        msgType: "document",
        messageType: "document",
        text: `📎 ${data.name}`,
        docData: { name: data.name, size: data.size, dataUrl: data.dataUrl },
      };
    if (data.type === "voice")
      return {
        ...base,
        msgType: "voice",
        messageType: "voice",
        text: "🎤 Voice message",
        voiceData: { blobUrl: data.blobUrl, duration: data.duration },
      };
    return { ...base, msgType: "text", messageType: "text", text: data.text };
  };

  // ── FIXED send() — now sends rich data to backend ────────
  const send = (custom = null) => {
    if (custom) {
      const m = buildMsg(custom);
      setMessages((p) => [...p, m]);

      const payload = {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
        text: m.text,
        messageType: custom.type,
        _tempId: m._tempId,
      };

      // Attach rich data based on type
      if (custom.type === "photo") {
        payload.photoSrc = custom.src;
      }
      if (custom.type === "document") {
        payload.docData = {
          name: custom.name,
          size: custom.size,
          dataUrl: custom.dataUrl,
        };
      }
      if (custom.type === "voice") {
        // Never send blobUrl to server — browser-only object URL
        payload.voiceData = { duration: custom.duration };
      }
      if (custom.type === "poll") {
        payload.pollData = {
          question: custom.question,
          options: custom.options,
          allowMultiple: custom.allowMultiple,
        };
      }

      socket?.emit("message:send", payload);
      setActiveModal(null);
      setShowAttach(false);
      return;
    }

    // Plain text
    if (!inputText.trim() || !selectedUser || !socket) return;
    const id = `temp_${Date.now()}`;
    setMessages((p) => [
      ...p,
      {
        _id: id,
        _tempId: id,
        sender: currentUser._id,
        receiver: selectedUser._id,
        text: inputText.trim(),
        msgType: "text",
        messageType: "text",
        status: "sent",
        createdAt: new Date().toISOString(),
      },
    ]);
    socket.emit("message:send", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: inputText.trim(),
      messageType: "text",
      _tempId: id,
    });
    setInputText("");
    setShowEmoji(false);
    socket.emit("typing:stop", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
    });
  };

  const handleTyping = (e) => {
    setInputText(e.target.value);
    if (!socket || !selectedUser) return;
    socket.emit("typing:start", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
    });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () =>
        socket.emit("typing:stop", {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
        }),
      1500,
    );
  };

  const switchUser = (u) => {
    setCurrentUser(u);
    localStorage.setItem("talkify_userId", u._id);
    setSelectedUser(null);
    setMessages([]);
    setConversations({});
    setShowSwitcher(false);
  };

  const others = allUsers.filter((u) => u._id !== currentUser?._id);
  const filtered = others
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
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid #25D366",
              borderTop: "3px solid transparent",
              borderRadius: "50%",
              animation: "spin .8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p
            style={{
              color: "#25D366",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Loading Talkify...
          </p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        background: "#111b21",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#2a3942;border-radius:4px;}
        .user-item:hover{background:#2a3942 !important;}
        .user-item.active{background:#2a3942 !important;}
        .send-btn:hover{background:#1ea952 !important;transform:scale(1.05);}
        .icon-btn:hover{background:#2a3942 !important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes attachIn{from{opacity:0;transform:translateY(10px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.96);}to{opacity:1;transform:scale(1);}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .msg-bubble{animation:fadeUp .15s ease;}
        .dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#25D366;margin:0 2px;animation:pulse 1.2s infinite;}
        .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
        input,textarea{caret-color:#25D366;}
        .tab-btn:hover{color:#e9edef !important;}
        .att:hover .att-ic{transform:scale(1.08);box-shadow:0 4px 16px rgba(0,0,0,.18);}
        .att:hover .att-lb{color:#222 !important;}
      `}</style>

      {/* ── SIDEBAR ── */}
      <div
        style={{
          width: 360,
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
            padding: "16px 20px",
            background: "#202c33",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
            }}
            onClick={() => setShowSwitcher(true)}
          >
            <Avatar
              src={currentUser?.profilePic}
              name={currentUser?.name}
              size={40}
              online={true}
            />
            <p style={{ fontWeight: 600, fontSize: 15, color: "#e9edef" }}>
              {currentUser?.name}
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              <svg
                key="a"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#aebac1"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>,
              <svg
                key="b"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#aebac1"
                strokeWidth="2"
              >
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>,
            ].map((icon, i) => (
              <button
                key={i}
                className="icon-btn"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all .2s",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: "#111b21",
            borderBottom: "1px solid #222d34",
            padding: "0 16px",
          }}
        >
          {[
            ["all", "All"],
            ["unread", "Unread"],
          ].map(([val, label]) => (
            <button
              key={val}
              className="tab-btn"
              onClick={() => setActiveTab(val)}
              style={{
                padding: "12px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                color: activeTab === val ? "#25D366" : "#8696a0",
                borderBottom:
                  activeTab === val
                    ? "2px solid #25D366"
                    : "2px solid transparent",
                transition: "all .2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ padding: "10px 14px" }}>
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
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              width="15"
              height="15"
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
              placeholder="Search or start new chat"
              style={{
                width: "100%",
                padding: "10px 12px 10px 38px",
                border: "none",
                background: "transparent",
                fontSize: 14,
                color: "#e9edef",
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
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
                padding: "48px 20px",
                color: "#8696a0",
              }}
            >
              <p style={{ fontSize: 30, marginBottom: 8 }}>🔍</p>
              <p style={{ fontSize: 13 }}>No users found</p>
            </div>
          ) : (
            filtered.map((user) => {
              const conv = conversations[user._id?.toString()];
              const isActive = selectedUser?._id === user._id;
              return (
                <button
                  key={user._id}
                  className={`user-item ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedUser(user)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    background: isActive ? "#2a3942" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background .15s",
                    borderBottom: "1px solid #1a2529",
                  }}
                >
                  <Avatar
                    src={user.profilePic}
                    name={user.name}
                    size={50}
                    online={onlineUsers.has(user._id?.toString())}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 15,
                          color: "#e9edef",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.name}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
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
                          fontSize: 13,
                          color: "#8696a0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 200,
                        }}
                      >
                        {typingUsers.has(user._id?.toString()) ? (
                          <span style={{ color: "#25D366" }}>typing...</span>
                        ) : conv?.lastMessage ? (
                          conv.lastMessage.text
                        ) : (
                          <span style={{ color: "#566b76", fontSize: 12 }}>
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
                            padding: "1px 7px",
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                            minWidth: 20,
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
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            pointerEvents: "none",
          }}
        />

        {selectedUser ? (
          <>
            {/* Chat header */}
            <div
              style={{
                padding: "10px 20px",
                background: "#202c33",
                display: "flex",
                alignItems: "center",
                gap: 14,
                zIndex: 10,
                borderBottom: "1px solid #222d34",
              }}
            >
              <Avatar
                src={selectedUser.profilePic}
                name={selectedUser.name}
                size={42}
                online={isOnline}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 16, color: "#e9edef" }}>
                  {selectedUser.name}
                </p>
                <p style={{ fontSize: 12 }}>
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
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  <svg
                    key="s"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#aebac1"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>,
                  <svg
                    key="p"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#aebac1"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l1-1a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>,
                  <svg
                    key="v"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#aebac1"
                    strokeWidth="2"
                  >
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>,
                  <svg
                    key="m"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#aebac1"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>,
                ].map((icon, i) => (
                  <button
                    key={i}
                    className="icon-btn"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all .2s",
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 60px",
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
                      width: 32,
                      height: 32,
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
                      padding: "12px 24px",
                      borderRadius: 12,
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: 13, color: "#8696a0" }}>
                      🔒 Messages are end-to-end encrypted
                    </p>
                    <p style={{ fontSize: 12, color: "#556b76", marginTop: 4 }}>
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
                    msg.sender === currentUser._id ||
                    msg.sender?._id === currentUser._id;
                  const showDate =
                    idx === 0 ||
                    new Date(msg.createdAt).toDateString() !==
                      new Date(messages[idx - 1]?.createdAt).toDateString();
                  const prevSame =
                    idx > 0 &&
                    (messages[idx - 1].sender === msg.sender ||
                      messages[idx - 1].sender?._id === msg.sender?._id);
                  return (
                    <div key={msg._id || idx}>
                      {showDate && (
                        <div style={{ textAlign: "center", margin: "12px 0" }}>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#e9edef",
                              background: "#182229",
                              padding: "4px 14px",
                              borderRadius: 8,
                            }}
                          >
                            {new Date(msg.createdAt).toLocaleDateString([], {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                      <MessageRenderer
                        msg={msg}
                        isMine={isMine}
                        prevSame={prevSame}
                        currentUserId={currentUser._id}
                        socket={socket}
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
                padding: "10px 20px",
                background: "#202c33",
                display: "flex",
                alignItems: "center",
                gap: 10,
                zIndex: 10,
                position: "relative",
              }}
            >
              {/* Emoji */}
              <div
                ref={emojiRef}
                style={{ position: "relative", flexShrink: 0 }}
              >
                <button
                  className="icon-btn"
                  onClick={() => {
                    setShowEmoji((p) => !p);
                    setShowAttach(false);
                  }}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    border: "none",
                    background: showEmoji ? "#2a3942" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .2s",
                    color: showEmoji ? "#25D366" : "#8696a0",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 13s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </button>
                {showEmoji && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 54,
                      left: 0,
                      zIndex: 9999,
                    }}
                  >
                    <EmojiPicker
                      onEmojiClick={(d) => {
                        setInputText((p) => p + d.emoji);
                        inputRef.current?.focus();
                      }}
                      theme="dark"
                      skinTonesDisabled
                      height={380}
                      width={320}
                    />
                  </div>
                )}
              </div>

              {/* Attach */}
              <div
                ref={attachRef}
                style={{ position: "relative", flexShrink: 0 }}
              >
                <button
                  className="icon-btn"
                  onClick={() => {
                    setShowAttach((p) => !p);
                    setShowEmoji(false);
                  }}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    border: "none",
                    background: showAttach ? "#2a3942" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .2s",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={showAttach ? "#25D366" : "#8696a0"}
                    strokeWidth="2"
                  >
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                {showAttach && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 56,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#f0f2f5",
                      borderRadius: 18,
                      padding: "20px 18px",
                      zIndex: 9999,
                      width: 260,
                      boxShadow: "0 8px 32px rgba(0,0,0,.45)",
                      animation: "attachIn .2s ease",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        bottom: -10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "10px solid transparent",
                        borderRight: "10px solid transparent",
                        borderTop: "10px solid #f0f2f5",
                      }}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: "16px 8px",
                      }}
                    >
                      {ATTACH_ITEMS.map((item) => (
                        <button
                          key={item.label}
                          className="att"
                          onClick={() => {
                            setShowAttach(false);
                            if (item.modal) setActiveModal(item.modal);
                          }}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 7,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            padding: 0,
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          <div
                            className="att-ic"
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: 16,
                              background: item.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "transform .18s, box-shadow .18s",
                              boxShadow: "0 2px 8px rgba(0,0,0,.1)",
                            }}
                          >
                            {item.icon}
                          </div>
                          <span
                            className="att-lb"
                            style={{
                              fontSize: 10.5,
                              color: "#3b4a54",
                              fontWeight: 500,
                              textAlign: "center",
                              lineHeight: 1.2,
                              transition: "color .15s",
                            }}
                          >
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Text input */}
              <div style={{ flex: 1, background: "#2a3942", borderRadius: 24 }}>
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={handleTyping}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    (e.preventDefault(), send())
                  }
                  placeholder="Type a message"
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    border: "none",
                    background: "transparent",
                    fontSize: 15,
                    color: "#e9edef",
                    outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    borderRadius: 24,
                  }}
                />
              </div>

              {/* Send button */}
              <button
                className="send-btn"
                onClick={() => send()}
                style={{
                  width: 46,
                  height: 46,
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
                  width="20"
                  height="20"
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
          /* Empty state */
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                borderTop: "1px solid #222d34",
                position: "absolute",
                bottom: 0,
                width: "100%",
                background: "#0b141a",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8696a0"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <p style={{ fontSize: 13, color: "#8696a0" }}>
                  Your personal messages are end-to-end encrypted
                </p>
              </div>
            </div>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "2px solid #222d34",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="60"
                height="60"
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
                  fontSize: 22,
                  color: "#e9edef",
                  marginBottom: 8,
                }}
              >
                Talkify Web
              </p>
              <p style={{ fontSize: 14, color: "#8696a0" }}>
                Select a contact to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Switch Account Modal */}
      {showSwitcher && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowSwitcher(false)}
        >
          <div
            style={{
              background: "#202c33",
              borderRadius: 16,
              padding: 24,
              width: 340,
              maxHeight: 480,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: 17,
                color: "#e9edef",
                marginBottom: 16,
              }}
            >
              Switch Account
            </p>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {allUsers.map((u) => (
                <button
                  key={u._id}
                  onClick={() => switchUser(u)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "none",
                    background:
                      u._id === currentUser?._id ? "#2a3942" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    marginBottom: 4,
                  }}
                  onMouseEnter={(e) => {
                    if (u._id !== currentUser?._id)
                      e.currentTarget.style.background = "#2a3942";
                  }}
                  onMouseLeave={(e) => {
                    if (u._id !== currentUser?._id)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Avatar
                    src={u.profilePic}
                    name={u.name}
                    size={44}
                    online={onlineUsers.has(u._id)}
                  />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#e9edef",
                      }}
                    >
                      {u.name}
                    </p>
                    <p style={{ fontSize: 12, color: "#8696a0" }}>{u.email}</p>
                  </div>
                  {u._id === currentUser?._id && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#25D366"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSwitcher(false)}
              style={{
                marginTop: 16,
                padding: "10px",
                borderRadius: 10,
                border: "none",
                background: "#2a3942",
                color: "#e9edef",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal === "document" && (
        <DocumentPickerModal
          onClose={() => setActiveModal(null)}
          onSend={(d) => send(d)}
        />
      )}
      {activeModal === "camera" && (
        <CameraModal
          onClose={() => setActiveModal(null)}
          onSend={(d) => send(d)}
        />
      )}
      {activeModal === "gallery" && (
        <GalleryModal
          onClose={() => setActiveModal(null)}
          onSend={(d) => send(d)}
        />
      )}
      {activeModal === "voice" && (
        <VoiceRecorderModal
          onClose={() => setActiveModal(null)}
          onSend={(d) => send(d)}
        />
      )}
      {activeModal === "poll" && (
        <PollModal
          onClose={() => setActiveModal(null)}
          onSend={(d) => send(d)}
        />
      )}
    </div>
  );
}
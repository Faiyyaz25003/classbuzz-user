"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const API = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

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
          background: `hsl(${((name?.charCodeAt(0) || 65) * 5) % 360}, 55%, 50%)`,
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

const StatusTick = ({ status }) => {
  if (status === "read")
    return (
      <span style={{ color: "#53bdeb", fontSize: 13, fontWeight: 700 }}>
        ✓✓
      </span>
    );
  if (status === "delivered")
    return <span style={{ color: "#aaa", fontSize: 13 }}>✓✓</span>;
  return <span style={{ color: "#aaa", fontSize: 13 }}>✓</span>;
};

export default function TalkifyChat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [conversations, setConversations] = useState([]); // map: userId -> conv data
  const [selectedUser, setSelectedUser] = useState(null); // the user we're chatting with
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all | unread
  const [showSwitcher, setShowSwitcher] = useState(false); // user switcher modal

  const messagesEndRef = useRef(null);
  const typingTimer = useRef(null);
  const inputRef = useRef(null);

  // ── Init: fetch all users, pick current user ─────────────
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

  // ── Load conversations (to get unread counts + last msgs) ─
  const loadConversations = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(
        `${API}/messages/conversations/${currentUser._id}`,
      );
      const convList = res.data?.conversations || [];
      // Store as map: otherUserId -> conv info
      const map = {};
      convList.forEach((c) => {
        if (c.user?.id) map[c.user.id.toString()] = c;
      });
      setConversations(map);
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ── Socket ────────────────────────────────────────────────
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

    s.on("message:receive", ({ message, conversationId }) => {
      // If the active chat is with this sender, append message
      setSelectedUser((sel) => {
        if (sel && message.sender?.toString() === sel._id?.toString()) {
          setMessages((prev) => {
            if (prev.find((m) => m._id === message._id)) return prev;
            return [...prev, message];
          });
          // mark read immediately
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
      loadConversations();
    });

    s.on("message:sent", ({ message }) => {
      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) => m._tempId && m._tempId === message._tempId,
        );
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...message };
          return updated;
        }
        return prev;
      });
      loadConversations();
    });

    s.on("message:read", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, status: "read", isRead: true } : m,
        ),
      );
    });

    return () => s.disconnect();
  }, [currentUser, loadConversations]);

  // ── Load messages when a user is selected ────────────────
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
        loadConversations();
      } catch (e) {
        console.error(e);
      }
      setMsgLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    })();
  }, [selectedUser, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────
  const sendMessage = () => {
    if (!inputText.trim() || !selectedUser || !socket) return;
    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      _id: tempId,
      _tempId: tempId,
      sender: currentUser._id,
      receiver: selectedUser._id,
      text: inputText.trim(),
      status: "sent",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    socket.emit("message:send", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: inputText.trim(),
      messageType: "text",
      _tempId: tempId,
    });
    setInputText("");
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
    typingTimer.current = setTimeout(() => {
      socket.emit("typing:stop", {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
      });
    }, 1500);
  };

  const switchUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem("talkify_userId", user._id);
    setSelectedUser(null);
    setMessages([]);
    setConversations({});
    setShowSwitcher(false);
  };

  // ── Build the sidebar list: ALL users except current ─────
  // Merge with conversation data for last message + unread
  const otherUsers = allUsers.filter((u) => u._id !== currentUser?._id);

  const filteredUsers = otherUsers
    .filter((u) => {
      const matchSearch =
        !searchQuery ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const conv = conversations[u._id?.toString()];
      const matchTab =
        activeTab === "all" ||
        (activeTab === "unread" && conv && conv.unread > 0);
      return matchSearch && matchTab;
    })
    .sort((a, b) => {
      // Sort: users with conversations (by time) first, then rest alphabetically
      const ca = conversations[a._id?.toString()];
      const cb = conversations[b._id?.toString()];
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
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#25D366",
              fontSize: 14,
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
        .msg-bubble{animation:fadeUp 0.15s ease;}
        .dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#25D366;margin:0 2px;animation:pulse 1.2s infinite;}
        .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
        input{caret-color:#25D366;}
        .tab-btn:hover{color:#e9edef !important;}
      `}</style>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
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
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, color: "#e9edef" }}>
                {currentUser?.name}
              </p>
              <p style={{ fontSize: 11, color: "#25D366" }}>
                ● You (tap to switch)
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className="icon-btn"
              title="New Chat"
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
              <svg
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
              </svg>
            </button>
            <button
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
              <svg
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
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
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
        <div style={{ padding: "10px 14px", background: "#111b21" }}>
          <div
            style={{
              position: "relative",
              background: "#202c33",
              borderRadius: 8,
              overflow: "hidden",
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
          {filteredUsers.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                color: "#8696a0",
              }}
            >
              <p style={{ fontSize: 32, marginBottom: 8 }}>🔍</p>
              <p style={{ fontSize: 13 }}>No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const conv = conversations[user._id?.toString()];
              const isActive = selectedUser?._id === user._id;
              const isOnlineU = onlineUsers.has(user._id?.toString());
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
                    online={isOnlineU}
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

      {/* ── CHAT AREA ────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#0b141a",
          position: "relative",
        }}
      >
        {/* WhatsApp-style bg pattern */}
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
            {/* Chat Header */}
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
                    key="search"
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
                    key="phone"
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
                    key="video"
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
                    key="more"
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
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              ) : messages.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    gap: 12,
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
                      <div
                        className="msg-bubble"
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
                            borderRadius: isMine
                              ? prevSame
                                ? "8px 8px 8px 8px"
                                : "8px 0px 8px 8px"
                              : prevSame
                                ? "8px 8px 8px 8px"
                                : "0px 8px 8px 8px",
                            background: isMine ? "#005c4b" : "#202c33",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                            position: "relative",
                          }}
                        >
                          <p
                            style={{
                              fontSize: 14.5,
                              lineHeight: 1.5,
                              wordBreak: "break-word",
                              color: "#e9edef",
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
                            <span style={{ fontSize: 11, color: "#8696a0" }}>
                              {fmtTime(msg.createdAt)}
                            </span>
                            {isMine && <StatusTick status={msg.status} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
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
              }}
            >
              <button
                className="icon-btn"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all .2s",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8696a0"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 13s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </button>
              <button
                className="icon-btn"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all .2s",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8696a0"
                  strokeWidth="2"
                >
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <div
                style={{
                  flex: 1,
                  background: "#2a3942",
                  borderRadius: 24,
                  overflow: "hidden",
                }}
              >
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={handleTyping}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    (e.preventDefault(), sendMessage())
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
                  }}
                />
              </div>
              <button
                className="send-btn"
                onClick={sendMessage}
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
                  marginBottom: 12,
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

      {/* ── USER SWITCHER MODAL ──────────────────────────────── */}
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
    </div>
  );
}

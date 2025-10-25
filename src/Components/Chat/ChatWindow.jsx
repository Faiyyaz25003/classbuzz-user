"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import axios from "axios";
import { initSocket, getSocket } from "../lib/socket";

export default function ChatWindow({
  user, // selected conversation partner
  currentUser, // logged-in user object (optional fallback)
  onHeaderClick,
  onBackClick,
  isMobile,
}) {
  // Use real user ID if available, else a temporary placeholder
  const CURRENT_USER_ID = currentUser?.id || "TEMP_USER_ID";

  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // Initialize socket
  useEffect(() => {
    if (!CURRENT_USER_ID || CURRENT_USER_ID === "TEMP_USER_ID") return;

    socketRef.current = initSocket(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
    );

    socketRef.current.emit("user:join", CURRENT_USER_ID);

    socketRef.current.on("message:receive", ({ message }) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: message.sender.name || message.sender,
          text: message.text,
          time: new Date(message.createdAt).toLocaleTimeString(),
          raw: message,
        },
      ]);
    });

    socketRef.current.on("message:sent", ({ message }) => {
      setMessages((prev) => [
        ...prev.filter((m) => !m._tmpId),
        {
          sender: message.sender.name || "You",
          text: message.text,
          time: "Now",
          raw: message,
        },
      ]);
    });

    socketRef.current.on("message:error", (err) => {
      console.error(
        "Socket message error:",
        err?.error || err || "Unknown error"
      );
    });

    return () => {
      socketRef.current.off("message:receive");
      socketRef.current.off("message:sent");
      socketRef.current.off("message:error");
    };
  }, [CURRENT_USER_ID]);

  // Fetch chat history
  useEffect(() => {
    if (!user || CURRENT_USER_ID === "TEMP_USER_ID") return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
          }/api/messages/${CURRENT_USER_ID}/${user.id}`
        );

        if (res.data?.messages) {
          const mapped = res.data.messages.map((m) => ({
            sender:
              m.sender?.name ||
              (m.sender === CURRENT_USER_ID ? "You" : user.name),
            text: m.text,
            time: new Date(m.createdAt).toLocaleTimeString(),
            raw: m,
          }));
          setMessages(mapped);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error(
          "Error fetching messages:",
          err.response?.data?.error || err.message
        );
      }
    };

    fetchHistory();
  }, [user, CURRENT_USER_ID]);

  // Send message
  const handleSendMessage = (payload) => {
    if (!user || CURRENT_USER_ID === "TEMP_USER_ID")
      return alert("Select a user to send message");

    const text = typeof payload === "string" ? payload : payload.text || "";
    const fileUrl = payload.image || payload.fileUrl;

    const tmpMsg = {
      _tmpId: Date.now(),
      sender: "You",
      text,
      time: "Now",
    };

    setMessages((prev) => [...prev, tmpMsg]);

    const socket = getSocket();
    if (socket?.connected) {
      socket.emit("message:send", {
        senderId: CURRENT_USER_ID,
        receiverId: user.id,
        text,
        messageType: fileUrl ? "image" : "text",
        fileUrl,
      });
    } else {
      console.error("Socket not connected");
    }
  };

  // Render placeholder if no conversation selected
  if (!user)
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto" />
          <h2 className="text-xl font-semibold text-slate-700">
            Select a conversation
          </h2>
          <p className="text-slate-500">
            Choose from your existing conversations or start a new one
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 h-screen">
      <Header
        user={user}
        onHeaderClick={onHeaderClick}
        onBackClick={onBackClick}
        isMobile={isMobile}
      />
      <ChatMessages messages={messages} currentUser="You" />
      <ChatFooter onSend={handleSendMessage} />
    </div>
  );
}

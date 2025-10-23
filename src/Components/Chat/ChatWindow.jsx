
"use client";

import React, { useState } from "react";
import Header from "./Header";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";

export default function ChatWindow({
  user,
  onHeaderClick,
  onBackClick,
  isMobile,
}) {
  const [messages, setMessages] = useState([
    {
      sender: "Victoria Ramos",
      time: "1:31 pm",
      text: "Class aptent taciti 🥰",
    },
    {
      sender: "Victoria Ramos",
      time: "1:32 pm",
      text: "Nunc efficitur neque sit amet varius scelerisque.",
    },
    {
      sender: "John Doe",
      time: "1:34 pm",
      text: "Nulla eget tortor tempor justo egestas scelerisque nec diam.",
    },
    {
      sender: "Victoria Ramos",
      time: "1:35 pm",
      text: "Phasellus in arcu felis.",
    },
    {
      sender: "John Doe",
      time: "1:36 pm",
      text: "Donec purus est, commodo in molestie et, vestibulum a enim.",
    },
  ]);

  if (!user)
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-700">
            Select a conversation
          </h2>
          <p className="text-slate-500">
            Choose from your existing conversations or start a new one
          </p>
        </div>
      </div>
    );

  const handleSendMessage = (newMsg) => {
    setMessages((prev) => [
      ...prev,
      { sender: "John Doe", time: "Now", text: newMsg },
    ]);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 h-screen">
      {/* Header */}
      <Header
        user={user}
        onHeaderClick={onHeaderClick}
        onBackClick={onBackClick}
        isMobile={isMobile}
      />

      {/* ✅ Separate Messages Component */}
      <ChatMessages messages={messages} currentUser="John Doe" />

      {/* ✅ Separate Footer Component */}
      <ChatFooter onSend={handleSendMessage} />
    </div>
  );
}

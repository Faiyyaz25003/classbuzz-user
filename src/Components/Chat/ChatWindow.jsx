

"use client";

import React, { useState } from "react";
import { Send, Smile, Paperclip, Mic } from "lucide-react";
import Header from "./Header";

export default function ChatWindow({ user, onHeaderClick }) {
  const [message, setMessage] = useState("");

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

  const messages = [
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
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 h-screen">
      <Header user={user} onHeaderClick={onHeaderClick} />{" "}
      {/* ✅ clickable header */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "John Doe" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md ${
                msg.sender === "John Doe"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-md"
                  : "bg-white text-slate-800 rounded-2xl rounded-tl-md shadow-sm"
              } p-4 transition-all hover:shadow-md`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <span
                className={`text-xs mt-2 block ${
                  msg.sender === "John Doe" ? "text-blue-100" : "text-slate-400"
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center space-x-3 max-w-5xl mx-auto">
          <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-5 py-3 pr-12 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <Mic className="w-5 h-5" />
          </button>

          <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

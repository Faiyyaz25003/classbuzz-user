"use client";

import React from "react";

export default function ChatMessages({ messages, currentUser }) {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${
            msg.sender === currentUser ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-md ${
              msg.sender === currentUser
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-md"
                : "bg-white text-slate-800 rounded-2xl rounded-tl-md shadow-sm"
            } p-4 transition-all hover:shadow-md`}
          >
            <p className="text-sm leading-relaxed">{msg.text}</p>
            <span
              className={`text-xs mt-2 block ${
                msg.sender === currentUser ? "text-blue-100" : "text-slate-400"
              }`}
            >
              {msg.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

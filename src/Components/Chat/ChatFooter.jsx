"use client";

import React, { useState } from "react";
import { Send, Smile, Paperclip, Mic } from "lucide-react";

export default function ChatFooter({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
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
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full px-5 py-3 pr-12 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <Mic className="w-5 h-5" />
        </button>

        <button
          onClick={handleSend}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

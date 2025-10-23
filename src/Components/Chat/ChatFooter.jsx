
"use client";
import React, { useState } from "react";
import { Send, Smile, Paperclip, Mic, BarChart, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import Poll from "./Pool";// ✅ Import your poll component

export default function ChatFooter({ onSend }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showPoll, setShowPoll] = useState(false); // ✅ For inline poll

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleAttachmentClick = (type) => {
    if (type === "poll") {
      setShowAttachMenu(false);
      setShowPoll(true); // ✅ open inline poll
      return;
    }
    setShowAttachMenu(false);
  };

  return (
    <div className="relative">
      {/* ✅ Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-20 z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="light"
            width={320}
            height={350}
          />
        </div>
      )}

      {/* ✅ Attachment Menu */}
      {showAttachMenu && (
        <div className="absolute bottom-20 right-32 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-72">
          <div className="grid grid-cols-3 gap-3">
            {/* Document */}
            <button
              onClick={() => handleAttachmentClick("document")}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">
                Document
              </span>
            </button>

            {/* Gallery */}
            <button
              onClick={() => handleAttachmentClick("gallery")}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">
                Gallery
              </span>
            </button>

            {/* Location */}
            <button
              onClick={() => handleAttachmentClick("location")}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-teal-200 transition-colors">
                <svg
                  className="w-6 h-6 text-teal-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">
                Location
              </span>
            </button>

            {/* Poll */}
            <button
              onClick={() => handleAttachmentClick("poll")}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
                <BarChart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Poll</span>
            </button>
          </div>
        </div>
      )}

      {/* ✅ Poll Modal (Inline Popup) */}
      {showPoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
            {/* Close Button */}
            <button
              onClick={() => setShowPoll(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Embed Poll Form */}
            <Poll />
          </div>
        </div>
      )}

      {/* ✅ Chat Footer */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between max-w-5xl mx-auto space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAttachMenu((prev) => !prev)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

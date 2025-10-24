"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  User,
  CheckCheck,
  Clock,
  Lock,
  X,
  Trash2,
  MessageSquare,
} from "lucide-react";

export default function Header({ user, onHeaderClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  if (!user) return null;

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: "Contact info", color: "text-blue-600" },
    { icon: CheckCheck, label: "Select messages", color: "text-purple-600" },
    { icon: Clock, label: "Disappearing messages", color: "text-amber-600" },
    { icon: Lock, label: "Lock chat", color: "text-green-600" },
    { icon: X, label: "Close chat", color: "text-gray-600" },
    { icon: MessageSquare, label: "Clear chat", color: "text-orange-600" },
    { icon: Trash2, label: "Delete chat", color: "text-red-600" },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm relative">
      {/* LEFT: User Info (clickable area) */}
      <div
        onClick={onHeaderClick}
        className="flex items-center space-x-4 cursor-pointer hover:opacity-90 transition"
      >
        {/* Avatar */}
        <div className="relative">
          <img
            src={user.img}
            alt={user.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </div>

        {/* Name and status */}
        <div>
          <h2 className="font-bold text-slate-800 text-lg">{user.name}</h2>
          <p className="text-sm text-blue-500 flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>
            typing...
          </p>
        </div>
      </div>

      {/* RIGHT: Action Icons */}
      <div
        className="flex items-center space-x-4 text-gray-600 relative"
        ref={menuRef}
      >
        <button className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
          <Phone className="w-5 h-5" />
        </button>

        <button className="p-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-colors">
          <Video className="w-5 h-5" />
        </button>

        {/* 3 dots menu */}
        <div className="relative">
          <button
            title="More Options"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <MoreVertical size={20} />
          </button>

          {/* Enhanced Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-2xl border border-gray-100 rounded-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const isDestructive = item.label === "Delete chat";

                return (
                  <button
                    key={idx}
                    className={`flex items-center w-full text-left px-4 py-3 transition-all duration-150 group ${
                      isDestructive ? "hover:bg-red-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      console.log(`${item.label} clicked`);
                      setMenuOpen(false);
                    }}
                  >
                    <div
                      className={`${item.color} mr-3 group-hover:scale-110 transition-transform duration-150`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isDestructive
                          ? "text-red-600 group-hover:text-red-700"
                          : "text-gray-700 group-hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

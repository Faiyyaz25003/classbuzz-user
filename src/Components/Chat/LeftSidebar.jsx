

"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function LeftSidebar({
  contacts,
  selectedContactId,
  setSelectedContact,
  onClose,
  isMobile,
}) {
  const [search, setSearch] = useState("");

  const filtered = contacts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Function to handle contact selection cleanly
  const handleSelectContact = (contact) => {
    setSelectedContact(contact); // update parent state
  };

  return (
    <div
      className={`fixed md:relative z-30 h-full w-full md:w-80 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
        isMobile ? "md:translate-x-0" : ""
      }`}
    >
      {/* ✅ Mobile back button */}
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 hover:bg-slate-300 md:hidden z-40"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {filtered.length > 0 ? (
          filtered.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleSelectContact(contact)} // ✅ call function
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedContactId === contact.id
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="relative">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      contact.status === "Online"
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {contact.name}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {contact.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1 ml-2">
                {contact.unread > 0 && (
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[20px] text-center">
                    {contact.unread}
                  </span>
                )}
                <span className="text-xs text-slate-400">2m</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 mt-5">No contacts found</p>
        )}
      </div>
    </div>
  );
}

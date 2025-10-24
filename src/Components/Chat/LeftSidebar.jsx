"use client";

import React, { useState } from "react";
import { Search, X, Users } from "lucide-react"; // Import Users icon

export default function LeftSidebar({
  contacts,
  selectedContactId,
  setSelectedContact,
  onClose,
  isMobile,
  onOpenGroupModal,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Groups", "Unread"];

  const filtered = contacts.filter((c) => {
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === "Groups") return c.members;
    if (filter === "Unread") return c.unread > 0;
    return true; // All
  });

  return (
    <div
      className={`fixed top-0 left-0 z-40 h-full w-full md:w-80 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
        isMobile ? "translate-x-0" : "translate-x-0 md:translate-x-0"
      }`}
    >
      {/* Mobile Close Button */}
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 hover:bg-slate-300 md:hidden z-50"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="p-2 border-b border-slate-200 space-y-2 flex items-center justify-between">
        <div className="flex flex-col items-center justify-center">
          <div className="relative group">
            <div className="w-50 h-15 rounded-full p-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
              <img
                src="log.jpeg"
                alt="Logo"
                className="w-full h-full rounded-full border-4 border-white object-cover shadow-lg transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2"
              />
            </div>
          </div>
        </div>
        {/* Icon Button for Create Group */}
        <button
          onClick={onOpenGroupModal}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          title="Create Group"
        >
          <Users className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4">
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

      {/* Filter Row */}
      <div className="flex space-x-2 p-4 overflow-x-auto border-b border-slate-200">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 text-sm py-1.5 px-3 rounded-lg transition-colors font-medium ${
              filter === f
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {filtered.length > 0 ? (
          filtered.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
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
                  {contact.members ? (
                    <span className="absolute bottom-0 right-0 text-xs bg-blue-500 text-white px-1 rounded">
                      G
                    </span>
                  ) : (
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        contact.status === "Online"
                          ? "bg-green-500"
                          : "bg-slate-300"
                      }`}
                    />
                  )}
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

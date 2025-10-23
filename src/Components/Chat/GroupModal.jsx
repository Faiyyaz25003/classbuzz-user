"use client";

import React, { useState } from "react";
import { X, Users, Lock, Check, Search } from "lucide-react";

export default function GroupModal({ users, onClose, onCreateGroup }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [chatCode, setChatCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!groupName) return alert("Group name is required!");
    if (selectedUsers.length === 0) return alert("Select at least one member!");

    const group = {
      id: `group_${Date.now()}`,
      name: groupName,
      members: selectedUsers,
      img: `https://i.pravatar.cc/150?u=group_${Date.now()}`,
      unread: 0,
      lastMessage: "Group created 🎉",
      chatCode: chatCode,
    };

    onCreateGroup(group);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create New Group</h2>
              <p className="text-blue-100 text-sm mt-1">
                Connect with multiple friends at once
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Group Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              placeholder="e.g., Weekend Squad, Study Group..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Chat Code Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chat Code (Optional)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Set a private code for security"
                value={chatCode}
                onChange={(e) => setChatCode(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
              />
            </div>
          </div>

          {/* Members Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Members
              <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {selectedUsers.length} selected
              </span>
            </label>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="max-h-56 overflow-y-auto border-2 border-gray-200 rounded-xl p-2 space-y-1">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No members found</p>
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedUsers.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300"
                          : "hover:bg-gray-50 border-2 border-transparent"
                      }`}
                      onClick={() => toggleUser(user.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                            isSelected
                              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

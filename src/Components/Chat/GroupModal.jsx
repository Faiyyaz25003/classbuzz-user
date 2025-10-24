
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-xl w-full max-w-md shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Create New Group</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              placeholder="e.g., Study Group"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Chat Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Chat Code (Optional)
            </label>
            <div className="relative">
              <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Private code"
                value={chatCode}
                onChange={(e) => setChatCode(e.target.value)}
                className="w-full pl-8 px-2 py-2 border rounded-md focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Members ({selectedUsers.length} selected)
            </label>

            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 px-2 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="max-h-48 overflow-y-auto border rounded-md p-1 space-y-1">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <Users className="w-10 h-10 mx-auto mb-1 opacity-40" />
                  <p className="text-sm">No members found</p>
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedUsers.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-gray-800">{user.name}</p>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

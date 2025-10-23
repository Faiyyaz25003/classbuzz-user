
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import LeftSidebar from "./LeftSidebar";
import ChatWindow from "./ChatWindow";
import ContactInfo from "./ContactInfo"; // ✅ new import

export default function ChatMain() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false); // ✅ toggle contact info panel

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        const formatted = res.data.map((u) => ({
          id: u._id,
          name: u.name,
          status: u.status || "Offline",
          img: u.profilePic || `https://i.pravatar.cc/150?u=${u._id}`,
          unread: 0,
          lastMessage: "Tap to start chat 💬",
          chatCode: u.chatCode || "0000",
          about: u.about || "Hey there! I’m using ChatApp 💬",
          phone: u.phone || "+91 98765 43210",
        }));
        setContacts(formatted);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleSelect = (contact) => {
    setShowInfo(false); // close info panel when new chat opens
    if (!verifiedUsers.includes(contact.id)) {
      const code = prompt(`Enter chat code for ${contact.name}:`);
      if (code === contact.chatCode) {
        alert("✅ Chat unlocked!");
        setVerifiedUsers((prev) => [...prev, contact.id]);
        setSelectedContact(contact);
      } else {
        alert("❌ Invalid code!");
      }
    } else {
      setSelectedContact(contact);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium text-slate-600">
        Loading users...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 transition-all">
      <LeftSidebar
        contacts={contacts}
        selectedContactId={selectedContact?.id}
        setSelectedContact={handleSelect}
      />

      <div
        className={`flex-1 flex transition-all duration-300 ${
          showInfo ? "w-2/3" : "w-full"
        }`}
      >
        <ChatWindow
          user={selectedContact}
          onHeaderClick={() => setShowInfo(!showInfo)} // ✅ toggle right panel
        />
      </div>

      {showInfo && (
        <div className="w-1/3 border-l bg-white transition-all duration-300">
          <ContactInfo
            user={selectedContact}
            onClose={() => setShowInfo(false)}
          />
        </div>
      )}
    </div>
  );
}

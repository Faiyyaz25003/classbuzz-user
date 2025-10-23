
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import LeftSidebar from "./LeftSidebar";
import ChatWindow from "./ChatWindow";
import ContactInfo from "./ContactInfo";

export default function ChatMain() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  // Mobile state: whether LeftSidebar is open
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true); // Desktop always show sidebar
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (!verifiedUsers.includes(contact.id)) {
      const code = prompt(`Enter chat code for ${contact.name}:`);
      if (code === contact.chatCode) {
        alert("✅ Chat unlocked!");
        setVerifiedUsers((prev) => [...prev, contact.id]);
        setSelectedContact(contact);
        if (isMobile) setShowSidebar(false); // Mobile: hide sidebar
      } else {
        alert("❌ Invalid code!");
      }
    } else {
      setSelectedContact(contact);
      if (isMobile) setShowSidebar(false); // Mobile: hide sidebar
    }
    setShowInfo(false); // Close info panel
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium text-slate-600">
        Loading users...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 transition-all relative">
      {/* LeftSidebar */}
      {(showSidebar || !isMobile) && (
        <div
          className={`absolute md:relative z-20 md:z-auto h-full md:h-auto w-full md:w-80 bg-white shadow-md md:shadow-none transition-transform duration-300 ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <LeftSidebar
            contacts={contacts}
            selectedContactId={selectedContact?.id}
            setSelectedContact={handleSelect}
          />
          {isMobile && selectedContact && (
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 hover:bg-slate-300 md:hidden"
            >
              Back
            </button>
          )}
        </div>
      )}

      {/* ChatWindow */}
      <div
        className={`flex-1 flex transition-all duration-300 ${
          isMobile
            ? showSidebar
              ? "hidden"
              : "block w-full"
            : showInfo
            ? "w-2/3"
            : "w-full"
        }`}
      >
        <ChatWindow
          user={selectedContact}
          onHeaderClick={() => setShowInfo(!showInfo)}
        />
      </div>

      {/* ContactInfo panel */}
      {!isMobile && showInfo && selectedContact && (
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

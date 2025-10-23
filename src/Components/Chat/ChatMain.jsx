

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import LeftSidebar from "./LeftSidebar";
import ChatWindow from "./ChatWindow";
import ContactInfo from "./ContactInfo";
import GroupModal from "./GroupModal";

export default function ChatMain() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowSidebar(true);
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleSelect = (contact) => {
    if (!verifiedUsers.includes(contact.id)) {
      if (contact.chatCode) {
        const code = prompt(`Enter chat code for ${contact.name}:`);
        if (code === contact.chatCode) {
          setVerifiedUsers((prev) => [...prev, contact.id]);
          setSelectedContact(contact);
          if (isMobile) setShowSidebar(false);
        } else return alert("❌ Invalid code!");
      } else {
        setSelectedContact(contact);
        if (isMobile) setShowSidebar(false);
      }
    } else {
      setSelectedContact(contact);
      if (isMobile) setShowSidebar(false);
    }
    setShowInfo(false);
  };

  const handleCreateGroup = (group) => {
    setContacts((prev) => [group, ...prev]);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium text-slate-600">
        Loading users...
      </div>
    );

  return (
    <div className="flex h-screen bg-slate-100 relative">
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
            isMobile={isMobile}
            onOpenGroupModal={() => setShowGroupModal(true)}
          />
        </div>
      )}

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
          onHeaderClick={() =>
            isMobile ? setShowInfo(true) : setShowInfo((prev) => !prev)
          }
        />
      </div>

      {selectedContact && !isMobile && showInfo && (
        <div className="w-1/3 border-l bg-white transition-all duration-300">
          <ContactInfo
            user={selectedContact}
            onClose={() => setShowInfo(false)}
          />
        </div>
      )}

      {selectedContact && isMobile && showInfo && (
        <div className="fixed inset-0 bg-black/40 z-30 flex justify-end">
          <div className="w-80 bg-white h-full shadow-xl p-4 relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 hover:bg-slate-300"
            >
              Back
            </button>
            <ContactInfo
              user={selectedContact}
              onClose={() => setShowInfo(false)}
            />
          </div>
        </div>
      )}

      {/* Group Modal */}
      {showGroupModal && (
        <GroupModal
          users={contacts.filter((c) => !c.members)}
          onClose={() => setShowGroupModal(false)}
          onCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
}

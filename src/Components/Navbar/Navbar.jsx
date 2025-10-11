

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Bell, User, ChevronDown, Settings, LogOut, Mail } from "lucide-react";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState({ name: "Loading...", email: "Loading..." });

  // ✅ Fetch logged-in user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser({ name: "Guest", email: "guest@classbuzz.com" });
          return;
        }

        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Backend se aane wale user data
        setUser({
          name: res.data.name || "User",
          email: res.data.email || "user@classbuzz.com",
        });

        // Optional: LocalStorage me bhi save karo
        localStorage.setItem("userName", res.data.name);
        localStorage.setItem("userEmail", res.data.email);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        setUser({ name: "Guest", email: "guest@classbuzz.com" });
      }
    };

    fetchUser();
  }, []);

  // ✅ Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Click outside close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) setIsProfileOpen(false);
      if (!e.target.closest(".notification-dropdown"))
        setIsNotificationOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Mock notifications (replace with backend later)
  const notifications = [
    {
      id: 1,
      title: "New Assignment",
      message: "Math homework due tomorrow",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Meeting Reminder",
      message: "Team sync at 3 PM today",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Grade Posted",
      message: "Your physics test score is available",
      time: "2 hours ago",
      unread: false,
    },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 z-30 transition-all duration-300 lg:left-80 left-0 
        ${isScrolled ? "shadow-lg" : ""}
        bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be]`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* ✅ Left Section - Username */}
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-2xl font-semibold text-white">
              Welcome,&nbsp;
              <span className="text-yellow-200">{user.name}</span>
            </h2>
          </div>

          {/* ✅ Right Section - Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <div className="relative notification-dropdown">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 text-white hover:text-yellow-200 transition-all duration-300"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {notifications.filter((n) => n.unread).length}
                </span>
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-4">
                    <h3 className="text-white font-semibold text-lg">
                      Notifications
                    </h3>
                    <p className="text-cyan-100 text-sm">
                      You have {notifications.filter((n) => n.unread).length}{" "}
                      unread messages
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-100 hover:bg-cyan-50 transition-colors cursor-pointer ${
                          notif.unread ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notif.unread ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">
                              {notif.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 text-center">
                    <button className="text-[#1e88a8] font-medium text-sm hover:underline">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <User size={20} className="text-white" />
                </div>
                <div className="hidden sm:block text-left text-white">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-cyan-100">{user.email}</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`hidden sm:block text-white transition-transform duration-300 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                        <User size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user.name}</p>
                        <p className="text-cyan-100 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-colors text-gray-700 hover:text-[#1e88a8]"
                    >
                      <User size={18} />
                      <span className="font-medium">My Profile</span>
                    </Link>
                    <Link
                      href="/messages"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-colors text-gray-700 hover:text-[#1e88a8]"
                    >
                      <Mail size={18} />
                      <span className="font-medium">Messages</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-colors text-gray-700 hover:text-[#1e88a8]"
                    >
                      <Settings size={18} />
                      <span className="font-medium">Settings</span>
                    </Link>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userName");
                        localStorage.removeItem("userEmail");
                        window.location.href = "/login";
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animation Style */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}

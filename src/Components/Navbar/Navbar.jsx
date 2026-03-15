// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Link from "next/link";
// import { Bell, User, ChevronDown, Settings, LogOut, Mail } from "lucide-react";

// export default function Navbar() {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [user, setUser] = useState({ name: "Loading...", email: "Loading..." });

//   // ✅ Load user from localStorage first, then backend
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         // Step 1: Try localStorage first
//         const localName = localStorage.getItem("userName");
//         const localEmail = localStorage.getItem("userEmail");

//         if (localName && localEmail) {
//           setUser({ name: localName, email: localEmail });
//           return; // Stop here if already found
//         }

//         // Step 2: Try backend if token available
//         const token = localStorage.getItem("token");
//         if (token) {
//           const res = await axios.get("http://localhost:5000/api/users/me", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           if (res.data?.name && res.data?.email) {
//             setUser({ name: res.data.name, email: res.data.email });
//             localStorage.setItem("userName", res.data.name);
//             localStorage.setItem("userEmail", res.data.email);
//           } else {
//             setUser({ name: "User", email: "user@classbuzz.com" });
//           }
//         } else {
//           setUser({ name: "Guest", email: "guest@classbuzz.com" });
//         }
//       } catch (error) {
//         console.error("❌ Error fetching user:", error);
//         setUser({ name: "Guest", email: "guest@classbuzz.com" });
//       }
//     };

//     fetchUser();
//   }, []);

//   // ✅ Scroll shadow effect
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // ✅ Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".profile-dropdown")) setIsProfileOpen(false);
//       if (!e.target.closest(".notification-dropdown"))
//         setIsNotificationOpen(false);
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // ✅ Mock notifications
//   const notifications = [
//     {
//       id: 1,
//       title: "New Assignment",
//       message: "Math homework due tomorrow",
//       time: "5 min ago",
//       unread: true,
//     },
//     {
//       id: 2,
//       title: "Meeting Reminder",
//       message: "Team sync at 3 PM today",
//       time: "1 hour ago",
//       unread: true,
//     },
//     {
//       id: 3,
//       title: "Grade Posted",
//       message: "Your physics test score is available",
//       time: "2 hours ago",
//       unread: false,
//     },
//   ];

//   return (
//     <nav
//       className={`fixed top-0 right-0 z-30 transition-all duration-300 lg:left-80 left-0
//         ${isScrolled ? "shadow-lg" : ""}
//         bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be]`}
//     >
//       <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           {/* ✅ Left Section - Username */}
//           <div className="flex items-center gap-4 flex-1">
//             <h2 className="text-2xl font-semibold text-white">
//               Welcome,&nbsp;
//               <span className="text-yellow-200">{user.name}</span>
//             </h2>
//           </div>

//           {/* ✅ Right Section - Notifications & Profile */}
//           <div className="flex items-center gap-2 sm:gap-4">
//             {/* 🔔 Notifications */}
//             <div className="relative notification-dropdown">
//               <button
//                 onClick={() => setIsNotificationOpen(!isNotificationOpen)}
//                 className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 text-white hover:text-yellow-200 transition-all duration-300"
//               >
//                 <Bell size={20} />
//                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
//                   {notifications.filter((n) => n.unread).length}
//                 </span>
//               </button>

//               {isNotificationOpen && (
//                 <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
//                   <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-4">
//                     <h3 className="text-white font-semibold text-lg">
//                       Notifications
//                     </h3>
//                     <p className="text-cyan-100 text-sm">
//                       You have {notifications.filter((n) => n.unread).length}{" "}
//                       unread messages
//                     </p>
//                   </div>
//                   <div className="max-h-96 overflow-y-auto">
//                     {notifications.map((notif) => (
//                       <div
//                         key={notif.id}
//                         className={`p-4 border-b border-gray-100 hover:bg-cyan-50 transition-colors cursor-pointer ${
//                           notif.unread ? "bg-blue-50/50" : ""
//                         }`}
//                       >
//                         <div className="flex items-start gap-3">
//                           <div
//                             className={`w-2 h-2 rounded-full mt-2 ${
//                               notif.unread ? "bg-blue-500" : "bg-gray-300"
//                             }`}
//                           ></div>
//                           <div className="flex-1">
//                             <h4 className="font-semibold text-gray-800">
//                               {notif.title}
//                             </h4>
//                             <p className="text-sm text-gray-600 mt-1">
//                               {notif.message}
//                             </p>
//                             <p className="text-xs text-gray-400 mt-2">
//                               {notif.time}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="p-3 bg-gray-50 text-center">
//                     <button className="text-[#1e88a8] font-medium text-sm hover:underline">
//                       View All Notifications
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* 👤 Profile Dropdown */}
//             <div className="relative profile-dropdown">
//               <button
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//                 className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 group"
//               >
//                 <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
//                   <User size={20} className="text-white" />
//                 </div>
//                 <div className="hidden sm:block text-left text-white">
//                   <p className="text-sm font-semibold">{user.name}</p>
//                   <p className="text-xs text-cyan-100">{user.email}</p>
//                 </div>
//                 <ChevronDown
//                   size={16}
//                   className={`hidden sm:block text-white transition-transform duration-300 ${
//                     isProfileOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {isProfileOpen && (
//                 <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
//                   <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
//                         <User size={24} className="text-white" />
//                       </div>
//                       <div>
//                         <p className="text-white font-semibold">{user.name}</p>
//                         <p className="text-cyan-100 text-sm">{user.email}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-2">
//                     <Link
//                       href="/profile"
//                       className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-colors text-gray-700 hover:text-[#1e88a8]"
//                     >
//                       <User size={18} />
//                       <span className="font-medium">My Profile</span>
//                     </Link>
//                     <Link
//                       href="/chatMain"
//                       className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-colors text-gray-700 hover:text-[#1e88a8]"
//                     >
//                       <Mail size={18} />
//                       <span className="font-medium">Messages</span>
//                     </Link>
//                     <Link
//                       href="/settings"
//                       className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-colors text-gray-700 hover:text-[#1e88a8]"
//                     >
//                       <Settings size={18} />
//                       <span className="font-medium">Settings</span>
//                     </Link>
//                     <div className="h-px bg-gray-200 my-2"></div>
//                     <button
//                       onClick={() => {
//                         localStorage.clear();
//                         window.location.href = "/login";
//                       }}
//                       className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
//                     >
//                       <LogOut size={18} />
//                       <span className="font-medium">Logout</span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Animation Style */}
//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//       `}</style>
//     </nav>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, User, ChevronDown, Settings, LogOut, Mail } from "lucide-react";

const BASE_URL = "http://localhost:5000";

export default function Navbar() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState({ name: "Loading...", email: "Loading..." });

  // ── Notification state ──
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(new Set());

  // Load user from localStorage first, then backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localName = localStorage.getItem("userName");
        const localEmail = localStorage.getItem("userEmail");
        if (localName && localEmail) {
          setUser({ name: localName, email: localEmail });
          return;
        }
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data?.name && res.data?.email) {
            setUser({ name: res.data.name, email: res.data.email });
            localStorage.setItem("userName", res.data.name);
            localStorage.setItem("userEmail", res.data.email);
          } else {
            setUser({ name: "User", email: "user@classbuzz.com" });
          }
        } else {
          setUser({ name: "Guest", email: "guest@classbuzz.com" });
        }
      } catch (error) {
        setUser({ name: "Guest", email: "guest@classbuzz.com" });
      }
    };
    fetchUser();
  }, []);

  // ── Fetch recent notifications for preview ──
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem("userId") || "demo_user";
        const res = await axios.get(
          `${BASE_URL}/api/notifications/user/${userId}`,
        );
        setNotifications(res.data.slice(0, 5)); // show latest 5 in dropdown
        const ids = new Set(
          res.data.filter((n) => n.readBy?.includes(userId)).map((n) => n._id),
        );
        setReadIds(ids);
      } catch (e) {
        // If API not available, keep empty
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) setIsProfileOpen(false);
      if (!e.target.closest(".notification-dropdown"))
        setIsNotificationOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ── Mark single notification as read ──
  const markRead = async (id) => {
    if (readIds.has(id)) return;
    try {
      const userId = localStorage.getItem("userId") || "demo_user";
      await axios.put(`${BASE_URL}/api/notifications/${id}/read`, { userId });
      setReadIds((prev) => new Set([...prev, id]));
    } catch (e) {
      setReadIds((prev) => new Set([...prev, id]));
    }
  };

  // ── Mark all as read ──
  const markAllRead = async (e) => {
    e.stopPropagation();
    try {
      const userId = localStorage.getItem("userId") || "demo_user";
      await axios.put(`${BASE_URL}/api/notifications/mark-all-read`, {
        userId,
      });
      setReadIds(new Set(notifications.map((n) => n._id)));
    } catch (e) {
      setReadIds(new Set(notifications.map((n) => n._id)));
    }
  };

  // ── Go to full notifications page ──
  const goToNotifications = () => {
    setIsNotificationOpen(false);
    router.push("/notifications"); // Change this path to match your route
  };

  // ── Helpers ──
  const getInitials = (name) => {
    if (!name || name === "Loading...") return "..";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const TYPE_ICONS = {
    announcement: "📢",
    exam: "📝",
    holiday: "🎉",
    fee: "💰",
    assignment: "📚",
    leave: "🌴",
    result: "🏆",
    general: "🔔",
  };

  const TYPE_COLORS = {
    announcement: "bg-blue-500",
    exam: "bg-red-500",
    holiday: "bg-green-500",
    fee: "bg-yellow-500",
    assignment: "bg-purple-500",
    leave: "bg-orange-500",
    result: "bg-teal-500",
    general: "bg-slate-400",
  };

  const unreadCount = notifications.filter((n) => !readIds.has(n._id)).length;

  return (
    <nav
      className={`fixed top-0 right-0 z-30 transition-all duration-300 lg:left-[289px] left-0 ${
        isScrolled
          ? "bg-[#0d4255]/95 backdrop-blur-xl shadow-xl shadow-black/10"
          : "bg-gradient-to-r from-[#0d4255] via-[#0f4c5c] to-[#1e88a8]"
      }`}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400/0 via-cyan-300/60 to-cyan-400/0" />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-[70px]">
          {/* Welcome text */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="min-w-0">
              <p className="text-white/50 text-[10px] uppercase tracking-widest font-medium hidden sm:block">
                Welcome back
              </p>
              <h2 className="text-white font-bold text-base lg:text-lg leading-none truncate">
                {user.name === "Loading..." ? (
                  <span className="inline-block w-28 h-4 bg-white/10 rounded animate-pulse" />
                ) : (
                  <>
                    <span className="text-white/80 font-normal hidden sm:inline">
                      Hello,{" "}
                    </span>
                    <span className="text-cyan-200">{user.name}</span>
                    <span className="text-white/60 ml-1">👋</span>
                  </>
                )}
              </h2>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* ── Notification Bell ── */}
            <div className="relative notification-dropdown">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileOpen(false);
                }}
                className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${
                  isNotificationOpen
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/10"
                }`}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-400 rounded-full ring-2 ring-[#0f4c5c] flex items-center justify-center text-white text-[10px] font-bold px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* ── Notification Dropdown ── */}
              {isNotificationOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden z-50"
                  style={{ animation: "dropIn 0.2s ease-out" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8]">
                    <div>
                      <h3 className="text-white font-semibold text-sm">
                        Notifications
                      </h3>
                      <p className="text-cyan-200/70 text-xs mt-0.5">
                        {unreadCount > 0
                          ? `${unreadCount} unread`
                          : "All caught up!"}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-white/70 hover:text-white text-xs underline underline-offset-2 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification items */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <span className="text-3xl">🔕</span>
                        <p className="text-sm text-gray-400 font-medium">
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const isRead = readIds.has(notif._id);
                        return (
                          <div
                            key={notif._id}
                            onClick={() => {
                              markRead(notif._id);
                              goToNotifications();
                            }}
                            className={`flex gap-3 p-3.5 hover:bg-cyan-50/60 transition-colors cursor-pointer ${
                              !isRead ? "bg-blue-50/40" : ""
                            }`}
                          >
                            {/* Icon */}
                            <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                              <span className="text-lg leading-none">
                                {TYPE_ICONS[notif.type] || "🔔"}
                              </span>
                              {!isRead && (
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${TYPE_COLORS[notif.type] || "bg-slate-400"}`}
                                />
                              )}
                            </div>
                            {/* Content */}
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm leading-tight ${!isRead ? "font-semibold text-gray-800" : "font-medium text-gray-600"}`}
                              >
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {timeAgo(notif.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer — View all */}
                  <div className="border-t border-gray-100 bg-gray-50/50">
                    <button
                      onClick={goToNotifications}
                      className="w-full flex items-center justify-center gap-2 py-3 text-xs text-[#1e88a8] font-semibold hover:text-[#0f4c5c] hover:bg-cyan-50 transition-colors"
                    >
                      View all notifications
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-3.5 h-3.5"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/15 mx-0.5 hidden sm:block" />

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationOpen(false);
                }}
                className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200 ${
                  isProfileOpen
                    ? "bg-white/20"
                    : "hover:bg-white/10 border border-white/10"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-300 to-[#1e88a8] flex items-center justify-center text-white font-bold text-[11px] shadow-md shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-white text-xs font-semibold truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <span className="text-white/50 text-[10px] mt-0.5 truncate max-w-[100px]">
                    {user.email}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-white/60 transition-transform duration-300 hidden sm:block ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden z-50"
                  style={{ animation: "dropIn 0.2s ease-out" }}
                >
                  {/* Profile card header */}
                  <div className="px-4 py-3 bg-gradient-to-br from-[#0f4c5c] to-[#1a7a9a]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-cyan-200/70 text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-50 transition-colors text-gray-700 text-sm"
                    >
                      <User size={15} className="text-[#1e88a8] shrink-0" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/chatMain"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-50 transition-colors text-gray-700 text-sm"
                    >
                      <Mail size={15} className="text-[#1e88a8] shrink-0" />
                      <span>Messages</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-50 transition-colors text-gray-700 text-sm"
                    >
                      <Settings size={15} className="text-[#1e88a8] shrink-0" />
                      <span>Settings</span>
                    </Link>
                    {/* Notifications link in profile menu too */}
                    <button
                      onClick={goToNotifications}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-50 transition-colors text-gray-700 text-sm"
                    >
                      <Bell size={15} className="text-[#1e88a8] shrink-0" />
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="ml-auto bg-red-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1.5">
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors text-sm"
                    >
                      <LogOut size={15} className="shrink-0" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dropIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </nav>
  );
}
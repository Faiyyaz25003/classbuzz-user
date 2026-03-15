// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   LayoutDashboard,
//   CalendarCheck,
//   Clock,
//   FileText,
//   Menu,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import Image from "next/image";

// export default function Sidebar({ currentView, setCurrentView }) {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       const mobile = window.innerWidth < 1024;
//       setIsMobile(mobile);
//       if (mobile) setIsCollapsed(false);
//     };
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   const menuItems = [
//     { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
//     { id: "attendance", name: "Attendance", icon: CalendarCheck },
//     {
//       id: "codeBasedAttendence",
//       name: "Code Based Attendence",
//       icon: CalendarCheck,
//     },
//     { id: "leave", name: "Apply Leave", icon: Clock },
//     { id: "fees", name: "Fees Record", icon: Clock },
//     { id: "event", name: "Event", icon: FileText },
//     { id: "schedule", name: "Schedule", icon: LayoutDashboard },
//     { id: "announcement", name: "Announcement", icon: FileText },
//     { id: "record", name: "Recorded Lecture", icon: FileText },
//     { id: "notes", name: "Notes", icon: FileText },
//     { id: "jobsOpportunity", name: "Jobs Opportunity", icon: FileText },
//     { id: "courses", name: "Courses", icon: FileText },
//     { id: "documents", name: "Documents", icon: FileText },
//     { id: "result", name: "Result", icon: FileText },
//     { id: "certificate", name: "Certificate", icon: FileText },
//     { id: "assignment", name: "Assignment", icon: FileText },
//     { id: "upcomingExams", name: "UpcomingExams", icon: FileText },
//     { id: "libraryManagement", name: "Library Management", icon: FileText },
//     { id: "id", name: "UserId", icon: FileText },
//     { id: "zoomMeeting", name: "Zoom Meeting", icon: FileText },
//   ];

//   const handleLinkClick = (id) => {
//     setCurrentView(id);
//     if (isMobile) setIsMobileOpen(false);
//   };

//   return (
//     <div
//       className={`h-screen bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white flex flex-col shadow-2xl transition-all duration-500 ease-in-out
//         ${isCollapsed && !isMobile ? "w-24" : "w-80"}
//         ${isMobile ? "fixed top-0 left-0 z-40" : "fixed"}
//         ${isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
//         max-w-full
//       `}
//     >
//       {/* Mobile Toggle */}
//       {isMobile && (
//         <button
//           onClick={() => setIsMobileOpen(!isMobileOpen)}
//           className="fixed top-4 left-4 z-50 bg-gradient-to-br from-[#0f4c5c] to-[#1e88a8] text-white p-3 rounded-xl shadow-lg lg:hidden"
//         >
//           {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       )}

//       {/* Collapse Button */}
//       {!isMobile && (
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="absolute -right-4 top-8 bg-white text-[#1e88a8] rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-300 z-10"
//         >
//           {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       )}

//       {/* Logo */}
//       <div
//         className={`flex items-center gap-3 px-6 py-6 transition-all duration-500 ${
//           isCollapsed && !isMobile ? "justify-center" : ""
//         }`}
//       >
//         <Image
//           src="/logo.jpeg"
//           alt="Logo"
//           width={isCollapsed && !isMobile ? 50 : 80}
//           height={isCollapsed && !isMobile ? 50 : 80}
//           className="rounded-lg shadow-xl"
//         />
//         {(!isCollapsed || isMobile) && (
//           <div>
//             <h1 className="text-2xl font-bold">ClassBuzz</h1>
//             <p className="text-xs text-cyan-200/80 mt-1">
//               Track . Achieve . Succeed
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Menu */}
//       <nav className="flex flex-col px-4 gap-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
//         {menuItems.map((item) => {
//           const isActive = currentView === item.id;
//           return (
//             <button
//               key={item.id}
//               onClick={() => handleLinkClick(item.id)}
//               className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
//                 isActive
//                   ? "bg-white text-[#1e88a8] shadow-2xl scale-[1.02]"
//                   : "hover:bg-white/15 hover:translate-x-1 hover:shadow-xl"
//               } ${isCollapsed && !isMobile ? "justify-center" : ""}`}
//             >
//               <item.icon size={22} />
//               {(!isCollapsed || isMobile) && (
//                 <span className="text-base font-medium">{item.name}</span>
//               )}
//             </button>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  FileText,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Award,
  FolderOpen,
  Library,
  Briefcase,
  Bell,
  Video,
  ClipboardList,
  CalendarDays,
  Mic2,
  CreditCard,
  User,
} from "lucide-react";
import Image from "next/image";

const menuGroups = [
  {
    label: "Overview",
    items: [{ id: "dashboard", name: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Academic",
    items: [
      { id: "courses", name: "Courses", icon: BookOpen },
      { id: "schedule", name: "Schedule", icon: CalendarDays },
      { id: "attendance", name: "Attendance", icon: CalendarCheck },
      {
        id: "codeBasedAttendence",
        name: "Code Attendance",
        icon: CalendarCheck,
      },
    ],
  },
  {
    label: "Exams & Results",
    items: [
      { id: "upcomingExams", name: "Upcoming Exams", icon: ClipboardList },
      { id: "result", name: "Result", icon: GraduationCap },
      { id: "certificate", name: "Certificate", icon: Award },
      { id: "assignment", name: "Assignment", icon: FolderOpen },
    ],
  },
  {
    label: "Study Material",
    items: [
      { id: "notes", name: "Notes", icon: FileText },
      { id: "documents", name: "Documents", icon: FileText },
      { id: "record", name: "Recorded Lecture", icon: Mic2 },
    ],
  },
  {
    label: "Communication",
    items: [
      { id: "announcement", name: "Announcement", icon: Bell },
      { id: "event", name: "Event", icon: CalendarDays },
      { id: "zoomMeeting", name: "Zoom Meeting", icon: Video },
    ],
  },
  {
    label: "More",
    items: [
      { id: "fees", name: "Fees Record", icon: CreditCard },
      { id: "leave", name: "Apply Leave", icon: Clock },
      { id: "libraryManagement", name: "Library", icon: Library },
      { id: "jobsOpportunity", name: "Jobs Opportunity", icon: Briefcase },
      { id: "id", name: "My ID", icon: User },
    ],
  },
];

export default function Sidebar({ currentView, setCurrentView }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLinkClick = (id) => {
    setCurrentView(id);
    if (isMobile) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 bg-[#0f4c5c] text-white p-2.5 rounded-xl shadow-lg lg:hidden"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      <aside
        className={`
          h-screen bg-gradient-to-b from-[#0a3a47] via-[#0f4c5c] to-[#1a6d88]
          text-white flex flex-col shadow-2xl
          transition-all duration-500 ease-in-out
          ${isCollapsed && !isMobile ? "w-[72px]" : "w-[288px]"}
          ${isMobile ? "fixed top-0 left-0 z-40" : "fixed"}
          ${isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Collapse button (desktop) */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3.5 top-9 bg-white text-[#1e88a8] rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 z-10 border border-[#1e88a8]/20"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        )}

        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b border-white/10
            ${isCollapsed && !isMobile ? "justify-center px-0" : ""}
          `}
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-cyan-400/30 rounded-xl blur-md" />
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={isCollapsed && !isMobile ? 36 : 44}
              height={isCollapsed && !isMobile ? 36 : 44}
              className="relative rounded-xl shadow-lg"
            />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight leading-none">
                ClassBuzz
              </h1>
              <p className="text-[10px] text-cyan-300/70 mt-1 tracking-widest uppercase">
                Track · Achieve · Succeed
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {menuGroups.map((group) => (
            <div key={group.label} className="mb-1">
              {/* Group label */}
              {(!isCollapsed || isMobile) && (
                <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-cyan-300/50 px-3 py-2 mt-2">
                  {group.label}
                </p>
              )}
              {isCollapsed && !isMobile && (
                <div className="w-8 h-px bg-white/15 mx-auto my-3" />
              )}

              {group.items.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    title={isCollapsed && !isMobile ? item.name : undefined}
                    className={`
                      w-full flex items-center gap-3 rounded-xl transition-all duration-200
                      ${
                        isCollapsed && !isMobile
                          ? "justify-center px-0 py-2.5 mx-auto w-11 h-11"
                          : "px-3 py-2.5"
                      }
                      ${
                        isActive
                          ? "bg-white text-[#0f4c5c] shadow-lg font-semibold"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <item.icon
                      size={18}
                      className={`shrink-0 ${isActive ? "text-[#1e88a8]" : ""}`}
                    />
                    {(!isCollapsed || isMobile) && (
                      <span className="text-[13px] truncate">{item.name}</span>
                    )}
                    {isActive && (!isCollapsed || isMobile) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1e88a8] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
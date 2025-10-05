

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import Dashboard from "../Dashboard/Dashboard";
// import other components

import Leave from "../Leave/Leave";
import Attendance from "../Attendance/Attendance";

export default function Sidebar() {
  const [currentView, setCurrentView] = useState("dashboard");
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

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "attendance", name: "Attendance", icon: CalendarCheck },
    { id: "leave", name: "Apply Leave", icon: Clock },
    { id: "diet", name: "Diet", icon: FileText },
    { id: "schedule", name: "Schedule", icon: LayoutDashboard },
    { id: "documents", name: "Documents", icon: FileText },
  ];

  const handleLinkClick = (id) => {
    setCurrentView(id);
    if (isMobile) setIsMobileOpen(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "attendance":
        return <Attendance />;
      case "leave":
        return <Leave />;
      // Add more cases as needed
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`h-screen bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white flex flex-col shadow-2xl transition-all duration-500 ease-in-out
          ${isCollapsed && !isMobile ? "w-24" : "w-80"}
          ${isMobile ? "fixed top-0 left-0 z-40" : "fixed"}
          ${isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
          max-w-full
        `}
      >
        {/* Mobile Toggle */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="fixed top-4 left-4 z-50 bg-gradient-to-br from-[#0f4c5c] to-[#1e88a8] text-white p-3 rounded-xl shadow-lg lg:hidden"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* Collapse Button */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-4 top-8 bg-white text-[#1e88a8] rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-300 z-10"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        )}

        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-6 py-6 transition-all duration-500 ${
            isCollapsed && !isMobile ? "justify-center" : ""
          }`}
        >
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={isCollapsed && !isMobile ? 50 : 80}
            height={isCollapsed && !isMobile ? 50 : 80}
            className="rounded-lg shadow-xl"
          />
          {(!isCollapsed || isMobile) && (
            <div>
              <h1 className="text-2xl font-bold">ClassBuzz</h1>
              <p className="text-xs text-cyan-200/80 mt-1">
                Track . Achieve . Succeed
              </p>
            </div>
          )}
        </div>

        {/* User Profile */}
        {(!isCollapsed || isMobile) && (
          <div className="mx-4 mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <User size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">Welcome Back!</p>
                <p className="text-xs text-cyan-200/80 truncate">
                  Faiyyaz Khan
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col px-4 gap-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-white text-[#1e88a8] shadow-2xl scale-[1.02]"
                    : "hover:bg-white/15 hover:translate-x-1 hover:shadow-xl"
                } ${isCollapsed && !isMobile ? "justify-center" : ""}`}
              >
                <item.icon size={22} />
                {(!isCollapsed || isMobile) && (
                  <span className="text-base font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area - Adjusted for Navbar and Sidebar */}
      <div
        className={`flex-1 transition-all duration-500 ${
          isMobile ? "" : isCollapsed ? "ml-24" : "ml-80"
        }`}
      >
        {/* Add padding-top to account for fixed navbar (h-16 on mobile, h-20 on desktop) */}
        <main className="pt-16 lg:pt-20 p-6 min-h-screen bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
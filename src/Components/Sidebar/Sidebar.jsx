"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      color: "#FF6B6B",
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: CalendarCheck,
      color: "#4ECDC4",
    },
    {
      name: "Apply Leave",
      href: "/leave",
      icon: Clock,
      color: "#FFE66D",
    },
    {
      name: "Schedule",
      href: "/schedule",
      icon: LayoutDashboard,
      color: "#A8E6CF",
    },
    {
      name: "ID Card",
      href: "/id",
      icon: Bell,
      color: "#FF8B94",
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
      color: "#C7CEEA",
    },
    {
      name: "Events",
      href: "/events",
      icon: FileText,
      color: "#C7CEEA",
    },
  ];

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 bg-gradient-to-br from-[#0f4c5c] to-[#1e88a8] text-white p-3 rounded-xl shadow-lg lg:hidden"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`h-screen bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white flex flex-col shadow-2xl transition-all duration-500 ease-in-out relative
        ${isCollapsed && !isMobile ? "w-24" : "w-80"}
        ${isMobile ? "fixed top-0 left-0 z-40" : ""}
        ${isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
        max-w-full
        `}
      >
        {/* Animated Background Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div
            className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -bottom-32 -right-32 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Collapse Toggle Button - Desktop Only */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-4 top-8 bg-white text-[#1e88a8] rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-300 z-10 group"
          >
            {isCollapsed ? (
              <ChevronRight
                size={20}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            ) : (
              <ChevronLeft
                size={20}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            )}
          </button>
        )}

        {/* Logo Section */}
        <div
          className={`flex items-center gap-3 px-6 py-6 transition-all duration-500 ${
            isCollapsed && !isMobile ? "justify-center" : ""
          } ${isMobile ? "pt-20" : ""}`}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-md group-hover:blur-lg transition-all"></div>
            <Image
              src="/logo.jpeg"
              alt="ClassBuzz Logo"
              width={isCollapsed && !isMobile ? 50 : 80}
              height={isCollapsed && !isMobile ? 50 : 80}
              className="rounded-lg shadow-xl relative z-10 transition-all duration-500"
            />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="overflow-hidden">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-wider bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent animate-fade-in">
                ClassBuzz
              </h1>
              <p className="text-xs text-cyan-200/80 mt-1">
                Track . Achieve . Succeed
              </p>
            </div>
          )}
        </div>

        {/* User Profile Card */}
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
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                  isActive
                    ? "bg-white text-[#1e88a8] shadow-2xl scale-[1.02]"
                    : "hover:bg-white/15 hover:translate-x-1 hover:shadow-xl"
                } ${isCollapsed && !isMobile ? "justify-center" : ""}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Animated background gradient on hover */}
                {!isActive && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}20 0%, transparent 100%)`,
                    }}
                  ></div>
                )}

                {/* Active indicator bar */}
                {isActive && (!isCollapsed || isMobile) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#1e88a8] rounded-r-full"></div>
                )}

                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className={`${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    } transition-transform duration-300 flex-shrink-0`}
                  >
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.5 : 2}
                      style={{ color: isActive ? item.color : undefined }}
                    />
                  </div>
                  {(!isCollapsed || isMobile) && (
                    <span
                      className={`text-base font-medium ${
                        isActive ? "font-bold" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Notification badge */}
                {(!isCollapsed || isMobile) && item.name === "Reminder" && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    3
                  </span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && !isMobile && hoveredItem === index && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-50">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    </>
  );
}

"use client";
import { useState } from "react";

import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import Dashboard from "../Dashboard/Dashboard";
import Attendance from "../Attendance/Attendance";
import Leave from "../Leave/Leave";
import Documents from "../Documents/Documents";



export default function Home() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "attendance":
        return <Attendance />;
      case "leave":
        return <Leave />;
      case "documents":
        return <Documents />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 p-6 min-h-screen bg-gray-50">
        {renderContent()}
      </div>
    </div>
  );
}

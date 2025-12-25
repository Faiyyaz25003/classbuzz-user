
"use client";
import { useState } from "react";
import { MessageSquare } from "lucide-react"; // Chat icon
import { useRouter } from "next/navigation";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import Dashboard from "../Dashboard/Dashboard";
import Attendance from "../Attendance/Attendance";
import Leave from "../Leave/Leave";
import Documents from "../Documents/Documents";
import Fees from "../Fees/Fees";
import Schedule from "../Schedule/Schedule";
import Event from "../Event/Event";
import Courses from "../Courses/Courses";
import Certificate from "../Certificate/Certificate";
import Id from "../Id/Id";
import Result from "../Result/Result";
import RecordedLectures from "../RecordedLecture/RecordedLecture";

export default function Home() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "attendance":
        return <Attendance />;
      case "fees":
        return <Fees />;
      case "leave":
        return <Leave />;
      case "schedule":
        return <Schedule />;
      case "event":
        return <Event />;
         case "leave":
        return <Leave />;
      case "courses":
        return <Courses />;
      case "documents":
        return <Documents />;
      case "result":
        return <Result />;
      case "certificate":
        return <Certificate />;
      case "id":
        return <Id />;
      case "record":
        return <RecordedLectures />;
      default:
        return <Dashboard />;
    }
  };

  const router = useRouter();

  const handleClick = () => {
    router.push("/chatMain"); // page par navigate karega
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 p-6 min-h-screen bg-gray-50">
        {renderContent()}

        {/* Chat Icon Button */}
        <button
          onClick={handleClick}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
}

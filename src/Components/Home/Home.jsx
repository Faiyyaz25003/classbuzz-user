"use client";
import { useState } from "react";

import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import Dashboard from "../Dashboard/Dashboard";
import Attendance from "../Attendance/Attendance";
import Leave from "../Leave/Leave";
import Documents from "../Documents/Documents";
import UserId from "../UserId/UserId";
import Fees from "../Fees/Fees";

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
      case "documents":
        return <Documents />;
      case "userId":
        return <UserId />;
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



// "use client";
// import { useState } from "react";
// import { MessageSquare } from "lucide-react"; // Chat icon

// import Sidebar from "../Sidebar/Sidebar";
// import Navbar from "../Navbar/Navbar";
// import Dashboard from "../Dashboard/Dashboard";
// import Attendance from "../Attendance/Attendance";
// import Leave from "../Leave/Leave";
// import Documents from "../Documents/Documents";
// import UserId from "../UserId/UserId";
// import Fees from "../Fees/Fees";

// export default function Home() {
//   const [currentView, setCurrentView] = useState("dashboard");

//   const renderContent = () => {
//     switch (currentView) {
//       case "dashboard":
//         return <Dashboard />;
//       case "attendance":
//         return <Attendance />;
//       case "fees":
//         return <Fees />;
//       case "leave":
//         return <Leave />;
//       case "documents":
//         return <Documents />;
//       case "userId":
//         return <UserId />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen relative">
//       <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
//       <Navbar currentView={currentView} setCurrentView={setCurrentView} />
//       <div className="flex-1 p-6 min-h-screen bg-gray-50 relative">
//         {renderContent()}

//         {/* Chat Icon Button */}
//         <button className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition">
//           <MessageSquare size={24} />
//         </button>
//       </div>
//     </div>
//   );
// }

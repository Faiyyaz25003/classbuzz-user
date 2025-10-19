// "use client";
// import React from "react";
// import { Users, Calendar, BookOpen, TrendingUp } from "lucide-react";
// import StatCard from "./StatCard";

// const StatsGrid = () => {
//   const stats = [
//     {
//       icon: Users,
//       label: "Total Present Day",
//       value: "1,248",
//       change: "+12%",
//       color: "bg-blue-500",
//     },
//     {
//       icon: Calendar,
//       label: "Attendance Rate",
//       value: "92%",
//       change: "+5%",
//       color: "bg-green-500",
//     },
//     {
//       icon: BookOpen,
//       label: "Active Courses",
//       value: "24",
//       change: "+3",
//       color: "bg-purple-500",
//     },
//     {
//       icon: TrendingUp,
//       label: "Avg. Performance",
//       value: "85%",
//       change: "+8%",
//       color: "bg-orange-500",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//       {stats.map((stat, idx) => (
//         <StatCard key={idx} {...stat} />
//       ))}
//     </div>
//   );
// };

// export default StatsGrid;
"use client";
import React, { useEffect, useState } from "react";
import { Users, Calendar, BookOpen, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";

const StatsGrid = () => {
  const [totalPresent, setTotalPresent] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState("0%");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/attendance/history");
        const data = await res.json();
        console.log("API Response:", data);

        // Handle both array directly or wrapped in object
        const attendanceArray = Array.isArray(data)
          ? data
          : Array.isArray(data.attendance)
          ? data.attendance
          : [];

        // Extract dates where status is "present"
        const presentDates = attendanceArray
          .filter((item) => item.status === "present")
          .map((item) => item.date);

        // Define total working days (example: current month)
        const startDate = new Date("2025-10-01"); // can be dynamic
        const endDate = new Date("2025-10-31");

        let presentCount = 0;
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split("T")[0];
          if (presentDates.includes(dateStr)) {
            presentCount += 1;
          }
          // Missing dates = absent automatically
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setTotalPresent(presentCount);

        // Calculate attendance rate
        const totalWorkingDays =
          Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        setAttendanceRate(
          ((presentCount / totalWorkingDays) * 100).toFixed(2) + "%"
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance history:", error);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const stats = [
    {
      icon: Users,
      label: "Total Present Day",
      value: totalPresent.toString(),
      change: "+12%",
      color: "bg-blue-500",
    },
    {
      icon: Calendar,
      label: "Attendance Rate",
      value: attendanceRate,
      change: "+5%",
      color: "bg-green-500",
    },
    {
      icon: BookOpen,
      label: "Active Courses",
      value: "24",
      change: "+3%",
      color: "bg-purple-500",
    },
    {
      icon: TrendingUp,
      label: "Avg. Performance",
      value: "85%",
      change: "+8%",
      color: "bg-orange-500",
    },
  ];

  return loading ? (
    <p>Loading stats...</p>
  ) : (
    <div
      key={totalPresent}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;

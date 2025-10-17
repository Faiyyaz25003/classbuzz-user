
"use client";
import React from "react";
import Header from "./Header";
import StatsGrid from "./StatsGrid";
import ChartsGrid from "./ChartsGrid";
import RecentActivity from "./RecentActivity";

const Dashboard = () => {
  const attendanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Attendance %",
        data: [92, 95, 88, 90, 93, 97],
        borderColor: "#1e88a8",
        backgroundColor: "rgba(30,136,168,0.2)",
        tension: 0.4,
      },
    ],
  };

  const performanceData = {
    labels: ["Math", "Science", "English", "History", "Art"],
    datasets: [
      {
        label: "Average Score",
        data: [85, 78, 92, 74, 88],
        backgroundColor: [
          "#1e88a8",
          "#43a047",
          "#fb8c00",
          "#8e24aa",
          "#3949ab",
        ],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 ml-[300px] mt-[40px] min-h-screen">
      <Header userName="Faiyyaz Khan" />
      <StatsGrid />
      <ChartsGrid
        attendanceData={attendanceData}
        performanceData={performanceData}
      />
      <RecentActivity />
    </div>
  );
};

export default Dashboard;

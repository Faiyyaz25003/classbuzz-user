"use client";
import React from "react";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import RecentActivityItem from "./RecentActivityItem";

const RecentActivity = () => {
  const activities = [
    {
      icon: CheckCircle,
      text: "Attendance report submitted successfully",
      time: "10 mins ago",
      color: "text-green-500",
    },
    {
      icon: Clock,
      text: "New student enrolled in Science course",
      time: "2 hrs ago",
      color: "text-blue-500",
    },
    {
      icon: AlertTriangle,
      text: "Low attendance alert for Class 9B",
      time: "5 hrs ago",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Recent Activity
      </h2>
      <ul className="space-y-4">
        {activities.map((activity, idx) => (
          <RecentActivityItem key={idx} {...activity} />
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;

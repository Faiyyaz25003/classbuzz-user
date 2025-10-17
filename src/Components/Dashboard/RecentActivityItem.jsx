"use client";
import React from "react";

const RecentActivityItem = ({ icon: Icon, text, time, color }) => {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Icon className={`w-6 h-6 ${color}`} />
        <span className="text-gray-700">{text}</span>
      </div>
      <span className="text-sm text-gray-400">{time}</span>
    </li>
  );
};

export default RecentActivityItem;

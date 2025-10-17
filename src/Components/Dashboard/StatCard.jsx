"use client";
import React from "react";

const StatCard = ({ icon: Icon, label, value, change, color }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-green-600 bg-green-100 text-sm px-2 py-1 rounded-full font-semibold">
          {change}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{label}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatCard;

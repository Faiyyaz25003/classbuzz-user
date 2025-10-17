"use client";
import React from "react";
import ChartCard from "./ChartCard";

const ChartsGrid = ({ attendanceData, performanceData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartCard title="Weekly Attendance" data={attendanceData} type="line" />
      <ChartCard
        title="Subject Performance"
        data={performanceData}
        type="bar"
      />
    </div>
  );
};

export default ChartsGrid;

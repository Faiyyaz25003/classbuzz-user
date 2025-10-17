"use client";
import React from "react";
import { Line, Bar } from "react-chartjs-2";

const ChartCard = ({ title, data, type = "line" }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
      {type === "line" ? <Line data={data} /> : <Bar data={data} />}
    </div>
  );
};

export default ChartCard;

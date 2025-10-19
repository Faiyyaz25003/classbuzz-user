
"use client";
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartCard = ({ title, data, type = "line" }) => {
  // Default chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="w-full h-64">
        {type === "line" ? (
          <Line data={data} options={options} />
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default ChartCard;

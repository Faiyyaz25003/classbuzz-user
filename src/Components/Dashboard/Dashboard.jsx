"use client";
import React from "react";
import {
  Users,
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
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

const Dashboard = () => {
  // Sample data for charts
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
      {/* Header */}
      <header className="relative mb-[20px] rounded-2xl bg-gradient-to-br from-[#0a3d4a] via-[#0f4c5c] to-[#1e88a8] text-white shadow-2xl overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Left section with enhanced typography */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-gradient-to-b from-teal-300 to-teal-500 rounded-full"></div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-teal-100 mt-1 text-sm font-medium flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Welcome back,{" "}
                    <span className="font-semibold text-white">
                      Faiyyaz Khan
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right section with interactive elements */}
            <div className="flex items-center gap-4">
              {/* Time display */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <svg
                  className="w-5 h-5 text-teal-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-teal-50">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* User avatar with gradient border */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur"></div>
                <div className="relative bg-gradient-to-br from-teal-400 to-cyan-500 p-0.5 rounded-full">
                  <div className="w-10 h-10 bg-[#0f4c5c] rounded-full flex items-center justify-center text-lg font-bold">
                    FK
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: Users,
            label: "Total Students",
            value: "1,248",
            change: "+12%",
            color: "bg-blue-500",
          },
          {
            icon: Calendar,
            label: "Attendance Rate",
            value: "92%",
            change: "+5%",
            color: "bg-green-500",
          },
          {
            icon: BookOpen,
            label: "Active Courses",
            value: "24",
            change: "+3",
            color: "bg-purple-500",
          },
          {
            icon: TrendingUp,
            label: "Avg. Performance",
            value: "85%",
            change: "+8%",
            color: "bg-orange-500",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 bg-green-100 text-sm px-2 py-1 rounded-full font-semibold">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Weekly Attendance
          </h2>
          <Line data={attendanceData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Subject Performance
          </h2>
          <Bar data={performanceData} />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Activity
        </h2>
        <ul className="space-y-4">
          {[
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
          ].map((activity, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <activity.icon className={`w-6 h-6 ${activity.color}`} />
                <span className="text-gray-700">{activity.text}</span>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

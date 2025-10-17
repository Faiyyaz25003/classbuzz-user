"use client";
import React from "react";
import { Users, Calendar, BookOpen, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";

const StatsGrid = () => {
  const stats = [
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
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;

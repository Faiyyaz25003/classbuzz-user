import { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Activity,
  Bell,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({
    present: 0,
    attendance: 0,
    courses: 0,
    performance: 0,
  });

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setSubjectData([
        { subject: "Math", score: 92 },
        { subject: "Physics", score: 88 },
        { subject: "Chemistry", score: 85 },
        { subject: "Biology", score: 90 },
        { subject: "English", score: 87 },
        { subject: "History", score: 83 },
      ]);
      setLoading(false);
    }, 1000);

    // Animate stats
    const targets = {
      present: 142,
      attendance: 94.5,
      courses: 24,
      performance: 85,
    };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        present: Math.floor(targets.present * progress),
        attendance: (targets.attendance * progress).toFixed(1),
        courses: Math.floor(targets.courses * progress),
        performance: Math.floor(targets.performance * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const colors = [
    "from-cyan-500 to-cyan-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-purple-500 to-purple-600",
    "from-indigo-500 to-indigo-600",
    "from-blue-500 to-blue-600",
  ];

  const statsCards = [
    {
      icon: Calendar,
      label: "Total Present Days",
      value: animatedStats.present,
      change: "+12%",
      bgColor: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: BookOpen,
      label: "Attendance Rate",
      value: `${animatedStats.attendance}%`,
      change: "+6%",
      bgColor: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Active Courses",
      value: animatedStats.courses,
      change: "+5%",
      bgColor: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Award,
      label: "Avg. Performance",
      value: `${animatedStats.performance}%`,
      change: "+3%",
      bgColor: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="ml-[300px] mt-[50px] min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600/40 to-blue-600/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1 tracking-tight">
                Dashboard
              </h1>
              <p className="text-teal-200 text-lg">
                Welcome back, Fahyees Khan ✨
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20">
                <Bell className="w-5 h-5 text-white" />
              </button>
              <div className="text-right text-white">
                <div className="text-sm font-medium">04:37 PM</div>
                <div className="text-xs text-teal-200">Monday, Nov 24</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform hover:scale-110 transition-transform duration-300">
                FK
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  hoveredCard === index ? "bg-white/20" : ""
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "slideInUp 0.6s ease-out",
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`${
                      stat.iconBg
                    } p-3 rounded-xl shadow-lg transform transition-transform duration-300 ${
                      hoveredCard === index ? "scale-110 rotate-6" : ""
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-semibold rounded-full border border-green-500/30">
                    {stat.change}
                  </span>
                </div>
                <div className="text-white/70 text-sm mb-1">{stat.label}</div>
                <div className="text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.bgColor} rounded-full transition-all duration-1000`}
                    style={{ width: hoveredCard === index ? "100%" : "60%" }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Attendance */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Weekly Attendance
              </h2>
              <button className="text-teal-300 text-sm hover:text-teal-200 transition-colors">
                View All
              </button>
            </div>
            <div className="h-64 flex items-end justify-around gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
                const heights = [85, 95, 78, 82, 90, 97];
                return (
                  <div
                    key={day}
                    className="flex flex-col items-center flex-1 group"
                  >
                    <div className="relative w-full">
                      <div
                        className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-xl transition-all duration-500 hover:from-teal-400 hover:to-teal-300 cursor-pointer shadow-lg group-hover:shadow-teal-500/50"
                        style={{
                          height: `${heights[i]}%`,
                          animation: `growUp 0.8s ease-out ${
                            i * 100
                          }ms backwards`,
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-2 py-1 rounded text-xs font-bold text-teal-700">
                          {heights[i]}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-white/70 mt-3 font-medium">
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Subject Performance
              </h2>
              <button className="text-teal-300 text-sm hover:text-teal-200 transition-colors">
                View Details
              </button>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
                  <div className="text-white/70">Loading data...</div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-end justify-around gap-2">
                {subjectData.map((subject, index) => {
                  const maxScore = 100;
                  const heightPercent = (subject.score / maxScore) * 100;
                  return (
                    <div
                      key={subject.subject}
                      className="flex flex-col items-center flex-1 group"
                    >
                      <div className="relative w-full">
                        <div
                          className={`w-full bg-gradient-to-t ${
                            colors[index % colors.length]
                          } rounded-t-xl transition-all duration-700 hover:brightness-110 cursor-pointer shadow-lg`}
                          style={{
                            height: `${heightPercent}%`,
                            animation: `growUp 0.8s ease-out ${
                              index * 100
                            }ms backwards`,
                          }}
                        >
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-xl">
                            {subject.score}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-white/70 mt-3 text-center font-medium">
                        {subject.subject}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: "✓",
                color: "green",
                text: "Attendance report submitted successfully",
                time: "10 mins ago",
              },
              {
                icon: "i",
                color: "blue",
                text: "New student enrolled in Science course",
                time: "2 hrs ago",
              },
              {
                icon: "⚠",
                color: "yellow",
                text: "Low attendance alert for Class 9B",
                time: "5 hrs ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer group border border-white/10"
                style={{
                  animation: `slideInLeft 0.5s ease-out ${
                    index * 100
                  }ms backwards`,
                }}
              >
                <div
                  className={`w-12 h-12 bg-${activity.color}-500/20 rounded-xl flex items-center justify-center text-${activity.color}-400 text-xl border border-${activity.color}-500/30 group-hover:scale-110 transition-transform duration-300`}
                >
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{activity.text}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-white/50">{activity.time}</div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes growUp {
          from {
            height: 0;
          }
        }
      `}</style>
    </div>
  );
}

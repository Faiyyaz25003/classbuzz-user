"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UpcomingExams() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedSemester("");
    setTimetable([]);
  };

  const handleSemesterSelect = async (semester) => {
    setSelectedSemester(semester);
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/exam-timetable`);
      const table = res.data.find(
        (t) =>
          t.course?._id === selectedCourse &&
          t.semester.toString() === semester,
      );
      if (table) {
        setTimetable(table.timetable);
      } else {
        setTimetable([]);
      }
    } catch (error) {
      console.log(error);
      setTimetable([]);
    }
    setLoading(false);
  };

  const selectedCourseName =
    courses.find((c) => c._id === selectedCourse)?.name || "";

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "—";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  return (
    <div
      style={{ fontFamily: "'Sora', sans-serif" }}
      className="min-h-screen bg-[#f7f6f3] text-slate-800 px-4 py-10"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-5xl  mt-[90px] ml-[300px] mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] bg-clip-text text-transparent">
            📅 Upcoming Exam Time-Table
          </h2>
        </div>

        {/* SELECTORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* COURSE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              📚 Course
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer"
              value={selectedCourse}
              onChange={(e) => handleCourseSelect(e.target.value)}
            >
              <option value="">— Choose a course —</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* SEMESTER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              🗓️ Semester
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              value={selectedSemester}
              onChange={(e) => handleSemesterSelect(e.target.value)}
              disabled={!selectedCourse}
            >
              <option value="">— Choose a semester —</option>
              {selectedCourse &&
                courses
                  .find((c) => c._id === selectedCourse)
                  ?.semesters?.map((s) => (
                    <option key={s.semester} value={s.semester}>
                      Semester {s.semester}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* ACTIVE PILLS */}
        {selectedCourseName && selectedSemester && (
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {selectedCourseName}
            </span>
            <span className="text-slate-300 text-xs">→</span>
            <span className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium px-4 py-2 rounded-full">
              Semester {selectedSemester}
            </span>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <svg
              className="animate-spin w-5 h-5 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-sm">Loading timetable...</span>
          </div>
        )}

        {/* TIMETABLE TABLE */}
        {!loading && timetable.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* TABLE HEADER BAR */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Exam Schedule
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {timetable.length} subject{timetable.length > 1 ? "s" : ""}{" "}
                  scheduled
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Read Only
              </span>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="px-5 py-3 text-left font-semibold">#</th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Subject
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Exam Date
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">Time</th>
                    <th className="px-5 py-3 text-left font-semibold">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timetable.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      {/* INDEX */}
                      <td className="px-5 py-4 text-slate-300 font-mono text-xs">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* SUBJECT */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-800">
                          {item.subject}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg">
                          📅 {formatDate(item.date)}
                        </span>
                      </td>

                      {/* TIME */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                          🕐 {formatTime(item.time)}
                        </span>
                      </td>

                      {/* ROOM */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-lg">
                          🏫 {item.room || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NO TIMETABLE FOUND */}
        {!loading && selectedSemester && timetable.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-slate-600 font-semibold">No timetable found</p>
            <p className="text-slate-400 text-sm mt-1">
              No exam schedule has been published for this semester yet.
            </p>
          </div>
        )}

        {/* INITIAL EMPTY STATE */}
        {!selectedCourse && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4 opacity-30">🎓</div>
            <p className="text-slate-400 text-sm">
              Select a course and semester to view the exam timetable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

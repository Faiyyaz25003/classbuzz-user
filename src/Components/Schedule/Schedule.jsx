"use client";
import React, { useEffect, useState } from "react";
import { Clock, BookOpen } from "lucide-react";
import axios from "axios";

export default function Schedule() {
  const [timetables, setTimetables] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");

  const subjectColors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
    "bg-gradient-to-br from-violet-500 to-violet-600",
    "bg-gradient-to-br from-cyan-500 to-cyan-600",
    "bg-gradient-to-br from-teal-500 to-teal-600",
    "bg-gradient-to-br from-emerald-500 to-emerald-600",
  ];

  // Fetch Schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/schedule");

        const formatted = res.data.map((t) => ({
          courseName: t.courseId.name,
          semester: t.semester,
          timetable: t.timetable,
          subjects: t.subjects,
        }));

        setTimetables(formatted);
        setFilteredData(formatted);

        const courseNames = [...new Set(formatted.map((t) => t.courseName))];
        setCourses(courseNames);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSchedules();
  }, []);

  // Filter logic (only by course)
  useEffect(() => {
    let filtered = timetables;

    if (selectedCourse) {
      filtered = filtered.filter((t) => t.courseName === selectedCourse);
    }

    setFilteredData(filtered);
  }, [selectedCourse, timetables]);

  const getSubjectColor = (subjectName, timetableSubjects) => {
    if (subjectName === "--") return "bg-gray-100 text-gray-400";
    const index = timetableSubjects.findIndex((s) => s.name === subjectName);
    return (
      subjectColors[index % subjectColors.length] + " text-white shadow-md"
    );
  };

  const generateSlots = (timetable) => {
    if (!timetable || timetable.length === 0) return [];
    return Object.keys(timetable[0]).filter((key) => key !== "day");
  };

  return (
    <div className="ml-[300px] mt-[50px] min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          All Timetables
        </h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6 justify-center">
          <select
            className="px-4 py-2 border rounded-lg shadow-sm bg-white"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>

          {selectedCourse && (
            <button
              onClick={() => setSelectedCourse("")}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            >
              Reset
            </button>
          )}
        </div>

        {/* Timetable Display */}
        {filteredData.length > 0 ? (
          filteredData.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-x-auto mb-6"
            >
              <h2 className="text-xl font-bold text-gray-800 p-4 border-b">
                {t.courseName} - Semester {t.semester}
              </h2>

              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 font-medium">Day</th>
                    {generateSlots(t.timetable).map((slot) => (
                      <th key={slot} className="px-4 py-2 font-medium">
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {t.timetable.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-semibold text-gray-700 bg-gray-50">
                        {row.day}
                      </td>

                      {generateSlots(t.timetable).map((slot) => (
                        <td key={slot} className="px-2 py-2">
                          <div
                            className={`px-3 py-1 rounded-lg text-white text-sm font-medium ${getSubjectColor(
                              row[slot],
                              t.subjects
                            )}`}
                          >
                            {row[slot]}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No timetables found...
          </div>
        )}
      </div>
    </div>
  );
}

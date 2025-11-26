"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, BookOpen } from "lucide-react";

export default function Schedule() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [timetables, setTimetables] = useState({});
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["10AM", "11AM", "12PM", "2PM", "3PM"];

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

  // LOAD COURSES
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/course")
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  // GET ALL SCHEDULES
  const fetchAllTimetables = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/schedule");

      const fetched = {};
      res.data.forEach((item) => {
        const key = `${item.courseId._id}_${item.semester}`;
        fetched[key] = {
          timetable: item.timetable,
          subjects: item.subjects,
          courseName: item.courseId.name,
        };
      });

      setTimetables(fetched);
    } catch (err) {
      console.log("Error fetching schedules");
    }
  };

  useEffect(() => {
    fetchAllTimetables();
  }, []);

  const getSubjectColor = (subjectName, subjects) => {
    if (subjectName === "--") return "bg-gray-200 text-gray-500";
    const i = subjects.findIndex((s) => s.name === subjectName);
    return subjectColors[i % subjectColors.length] + " text-white shadow";
  };

  // FILTER DISPLAY
  const filteredTimetables = Object.keys(timetables).filter((key) => {
    const [courseId, sem] = key.split("_");
    return (
      (selectedCourse ? selectedCourse === courseId : true) &&
      (selectedSemester ? selectedSemester === sem : true)
    );
  });

  return (
    <div className="ml-[300px] mt-[50px] min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            All Schedules
          </h1>
        </div>

        {/* FILTER CONTROLS */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-gray-700 flex items-center mb-2">
                <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
                Filter by Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
              >
                <option value="">All Courses</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2 text-purple-600" />
                Filter by Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* DISPLAY FILTERED TIMETABLES */}
        {filteredTimetables.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No schedules found.
          </p>
        ) : (
          filteredTimetables.map((key) => {
            const [courseId, semester] = key.split("_");
            const { timetable, subjects, courseName } = timetables[key];

            return (
              <div
                key={key}
                className="bg-white rounded-2xl shadow-xl p-8 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  {courseName} -{" "}
                  <span className="text-indigo-600">Semester {semester}</span>
                </h2>

                <div className="overflow-x-auto mt-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="bg-gray-900 text-white px-6 py-4">
                          Day
                        </th>
                        {slots.map((slot) => (
                          <th
                            key={slot}
                            className="bg-gray-900 text-white px-6 py-4"
                          >
                            {slot}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((row, i) => (
                        <tr key={i} className="border-b">
                          <td className="font-bold bg-gray-100 px-6 py-4">
                            {row.day}
                          </td>
                          {slots.map((slot) => (
                            <td key={slot} className="text-center px-3 py-3">
                              <div
                                className={`px-4 py-3 rounded-lg font-semibold ${getSubjectColor(
                                  row[slot],
                                  subjects
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

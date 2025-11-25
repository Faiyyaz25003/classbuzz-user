"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Book, Plus, Minus, Check, AlertCircle, Search } from "lucide-react";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [credits, setCredits] = useState("2");
  const [expandedCourses, setExpandedCourses] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data);
    } catch (err) {
      console.log("Error fetching:", err);
      showNotification("Failed to fetch courses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCourse = (id) => {
    setExpandedCourses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="ml-[320px] mt-[70px] min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 🔔 Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? <Check /> : <AlertCircle />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center gap-4">
          <div className="bg-teal-600 p-3 rounded-xl">
            <Book className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-teal-700">
              Course Management System
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage courses, semesters & subjects
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Course List */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex gap-3 items-center">
              <Book className="text-teal-600" /> All Courses
            </h2>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" />
              <input
                className="pl-10 pr-4 py-2 border rounded-xl"
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="border rounded-xl overflow-hidden mb-4"
            >
              <div
                className="bg-teal-600 p-5 flex justify-between items-center text-white cursor-pointer"
                onClick={() => toggleCourse(course._id)}
              >
                <div className="flex items-center gap-3">
                  {expandedCourses[course._id] ? <Minus /> : <Plus />}
                  <span className="font-bold">{course.name}</span>
                </div>
              </div>

              {expandedCourses[course._id] && (
                <div className="bg-gray-50 p-6">
                  {course.semesters.map((sem) => (
                    <div key={sem.semester} className="mb-6">
                      <h3 className="text-xl font-bold mb-3 text-orange-600">
                        Semester {sem.semester}
                      </h3>

                      <table className="w-full border rounded-xl overflow-hidden">
                        <thead className="bg-orange-500 text-white">
                          <tr>
                            <th className="p-3 text-left">Sr</th>
                            <th className="p-3 text-left">Subject</th>
                            <th className="p-3 text-center">Credits</th>
                          </tr>
                        </thead>

                        <tbody>
                          {sem.subjects.map((sub, index) => (
                            <tr
                              key={sub.id}
                              className="border-b hover:bg-indigo-50"
                            >
                              <td className="p-3">{index + 1}</td>

                              <td className="p-3">{sub.name}</td>

                              <td className="p-3 text-center">
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                  {sub.credits}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

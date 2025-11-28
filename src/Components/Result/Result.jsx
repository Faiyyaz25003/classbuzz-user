

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, BookOpen } from "lucide-react";
import ResultView from "./ResultView";
import ResultPDF from "./ResultPDF";

export default function Result() {
  // 🧍 Logged-in user (read from localStorage)
  const [loggedUser, setLoggedUser] = useState(null);

  // ✅ All student results from backend
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [userResult, setUserResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧩 Get user data from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setLoggedUser(JSON.parse(userData));
      } else {
        console.warn("⚠️ No user data found in localStorage!");
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }
  }, []);

  // 📦 Fetch all results from backend API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/results");
        setStudents(response.data || []);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // 🔍 Match logged-in user's result
  useEffect(() => {
    if (students.length > 0 && loggedUser) {
      const found = students.find(
        (s) =>
          s.rollNo?.toLowerCase() === loggedUser.rollNo?.toLowerCase() ||
          s.name?.toLowerCase() === loggedUser.name?.toLowerCase()
      );
      setUserResult(found || null);
    }
  }, [students, loggedUser]);

  return (
    <div className="min-h-screen mt-[50px] ml-[300px] bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        {/* 🧾 Header */}
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-10 h-10 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">My Result</h1>
        </div>

        {/* 👤 User Info */}
        {!loggedUser ? (
          <p className="text-center text-red-600 mt-8">
            User not found in localStorage. Please login again.
          </p>
        ) : (
          <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <p className="text-gray-700 font-medium">
              <strong>Name:</strong> {loggedUser.name}
            </p>
            <p className="text-gray-700 font-medium">
              <strong>Roll No:</strong> {students.rollNo}
            </p>
          </div>
        )}

        {/* 🕒 Loading Results */}
        {loading ? (
          <p className="text-center text-gray-600 mt-8">Loading results...</p>
        ) : userResult ? (
          // ✅ User's result found
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Roll No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Percentage
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {userResult.rollNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {userResult.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {userResult.class}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userResult.percentage >= 75
                          ? "bg-green-100 text-green-800"
                          : userResult.percentage >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {userResult.percentage}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedStudent(userResult)}
                        className="text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50"
                        title="View Result"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <ResultPDF student={userResult} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          // ❌ No result found
          <p className="text-center text-gray-600 mt-8">
            No result found for your account.
          </p>
        )}
      </div>

      {/* 📄 Result Modal */}
      {selectedStudent && (
        <ResultView
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}

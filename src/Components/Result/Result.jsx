"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, BookOpen } from "lucide-react";
import ResultView from "./ResultView";
import ResultPDF from "./ResultPDF";

export default function Result() {
  const [mounted, setMounted] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [finalData, setFinalData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setLoggedUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("LocalStorage error:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, resultsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users"),
          axios.get("http://localhost:5000/api/result"),
        ]);

        setUsers(usersRes.data || []);
        setResults(resultsRes.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loggedUser && users.length > 0) {
      const foundUser = users.find(
        (u) =>
          (u.rollNo &&
            loggedUser.rollNo &&
            u.rollNo.toLowerCase() === loggedUser.rollNo.toLowerCase()) ||
          (u.email &&
            loggedUser.email &&
            u.email.toLowerCase() === loggedUser.email.toLowerCase()) ||
          (u.name &&
            loggedUser.name &&
            u.name.toLowerCase() === loggedUser.name.toLowerCase()),
      );

      const foundResult = results.find(
        (r) =>
          (r.rollNo &&
            loggedUser.rollNo &&
            r.rollNo.toLowerCase() === loggedUser.rollNo.toLowerCase()) ||
          (r.name &&
            loggedUser.name &&
            r.name.toLowerCase() === loggedUser.name.toLowerCase()),
      );

      if (foundUser || foundResult) {
        setFinalData({
          ...foundUser,
          ...foundResult,
        });
      } else {
        setFinalData(null);
      }
    }
  }, [loggedUser, users, results]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen mt-[50px] ml-[300px] bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-10 h-10 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">My Result</h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 mt-8">Loading data...</p>
        ) : finalData ? (
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
                    Semester
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Percentage
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3">{finalData.rollNo || "N/A"}</td>
                  <td className="px-4 py-3">{finalData.name || "N/A"}</td>
                  <td className="px-4 py-3">
                    {finalData.semester || finalData.class || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {finalData.percentage !== undefined
                      ? `${finalData.percentage}%`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedStudent(finalData)}
                        className="text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <ResultPDF student={finalData} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-red-600 mt-8">No data found.</p>
        )}
      </div>

      {selectedStudent && (
        <ResultView
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}

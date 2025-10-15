"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const PunchinHistory = () => {
  const [punchData, setPunchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const backendURL = "http://localhost:5000/api/attendance";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/history`);
        if (response.data.success) {
          // Merge punch in/out by date
          const mergedData = [];
          const tempMap = {};

          response.data.punches.forEach((rec) => {
            const dateKey = rec.date; // YYYY-MM-DD
            if (!tempMap[dateKey]) {
              tempMap[dateKey] = {
                date: dateKey,
                in: null,
                out: null,
                totalHours: rec.totalHours || "",
              };
            }
            if (rec.type === "in") tempMap[dateKey].in = rec;
            if (rec.type === "out") tempMap[dateKey].out = rec;
          });

          for (const key in tempMap) {
            mergedData.push(tempMap[key]);
          }

          // Sort by date descending
          mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));
          setPunchData(mergedData);
        } else {
          alert("Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching punch history from backend");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered records
  const filteredData = punchData.filter((record) => {
    if (filterType === "day" && selectedDate)
      return record.date === selectedDate;
    if (filterType === "month" && selectedMonth)
      return record.date.startsWith(selectedMonth);
    return true;
  });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getDayName = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { weekday: "short" });

  const getTotalWorkingHours = () => {
    let total = 0;
    filteredData.forEach((record) => {
      if (record.totalHours) {
        const [h, m] = record.totalHours
          .replace("h", "")
          .replace("m", "")
          .split(" ")
          .map((x) => parseInt(x) || 0);
        total += h * 60 + m;
      }
    });
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    return `${hours}h ${mins}m`;
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  return (
    <div className="min-h-screen ml-[300px] bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto mt-[70px]">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] p-6">
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => router.push("/attendance")}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
              >
                ⬅ Back
              </button>
              <div className="text-white text-sm font-medium">
                {new Date().toLocaleDateString("en-GB")}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center">
              PUNCH HISTORY
            </h1>
          </div>

          {/* Filters */}
          <div className="p-6 space-y-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Filter By:
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Records</option>
                  <option value="day">Specific Day</option>
                  <option value="month">Specific Month</option>
                </select>
              </div>

              {filterType === "day" && (
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Select Date:
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}

              {filterType === "month" && (
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Select Month:
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl">
                <div className="text-sm text-green-700 font-medium">
                  Total Records
                </div>
                <div className="text-2xl font-bold text-green-900 mt-1">
                  {filteredData.length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl">
                <div className="text-sm text-blue-700 font-medium">
                  Complete Days
                </div>
                <div className="text-2xl font-bold text-blue-900 mt-1">
                  {filteredData.filter((r) => r.in && r.out).length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-4 rounded-xl">
                <div className="text-sm text-purple-700 font-medium">
                  Total Hours
                </div>
                <div className="text-2xl font-bold text-purple-900 mt-1">
                  {getTotalWorkingHours()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Records */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading records...</p>
          ) : filteredData.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Records Found
              </h3>
              <p className="text-gray-500">
                There are no punch records for the selected filter.
              </p>
            </div>
          ) : (
            filteredData.map((record, index) => (
              <div
                key={record.date || index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {formatDate(record.date)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getDayName(record.date)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.in && record.out
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {record.in && record.out ? "COMPLETED" : "INCOMPLETE"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {record.in && (
                      <div className="space-y-2">
                        <div className="text-green-600 font-semibold">
                          Punch In
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-2xl font-mono font-bold text-gray-800">
                            {record.in.time}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {record.in.location}
                          </div>
                          <img
                            src={record.in.photo}
                            alt="Punch In"
                            className="w-16 h-16 rounded-full object-cover border mt-2"
                          />
                        </div>
                      </div>
                    )}

                    {record.out && (
                      <div className="space-y-2">
                        <div className="text-red-600 font-semibold">
                          Punch Out
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-2xl font-mono font-bold text-gray-800">
                            {record.out.time}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {record.out.location}
                          </div>
                          <img
                            src={record.out.photo}
                            alt="Punch Out"
                            className="w-16 h-16 rounded-full object-cover border mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewDetails(record)}
                      className="px-4 py-2 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Modal */}
        {showModal && selectedRecord && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 flex justify-between items-center sticky top-0">
                <h2 className="text-xl font-bold text-white">
                  Details - {formatDate(selectedRecord.date)}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Punch In */}
                {selectedRecord.in && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                      Punch In
                    </h3>
                    <p className="text-xl font-mono font-bold">
                      {selectedRecord.in.time}
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedRecord.in.location}
                    </p>
                    <img
                      src={selectedRecord.in.photo}
                      alt="Punch In"
                      className="w-32 h-32 rounded-full object-cover border mt-2"
                    />
                  </div>
                )}

                {/* Punch Out */}
                {selectedRecord.out && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                      Punch Out
                    </h3>
                    <p className="text-xl font-mono font-bold">
                      {selectedRecord.out.time}
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedRecord.out.location}
                    </p>
                    <img
                      src={selectedRecord.out.photo}
                      alt="Punch Out"
                      className="w-32 h-32 rounded-full object-cover border mt-2"
                    />
                  </div>
                )}

                <button
                  onClick={closeModal}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PunchinHistory;

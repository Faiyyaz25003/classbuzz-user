// Punch History Component
'use client';
import { useState } from "react";
const PunchinHistory = ({ onNavigateBack }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sampleData = [
    {
      id: 1,
      date: "2025-10-09",
      punchInTime: "09:15:30",
      punchOutTime: "18:30:45",
      punchInLocation: "Alpine Industrial Estate, Marol, Andheri East, Mumbai",
      punchOutLocation: "Alpine Industrial Estate, Marol, Andheri East, Mumbai",
      punchInPhoto: null,
      punchOutPhoto: null,
      totalHours: "9h 15m",
      status: "Complete",
    },
    {
      id: 2,
      date: "2025-10-08",
      punchInTime: "09:00:12",
      punchOutTime: "17:45:20",
      punchInLocation: "Alpine Industrial Estate, Marol, Andheri East, Mumbai",
      punchOutLocation: "Alpine Industrial Estate, Marol, Andheri East, Mumbai",
      punchInPhoto: null,
      punchOutPhoto: null,
      totalHours: "8h 45m",
      status: "Complete",
    },
    {
      id: 3,
      date: "2025-10-07",
      punchInTime: "09:30:00",
      punchOutTime: "--:--:--",
      punchInLocation: "Alpine Industrial Estate, Marol, Andheri East, Mumbai",
      punchOutLocation: "Not punched out yet",
      punchInPhoto: null,
      punchOutPhoto: null,
      totalHours: "N/A",
      status: "Incomplete",
    },
    {
      id: 4,
      date: "2025-10-04",
      punchInTime: "08:45:15",
      punchOutTime: "18:00:30",
      punchInLocation: "Alpine Industrial Estate, Marol, Andheri East, Mumbai",
      punchOutLocation: "Alpine Industrial Estate, Marol, Andheri East, Mumbai",
      punchInPhoto: null,
      punchOutPhoto: null,
      totalHours: "9h 15m",
      status: "Complete",
    },
    {
      id: 5,
      date: "2025-10-03",
      punchInTime: "09:10:00",
      punchOutTime: "17:30:00",
      punchInLocation: "Alpine Industrial Estate, Marol, Andheri East, Mumbai",
      punchOutLocation: "Alpine Industrial Estate, Marol, Andheri East, Mumbai",
      punchInPhoto: null,
      punchOutPhoto: null,
      totalHours: "8h 20m",
      status: "Complete",
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const filteredData = sampleData.filter((record) => {
    if (filterType === "day" && selectedDate) {
      return record.date === selectedDate;
    }
    if (filterType === "month" && selectedMonth) {
      return record.date.startsWith(selectedMonth);
    }
    return true;
  });

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const getTotalWorkingHours = () => {
    let total = 0;
    filteredData.forEach((record) => {
      if (record.status === "Complete") {
        const hours = parseInt(record.totalHours.split("h")[0]);
        const mins = parseInt(record.totalHours.split("h")[1].split("m")[0]);
        total += hours * 60 + mins;
      }
    });
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen ml-[320px]  bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mt-[100px] mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={onNavigateBack}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back
              </button>
              <div className="text-white text-sm font-medium">
                {new Date().toLocaleDateString("en-GB")}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center">
              PUNCH HISTORY
            </h1>
          </div>

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
                  {filteredData.filter((r) => r.status === "Complete").length}
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

        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Records Found
              </h3>
              <p className="text-gray-500">
                There are no punch records for the selected filter.
              </p>
            </div>
          ) : (
            filteredData.map((record) => (
              <div
                key={record.id}
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
                        record.status === "Complete"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Punch In
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-2xl font-mono font-bold text-gray-800">
                          {record.punchInTime}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {record.punchInLocation}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-600 font-semibold">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <path
                            d="M15 9l-6 6M9 9l6 6"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        Punch Out
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-2xl font-mono font-bold text-gray-800">
                          {record.punchOutTime}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {record.punchOutLocation}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path
                          d="M12 6v6l4 2"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="font-semibold text-indigo-600">
                        {record.totalHours}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(record)}
                      className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors font-medium text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedRecord.status === "Complete"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedRecord.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {selectedRecord.totalHours}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                  Punch In Details
                </h3>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <p className="text-xl font-mono font-bold">
                    {selectedRecord.punchInTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-sm text-gray-700">
                    {selectedRecord.punchInLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Photo</p>
                  <div className="w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {selectedRecord.punchInPhoto ? (
                      <img
                        src={selectedRecord.punchInPhoto}
                        alt="Punch In"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-400">No photo available</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                  Punch Out Details
                </h3>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <p className="text-xl font-mono font-bold">
                    {selectedRecord.punchOutTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-sm text-gray-700">
                    {selectedRecord.punchOutLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Photo</p>
                  <div className="w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {selectedRecord.punchOutPhoto ? (
                      <img
                        src={selectedRecord.punchOutPhoto}
                        alt="Punch Out"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-400">No photo available</p>
                    )}
                  </div>
                </div>
              </div>

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
  );
};
export default PunchinHistory;

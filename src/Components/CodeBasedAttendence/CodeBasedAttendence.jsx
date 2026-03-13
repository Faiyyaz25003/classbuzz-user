"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// ─── Mock attendance data (replace with real API) ───────────────────────────
const MOCK_ATTENDANCE = [
  { date: "2025-03-10", status: "Present", code: "429506" },
  { date: "2025-03-08", status: "Absent", code: "—" },
  { date: "2025-03-06", status: "Present", code: "812344" },
  { date: "2025-03-04", status: "Present", code: "991023" },
  { date: "2025-03-02", status: "Absent", code: "—" },
];

// ─── SubjectDetail ───────────────────────────────────────────────────────────
function SubjectDetail({ subject, onBack }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loadingAtt, setLoadingAtt] = useState(true);

  useEffect(() => {
    // Replace with: axios.get(`/api/attendance?subjectId=${subject._id}`)
    setTimeout(() => {
      setAttendance(MOCK_ATTENDANCE);
      setLoadingAtt(false);
    }, 500);
  }, [subject]);

  const handleMark = () => {
    if (!code.trim()) {
      setMsg({ type: "error", text: "Please enter a verification code." });
      return;
    }
    // Replace with real API call
    if (code.trim() === "429506") {
      setMsg({ type: "success", text: "✓ Attendance marked successfully!" });
      setCode("");
    } else {
      setMsg({ type: "error", text: "✗ Invalid code. Please try again." });
    }
  };

  const present = attendance.filter((a) => a.status === "Present").length;
  const total = attendance.length;
  const pct = total ? Math.round((present / total) * 100) : 0;

  // ── Renders inside the SAME layout shell (sidebar + header stay intact) ──
  return (
    <div className="p-10 mt-[50px] ml-[300px] bg-gray-50 min-h-screen">
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors duration-200"
      >
        ← Back to Subjects
      </button>

      {/* Subject name + attendance % */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{subject.name}</h1>
        <div
          className="flex flex-col items-center justify-center rounded-xl px-6 py-3 min-w-[90px]"
          style={{ background: "#5b6af0" }}
        >
          <span className="text-2xl font-extrabold text-white leading-none">
            {pct}%
          </span>
          <span className="text-[10px] text-white/80 uppercase tracking-widest mt-1">
            Attendance
          </span>
        </div>
      </div>

      {/* Verification card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
        <p className="text-sm font-semibold text-gray-500 mb-5">
          Enter Valid Verification Code for Attendance
        </p>

        <div className="flex gap-4 items-center flex-wrap">
          <input
            type="text"
            maxLength={10}
            placeholder="e.g. 429506"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setMsg(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleMark()}
            className="flex-1 min-w-[200px] border-2 border-gray-200 rounded-lg px-5 py-3 text-xl font-bold tracking-[6px] text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 transition"
          />
          <button
            onClick={handleMark}
            className="px-8 py-3 rounded-lg text-white font-bold text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95 shadow"
            style={{ background: "#5b6af0" }}
          >
            Mark Present
          </button>
        </div>

        {msg && (
          <p
            className={`mt-4 text-sm font-semibold px-4 py-3 rounded-lg ${
              msg.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {msg.text}
          </p>
        )}
      </div>

      {/* Attendance History */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Daily Attendance History
          </h2>
        </div>

        {loadingAtt ? (
          <p className="px-8 py-6 text-gray-400 text-sm animate-pulse">
            Loading attendance…
          </p>
        ) : attendance.length === 0 ? (
          <p className="px-8 py-6 text-gray-400 text-sm">No records found.</p>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {["#", "Date", "Status", "Code Used"].map((h) => (
                    <th
                      key={h}
                      className="px-8 py-3 text-left text-xs font-bold uppercase tracking-wider"
                      style={{ color: "#5b6af0" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendance.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-50 hover:bg-gray-50 transition-colors relative"
                  >
                    <td className="px-8 py-4 text-sm text-gray-500 relative">
                      <span
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={{
                          background:
                            row.status === "Present" ? "#2ecc71" : "#e74c3c",
                        }}
                      />
                      {i + 1}
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-700">
                      {new Date(row.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-8 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          row.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm font-mono tracking-widest text-gray-600">
                      {row.code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary bar */}
            <div className="flex gap-8 px-8 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 flex-wrap">
              <span>
                Total: <strong className="text-gray-800">{total}</strong>
              </span>
              <span>
                Present: <strong className="text-green-600">{present}</strong>
              </span>
              <span>
                Absent:{" "}
                <strong className="text-red-500">{total - present}</strong>
              </span>
              <span>
                Percentage:{" "}
                <strong
                  className={pct >= 75 ? "text-green-600" : "text-red-500"}
                >
                  {pct}%
                </strong>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Subjects List (your original, unchanged styles) ────────────────────────
export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/users");
        const loginUser = userRes.data.find(
          (u) => u._id === JSON.parse(localStorage.getItem("user"))._id,
        );

        const userDepartment = loginUser.departments[0];
        const userSemester = loginUser.semester;

        const courseRes = await axios.get("http://localhost:5000/api/course");
        const course = courseRes.data.find((c) => c.name === userDepartment);
        const semesterData = course.semesters.find(
          (s) => s.semester == userSemester,
        );

        setSubjects(semesterData.subjects || []);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-medium animate-pulse">Loading subjects…</p>
      </div>
    );
  }

  // Show detail view — sidebar/header stay because this component only
  // controls the main content area (ml-[300px] mt-[50px])
  if (selected) {
    return (
      <SubjectDetail subject={selected} onBack={() => setSelected(null)} />
    );
  }

  return (
    <div className="p-10 mt-[50px] ml-[300px] bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-gray-800">Your Subjects</h1>

      <div className="flex flex-col space-y-6">
        {subjects.map((sub, i) => (
          <div
            key={i}
            onClick={() => setSelected(sub)}
            className="flex items-center justify-between border-2 border-gray-300 rounded-xl shadow-lg p-6 bg-white transform transition duration-300 hover:scale-105 hover:shadow-2xl w-full cursor-pointer"
          >
            <h2 className="text-2xl font-semibold text-gray-700">{sub.name}</h2>

            <button
              className="flex items-center justify-center border-2 border-gray-400 rounded-md px-6 py-3 bg-gray-100 font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(sub);
              }}
            >
              Open
              <span className="ml-3 text-xl">➜</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

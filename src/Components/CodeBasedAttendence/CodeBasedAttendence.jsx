"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

// ─────────────────────────────────────────────────────────────────────────────
// SubjectDetail — Student ka individual subject page
// ─────────────────────────────────────────────────────────────────────────────
function SubjectDetail({
  subject,
  courseId,
  semester,
  userId,
  userName,
  onBack,
}) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  });
  const [loadingAtt, setLoadingAtt] = useState(true);
  const [todayStatus, setTodayStatus] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // ✅ FIX: subjectId consistently subject.name use karo (backend mein bhi yahi store hota hai)
  const subjectId = subject.name;

  // ── Attendance history fetch ─────────────────────────────────────────────────
  const fetchAttendance = useCallback(async () => {
    if (!userId || !subjectId) return;
    setLoadingAtt(true);
    setFetchError(null);
    try {
      const res = await axios.get(`${API}/attendance-record/student`, {
        params: { userId, subjectId },
      });

      const records = res.data?.data || [];
      const sum = res.data?.summary || {
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0,
      };

      setAttendance(records);
      setSummary(sum);

      // Aaj ki attendance check karo
      const today = new Date().toISOString().split("T")[0];
      const todayRec = records.find((r) => r.date === today);
      setTodayStatus(todayRec?.status || null);
    } catch (err) {
      console.error("fetchAttendance error:", err.message);
      // ✅ FIX: 404 ya koi bhi error pe empty state set karo, crash mat karo
      setAttendance([]);
      setSummary({ total: 0, present: 0, absent: 0, percentage: 0 });
      setTodayStatus(null);
      if (err.response?.status !== 404) {
        setFetchError("Records load nahi ho sake. Thodi der baad try karo.");
      }
    } finally {
      setLoadingAtt(false);
    }
  }, [userId, subjectId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // ── Mark attendance ──────────────────────────────────────────────────────────
  const handleMark = async () => {
    if (!code.trim()) {
      setMsg({ type: "error", text: "Pehle attendance code daalo." });
      return;
    }
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await axios.post(`${API}/attendance-code/verify`, {
        enteredCode: code.trim(),
        subjectId,
        subjectName: subject.name,
        courseId,
        semester,
        userId,
        userName,
      });
      setMsg({
        type: res.data.status === "Present" ? "success" : "error",
        text: res.data.message,
      });
      setCode("");
      fetchAttendance();
    } catch (err) {
      const errData = err.response?.data;
      setMsg({
        type: "error",
        text: errData?.message || "Kuch galat hua, dobara try karo.",
      });
      setCode("");
      fetchAttendance();
    } finally {
      setSubmitting(false);
    }
  };

  const { total, present, absent, percentage: pct = 0 } = summary;

  return (
    <div className="p-10 mt-[50px] ml-[300px] bg-gray-50 min-h-screen">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-8 transition"
      >
        ← Back to Subjects
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{subject.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Semester {semester}</p>
        </div>
        <div
          className="flex flex-col items-center justify-center rounded-xl px-6 py-3 min-w-[90px]"
          style={{
            background:
              pct >= 75 ? "#2ecc71" : pct >= 50 ? "#f39c12" : "#e74c3c",
          }}
        >
          <span className="text-2xl font-extrabold text-white leading-none">
            {pct}%
          </span>
          <span className="text-[10px] text-white/80 uppercase tracking-widest mt-1">
            Attendance
          </span>
        </div>
      </div>

      {/* Aaj already marked banner */}
      {todayStatus && (
        <div
          className={`mb-6 px-6 py-4 rounded-xl border font-semibold text-sm ${
            todayStatus === "Present"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {todayStatus === "Present"
            ? "✅ Aaj ki attendance ho gayi — Present"
            : "❌ Aaj ki attendance mark ho gayi — Absent"}
        </div>
      )}

      {/* Code entry card — sirf tab dikhao jab aaj mark nahi hui */}
      {!todayStatus && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
          <p className="text-sm font-semibold text-gray-500 mb-1">
            Teacher ka Attendance Code daalo
          </p>
          <p className="text-xs text-gray-400 mb-5">
            ⚠️ Code sirf 5 minutes ke liye valid hota hai
          </p>
          <div className="flex gap-4 items-center flex-wrap">
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="e.g. 482916"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setMsg(null);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && !submitting && handleMark()
              }
              className="flex-1 min-w-[200px] border-2 border-gray-200 rounded-lg px-5 py-3 text-xl font-bold tracking-[6px] text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 transition"
            />
            <button
              onClick={handleMark}
              disabled={submitting}
              className="px-8 py-3 rounded-lg text-white font-bold text-sm tracking-wide transition-all hover:opacity-90 active:scale-95 shadow disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "#5b6af0" }}
            >
              {submitting ? "Verifying…" : "Mark Present"}
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
      )}

      {/* Daily Attendance History */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Daily Attendance History
          </h2>
          <button
            onClick={fetchAttendance}
            className="text-sm text-blue-500 hover:underline"
          >
            🔃 Refresh
          </button>
        </div>

        {loadingAtt ? (
          <p className="px-8 py-6 text-gray-400 text-sm animate-pulse">
            Loading attendance…
          </p>
        ) : fetchError ? (
          <p className="px-8 py-6 text-red-500 text-sm">{fetchError}</p>
        ) : attendance.length === 0 ? (
          <p className="px-8 py-6 text-gray-400 text-sm">
            Abhi tak koi attendance record nahi hai.
          </p>
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
                    key={row._id || i}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors relative"
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
                      {new Date(row.date + "T00:00:00").toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
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
                      {row.codeUsed || "—"}
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
                Absent: <strong className="text-red-500">{absent}</strong>
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

// ─────────────────────────────────────────────────────────────────────────────
// Main export — Subjects list (Student view)
// ─────────────────────────────────────────────────────────────────────────────
export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    userId: "",
    userName: "",
    courseId: "",
    semester: 1,
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser?._id) throw new Error("User not logged in.");

        const userRes = await axios.get(`${API}/users`);
        const loginUser = userRes.data.find((u) => u._id === storedUser._id);
        if (!loginUser) throw new Error("User not found.");

        const userDepartment = loginUser.departments?.[0];
        const userSemester = loginUser.semester;

        const courseRes = await axios.get(`${API}/course`);
        const course = courseRes.data.find((c) => c.name === userDepartment);
        if (!course) throw new Error(`Course not found: ${userDepartment}`);

        const semesterData = course.semesters.find(
          (s) => String(s.semester) === String(userSemester),
        );
        if (!semesterData)
          throw new Error(`Semester ${userSemester} not found.`);

        setSubjects(semesterData.subjects || []);
        setUserInfo({
          userId: loginUser._id,
          userName:
            loginUser.name ||
            loginUser.username ||
            loginUser.email ||
            "Student",
          courseId: course._id || course.name,
          semester: userSemester,
        });
      } catch (err) {
        console.error("fetchSubjects:", err);
        setError(err.message || "Data load nahi ho saka.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-medium animate-pulse text-gray-600">
          Loading subjects…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 gap-4">
        <p className="text-red-500 font-semibold text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (selected) {
    return (
      <SubjectDetail
        subject={selected}
        courseId={userInfo.courseId}
        semester={userInfo.semester}
        userId={userInfo.userId}
        userName={userInfo.userName}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="p-10 mt-[50px] ml-[300px] bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-gray-800">Your Subjects</h1>
      {subjects.length === 0 ? (
        <p className="text-gray-400">Koi subject nahi mila.</p>
      ) : (
        <div className="flex flex-col space-y-6">
          {subjects.map((sub, i) => (
            <div
              key={sub._id || i}
              onClick={() => setSelected(sub)}
              className="flex items-center justify-between border-2 border-gray-300 rounded-xl shadow-lg p-6 bg-white transform transition duration-300 hover:scale-105 hover:shadow-2xl w-full cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-gray-700">
                {sub.name}
              </h2>
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
      )}
    </div>
  );
}

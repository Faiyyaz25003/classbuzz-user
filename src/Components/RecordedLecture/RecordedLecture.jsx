"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import {
  Video,
  BookOpen,
  Calendar,
  Upload,
  Link2,
  FileText,
  Save,
  Trash2,
  PlayCircle,
  Loader2,
  FileVideo,
  Sparkles,
  ArrowLeft,
  BookMarked,
  AlertCircle,
} from "lucide-react";

const API_BASE = "http://localhost:5000";
const API = `${API_BASE}/api`;

// ─────────────────────────────────────────────────────────────────────────────
// SubjectLectures — Ek subject ki saari lectures dikhata hai
// ─────────────────────────────────────────────────────────────────────────────
function SubjectLectures({
  subject,
  department,
  semester,
  onBack,
  attendanceMap,
}) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Attendance records for this subject (from parent)
  const attendanceRecords = attendanceMap?.[subject] || [];

  const fetchLectures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/lectures`, {
        params: { department, semester, subject },
      });
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.lectures)
          ? res.data.lectures
          : [];

      const filtered = data.filter(
        (lec) =>
          String(lec.department) === String(department) &&
          String(lec.semester) === String(semester) &&
          String(lec.subject) === String(subject),
      );

      setLectures(filtered);
    } catch (err) {
      console.error("fetchLectures error:", err.message);
      setLectures([]);
      if (err.response?.status !== 404) {
        setError("Lectures load nahi ho sake. Thodi der baad try karo.");
      }
    } finally {
      setLoading(false);
    }
  }, [department, semester, subject]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  // Build a map: date → status  (from attendance records of this subject)
  const dateStatusMap = useMemo(() => {
    const map = {};
    attendanceRecords.forEach((r) => {
      if (r.date) map[r.date] = r.status; // "Present" | "Absent"
    });
    return map;
  }, [attendanceRecords]);

  return (
    <div className="p-10 mt-[50px] ml-[300px] bg-gray-50 min-h-screen">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-8 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Subjects
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
          <Video className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{subject}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {department} &nbsp;·&nbsp; Semester {semester}
          </p>
        </div>
      </div>

      {/* Lectures */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading lectures…
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm py-6">{error}</p>
      ) : lectures.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">
          <FileVideo className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            Is subject ke liye abhi koi recorded lecture nahi hai.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {lectures.map((lecture) => {
            // Normalize lecture date to YYYY-MM-DD
            const lecDate = lecture.date
              ? lecture.date.includes("T")
                ? lecture.date.split("T")[0]
                : lecture.date
              : null;

            const attStatus = lecDate ? dateStatusMap[lecDate] : null;
            const isAbsent = attStatus === "Absent";
            const isPresent = attStatus === "Present";

            return (
              <div
                key={lecture._id}
                className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
                  isAbsent
                    ? "border-red-300"
                    : isPresent
                      ? "border-green-200"
                      : "border-gray-200"
                }`}
              >
                {/* ── Attendance status ribbon on the left edge ── */}
                {attStatus && (
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[4px]"
                    style={{ background: isAbsent ? "#e74c3c" : "#2ecc71" }}
                  />
                )}

                {/* ── Absent badge (top-right corner) ── */}
                {isAbsent && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">
                    <AlertCircle className="h-3 w-3" />
                    Absent
                  </div>
                )}

                {isPresent && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full border border-green-200">
                    ✅ Present
                  </div>
                )}

                {/* Title + date */}
                <div className="mb-3 pr-20">
                  <h3 className="text-lg font-bold text-gray-800">
                    {lecture.lectureTitle || "Untitled Lecture"}
                  </h3>
                  <p
                    className={`text-sm mt-1 font-medium ${
                      isAbsent
                        ? "text-red-500"
                        : isPresent
                          ? "text-green-600"
                          : "text-gray-500"
                    }`}
                  >
                    <Calendar className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                    {lecture.date
                      ? new Date(
                          lecture.date.includes("T")
                            ? lecture.date
                            : lecture.date + "T00:00:00",
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "No date"}
                    {isAbsent && (
                      <span className="ml-2 text-red-400 text-xs">
                        — Tum absent the is din
                      </span>
                    )}
                  </p>
                </div>

                {lecture.summaryGeneratedByAI && (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Summary Generated
                  </div>
                )}

                {/* Summary */}
                {lecture.summary?.trim() && (
                  <div className="mb-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <h4 className="text-sm font-semibold text-gray-700">
                        Summary
                      </h4>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-6 text-gray-700 line-clamp-4">
                      {lecture.summary}
                    </p>
                  </div>
                )}

                {/* YouTube embedded player */}
                {lecture.youtubeUrl &&
                  (() => {
                    const match = lecture.youtubeUrl.match(
                      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/,
                    );
                    const videoId = match?.[1];
                    return videoId ? (
                      <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 aspect-video">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={lecture.lectureTitle || "Lecture Video"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a
                        href={lecture.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 mt-2"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Watch on YouTube
                      </a>
                    );
                  })()}

                {/* Uploaded video file */}
                {lecture.videoFile && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    <a
                      href={`${API_BASE}/${lecture.videoFile}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900"
                    >
                      <FileVideo className="h-4 w-4" />
                      View Video
                    </a>
                  </div>
                )}

                {lecture.videoFile && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
                    <video
                      controls
                      className="h-56 w-full bg-black object-cover"
                      src={`${API_BASE}/${lecture.videoFile}`}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Transcript */}
                {lecture.transcript?.trim() && (
                  <details className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <summary className="cursor-pointer text-sm font-medium text-blue-600">
                      View Transcript
                    </summary>
                    <div className="mt-3 max-h-48 overflow-y-auto whitespace-pre-line text-sm text-gray-700">
                      {lecture.transcript}
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — Student ke subjects list (Recorded Lectures view)
// ─────────────────────────────────────────────────────────────────────────────
export default function RecordedLecture() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  // attendanceMap: { [subjectName]: [ { date, status, ... }, ... ] }
  const [attendanceMap, setAttendanceMap] = useState({});

  const [userInfo, setUserInfo] = useState({
    userId: "",
    department: "",
    semester: 1,
  });

  // ── Fetch subjects + user info ────────────────────────────────────────────
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

        const subjectList = semesterData.subjects || [];
        setSubjects(subjectList);
        setUserInfo({
          userId: loginUser._id,
          department: userDepartment,
          semester: userSemester,
        });

        // ── Fetch attendance for every subject in parallel ──────────────────
        const results = await Promise.allSettled(
          subjectList.map(async (sub) => {
            const subName = typeof sub === "string" ? sub : sub.name;
            try {
              const res = await axios.get(`${API}/attendance-record/student`, {
                params: { userId: loginUser._id, subjectId: subName },
              });
              return { subName, records: res.data?.data || [] };
            } catch {
              return { subName, records: [] };
            }
          }),
        );

        const map = {};
        results.forEach((r) => {
          if (r.status === "fulfilled") {
            map[r.value.subName] = r.value.records;
          }
        });
        setAttendanceMap(map);
      } catch (err) {
        console.error("fetchSubjects:", err);
        setError(err.message || "Data load nahi ho saka.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];

  // Returns today's attendance status for a subject: "Present" | "Absent" | null
  const getTodayStatus = (subName) => {
    const records = attendanceMap[subName] || [];
    return records.find((r) => r.date === today)?.status || null;
  };

  // Returns absent count for a subject (for the badge)
  const getAbsentCount = (subName) => {
    const records = attendanceMap[subName] || [];
    return records.filter((r) => r.status === "Absent").length;
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-medium animate-pulse text-gray-600">
          Loading subjects…
        </p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
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

  // ── Subject detail view ───────────────────────────────────────────────────
  if (selected) {
    return (
      <SubjectLectures
        subject={selected}
        department={userInfo.department}
        semester={userInfo.semester}
        onBack={() => setSelected(null)}
        attendanceMap={attendanceMap}
      />
    );
  }

  // ── Subjects list ─────────────────────────────────────────────────────────
  return (
    <div className="p-10 mt-[50px] ml-[300px] bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-12">
        <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
          <Video className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Recorded Lectures
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {userInfo.department} &nbsp;·&nbsp; Semester {userInfo.semester}
          </p>
        </div>
      </div>

      {subjects.length === 0 ? (
        <p className="text-gray-400">Koi subject nahi mila.</p>
      ) : (
        <div className="flex flex-col space-y-6">
          {subjects.map((sub, i) => {
            const subName = typeof sub === "string" ? sub : sub.name;
            const todayStatus = getTodayStatus(subName);
            const absentCount = getAbsentCount(subName);
            const isAbsentToday = todayStatus === "Absent";
            const isPresentToday = todayStatus === "Present";

            return (
              <div
                key={sub._id || i}
                onClick={() => setSelected(subName)}
                className={`flex items-center justify-between rounded-xl shadow-lg p-6 bg-white transform transition duration-300 hover:scale-105 hover:shadow-2xl w-full cursor-pointer relative overflow-hidden ${
                  isAbsentToday
                    ? "border-2 border-red-400"
                    : isPresentToday
                      ? "border-2 border-green-300"
                      : "border-2 border-gray-300"
                }`}
              >
                {/* Left colored ribbon */}
                <span
                  className="absolute left-0 top-0 bottom-0 w-[5px]"
                  style={{
                    background: isAbsentToday
                      ? "#e74c3c"
                      : isPresentToday
                        ? "#2ecc71"
                        : "transparent",
                  }}
                />

                <div className="flex items-center gap-4 pl-2">
                  <div
                    className={`rounded-xl p-2.5 ${
                      isAbsentToday
                        ? "bg-red-50 text-red-500"
                        : isPresentToday
                          ? "bg-green-50 text-green-500"
                          : "bg-blue-50 text-blue-500"
                    }`}
                  >
                    <BookMarked className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-700">
                      {subName}
                    </h2>

                    {/* Today's status label */}
                    {isAbsentToday && (
                      <p className="flex items-center gap-1 text-xs font-semibold text-red-500 mt-0.5">
                        <AlertCircle className="h-3 w-3" />
                        Aaj absent the — missed lecture dekho
                      </p>
                    )}
                    {isPresentToday && (
                      <p className="text-xs font-semibold text-green-600 mt-0.5">
                        ✅ Aaj present the
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Absent count badge */}
                  {absentCount > 0 && (
                    <div className="flex flex-col items-center justify-center bg-red-50 border border-red-200 rounded-xl px-3 py-2 min-w-[56px]">
                      <span className="text-lg font-extrabold text-red-500 leading-none">
                        {absentCount}
                      </span>
                      <span className="text-[10px] text-red-400 uppercase tracking-wider mt-0.5">
                        Absent
                      </span>
                    </div>
                  )}

                  <button
                    className={`flex items-center justify-center border-2 rounded-md px-6 py-3 font-medium transition duration-300 ${
                      isAbsentToday
                        ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"
                        : "border-gray-400 bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(subName);
                    }}
                  >
                    View Lectures
                    <span className="ml-3 text-xl">➜</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

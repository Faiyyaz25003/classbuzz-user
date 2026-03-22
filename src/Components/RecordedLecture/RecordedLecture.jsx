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
} from "lucide-react";

const API_BASE = "http://localhost:5000";
const API = `${API_BASE}/api`;

// ─────────────────────────────────────────────────────────────────────────────
// SubjectLectures — Ek subject ki saari lectures dikhata hai
// ─────────────────────────────────────────────────────────────────────────────
function SubjectLectures({ subject, department, semester, onBack }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLectures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/lectures`, {
        params: {
          department,
          semester,
          subject,
        },
      });
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.lectures)
          ? res.data.lectures
          : [];

      // Client-side filter bhi lagao — ensure correct subject ki lectures aayein
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
          {lectures.map((lecture) => (
            <div
              key={lecture._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Title + AI badge */}
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {lecture.lectureTitle || "Untitled Lecture"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  <Calendar className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                  {lecture.date || "No date"}
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

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-2">
                {lecture.youtubeUrl && (
                  <a
                    href={lecture.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Watch on YouTube
                  </a>
                )}

                {lecture.videoFile && (
                  <a
                    href={`${API_BASE}/${lecture.videoFile}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900"
                  >
                    <FileVideo className="h-4 w-4" />
                    View Video
                  </a>
                )}
              </div>

              {/* Embedded video player */}
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

              {/* Transcript (collapsible) */}
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
          ))}
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
  const [selected, setSelected] = useState(null); // selected subject name
  const [userInfo, setUserInfo] = useState({
    userId: "",
    department: "",
    semester: 1,
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser?._id) throw new Error("User not logged in.");

        // User details fetch karo
        const userRes = await axios.get(`${API}/users`);
        const loginUser = userRes.data.find((u) => u._id === storedUser._id);
        if (!loginUser) throw new Error("User not found.");

        const userDepartment = loginUser.departments?.[0];
        const userSemester = loginUser.semester;

        // Course fetch karo
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
          department: userDepartment,
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

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-medium animate-pulse text-gray-600">
          Loading subjects…
        </p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
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

  // ── Subject detail view ──────────────────────────────────────────────────────
  if (selected) {
    return (
      <SubjectLectures
        subject={selected}
        department={userInfo.department}
        semester={userInfo.semester}
        onBack={() => setSelected(null)}
      />
    );
  }

  // ── Subjects list ────────────────────────────────────────────────────────────
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
            return (
              <div
                key={sub._id || i}
                onClick={() => setSelected(subName)}
                className="flex items-center justify-between border-2 border-gray-300 rounded-xl shadow-lg p-6 bg-white transform transition duration-300 hover:scale-105 hover:shadow-2xl w-full cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-500">
                    <BookMarked className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-700">
                    {subName}
                  </h2>
                </div>
                <button
                  className="flex items-center justify-center border-2 border-gray-400 rounded-md px-6 py-3 bg-gray-100 font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(subName);
                  }}
                >
                  View Lectures
                  <span className="ml-3 text-xl">➜</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

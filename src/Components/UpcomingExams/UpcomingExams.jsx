// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function UpcomingExams() {
//   const [courses, setCourses] = useState([]);
//   const [allTimetables, setAllTimetables] = useState([]);
//   const [timetable, setTimetable] = useState([]);

//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [selectedSemester, setSelectedSemester] = useState("");

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchCourses();
//     fetchTimetables();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/course");
//       setCourses(res.data || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchTimetables = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get("http://localhost:5000/api/exam-timetable");

//       const tables = res.data || [];

//       setAllTimetables(tables);

//       const merged = tables.flatMap((t) =>
//         t.timetable.map((row) => ({
//           ...row,
//           courseId: t.course?._id,
//           courseName: t.course?.name,
//           semester: t.semester,
//         })),
//       );

//       setTimetable(merged);
//     } catch (error) {
//       console.log(error);
//     }

//     setLoading(false);
//   };

//   const handleCourseSelect = (courseId) => {
//     setSelectedCourse(courseId);
//     setSelectedSemester("");

//     if (!courseId) {
//       fetchTimetables();
//       return;
//     }

//     const filtered = allTimetables
//       .filter((t) => t.course?._id === courseId)
//       .flatMap((t) =>
//         t.timetable.map((row) => ({
//           ...row,
//           courseId: t.course?._id,
//           courseName: t.course?.name,
//           semester: t.semester,
//         })),
//       );

//     setTimetable(filtered);
//   };

//   const handleSemesterSelect = (semester) => {
//     setSelectedSemester(semester);

//     const filtered = allTimetables
//       .filter(
//         (t) =>
//           t.course?._id === selectedCourse &&
//           t.semester.toString() === semester,
//       )
//       .flatMap((t) =>
//         t.timetable.map((row) => ({
//           ...row,
//           courseId: t.course?._id,
//           courseName: t.course?.name,
//           semester: t.semester,
//         })),
//       );

//     setTimetable(filtered);
//   };

//   const handleChange = (index, field, value) => {
//     const updated = [...timetable];
//     updated[index][field] = value;
//     setTimetable(updated);
//   };

//   // GROUP BY COURSE + SEMESTER
//   const groupedTimetable = timetable.reduce((acc, item) => {
//     const key = `${item.courseName} - Semester ${item.semester}`;

//     if (!acc[key]) acc[key] = [];
//     acc[key].push(item);

//     return acc;
//   }, {});

//   return (
//     <div className="min-h-screen ml-[350px] mt-[50px] bg-white text-slate-800 px-4 py-10">
//       <div className="max-w-6xl mx-auto">
//         {/* HEADER */}
//         <div className="mb-10">
//           <p className="text-slate-400 mt-2">Upcoming Exam Schedule</p>
//         </div>

//         {/* FILTERS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
//           <select
//             className="border rounded-xl px-4 py-3"
//             value={selectedCourse}
//             onChange={(e) => handleCourseSelect(e.target.value)}
//           >
//             <option value="">All Courses</option>

//             {courses.map((course) => (
//               <option key={course._id} value={course._id}>
//                 {course.name}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border rounded-xl px-4 py-3"
//             value={selectedSemester}
//             onChange={(e) => handleSemesterSelect(e.target.value)}
//             disabled={!selectedCourse}
//           >
//             <option value="">All Semester</option>

//             {selectedCourse &&
//               courses
//                 .find((c) => c._id === selectedCourse)
//                 ?.semesters?.map((s) => (
//                   <option key={s.semester} value={s.semester}>
//                     Semester {s.semester}
//                   </option>
//                 ))}
//           </select>
//         </div>

//         {loading && <p>Loading timetable...</p>}

//         {/* MULTIPLE TABLES */}
//         {!loading &&
//           Object.entries(groupedTimetable).map(([group, rows], index) => (
//             <div key={index} className="mb-12">
//               {/* TABLE TITLE */}
//               <h2 className="text-xl font-semibold mb-4 text-indigo-600">
//                 {group}
//               </h2>

//               <div className="border rounded-2xl overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-slate-50 border-b">
//                     <tr>
//                       <th className="px-5 py-3 text-left">#</th>
//                       <th className="px-5 py-3 text-left">Subject</th>
//                       <th className="px-5 py-3 text-left">Date</th>
//                       <th className="px-5 py-3 text-left">Time</th>
//                       <th className="px-5 py-3 text-left">Room</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {rows.map((item, i) => (
//                       <tr key={i} className="border-b">
//                         <td className="px-5 py-4">{i + 1}</td>

//                         <td className="px-5 py-4 font-semibold">
//                           {item.subject}
//                         </td>

//                         <td className="px-5 py-4">
//                           <input
//                             type="date"
//                             value={item.date}
//                             onChange={(e) =>
//                               handleChange(i, "date", e.target.value)
//                             }
//                             className="border rounded px-2 py-1"
//                           />
//                         </td>

//                         <td className="px-5 py-4">
//                           <input
//                             type="time"
//                             value={item.time}
//                             onChange={(e) =>
//                               handleChange(i, "time", e.target.value)
//                             }
//                             className="border rounded px-2 py-1"
//                           />
//                         </td>

//                         <td className="px-5 py-4">
//                           <input
//                             type="text"
//                             value={item.room}
//                             onChange={(e) =>
//                               handleChange(i, "room", e.target.value)
//                             }
//                             className="border rounded px-2 py-1"
//                           />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UpcomingExams() {
  const [courses, setCourses] = useState([]);
  const [allTimetables, setAllTimetables] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchTimetables();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/course");
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/exam-timetable");
      const tables = res.data || [];
      setAllTimetables(tables);
      const merged = tables.flatMap((t) =>
        t.timetable.map((row) => ({
          ...row,
          courseId: t.course?._id,
          courseName: t.course?.name,
          semester: t.semester,
        })),
      );
      setTimetable(merged);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedSemester("");
    if (!courseId) {
      fetchTimetables();
      return;
    }
    const filtered = allTimetables
      .filter((t) => t.course?._id === courseId)
      .flatMap((t) =>
        t.timetable.map((row) => ({
          ...row,
          courseId: t.course?._id,
          courseName: t.course?.name,
          semester: t.semester,
        })),
      );
    setTimetable(filtered);
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
    const filtered = allTimetables
      .filter(
        (t) =>
          t.course?._id === selectedCourse &&
          t.semester.toString() === semester,
      )
      .flatMap((t) =>
        t.timetable.map((row) => ({
          ...row,
          courseId: t.course?._id,
          courseName: t.course?.name,
          semester: t.semester,
        })),
      );
    setTimetable(filtered);
  };

  const handleChange = (index, field, value) => {
    const updated = [...timetable];
    updated[index][field] = value;
    setTimetable(updated);
  };

  const groupedTimetable = timetable.reduce((acc, item) => {
    const key = `${item.courseName} - Semester ${item.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const totalExams = timetable.length;
  const totalGroups = Object.keys(groupedTimetable).length;

  return (
    <div className="min-h-screen ml-[350px] mt-[50px] bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 text-slate-800 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Exam Timetable
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Upcoming Exam Schedule
              </p>
            </div>
          </div>
          {!loading && timetable.length > 0 && (
            <div className="flex gap-3 mt-5">
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                {totalGroups} {totalGroups === 1 ? "Group" : "Groups"}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-violet-100">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                {totalExams} {totalExams === 1 ? "Exam" : "Exams"}
              </span>
            </div>
          )}
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            {
              label: "Course",
              content: (
                <select
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all hover:border-slate-300 cursor-pointer"
                  value={selectedCourse}
                  onChange={(e) => handleCourseSelect(e.target.value)}
                >
                  <option value="">All Courses</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              label: "Semester",
              content: (
                <select
                  className={`w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all ${!selectedCourse ? "opacity-50 cursor-not-allowed text-slate-400" : "text-slate-700 hover:border-slate-300 cursor-pointer"}`}
                  value={selectedSemester}
                  onChange={(e) => handleSemesterSelect(e.target.value)}
                  disabled={!selectedCourse}
                >
                  <option value="">All Semesters</option>
                  {selectedCourse &&
                    courses
                      .find((c) => c._id === selectedCourse)
                      ?.semesters?.map((s) => (
                        <option key={s.semester} value={s.semester}>
                          Semester {s.semester}
                        </option>
                      ))}
                </select>
              ),
            },
          ].map(({ label, content }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                {label}
              </label>
              <div className="relative">
                {content}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">
              Loading timetable...
            </p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && timetable.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-slate-600 font-semibold">No exams scheduled</p>
            <p className="text-slate-400 text-sm max-w-xs">
              Try selecting a different course or semester.
            </p>
          </div>
        )}

        {/* GROUPED TABLES */}
        {!loading &&
          Object.entries(groupedTimetable).map(([group, rows], index) => (
            <div key={index} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2.5 bg-white border border-indigo-100 rounded-xl px-4 py-2.5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <h2 className="text-sm font-bold text-indigo-700">{group}</h2>
                </div>
                <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                  {rows.length} {rows.length === 1 ? "exam" : "exams"}
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {["#", "Subject", "Date", "Time", "Room"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((item, i) => (
                      <tr
                        key={i}
                        className="group hover:bg-indigo-50/40 transition-colors duration-150"
                      >
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            {i + 1}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {item.subject}
                        </td>
                        <td className="px-5 py-4">
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) =>
                              handleChange(i, "date", e.target.value)
                            }
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-4">
                          <input
                            type="time"
                            value={item.time}
                            onChange={(e) =>
                              handleChange(i, "time", e.target.value)
                            }
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-4">
                          <input
                            type="text"
                            value={item.room}
                            onChange={(e) =>
                              handleChange(i, "room", e.target.value)
                            }
                            placeholder="Room no."
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 hover:border-slate-300 transition-all shadow-sm w-28 placeholder:text-slate-300"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
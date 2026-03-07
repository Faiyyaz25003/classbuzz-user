

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

  // GROUP BY COURSE + SEMESTER
  const groupedTimetable = timetable.reduce((acc, item) => {
    const key = `${item.courseName} - Semester ${item.semester}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white text-slate-800 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Exam <span className="text-indigo-600">Timetable</span>
          </h1>
          <p className="text-slate-400 mt-2">Upcoming Exam Schedule</p>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <select
            className="border rounded-xl px-4 py-3"
            value={selectedCourse}
            onChange={(e) => handleCourseSelect(e.target.value)}
          >
            <option value="">All Courses</option>

            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-xl px-4 py-3"
            value={selectedSemester}
            onChange={(e) => handleSemesterSelect(e.target.value)}
            disabled={!selectedCourse}
          >
            <option value="">All Semester</option>

            {selectedCourse &&
              courses
                .find((c) => c._id === selectedCourse)
                ?.semesters?.map((s) => (
                  <option key={s.semester} value={s.semester}>
                    Semester {s.semester}
                  </option>
                ))}
          </select>
        </div>

        {loading && <p>Loading timetable...</p>}

        {/* MULTIPLE TABLES */}
        {!loading &&
          Object.entries(groupedTimetable).map(([group, rows], index) => (
            <div key={index} className="mb-12">
              {/* TABLE TITLE */}
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">
                {group}
              </h2>

              <div className="border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-5 py-3 text-left">#</th>
                      <th className="px-5 py-3 text-left">Subject</th>
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-left">Time</th>
                      <th className="px-5 py-3 text-left">Room</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-5 py-4">{i + 1}</td>

                        <td className="px-5 py-4 font-semibold">
                          {item.subject}
                        </td>

                        <td className="px-5 py-4">
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) =>
                              handleChange(i, "date", e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          />
                        </td>

                        <td className="px-5 py-4">
                          <input
                            type="time"
                            value={item.time}
                            onChange={(e) =>
                              handleChange(i, "time", e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          />
                        </td>

                        <td className="px-5 py-4">
                          <input
                            type="text"
                            value={item.room}
                            onChange={(e) =>
                              handleChange(i, "room", e.target.value)
                            }
                            className="border rounded px-2 py-1"
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
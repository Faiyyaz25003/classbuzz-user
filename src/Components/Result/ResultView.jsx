
import React from "react";
import { X } from "lucide-react";

export default function ResultView({ student, onClose }) {
  if (!student) return null;

  // Calculate totals
  const totalObtained = student.subjects.reduce(
    (sum, sub) => sum + Number(sub.marks || 0),
    0
  );
  const totalMax = student.subjects.reduce(
    (sum, sub) => sum + Number(sub.maxMarks || 0),
    0
  );
  const percentage = ((totalObtained / totalMax) * 100).toFixed(2);

  // Grade calculation function
  const calculateGrade = (marks, maxMarks) => {
    const percent = (marks / maxMarks) * 100;
    if (percent >= 90) return "A+";
    if (percent >= 80) return "A";
    if (percent >= 70) return "B+";
    if (percent >= 60) return "B";
    if (percent >= 50) return "C";
    if (percent >= 40) return "D";
    return "F";
  };

  // Result status
  const isSuccessful = student.subjects.every(
    (sub) => (sub.marks / sub.maxMarks) * 100 >= 40
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white mt-[200px] rounded-lg shadow-2xl max-w-5xl w-full my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Result Content */}
        <div className="bg-gradient-to-b from-blue-50 to-gray-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-b-4 border-red-800 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-16 h-16 flex items-center justify-center rounded">
                  <img
                    src="logo.png"
                    alt="University Logo"
                    className="object-contain w-[450px] h-[250px]"
                  />
                </div>
              </div>
              <div className="flex-1 text-center">
                <h1
                  className="text-3xl font-bold text-red-800 mb-1"
                  style={{ fontFamily: "serif" }}
                >
                  University of Mumbai
                </h1>
                <h2
                  className="text-2xl font-bold text-red-700"
                  style={{ fontFamily: "serif" }}
                >
                  GRADE CARD
                </h2>
              </div>
              <div className="w-16"></div>
            </div>
          </div>

          {/* Student Info */}
          <div className="bg-white border-2 border-gray-300 m-6">
            <div className="flex">
              <div className="flex-1 p-4 space-y-2">
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-semibold w-32">Name</span>
                  <span className="flex-1 uppercase">{student.name}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-semibold w-32">Class</span>
                  <span className="flex-1">{student.class}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-semibold w-32">Semester</span>
                  <span className="flex-1">
                    {student.semester || "Not Specified"}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Roll No</span>
                  <span className="flex-1">{student.rollNo}</span>
                </div>
              </div>
              <div className="w-32 border-l-2 border-gray-300 flex items-center justify-center p-2">
                <div className="w-24 h-32 border-2 border-gray-400 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                  Photo
                </div>
              </div>
            </div>
          </div>

          {/* Marks Table */}
          <div className="m-6 overflow-x-auto">
            <table className="w-full border-2 border-gray-400 bg-white text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 p-3 font-semibold text-left">
                    Subject Name
                  </th>
                  <th className="border border-gray-400 p-3 font-semibold text-center">
                    Marks Obtained
                  </th>
                  <th className="border border-gray-400 p-3 font-semibold text-center">
                    Maximum Marks
                  </th>
                  <th className="border border-gray-400 p-3 font-semibold text-center">
                    Grade
                  </th>
                  <th className="border border-gray-400 p-3 font-semibold text-center">
                    Percentage (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {student.subjects.map((subject, idx) => {
                  const subjectPercentage = (
                    (subject.marks / subject.maxMarks) *
                    100
                  ).toFixed(2);
                  const grade = calculateGrade(subject.marks, subject.maxMarks);

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-400 p-3">
                        {subject.name}
                      </td>
                      <td className="border border-gray-400 p-3 text-center font-semibold">
                        {subject.marks}
                      </td>
                      <td className="border border-gray-400 p-3 text-center">
                        {subject.maxMarks}
                      </td>
                      <td className="border border-gray-400 p-3 text-center font-semibold">
                        <span
                          className={`px-2 py-1 rounded ${
                            grade === "F"
                              ? "bg-red-100 text-red-800"
                              : grade.startsWith("A")
                              ? "bg-green-100 text-green-800"
                              : grade.startsWith("B")
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {grade}
                        </span>
                      </td>
                      <td className="border border-gray-400 p-3 text-center">
                        {subjectPercentage}%
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-gray-400 p-3 text-center">
                    TOTAL / AVERAGE
                  </td>
                  <td className="border border-gray-400 p-3 text-center">
                    {totalObtained}
                  </td>
                  <td className="border border-gray-400 p-3 text-center">
                    {totalMax}
                  </td>
                  <td className="border border-gray-400 p-3 text-center">–</td>
                  <td className="border border-gray-400 p-3 text-center">
                    {percentage}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Result Details */}
          <div className="bg-white border-2 border-gray-300 m-6 p-4 space-y-2">
            <div>
              <span className="font-semibold">Remark:</span>{" "}
              <span
                className={`font-bold ${
                  isSuccessful ? "text-green-600" : "text-red-600"
                }`}
              >
                {isSuccessful ? "SUCCESSFUL" : "UNSUCCESSFUL"}
              </span>
            </div>

            <div>
              <span className="font-semibold">Overall Percentage:</span>{" "}
              <span className="font-bold text-indigo-600">{percentage}%</span>
            </div>

            <div>
              <span className="font-semibold">Result Declared On:</span>{" "}
              {new Date()
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                .toUpperCase()}
            </div>
          </div>

          {/* Signature */}
          <div className="text-right p-6 pb-8">
            <div className="inline-block">
              <div
                className="text-sm italic mb-1"
                style={{ fontFamily: "cursive" }}
              >
                Signature
              </div>
              <div className="text-xs font-semibold">DIRECTOR</div>
              <div className="text-xs">
                BOARD OF EXAMINATIONS AND EVALUATION
              </div>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="bg-gray-100 p-4 rounded-b-lg border-t-2 border-gray-300">
          <button
            onClick={() => window.print()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Print Result
          </button>
        </div>
      </div>
    </div>
  );
}

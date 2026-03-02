
import React from "react";
import { X } from "lucide-react";

export default function ResultView({ student, onClose }) {
  if (!student) return null;

  /* ================= SAFE SUBJECT ARRAY ================= */
  const subjects = student.subjects || student.marks || [];

  /* ================= SAFE TOTAL CALC ================= */
  const totalObtained = subjects.reduce(
    (sum, sub) => sum + (sub.marks ?? sub.obtained ?? 0),
    0,
  );

  const totalMax = subjects.reduce(
    (sum, sub) => sum + (sub.maxMarks ?? 100),
    0,
  );

  const percentage =
    totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

  /* ================= GRADE LOGIC ================= */
  const calculateGrade = (marks, maxMarks) => {
    if (!maxMarks) return "-";
    const percent = (marks / maxMarks) * 100;

    if (percent >= 90) return "A+";
    if (percent >= 80) return "A";
    if (percent >= 70) return "B+";
    if (percent >= 60) return "B";
    if (percent >= 50) return "C";
    if (percent >= 40) return "D";
    return "F";
  };

  /* ================= RESULT STATUS ================= */
  const isSuccessful =
    subjects.length > 0 &&
    subjects.every((sub) => {
      const obtained = sub.marks ?? sub.obtained ?? 0;
      const max = sub.maxMarks ?? 100;
      return max > 0 && (obtained / max) * 100 >= 40;
    });

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

        <div className="bg-gradient-to-b from-blue-50 to-gray-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-b-4 border-red-800 p-6 text-center">
            <img
              src="logo.png"
              alt="University Logo"
              className="mx-auto object-contain w-32 mb-3"
            />
            <h1 className="text-3xl font-bold text-red-800 font-serif">
              University of Mumbai
            </h1>
            <h2 className="text-2xl font-bold text-red-700 font-serif">
              GRADE CARD
            </h2>
          </div>

          {/* Student Info */}
          <div className="bg-white border-2 border-gray-300 m-6 p-4 space-y-2">
            <div>
              <strong>Name:</strong> {student.name || "-"}
            </div>
            <div>
              <strong>Class:</strong> {student.class || "-"}
            </div>
            <div>
              <strong>Semester:</strong> {student.semester || "-"}
            </div>
            <div>
              <strong>Roll No:</strong> {student.rollNo || "-"}
            </div>
          </div>

          {/* Marks Table */}
          <div className="m-6 overflow-x-auto">
            <table className="w-full border-2 border-gray-400 bg-white text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3 text-left">Subject</th>
                  <th className="border p-3 text-center">Marks</th>
                  <th className="border p-3 text-center">Max</th>
                  <th className="border p-3 text-center">Grade</th>
                  <th className="border p-3 text-center">%</th>
                </tr>
              </thead>

              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((sub, idx) => {
                    const obtained = sub.marks ?? sub.obtained ?? 0;
                    const max = sub.maxMarks ?? 100;
                    const subjectPercentage =
                      max > 0 ? ((obtained / max) * 100).toFixed(2) : "0.00";

                    return (
                      <tr key={idx}>
                        <td className="border p-3">
                          {sub.name || sub.subject || "-"}
                        </td>
                        <td className="border p-3 text-center">{obtained}</td>
                        <td className="border p-3 text-center">{max}</td>
                        <td className="border p-3 text-center font-semibold">
                          {calculateGrade(obtained, max)}
                        </td>
                        <td className="border p-3 text-center">
                          {subjectPercentage}%
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No Subjects Found
                    </td>
                  </tr>
                )}

                <tr className="bg-gray-200 font-bold">
                  <td className="border p-3 text-center">TOTAL</td>
                  <td className="border p-3 text-center">{totalObtained}</td>
                  <td className="border p-3 text-center">{totalMax}</td>
                  <td className="border p-3 text-center">–</td>
                  <td className="border p-3 text-center">{percentage}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Result Section */}
          <div className="bg-white border-2 border-gray-300 m-6 p-4 space-y-2">
            <div>
              <strong>Result:</strong>{" "}
              <span
                className={`font-bold ${
                  isSuccessful ? "text-green-600" : "text-red-600"
                }`}
              >
                {isSuccessful ? "PASS" : "FAIL"}
              </span>
            </div>

            <div>
              <strong>Overall Percentage:</strong>{" "}
              <span className="font-bold text-indigo-600">{percentage}%</span>
            </div>

            <div>
              <strong>Declared On:</strong> {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Print */}
          <div className="bg-gray-100 p-4 border-t-2 border-gray-300">
            <button
              onClick={() => window.print()}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Print Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
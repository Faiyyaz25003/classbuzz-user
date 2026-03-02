
"use client";
import React from "react";
import { Download } from "lucide-react";

export default function ResultPDF({ student }) {
  if (!student) return null;

  /* ================= SAFE SUBJECT ARRAY ================= */
  const subjects = student.subjects || student.marks || [];

  /* ================= SAFE PERCENTAGE ================= */
  const calculatePercentage = () => {
    if (!subjects.length) return 0;

    const totalObtained = subjects.reduce(
      (acc, sub) => acc + (sub.marks ?? sub.obtained ?? 0),
      0,
    );

    const totalMax = subjects.reduce(
      (acc, sub) => acc + (sub.maxMarks ?? 0),
      0,
    );

    if (totalMax === 0) return 0;

    return ((totalObtained / totalMax) * 100).toFixed(2);
  };

  const percentage = student.percentage ?? calculatePercentage();

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

  /* ================= GENERATE PDF ================= */
  const generatePDF = () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            @page { size: A4; margin: 20px; }
            body { font-family: Arial; background: #f9fafb; }
            .header {
              text-align: center;
              border-bottom: 4px solid #8b0000;
              padding: 15px;
            }
            .uni-title {
              font-size: 26px;
              font-weight: bold;
              color: #8b0000;
            }
            table {
              width: 95%;
              margin: 20px auto;
              border-collapse: collapse;
              font-size: 13px;
            }
            th, td {
              border: 1px solid #444;
              padding: 7px;
              text-align: center;
            }
            th { background: #e4e4e4; }
            .total-row { font-weight: bold; background:#e4e4e4; }
          </style>
        </head>

        <body>

          <div class="header">
            <div class="uni-title">University Result Card</div>
          </div>

          <div style="padding:15px;">
            <p><b>Name:</b> ${student.name || "-"}</p>
            <p><b>Class:</b> ${student.class || "-"}</p>
            <p><b>Semester:</b> ${student.semester || "-"}</p>
            <p><b>Roll No:</b> ${student.rollNo || "-"}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Max</th>
                <th>Grade</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              ${
                subjects.length
                  ? subjects
                      .map((sub) => {
                        const obtained = sub.marks ?? sub.obtained ?? 0;
                        const max = sub.maxMarks ?? 100;
                        const perc =
                          max > 0 ? ((obtained / max) * 100).toFixed(2) : 0;

                        return `
                          <tr>
                            <td>${sub.name || sub.subject || "-"}</td>
                            <td>${obtained}</td>
                            <td>${max}</td>
                            <td>${calculateGrade(obtained, max)}</td>
                            <td>${perc}%</td>
                          </tr>
                        `;
                      })
                      .join("")
                  : `<tr><td colspan="5">No Subjects Found</td></tr>`
              }

              <tr class="total-row">
                <td>TOTAL</td>
                <td>
                  ${subjects.reduce(
                    (a, b) => a + (b.marks ?? b.obtained ?? 0),
                    0,
                  )}
                </td>
                <td>
                  ${subjects.reduce((a, b) => a + (b.maxMarks ?? 100), 0)}
                </td>
                <td>-</td>
                <td>${percentage}%</td>
              </tr>
            </tbody>
          </table>

          <div style="padding:15px;">
            <b>Result:</b> ${
              percentage >= 40
                ? "<span style='color:green;'>PASS</span>"
                : "<span style='color:red;'>FAIL</span>"
            }
            <br/><br/>
            <b>Declared On:</b> ${new Date().toLocaleDateString()}
          </div>

        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <button
      onClick={generatePDF}
      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 text-xs font-semibold"
    >
      <Download className="w-3 h-3" />
      PDF
    </button>
  );
}
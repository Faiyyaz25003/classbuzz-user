
import React from "react";
import { Download } from "lucide-react";

export default function ResultPDF({ student }) {
  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

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

  const generatePDF = () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            @page { size: A4; margin: 20px; }
            body { font-family: Arial, sans-serif; background: #f9fafb; }

            .header {
              background: linear-gradient(to right, #e0ecff, #f4f7ff);
              border-bottom: 4px solid #8b0000;
              padding: 15px;
              text-align: center;
            }

            .uni-title {
              font-size: 28px;
              font-weight: bold;
              color: #8b0000;
              margin: 0;
              font-family: serif;
            }

            .grade-card {
              font-size: 22px;
              font-weight: bold;
              color: #a51616;
              font-family: serif;
            }

            .info-box {
              border: 2px solid #cfcfcf;
              background: #fff;
              margin: 15px;
              padding: 10px 15px;
            }

            .row {
              display: flex;
              border-bottom: 1px solid #ddd;
              padding: 6px 0;
            }

            .label { width: 120px; font-weight: bold; }
            .value { text-transform: uppercase; }

            .photo-box {
              width: 100px;
              height: 130px;
              border: 2px solid #888;
              background: #efefef;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              color: #666;
            }

            .photo-container {
              position: absolute;
              right: 25px;
              top: 158px;
            }

            table {
              width: 95%;
              margin: 15px auto;
              border-collapse: collapse;
              font-size: 13px;
            }

            th, td {
              border: 1px solid #444;
              padding: 7px;
              text-align: center;
            }

            th { background: #e4e4e4; }
            .total-row { background: #e4e4e4; font-weight: bold; }

            .result-box {
              border: 2px solid #cfcfcf;
              margin: 15px;
              padding: 10px 15px;
              background: #fff;
              font-size: 14px;
            }

            .signature {
              text-align: right;
              margin: 15px 25px;
              margin-top: 40px;
            }

            .sign-label { font-family: cursive; font-size: 14px; }
            .footer { font-size: 11px; color: gray; text-align: center; margin-top: 10px; }
          </style>
        </head>

        <body>

          <div class="header">
            <img src="logo.png" style="width:150px;height:90px;object-fit:contain;">
            <div class="uni-title">University of Mumbai</div>
            <div class="grade-card">GRADE CARD</div>
          </div>

          <div class="info-box">
            <div class="row">
              <div class="label">Name</div><div class="value">${
                student.name
              }</div>
            </div>
            <div class="row">
              <div class="label">Class</div><div>${student.class}</div>
            </div>
            <div class="row">
              <div class="label">Semester</div><div>${
                student.semester || "Not Specified"
              }</div>
            </div>
            <div class="row" style="border:none;">
              <div class="label">Roll No</div><div>${student.rollNo}</div>
            </div>
          </div>

          <div class="photo-container">
            <div class="photo-box">Photo</div>
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
              ${student.subjects
                .map((sub) => {
                  const perc = ((sub.marks / sub.maxMarks) * 100).toFixed(2);
                  return `
                  <tr>
                    <td>${sub.name}</td>
                    <td>${sub.marks}</td>
                    <td>${sub.maxMarks}</td>
                    <td>${calculateGrade(sub.marks, sub.maxMarks)}</td>
                    <td>${perc}%</td>
                  </tr>
                `;
                })
                .join("")}
              <tr class="total-row">
                <td>TOTAL</td>
                <td>${student.subjects.reduce((a, b) => a + b.marks, 0)}</td>
                <td>${student.subjects.reduce((a, b) => a + b.maxMarks, 0)}</td>
                <td>-</td>
                <td>${student.percentage}%</td>
              </tr>
            </tbody>
          </table>

          <div class="result-box">
            <b>Remark:</b> ${
              student.percentage >= 40
                ? "<span style='color:green;font-weight:bold;'>SUCCESSFUL</span>"
                : "<span style='color:red;font-weight:bold;'>UNSUCCESSFUL</span>"
            }
            <br/><br/>
            <b>Overall Percentage:</b> ${student.percentage}%
            <br/><br/>
            <b>Result Declared On:</b> ${new Date().toLocaleDateString()}
          </div>

          <div class="signature">
            <div class="sign-label">Signature</div>
            <div style="font-size:11px;font-weight:bold;">DIRECTOR</div>
            <div style="font-size:11px;">BOARD OF EXAMINATIONS AND EVALUATION</div>
          </div>

          <div class="footer">Computer generated result does not require a signature.</div>

        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
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

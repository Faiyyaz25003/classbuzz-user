"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StatCard = ({ icon, label, value, color }) => (
  <div
    className={`bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 border-l-4 ${color}`}
  >
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  </div>
);

export default function MyFees() {
  const [fees, setFees] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyFees = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("You are not logged in. Please login first.");
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // ✅ _id ya id dono try karo
        const userId = parsedUser._id || parsedUser.id;

        if (!userId) {
          setError("User ID not found. Please logout and login again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/fees/user/${userId}`,
        );
        setFees(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your fee records.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyFees();
  }, []);

  const downloadReceipt = (fee) => {
    const doc = new jsPDF();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("ABC SCHOOL", 105, 18, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Fee Payment Receipt", 105, 30, { align: "center" });

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);

    const infoY = 55;
    doc.setFont("helvetica", "bold");
    doc.text("Receipt Details", 20, infoY);
    doc.setDrawColor(37, 99, 235);
    doc.line(20, infoY + 2, 100, infoY + 2);

    doc.setFont("helvetica", "normal");
    const fields = [
      ["Receipt ID:", fee._id],
      ["Date:", new Date(fee.feeDate).toLocaleDateString()],
      ["Student Name:", user?.name || ""],
      ["Installment:", `Installment ${fee.installment}`],
      ["Payment Method:", fee.paymentMethod],
    ];
    if (fee.paymentName) fields.push(["Transaction ID:", fee.paymentName]);

    fields.forEach(([label, value], i) => {
      doc.text(label, 20, infoY + 12 + i * 8);
      doc.text(String(value), 70, infoY + 12 + i * 8);
    });

    autoTable(doc, {
      startY: infoY + 12 + fields.length * 8 + 6,
      head: [["Description", "Amount"]],
      body: [["Tuition Fee", `Rs.${fee.amount}`]],
      headStyles: { fillColor: [37, 99, 235] },
    });

    const finalY = doc.lastAutoTable.finalY;
    doc.setFillColor(240, 245, 255);
    doc.rect(14, finalY + 8, 182, 14, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(37, 99, 235);
    doc.text(`Total Paid: Rs.${fee.amount}`, 20, finalY + 18);

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Authorized Signature", 140, finalY + 40);
    doc.line(135, finalY + 42, 195, finalY + 42);

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Thank you for your payment!", 105, 285, { align: "center" });

    doc.save(`Receipt_${user?.name}_Installment${fee.installment}.pdf`);
  };

  const filteredFees =
    selectedInstallment === "All"
      ? fees
      : fees.filter((f) => f.installment === Number(selectedInstallment));

  const totalPaid = fees.reduce((acc, f) => acc + Number(f.amount), 0);
  const installmentCount = (n) =>
    fees.filter((f) => f.installment === n).length;
  const installmentsPaid = [1, 2, 3].filter((n) =>
    fees.some((f) => f.installment === n),
  ).length;

  // ---- Loading ----
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📚</div>
          <p className="text-gray-500 text-lg font-medium">
            Loading your fee records...
          </p>
        </div>
      </div>
    );
  }

  // ---- Error ----
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[70px] ml-[300px] bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-8 font-sans">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            🎓 My Fee Records
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Welcome,{" "}
            <span className="font-semibold text-blue-600">{user?.name}</span> —
            your complete fee history
          </p>
        </div>
        <div className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow">
          ABC School
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon="📋"
          label="Total Transactions"
          value={fees.length}
          color="border-blue-500"
        />
        <StatCard
          icon="✅"
          label="Installments Paid"
          value={`${installmentsPaid} / 3`}
          color="border-green-500"
        />
        <StatCard
          icon="💰"
          label="Total Amount Paid"
          value={`Rs.${totalPaid.toLocaleString()}`}
          color="border-indigo-500"
        />
      </div>

      {/* Installment Status */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
        <h3 className="text-base font-bold text-gray-700 mb-4">
          📊 Installment Status
        </h3>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3].map((num) => {
            const paid = fees.some((f) => f.installment === num);
            return (
              <div
                key={num}
                className={`flex-1 min-w-[120px] rounded-xl p-4 text-center border-2 ${
                  paid
                    ? "bg-green-50 border-green-400 text-green-700"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                }`}
              >
                <div className="text-2xl mb-1">{paid ? "✅" : "⏳"}</div>
                <p className="font-semibold text-sm">Installment {num}</p>
                <p className="text-xs mt-1">{paid ? "Paid" : "Pending"}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {["All", 1, 2, 3].map((item) => (
          <button
            key={item}
            onClick={() => setSelectedInstallment(item)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${
              selectedInstallment === item
                ? "bg-blue-600 text-white shadow-blue-200 shadow-md scale-105"
                : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            {item === "All"
              ? "🗂 All Records"
              : `📋 Installment ${item} (${installmentCount(item)})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-700">
            🧾 Payment History
          </h2>
          <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
            {filteredFees.length} records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Installment</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Method</th>
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">📭</div>
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr
                    key={fee._id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Installment {fee.installment}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      Rs.{Number(fee.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          fee.paymentMethod === "Cash"
                            ? "bg-yellow-100 text-yellow-700"
                            : fee.paymentMethod === "UPI"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {fee.paymentMethod === "Cash"
                          ? "💵"
                          : fee.paymentMethod === "UPI"
                            ? "📱"
                            : "🏦"}{" "}
                        {fee.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {fee.paymentName || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(fee.feeDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => downloadReceipt(fee)}
                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-150 shadow-sm"
                      >
                        📄 Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-8">
        © {new Date().getFullYear()} ABC School Fee Management System
      </p>
    </div>
  );
}

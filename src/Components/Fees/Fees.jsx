"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FileText,
  IndianRupee,
  Calendar,
  User,
  Hash,
  Download,
  Loader2,
  Mail,
  Phone,
  Search,
  Filter,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Eye,
  X,
} from "lucide-react";

export default function FeesReceipts() {
  const [fees, setFees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [selectedFee, setSelectedFee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🧭 Fetch Fees and Users Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/fees"),
          axios.get("http://localhost:5000/api/users"),
        ]);

        const usersData = usersRes.data;
        const feesData = feesRes.data;

        // Create a map of users by ID for quick lookup
        const usersMap = {};
        usersData.forEach((user) => {
          usersMap[user._id] = user;
        });

        // Merge user data with fees data
        const mergedFees = feesData.map((fee) => {
          const user = usersMap[fee.userId] || {};
          return {
            ...fee,
            studentName: user.name || "N/A",
            email: user.email || "N/A",
            phone: user.phone || "N/A",
            course: user.Department || "N/A",
          };
        });

        setFees(mergedFees);
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate statistics
  const stats = {
    total: fees.length,
    totalAmount: fees.reduce((sum, fee) => sum + fee.amount, 0),
    avgAmount:
      fees.length > 0
        ? (
            fees.reduce((sum, fee) => sum + fee.amount, 0) / fees.length
          ).toFixed(2)
        : 0,
  };

  // Filter and search
  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      (fee.studentName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (fee.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (fee.course?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterMode === "all" || fee.paymentMode === filterMode;
    return matchesSearch && matchesFilter;
  });

  // 🧾 Generate PDF Receipt
  const generatePDF = (fee) => {
    const doc = new jsPDF();

    // Header with gradient effect
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("FEES RECEIPT", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("🎓 College Management System", 105, 30, { align: "center" });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Receipt details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Receipt ID: ${fee._id}`, 14, 50);
    doc.text(`Date: ${new Date(fee.date).toLocaleDateString()}`, 150, 50);

    // Student Info Box
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.rect(14, 60, 182, 50);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Student Information", 20, 70);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${fee.studentName}`, 20, 80);
    doc.text(`Email: ${fee.email}`, 20, 88);
    doc.text(`Phone: ${fee.phone}`, 20, 96);
    doc.text(`Course: ${fee.course}`, 20, 104);

    // Payment Details Box
    doc.rect(14, 120, 182, 40);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Payment Details", 20, 130);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Payment Mode: ${fee.paymentMode}`, 20, 140);
    doc.text(`Amount Paid: ₹${fee.amount}`, 20, 148);

    // Total Amount (highlighted)
    doc.setFillColor(240, 253, 244);
    doc.rect(14, 170, 182, 20, "F");
    doc.setFontSize(14);
    doc.setTextColor(22, 163, 74);
    doc.text(`Total Amount: ₹${fee.amount}`, 105, 182, { align: "center" });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "✅ This is a computer-generated receipt. Thank you for your payment!",
      105,
      200,
      { align: "center" }
    );
    doc.text(
      "For queries, contact: admin@college.edu | +91-9876543210",
      105,
      206,
      { align: "center" }
    );

    doc.save(`Receipt_${fee.studentName}_${fee._id}.pdf`);
  };

  // View Details Modal
  const viewDetails = (fee) => {
    setSelectedFee(fee);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen ml-[300px] mt-[50px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
            <FileText className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Fees Receipts</h1>
            <p className="text-gray-600">
              Manage and download payment receipts
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Receipts
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-xl">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Amount</p>
              <p className="text-3xl font-bold text-gray-800 mt-2 flex items-center gap-1">
                <IndianRupee className="w-6 h-6" />
                {stats.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-xl">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Average Amount
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2 flex items-center gap-1">
                <IndianRupee className="w-6 h-6" />
                {stats.avgAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-xl">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500 w-5 h-5" />
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
              <option value="all">All Payments</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="Cheque">Cheque</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-lg">
          <div className="text-center">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12 mx-auto mb-4" />
            <p className="text-gray-600">Loading receipts...</p>
          </div>
        </div>
      ) : filteredFees.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No fee records found</p>
          <p className="text-gray-400 mt-2">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="py-4 px-6 text-left font-semibold">#</th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Student Details
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">Course</th>
                  <th className="py-4 px-6 text-left font-semibold">Amount</th>
                  <th className="py-4 px-6 text-left font-semibold">Payment</th>
                  <th className="py-4 px-6 text-left font-semibold">Date</th>
                  <th className="py-4 px-6 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFees.map((fee, index) => (
                  <tr
                    key={fee._id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full text-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {fee.studentName}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" /> {fee.email}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {fee.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {fee.course}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                        <IndianRupee className="w-5 h-5" />
                        {fee.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{fee.paymentMode}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(fee.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => viewDetails(fee)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button
                          onClick={() => generatePDF(fee)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                        >
                          <Download className="w-4 h-4" /> PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal - FIXED */}
      {showModal && selectedFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Receipt Details
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Complete payment information
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Receipt ID</p>
                <p className="font-mono text-gray-800 font-semibold">
                  {selectedFee._id}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Student Name
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedFee.studentName}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedFee.email}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedFee.phone}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Course
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedFee.Department}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payment Mode
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedFee.paymentMode}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Date
                  </p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedFee.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-2">Amount Paid</p>
                <p className="text-4xl font-bold text-green-600 flex items-center gap-2">
                  <IndianRupee className="w-8 h-8" />
                  {selectedFee.amount.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    generatePDF(selectedFee);
                    setShowModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

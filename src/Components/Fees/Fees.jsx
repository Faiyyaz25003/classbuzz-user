
"use client";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct plugin import
import {
  Receipt,
  Calendar,
  IndianRupee,
  FileText,
  Loader2,
  Mail,
  Phone,
  Download,
  CheckCircle,
  Building2,
  User,
  Hash,
} from "lucide-react";

export default function Fees() {
  const [user, setUser] = useState(null);
  const [fees, setFees] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUserFees = async () => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      console.error("No user ID found in localStorage!");
      setLoading(false);
      return;
    }

    const userFromStorage = {
      name:
        typeof window !== "undefined"
          ? sessionStorage.getItem("name") || "User"
          : "User",
      role:
        typeof window !== "undefined"
          ? sessionStorage.getItem("role") || "student"
          : "student",
      id: userId,
    };
    setUser(userFromStorage);

    try {
      // Fetch fee records
      const feesRes = await fetch(
        `http://localhost:5000/api/fees/user/${userId}`
      );
      const feesData = await feesRes.json();
      setFees(feesData || []);

      // Fetch user info
      const usersRes = await fetch("http://localhost:5000/api/users");
      const usersData = await usersRes.json();
      const currentUser = usersData.find((u) => u._id === userId);
      setUserInfo(currentUser || {});
    } catch (err) {
      console.error("Error fetching data:", err);
      setFees([]);
      setUserInfo({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFees();
  }, []);

  const totalPaid = fees.reduce((sum, f) => sum + (f.amount || 0), 0);

  // 🧾 Generate and download PDF
  const handleDownload = (receipt, index) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Official Fee Receipt", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(
      `Receipt No: RCP-${new Date(receipt.createdAt).getFullYear()}-${String(
        index + 1
      ).padStart(3, "0")}`,
      20,
      40
    );
    doc.text(
      `Date: ${new Date(receipt.createdAt).toLocaleDateString("en-IN")}`,
      150,
      40
    );

    // Student Info
    doc.text("Student Information", 20, 55);
    autoTable(doc, {
      startY: 60,
      theme: "striped",
      styles: { fontSize: 11 },
      head: [["Field", "Details"]],
      body: [
        ["Name", user?.name || "—"],
        ["User ID", user?.id || "—"],
        ["Department", userInfo.departments?.join(", ") || "—"],
        ["Email", userInfo.email || "—"],
        ["Phone", userInfo.phone || "—"],
        ["Position", userInfo.positions?.join(", ") || "—"],
      ],
    });

    // Fee Details
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text("Payment Details", 20, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      theme: "striped",
      styles: { fontSize: 11 },
      head: [["Particular", "Details"]],
      body: [
        ["Amount Paid", `₹${receipt.amount?.toLocaleString("en-IN")}`],
        ["Installment", receipt.installment || "—"],
        ["Transaction ID", receipt._id || "—"],
        [
          "Payment Date",
          new Date(receipt.createdAt).toLocaleDateString("en-IN"),
        ],
      ],
    });

    // Footer
    const footerY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.text(
      "This is an official computer-generated receipt. Please keep it for your records.",
      20,
      footerY
    );
    doc.text("Authorized Signature:", 150, footerY + 10);
    doc.line(150, footerY + 15, 190, footerY + 15);

    // Save PDF
    doc.save(
      `Receipt_${user?.name || "Student"}_${
        receipt.installment || "Payment"
      }.pdf`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700 font-medium">
            Loading receipts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-[320px] mt-[50px] bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Fee Receipts</h1>
                <p className="text-blue-100 mt-1">Official Payment Records</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Academic Year</p>
              <p className="text-xl font-bold">2024-25</p>
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-white shadow-lg p-6 border-x border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Student Name
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {user?.name || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    User ID
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {user?.id || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Department
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {userInfo.departments?.join(", ") || "—"}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Email
                  </p>
                  <p className="text-base text-gray-700">
                    {userInfo.email || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Phone
                  </p>
                  <p className="text-base text-gray-700">
                    {userInfo.phone || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Position
                  </p>
                  <p className="text-base text-gray-700">
                    {userInfo.positions?.join(", ") || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg p-6 border-x border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-xl shadow-md">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium uppercase">
                  Total Amount Paid
                </p>
                <p className="text-3xl font-bold text-green-700">
                  ₹{totalPaid.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-medium">
                Total Receipts
              </p>
              <p className="text-2xl font-bold text-gray-800">{fees.length}</p>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Payment History
          </h2>

          {fees.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Receipts Available
              </h3>
              <p className="text-gray-500">
                Your payment receipts will appear here once payments are made.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fees.map((f, i) => (
                <div
                  key={i}
                  className="border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Receipt className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Receipt No.
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            RCP-{new Date(f.createdAt).getFullYear()}-
                            {String(i + 1).padStart(3, "0")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(f, i)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <IndianRupee className="w-5 h-5 text-green-600" />
                          <p className="text-xs text-gray-600 font-bold uppercase">
                            Amount Paid
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-green-700">
                          ₹{f.amount?.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <p className="text-xs text-gray-600 font-bold uppercase">
                            Installment
                          </p>
                        </div>
                        <p className="text-lg font-bold text-blue-700">
                          {f.installment}
                        </p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <p className="text-xs text-gray-600 font-bold uppercase">
                            Payment Date
                          </p>
                        </div>
                        <p className="text-base font-bold text-purple-700">
                          {new Date(f.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {f._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                          Transaction ID
                        </p>
                        <p className="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded inline-block">
                          {f._id}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">
                          Payment Verified
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Authorized Signature
                        </p>
                        <div className="border-t-2 border-gray-400 w-32 mt-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 text-center">
            <strong>Note:</strong> This is an official computer-generated
            receipt. Please keep this for your records. For any queries, contact
            the accounts department.
          </p>
        </div>
      </div>
    </div>
  );
}

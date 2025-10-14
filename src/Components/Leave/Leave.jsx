
"use client";
import { useState, useEffect } from "react";
import { Calendar, FileText, User, X } from "lucide-react";

export default function Leave() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "", // added email field
    fromDate: "2025-10-08",
    toDate: "2025-10-08",
    leaveType: "",
    approver: "",
    attachment: null,
    reason: "",
  });

  const leaveTypes = [
    "Sick Leave",
    "Casual Leave",
    "Earned Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Emergency Leave",
  ];

  const [approvers, setApprovers] = useState([]);

  // Fetch approvers
  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users");
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch users");
        setApprovers(data.map((user) => `${user.name} (${user.positions})`));
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    };
    fetchApprovers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, attachment: file }));
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, attachment: null }));
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  const handleCancel = () => {
    setFormData({
      userName: "",
      email: "",
      fromDate: "2025-10-08",
      toDate: "2025-10-08",
      leaveType: "",
      approver: "",
      attachment: null,
      reason: "",
    });
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    handleCancel();
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.userName ||
      !formData.email ||
      !formData.leaveType ||
      !formData.approver ||
      !formData.reason.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (formData.reason.length < 24) {
      alert("Reason must be at least 24 characters long");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("userName", formData.userName);
    formPayload.append("email", formData.email); // include email
    formPayload.append("fromDate", formData.fromDate);
    formPayload.append("toDate", formData.toDate);
    formPayload.append("leaveType", formData.leaveType);
    formPayload.append("approver", formData.approver);
    formPayload.append("reason", formData.reason);
    if (formData.attachment) {
      formPayload.append("attachment", formData.attachment);
    }

    try {
      const response = await fetch("http://localhost:5000/api/leave", {
        method: "POST",
        body: formPayload,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");

      alert("Leave application submitted successfully!");
      handleCloseForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed: " + error.message);
    }
  };

  const characterCount = formData.reason.length;
  const minCharacters = 24;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Landing Page */}
      {!isFormOpen && (
        <div className="w-full flex justify-center pt-25 ml-[-250px] absolute top-6 left-0">
          <button
            onClick={() => setIsFormOpen(true)}
            className="group relative px-12 py-5 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Apply for Leave
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      )}

      {/* Leave Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">
                    Leave Application Form
                  </h1>
                </div>
                <button
                  onClick={handleCloseForm}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Your Name */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["fromDate", "toDate"].map((field, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="block text-gray-700 font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {field === "fromDate" ? "From Date" : "To Date"}
                    </label>
                    <input
                      type="date"
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Leave Type & Approver */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Select Approver <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="approver"
                    value={formData.approver}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  >
                    <option value="">Select Approver</option>
                    {approvers.map((approver, index) => (
                      <option key={index} value={approver}>
                        {approver}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Attachment */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Attachment (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="file"
                      name="attachment"
                      id="fileInput"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="fileInput"
                      className="flex items-center justify-between w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <span className="text-blue-600 font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Choose File
                      </span>
                      <span className="text-gray-500 text-sm truncate max-w-xs">
                        {formData.attachment
                          ? formData.attachment.name
                          : "No file chosen"}
                      </span>
                    </label>
                  </div>
                  {formData.attachment && (
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all border-2 border-red-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Reason For Leave <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Please provide a detailed reason for your leave request..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    Minimum 24 characters required
                  </span>
                  <span
                    className={`font-semibold ${
                      characterCount < minCharacters
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {characterCount} / {minCharacters}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all shadow-md"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

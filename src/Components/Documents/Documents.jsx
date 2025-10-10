import { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";

export default function Documents() {
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    pan: null,
  });

  const [uploaded, setUploaded] = useState({
    aadhaarFront: false,
    aadhaarBack: false,
    pan: false,
  });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
      setUploaded((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleUpload = (type) => {
    if (files[type]) {
      setUploaded((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        alert(`${files[type].name} uploaded successfully!`);
      }, 300);
    } else {
      alert("Please select a file first");
    }
  };

  const DocumentUploadCard = ({ title, type, icon }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-4 sm:p-6 mb-4">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] rounded-xl flex items-center justify-center mr-3 shadow-lg">
          {icon}
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex-1">
          {title}
        </h3>
        {uploaded[type] && (
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="file"
            id={type}
            accept="image/*,.pdf"
            onChange={(e) => handleFileChange(e, type)}
            className="hidden"
          />
          <label
            htmlFor={type}
            className="flex items-center justify-between w-full px-3 sm:px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
          >
            <span
              className={`text-xs sm:text-sm truncate pr-2 ${
                files[type] ? "text-gray-800 font-medium" : "text-gray-500"
              }`}
            >
              {files[type] ? files[type].name : "No file chosen"}
            </span>
            <span className="text-blue-600 text-xs sm:text-sm font-medium whitespace-nowrap">
              Browse
            </span>
          </label>
        </div>

        <button
          onClick={() => handleUpload(type)}
          disabled={!files[type]}
          className={`px-4 sm:px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm sm:text-base whitespace-nowrap ${
            files[type] && !uploaded[type]
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
              : uploaded[type]
              ? "bg-green-500 text-white cursor-default shadow-md"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {uploaded[type] ? (
            <>
              <CheckCircle size={18} />
              <span className="hidden sm:inline">Uploaded</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span className="hidden sm:inline">Upload</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] rounded-2xl sm:rounded-3xl mb-4 shadow-lg">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] bg-clip-text text-transparent mb-2">
              Upload KYC Documents
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Please upload clear images of your identity documents
            </p>
          </div>

          {/* Upload Cards */}
          <div className="space-y-4">
            <DocumentUploadCard
              title="Aadhaar Card - Front Side"
              type="aadhaarFront"
              icon={
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              }
            />

            <DocumentUploadCard
              title="Aadhaar Card - Back Side"
              type="aadhaarBack"
              icon={
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              }
            />

            <DocumentUploadCard
              title="PAN Card"
              type="pan"
              icon={
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              }
            />
          </div>

          {/* Info Note */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs sm:text-sm font-bold">
                  i
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">Important:</strong> Ensure
                  all documents are clear and readable. Accepted formats:{" "}
                  <span className="font-semibold">JPG, PNG, PDF</span> (Max
                  size: 5MB per file)
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={
              !uploaded.aadhaarFront || !uploaded.aadhaarBack || !uploaded.pan
            }
            className={`w-full mt-6 sm:mt-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 ${
              uploaded.aadhaarFront && uploaded.aadhaarBack && uploaded.pan
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {uploaded.aadhaarFront && uploaded.aadhaarBack && uploaded.pan
              ? "Submit All Documents"
              : "Upload All Documents to Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

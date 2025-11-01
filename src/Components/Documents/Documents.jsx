

import { useState } from "react";
import {
  Upload,
  FileText,
  Image,
  CreditCard,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Documents() {
  const [files, setFiles] = useState({});
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!name) return alert("Please enter your name");

    setUploading(true);
    const formData = new FormData();
    formData.append("name", name);
    Object.keys(files).forEach((key) => formData.append(key, files[key]));

    try {
      const res = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
      setFiles({});
      setName("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen ml-[350px] mt-[50px] bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] p-8 text-center">
            <h2 className="flex items-center gap-2 text-3xl font-bold text-white mb-4">
              <Upload className="text-white" size={32} />
              Upload Documents
            </h2>

            <p className="text-violet-100 float-left">
              Submit your school documents securely
            </p>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <User size={18} className="text-violet-600" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-violet-400 transition-colors">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="bg-emerald-100 rounded-lg p-3">
                    <CreditCard className="text-emerald-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">Aadhaar Card</p>
                    <p className="text-sm text-gray-500">
                      {files.aadhaar
                        ? files.aadhaar.name
                        : "Choose file to upload"}
                    </p>
                  </div>
                  {files.aadhaar && (
                    <CheckCircle className="text-emerald-500" size={20} />
                  )}
                  <input
                    type="file"
                    name="aadhaar"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-violet-400 transition-colors">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="bg-amber-100 rounded-lg p-3">
                    <FileText className="text-amber-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">Marksheet</p>
                    <p className="text-sm text-gray-500">
                      {files.marksheet
                        ? files.marksheet.name
                        : "Choose file to upload"}
                    </p>
                  </div>
                  {files.marksheet && (
                    <CheckCircle className="text-emerald-500" size={20} />
                  )}
                  <input
                    type="file"
                    name="marksheet"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-violet-400 transition-colors">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <Image className="text-purple-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">Photo</p>
                    <p className="text-sm text-gray-500">
                      {files.photo ? files.photo.name : "Choose file to upload"}
                    </p>
                  </div>
                  {files.photo && (
                    <CheckCircle className="text-emerald-500" size={20} />
                  )}
                  <input
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                  />
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Accepted formats:</p>
                <p>PDF, JPG, JPEG, PNG (Max 5MB per file)</p>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-gradient-to-r from-[#0f4c5c] to-[#1e88a8] text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Documents
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>Your documents are encrypted and stored securely</p>
        </div>
      </div>
    </div>
  );
}
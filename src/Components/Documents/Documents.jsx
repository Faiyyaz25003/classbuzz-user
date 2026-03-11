
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function DocumentUpload() {
  const [documents, setDocuments] = useState([
    { name: "Aadhar Card", file: null },
    { name: "Marksheet", file: null },
    { name: "Photo", file: null },
  ]);

  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  const handleNameChange = (index, value) => {
    const updatedDocs = [...documents];
    updatedDocs[index].name = value;
    setDocuments(updatedDocs);
  };

  const handleFileChange = (index, file) => {
    const updatedDocs = [...documents];
    updatedDocs[index].file = file;
    setDocuments(updatedDocs);
  };

  const addNewDocument = () => {
    setDocuments([...documents, { name: "", file: null }]);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!user?._id) {
      alert("User not found. Please login again.");
      return;
    }

    // ✅ Check karo ki kam se kam ek file select ho
    const hasFile = documents.some((doc) => doc.file);
    if (!hasFile) {
      alert("Please select at least one file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);

    // ✅ FIX: file_0, file_1... aur name_0, name_1... pattern use karo
    documents.forEach((doc, index) => {
      if (doc.file) {
        formData.append(`file_${index}`, doc.file);
        formData.append(`name_${index}`, doc.name || `Document ${index + 1}`);
      }
    });

    try {
      setUploading(true);

      const res = await axios.post(
        `http://localhost:5000/api/documents/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      alert(res.data.message || "Documents Uploaded Successfully!");

      setDocuments([
        { name: "Aadhar Card", file: null },
        { name: "Marksheet", file: null },
        { name: "Photo", file: null },
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Upload Failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen ml-[300px] bg-gradient-to-r from-indigo-500 to-emerald-400 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          👤 User Information
        </h2>

        {loadingUser ? (
          <p className="text-center">Loading user...</p>
        ) : user ? (
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        ) : (
          <p className="text-center text-red-500">
            User not found. Please login again.
          </p>
        )}

        <h2 className="text-2xl font-bold text-center mb-6">
          📂 Upload Your Documents
        </h2>

        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-3 items-center"
            >
              <input
                type="text"
                value={doc.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="Document name"
                className="border rounded-lg px-3 py-2 w-full md:w-1/3"
              />
              <input
                type="file"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                className="w-full md:w-1/3"
              />
              {/* ✅ Pehle 3 fixed hain, uske baad remove button */}
              {index >= 3 && (
                <button
                  onClick={() => removeDocument(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={addNewDocument}
            className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold"
          >
            ➕ Add Custom
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "🚀 Upload All"}
          </button>
        </div>
      </div>
    </div>
  );
}
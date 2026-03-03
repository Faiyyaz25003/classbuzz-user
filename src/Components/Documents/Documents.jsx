"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function DocumentUpload() {
  const [documents, setDocuments] = useState([
    { name: "", file: null },
    { name: "", file: null },
    { name: "", file: null },
  ]);

  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");

        // Agar API multiple users return karti hai
        // toh first user le liya (aap apni logic laga sakte ho)
        setUser(res.data[0]);
      } catch (error) {
        console.error("User fetch failed:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Handle name change
  const handleNameChange = (index, value) => {
    const updatedDocs = [...documents];
    updatedDocs[index].name = value;
    setDocuments(updatedDocs);
  };

  // Handle file change
  const handleFileChange = (index, file) => {
    const updatedDocs = [...documents];
    updatedDocs[index].file = file;
    setDocuments(updatedDocs);
  };

  const addNewDocument = () => {
    setDocuments([...documents, { name: "", file: null }]);
  };

  const removeDocument = (index) => {
    const updatedDocs = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocs);
  };

  const handleUpload = async () => {
    const formData = new FormData();

    documents.forEach((doc, index) => {
      if (doc.file) {
        formData.append(`file_${index}`, doc.file);
        formData.append(`name_${index}`, doc.name);
      }
    });

    try {
      setUploading(true);
      alert("Documents Uploaded Successfully!");
    } catch (error) {
      alert("Upload Failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-emerald-400 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl">
        {/* ✅ User Info Section */}
        <h2 className="text-2xl font-bold text-center mb-6">
          👤 User Information
        </h2>

        {loadingUser ? (
          <p className="text-center">Loading user...</p>
        ) : user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
            <div>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            <div>
              <p>
                <strong>Departments:</strong> {user.departments?.join(", ")}
              </p>
              <p>
                <strong>Positions:</strong> {user.positions?.join(", ")}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">User not found</p>
        )}

        {/* ✅ Upload Section */}
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
                placeholder="Enter document name"
                value={doc.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="border rounded-lg px-3 py-2 w-full md:w-1/3"
              />

              <input
                type="file"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                className="w-full md:w-1/3"
              />

              {doc.file && (
                <span className="text-sm text-gray-500 truncate w-full md:w-1/4">
                  {doc.file.name}
                </span>
              )}

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

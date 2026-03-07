


"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_FOLDER = "http://localhost:5000/api/folders";
const API_ASSIGNMENT = "http://localhost:5000/api/assignments";

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {msg}
    </div>
  );
}

export default function Assignment() {
  const [folders, setFolders] = useState([]);

  const [classes, setClasses] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");

  const [studentName, setStudentName] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => setToast({ msg, type });

  /* ================= GET FOLDERS ================= */

  useEffect(() => {
    const fetchFolders = async () => {
      const res = await axios.get(API_FOLDER);

      setFolders(res.data);

      const uniqueClasses = [...new Set(res.data.map((f) => f.className))];

      setClasses(uniqueClasses);
    };

    fetchFolders();
  }, []);

  /* ================= FILTER FOLDERS ================= */

  const filteredFolders = folders.filter((f) => f.className === selectedClass);

  /* ================= SUBMIT ASSIGNMENT ================= */

  const submitAssignment = async () => {
    if (!studentName || !selectedClass || !selectedFolder || !file) {
      showToast("Fill all fields", "error");
      return;
    }

    const folder = folders.find((f) => f._id === selectedFolder);

    if (!folder) {
      showToast("Folder not found", "error");
      return;
    }

    if (folder.password !== password) {
      showToast("Wrong Password", "error");
      return;
    }

    const formData = new FormData();

    formData.append("studentName", studentName);
    formData.append("folderId", selectedFolder);
    formData.append("file", file);

    try {
      await axios.post(API_ASSIGNMENT + "/upload", formData);

      showToast("Assignment uploaded", "success");

      setStudentName("");
      setPassword("");
      setFile(null);
    } catch (err) {
      showToast("Upload failed", "error");
    }
  };

  return (
    <div className="min-h-screen ml-[350px] mt-[50px] p-10 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Submit Assignment</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* FORM */}

        <div className="bg-white p-6 rounded-xl shadow">
          <input
            className="border w-full mb-3 p-2"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />

          {/* CLASS */}

          <select
            className="border w-full mb-3 p-2"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedFolder("");
            }}
          >
            <option value="">Select Class</option>

            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* FOLDER */}

          <select
            className="border w-full mb-3 p-2"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
          >
            <option value="">Select Folder</option>

            {filteredFolders.map((f) => (
              <option key={f._id} value={f._id}>
                {f.docName}
              </option>
            ))}
          </select>

          {/* PASSWORD */}

          <input
            type="password"
            className="border w-full mb-3 p-2"
            placeholder="Folder Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* FILE */}

          <input
            type="file"
            className="border w-full mb-3 p-2"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            onClick={submitAssignment}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
          >
            Submit Assignment
          </button>
        </div>

        {/* FOLDER LIST */}

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Folders</h2>

          {!selectedClass ? (
            <p>Select class first</p>
          ) : (
            filteredFolders.map((f) => (
              <div key={f._id} className="border p-3 mb-3 rounded">
                <p className="font-semibold">{f.docName}</p>

                <p className="text-xs text-gray-500">Teacher: {f.teacher}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
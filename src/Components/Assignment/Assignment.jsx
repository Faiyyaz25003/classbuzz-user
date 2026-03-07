// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";

// const API_FOLDER = "http://localhost:5000/api/folders";
// const API_ASSIGNMENT = "http://localhost:5000/api/assignments";

// function Toast({ msg, type, onClose }) {
//   useEffect(() => {
//     const t = setTimeout(onClose, 3000);
//     return () => clearTimeout(t);
//   }, []);

//   return (
//     <div
//       className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white ${
//         type === "success" ? "bg-green-500" : "bg-red-500"
//       }`}
//     >
//       {msg}
//     </div>
//   );
// }

// export default function Assignment() {
//   const [folders, setFolders] = useState([]);

//   const [classes, setClasses] = useState([]);

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedFolder, setSelectedFolder] = useState("");

//   const [studentName, setStudentName] = useState("");
//   const [password, setPassword] = useState("");
//   const [file, setFile] = useState(null);

//   const [toast, setToast] = useState(null);

//   const showToast = (msg, type) => setToast({ msg, type });

//   /* ================= GET FOLDERS ================= */

//   useEffect(() => {
//     const fetchFolders = async () => {
//       const res = await axios.get(API_FOLDER);

//       setFolders(res.data);

//       const uniqueClasses = [...new Set(res.data.map((f) => f.className))];

//       setClasses(uniqueClasses);
//     };

//     fetchFolders();
//   }, []);

//   /* ================= FILTER FOLDERS ================= */

//   const filteredFolders = folders.filter((f) => f.className === selectedClass);

//   /* ================= SUBMIT ASSIGNMENT ================= */

//   const submitAssignment = async () => {
//     if (!studentName || !selectedClass || !selectedFolder || !file) {
//       showToast("Fill all fields", "error");
//       return;
//     }

//     const folder = folders.find((f) => f._id === selectedFolder);

//     if (!folder) {
//       showToast("Folder not found", "error");
//       return;
//     }

//     if (folder.password !== password) {
//       showToast("Wrong Password", "error");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("studentName", studentName);
//     formData.append("folderId", selectedFolder);
//     formData.append("file", file);

//     try {
//       await axios.post(API_ASSIGNMENT + "/upload", formData);

//       showToast("Assignment uploaded", "success");

//       setStudentName("");
//       setPassword("");
//       setFile(null);
//     } catch (err) {
//       showToast("Upload failed", "error");
//     }
//   };

//   return (
//     <div className="min-h-screen ml-[350px] mt-[50px] p-10 bg-gray-50">
//       <h1 className="text-2xl font-bold mb-6">Submit Assignment</h1>

//       <div className="grid grid-cols-2 gap-6">
//         {/* FORM */}

//         <div className="bg-white p-6 rounded-xl shadow">
//           <input
//             className="border w-full mb-3 p-2"
//             placeholder="Student Name"
//             value={studentName}
//             onChange={(e) => setStudentName(e.target.value)}
//           />

//           {/* CLASS */}

//           <select
//             className="border w-full mb-3 p-2"
//             value={selectedClass}
//             onChange={(e) => {
//               setSelectedClass(e.target.value);
//               setSelectedFolder("");
//             }}
//           >
//             <option value="">Select Class</option>

//             {classes.map((c) => (
//               <option key={c}>{c}</option>
//             ))}
//           </select>

//           {/* FOLDER */}

//           <select
//             className="border w-full mb-3 p-2"
//             value={selectedFolder}
//             onChange={(e) => setSelectedFolder(e.target.value)}
//           >
//             <option value="">Select Folder</option>

//             {filteredFolders.map((f) => (
//               <option key={f._id} value={f._id}>
//                 {f.docName}
//               </option>
//             ))}
//           </select>

//           {/* PASSWORD */}

//           <input
//             type="password"
//             className="border w-full mb-3 p-2"
//             placeholder="Folder Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {/* FILE */}

//           <input
//             type="file"
//             className="border w-full mb-3 p-2"
//             onChange={(e) => setFile(e.target.files[0])}
//           />

//           <button
//             onClick={submitAssignment}
//             className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
//           >
//             Submit Assignment
//           </button>
//         </div>

//         {/* FOLDER LIST */}

//         <div className="bg-white p-6 rounded-xl shadow">
//           <h2 className="font-bold mb-4">Folders</h2>

//           {!selectedClass ? (
//             <p>Select class first</p>
//           ) : (
//             filteredFolders.map((f) => (
//               <div key={f._id} className="border p-3 mb-3 rounded">
//                 <p className="font-semibold">{f.docName}</p>

//                 <p className="text-xs text-gray-500">Teacher: {f.teacher}</p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {toast && (
//         <Toast
//           msg={toast.msg}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_FOLDER = "http://localhost:5000/api/folders";
const API_ASSIGNMENT = "http://localhost:5000/api/assignments";
const API_USERS = "http://localhost:5000/api/users";

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl text-white font-semibold text-sm flex items-center gap-2 shadow-2xl z-[9999] animate-slideUp ${
        type === "success"
          ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
          : "bg-gradient-to-br from-red-500 to-red-600"
      }`}
    >
      <span>{type === "success" ? "✓" : "✕"}</span>
      {msg}
    </div>
  );
}

export default function Assignment() {
  const [folders, setFolders] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type) => setToast({ msg, type });

  useEffect(() => {
    const fetchFolders = async () => {
      const res = await axios.get(API_FOLDER);
      setFolders(res.data);
      const uniqueClasses = [...new Set(res.data.map((f) => f.className))];
      setClasses(uniqueClasses);
    };
    fetchFolders();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await axios.get(API_USERS);
      setStudents(res.data);
    };
    fetchStudents();
  }, []);

  const filteredFolders = folders.filter((f) => f.className === selectedClass);

  const submitAssignment = async () => {
    if (!selectedStudent || !selectedClass || !selectedFolder || !file) {
      showToast("Please fill all fields", "error");
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

    const student = students.find((s) => s._id === selectedStudent);
    const formData = new FormData();
    formData.append("studentName", student?.name || selectedStudent);
    formData.append("folderId", selectedFolder);
    formData.append("file", file);

    setLoading(true);
    try {
      await axios.post(API_ASSIGNMENT + "/upload", formData);
      showToast("Assignment submitted successfully!", "success");
      setSelectedStudent("");
      setPassword("");
      setFile(null);
    } catch {
      showToast("Upload failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const selectedFolderData = folders.find((f) => f._id === selectedFolder);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease; }
        .animate-fadeIn { animation: fadeIn 0.5s ease; }
        .animate-fadeIn-delay-1 { animation: fadeIn 0.5s ease 0.1s both; }
        .animate-fadeIn-delay-2 { animation: fadeIn 0.5s ease 0.2s both; }
        .animate-fadeIn-delay-3 { animation: fadeIn 0.3s ease both; }
        .animate-spin-custom { animation: spin 0.7s linear infinite; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        .select-custom { appearance: none; }
      `}</style>

      <div className="min-h-screen ml-[350px] mt-[50px] p-10 bg-[#f5f6fa] font-dm">
        {/* Header */}
        <div className="mb-10 animate-fadeIn">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-[10px] flex items-center justify-center text-lg">
              📝
            </div>
            <h1 className="font-playfair text-[1.8rem] font-bold text-[#1e1b4b] m-0">
              Submit Assignment
            </h1>
          </div>
          <p className="text-slate-400 text-sm m-0 ml-[52px]">
            Upload your work to the correct class folder
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-[960px]">
          {/* FORM CARD */}
          <div className="bg-white border border-[#e0e7ff] rounded-[18px] p-7 animate-fadeIn-delay-1 shadow-[0_2px_16px_rgba(99,102,241,0.06)]">
            <h2 className="text-[#1e1b4b] text-base font-semibold mt-0 mb-6 flex items-center gap-2">
              <span className="text-indigo-500">✦</span> Assignment Details
            </h2>

            {/* Student Select */}
            <div className="mb-[1.1rem]">
              <label className="block text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-indigo-500 mb-[0.4rem]">
                <div className="flex items-center gap-[0.4rem]">
                  <StepNum>1</StepNum> Student Name
                </div>
              </label>
              <select
                className="select-custom w-full px-4 py-3 bg-[#f8f9ff] border-[1.5px] border-[#e0e7ff] rounded-[10px] text-[#1e1b4b] font-dm text-[0.9rem] outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] focus:bg-white"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Select */}
            <div className="mb-[1.1rem]">
              <label className="block text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-indigo-500 mb-[0.4rem]">
                <div className="flex items-center gap-[0.4rem]">
                  <StepNum>2</StepNum> Class
                </div>
              </label>
              <select
                className="select-custom w-full px-4 py-3 bg-[#f8f9ff] border-[1.5px] border-[#e0e7ff] rounded-[10px] text-[#1e1b4b] font-dm text-[0.9rem] outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] focus:bg-white"
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
            </div>

            {/* Folder Select */}
            <div className="mb-[1.1rem]">
              <label className="block text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-indigo-500 mb-[0.4rem]">
                <div className="flex items-center gap-[0.4rem]">
                  <StepNum>3</StepNum> Folder
                </div>
              </label>
              <select
                className="select-custom w-full px-4 py-3 bg-[#f8f9ff] border-[1.5px] border-[#e0e7ff] rounded-[10px] text-[#1e1b4b] font-dm text-[0.9rem] outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                disabled={!selectedClass}
              >
                <option value="">Select Folder</option>
                {filteredFolders.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.docName}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="mb-[1.1rem]">
              <label className="block text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-indigo-500 mb-[0.4rem]">
                <div className="flex items-center gap-[0.4rem]">
                  <StepNum>4</StepNum> Folder Password
                </div>
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-[#f8f9ff] border-[1.5px] border-[#e0e7ff] rounded-[10px] text-[#1e1b4b] font-dm text-[0.9rem] outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] focus:bg-white"
                placeholder="Enter folder password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* File Upload */}
            <div className="mb-[1.1rem]">
              <label className="block text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-indigo-500 mb-[0.4rem]">
                <div className="flex items-center gap-[0.4rem]">
                  <StepNum>5</StepNum> Upload File
                </div>
              </label>
              <div
                className={`border-2 border-dashed rounded-[10px] p-6 text-center cursor-pointer transition-all text-sm
                  ${
                    file
                      ? "border-emerald-400 bg-green-50 text-emerald-500"
                      : dragOver
                        ? "border-indigo-500 bg-indigo-50 text-indigo-500"
                        : "border-[#c7d2fe] bg-[#f8f9ff] text-slate-400 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-500"
                  }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    <span className="font-semibold">{file.name}</span>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl mb-1 opacity-70">☁</div>
                    <div>
                      Drop file here or{" "}
                      <span className="text-indigo-500 font-semibold">
                        browse
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="w-full py-[0.9rem] bg-gradient-to-br from-indigo-500 to-violet-500 text-white border-none rounded-[10px] font-dm text-[0.95rem] font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 tracking-[0.02em] mt-2 hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_8px_25px_rgba(99,102,241,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={submitAssignment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-custom" />
                  Uploading...
                </>
              ) : (
                <> Submit Assignment →</>
              )}
            </button>
          </div>

          {/* FOLDER PANEL */}
          <div className="bg-white border border-[#e0e7ff] rounded-[18px] p-7 animate-fadeIn-delay-2 shadow-[0_2px_16px_rgba(99,102,241,0.06)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#1e1b4b] text-base font-semibold m-0 flex items-center gap-2">
                <span className="text-indigo-500">✦</span> Folders
              </h2>
              {selectedClass && (
                <span className="inline-flex items-center px-[0.6rem] py-[0.2rem] rounded-full text-[0.7rem] font-semibold bg-indigo-50 text-indigo-500 border border-[#c7d2fe]">
                  {filteredFolders.length} available
                </span>
              )}
            </div>

            {!selectedClass ? (
              <div className="text-center py-12 px-4 text-[#c7d2fe]">
                <div className="text-4xl mb-3 opacity-50">📂</div>
                <p className="m-0 text-sm">Select a class to view folders</p>
              </div>
            ) : filteredFolders.length === 0 ? (
              <div className="text-center py-12 px-4 text-[#c7d2fe]">
                <p className="m-0 text-sm">No folders found for this class</p>
              </div>
            ) : (
              filteredFolders.map((f, i) => (
                <div
                  key={f._id}
                  className={`px-[1.2rem] py-4 rounded-xl mb-3 cursor-pointer transition-all animate-fadeIn-delay-3
                    ${
                      selectedFolder === f._id
                        ? "border border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-[0_0_0_1px_#6366f1,0_4px_20px_rgba(99,102,241,0.15)]"
                        : "border border-[#e0e7ff] bg-[#f8f9ff] hover:border-indigo-500 hover:bg-indigo-50 hover:translate-x-1"
                    }`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => setSelectedFolder(f._id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="m-0 font-semibold text-[#1e1b4b] text-[0.9rem]">
                        {f.docName}
                      </p>
                      <p className="m-0 mt-1 text-[0.75rem] text-slate-400">
                        👤 {f.teacher}
                      </p>
                    </div>
                    <div
                      className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[0.85rem] flex-shrink-0 transition-all
                        ${
                          selectedFolder === f._id
                            ? "bg-gradient-to-br from-indigo-500 to-violet-500"
                            : "bg-indigo-50"
                        }`}
                    >
                      📁
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Selected folder detail */}
            {selectedFolderData && (
              <div className="mt-4 p-4 bg-gradient-to-br from-indigo-50 to-violet-50 border border-[#c7d2fe] rounded-xl animate-fadeIn-delay-3">
                <p className="m-0 text-[0.78rem] text-indigo-500 font-semibold uppercase tracking-[0.05em]">
                  Selected
                </p>
                <p className="m-0 mt-1 font-semibold text-[#1e1b4b] text-[0.9rem]">
                  {selectedFolderData.docName}
                </p>
                <p className="m-0 mt-0.5 text-[0.8rem] text-slate-400">
                  {selectedFolderData.className} · {selectedFolderData.teacher}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

// Step number badge component
function StepNum({ children }) {
  return (
    <span className="w-[22px] h-[22px] bg-gradient-to-br from-[#0f4c5c] via-[#1e88a8] to-[#2596be] rounded-full flex items-center justify-center text-[0.7rem] font-bold text-white flex-shrink-0">
      {children}
    </span>
  );
}
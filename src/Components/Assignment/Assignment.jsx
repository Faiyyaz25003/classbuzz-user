
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
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        padding: "1rem 1.5rem",
        borderRadius: "12px",
        color: "white",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600,
        fontSize: "0.9rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        zIndex: 9999,
        animation: "slideUp 0.3s ease",
        background:
          type === "success"
            ? "linear-gradient(135deg, #10b981, #059669)"
            : "linear-gradient(135deg, #ef4444, #dc2626)",
      }}
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

        * { box-sizing: border-box; }

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

        .field-group {
          margin-bottom: 1.1rem;
        }
        .field-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6366f1;
          margin-bottom: 0.4rem;
        }
        .field-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #f8f9ff;
          border: 1.5px solid #e0e7ff;
          border-radius: 10px;
          color: #1e1b4b;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        .field-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
          background: #fff;
        }
        .field-input option {
          background: #fff;
          color: #1e1b4b;
        }

        .folder-card {
          padding: 1rem 1.2rem;
          background: #f8f9ff;
          border: 1.5px solid #e0e7ff;
          border-radius: 12px;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          animation: fadeIn 0.3s ease both;
        }
        .folder-card:hover {
          border-color: #6366f1;
          background: #eef2ff;
          transform: translateX(4px);
        }
        .folder-card.active {
          border-color: #6366f1;
          background: linear-gradient(135deg, #eef2ff, #f5f3ff);
          box-shadow: 0 0 0 1px #6366f1, 0 4px 20px rgba(99,102,241,0.15);
        }

        .submit-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          letter-spacing: 0.02em;
          margin-top: 0.5rem;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.4);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .drop-zone {
          border: 2px dashed #c7d2fe;
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #f8f9ff;
          color: #94a3b8;
          font-size: 0.85rem;
        }
        .drop-zone.over, .drop-zone:hover {
          border-color: #6366f1;
          background: #eef2ff;
          color: #6366f1;
        }
        .drop-zone.has-file {
          border-color: #10b981;
          background: #f0fdf4;
          color: #10b981;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          background: #eef2ff;
          color: #6366f1;
          border: 1px solid #c7d2fe;
        }

        .step-num {
          width: 22px; height: 22px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          marginLeft: "350px",
          marginTop: "50px",
          padding: "2.5rem",
          background: "#f5f6fa",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2.5rem", animation: "fadeIn 0.5s ease" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.4rem",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
              }}
            >
              📝
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "#1e1b4b",
                margin: 0,
              }}
            >
              Submit Assignment
            </h1>
          </div>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.875rem",
              margin: 0,
              marginLeft: "52px",
            }}
          >
            Upload your work to the correct class folder
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            maxWidth: "960px",
          }}
        >
          {/* FORM CARD */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e0e7ff",
              borderRadius: "18px",
              padding: "1.75rem",
              animation: "fadeIn 0.5s ease 0.1s both",
              boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
            }}
          >
            <h2
              style={{
                color: "#1e1b4b",
                fontSize: "1rem",
                fontWeight: 600,
                marginTop: 0,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: "#6366f1" }}>✦</span> Assignment Details
            </h2>

            {/* Student Select */}
            <div className="field-group">
              <label className="field-label">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span className="step-num">1</span> Student Name
                </div>
              </label>
              <select
                className="field-input"
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
            <div className="field-group">
              <label className="field-label">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span className="step-num">2</span> Class
                </div>
              </label>
              <select
                className="field-input"
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
            <div className="field-group">
              <label className="field-label">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span className="step-num">3</span> Folder
                </div>
              </label>
              <select
                className="field-input"
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
            <div className="field-group">
              <label className="field-label">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span className="step-num">4</span> Folder Password
                </div>
              </label>
              <input
                type="password"
                className="field-input"
                placeholder="Enter folder password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* File Upload */}
            <div className="field-group">
              <label className="field-label">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span className="step-num">5</span> Upload File
                </div>
              </label>
              <div
                className={`drop-zone ${dragOver ? "over" : ""} ${file ? "has-file" : ""}`}
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
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>✓</span>
                    <span style={{ fontWeight: 600 }}>{file.name}</span>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>
                      ☁
                    </div>
                    <div>
                      Drop file here or{" "}
                      <span style={{ color: "#6366f1", fontWeight: 600 }}>
                        browse
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="submit-btn"
              onClick={submitAssignment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" /> Uploading...
                </>
              ) : (
                <> Submit Assignment →</>
              )}
            </button>
          </div>

          {/* FOLDER PANEL */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e0e7ff",
              borderRadius: "18px",
              padding: "1.75rem",
              animation: "fadeIn 0.5s ease 0.2s both",
              boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  color: "#1e1b4b",
                  fontSize: "1rem",
                  fontWeight: 600,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ color: "#6366f1" }}>✦</span> Folders
              </h2>
              {selectedClass && (
                <span className="badge">
                  {filteredFolders.length} available
                </span>
              )}
            </div>

            {!selectedClass ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "#c7d2fe",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "0.75rem",
                    opacity: 0.5,
                  }}
                >
                  📂
                </div>
                <p style={{ margin: 0, fontSize: "0.875rem" }}>
                  Select a class to view folders
                </p>
              </div>
            ) : filteredFolders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "#c7d2fe",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.875rem" }}>
                  No folders found for this class
                </p>
              </div>
            ) : (
              filteredFolders.map((f, i) => (
                <div
                  key={f._id}
                  className={`folder-card ${selectedFolder === f._id ? "active" : ""}`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => setSelectedFolder(f._id)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          color: "#1e1b4b",
                          fontSize: "0.9rem",
                        }}
                      >
                        {f.docName}
                      </p>
                      <p
                        style={{
                          margin: "0.25rem 0 0",
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                        }}
                      >
                        👤 {f.teacher}
                      </p>
                    </div>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        background:
                          selectedFolder === f._id
                            ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                            : "#eef2ff",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        flexShrink: 0,
                        transition: "all 0.2s",
                      }}
                    >
                      📁
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Selected folder detail */}
            {selectedFolderData && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
                  border: "1px solid #c7d2fe",
                  borderRadius: "12px",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.78rem",
                    color: "#6366f1",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Selected
                </p>
                <p
                  style={{
                    margin: "0.3rem 0 0",
                    fontWeight: 600,
                    color: "#1e1b4b",
                    fontSize: "0.9rem",
                  }}
                >
                  {selectedFolderData.docName}
                </p>
                <p
                  style={{
                    margin: "0.2rem 0 0",
                    fontSize: "0.8rem",
                    color: "#94a3b8",
                  }}
                >
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

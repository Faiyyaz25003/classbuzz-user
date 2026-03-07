
"use client";

import { useState, useEffect } from "react";

const GRADIENTS = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
];

const EMOJIS = ["📘", "📗", "📙", "📕", "📒"];

const STORAGE_KEY = "__vaultCards_v1";

/* ---------------- Dummy Data ---------------- */

const DUMMY_CARDS = [
  {
    id: 1,
    className: "BCA",
    folder: "Semester 1",
    password: "123",
    colorIdx: 0,
    files: [],
  },
  {
    id: 2,
    className: "BCA",
    folder: "Semester 2",
    password: "123",
    colorIdx: 1,
    files: [],
  },
  {
    id: 3,
    className: "BBA",
    folder: "Semester 1",
    password: "456",
    colorIdx: 2,
    files: [],
  },
  {
    id: 4,
    className: "BBA",
    folder: "Semester 2",
    password: "456",
    colorIdx: 3,
    files: [],
  },
];

/* ---------------- Storage ---------------- */

function getSharedCards() {
  try {
    const raw = window[STORAGE_KEY];
    if (Array.isArray(raw) && raw.length) return raw;

    window[STORAGE_KEY] = DUMMY_CARDS;
    return DUMMY_CARDS;
  } catch {
    return DUMMY_CARDS;
  }
}

function setSharedCards(cards) {
  window[STORAGE_KEY] = cards;
}

/* ---------------- Toast ---------------- */

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold
      ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
    >
      {msg}
    </div>
  );
}

/* ---------------- Component ---------------- */

export default function Assignment() {
  const [cards, setCards] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => setToast({ msg, type });

  useEffect(() => {
    setCards(getSharedCards());
  }, []);

  /* -------- Unique Classes -------- */

  const classes = [...new Set(cards.map((c) => c.className))];

  /* -------- Filter folders by class -------- */

  const filteredFolders = cards.filter((c) => c.className === selectedClass);

  /* ---------------- Submit ---------------- */

  const handleSubmit = () => {
    if (!studentName) {
      showToast("Student name likho!", "error");
      return;
    }

    if (!selectedClass) {
      showToast("Class select karo!", "error");
      return;
    }

    if (!selectedFolder) {
      showToast("Folder select karo!", "error");
      return;
    }

    if (!file) {
      showToast("File choose karo!", "error");
      return;
    }

    const folder = cards.find(
      (c) => c.className === selectedClass && c.folder === selectedFolder,
    );

    if (!folder) {
      showToast("Folder nahi mila!", "error");
      return;
    }

    if (folder.password !== password) {
      showToast("Wrong Password!", "error");
      return;
    }

    /* -------- Save File -------- */

    const updatedCards = cards.map((c) => {
      if (c.id === folder.id) {
        return {
          ...c,
          files: [
            ...c.files,
            {
              student: studentName,
              fileName: file.name,
            },
          ],
        };
      }
      return c;
    });

    setCards(updatedCards);
    setSharedCards(updatedCards);

    showToast("Assignment Submitted ✅", "success");

    setStudentName("");
    setPassword("");
    setFile(null);
  };

  return (
    <div className="min-h-screen mt-[30px] ml-[250px] bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6">
        {/* ---------------- FORM ---------------- */}

        <div className="bg-white border rounded-2xl p-6 shadow">
          <h2 className="text-lg font-bold mb-4">Submit Assignment</h2>

          {/* Student Name */}

          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          />

          {/* Class */}

          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedFolder("");
            }}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          >
            <option value="">Select Class</option>

            {classes.map((cls, i) => (
              <option key={i} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          {/* Folder */}

          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          >
            <option value="">Select Folder</option>

            {filteredFolders.map((folder) => (
              <option key={folder.id} value={folder.folder}>
                {folder.folder}
              </option>
            ))}
          </select>

          {/* Password */}

          <input
            type="password"
            placeholder="Folder Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          />

          {/* File Upload */}

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg"
          >
            Submit Assignment
          </button>
        </div>

        {/* ---------------- Folder Cards ---------------- */}

        <div className="bg-white border rounded-2xl p-6 shadow">
          <h2 className="text-lg font-bold mb-4">Folders</h2>

          {!selectedClass ? (
            <p className="text-gray-500 text-sm">Pehle class select karo</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredFolders.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border overflow-hidden"
                >
                  <div
                    className={`bg-gradient-to-br ${GRADIENTS[card.colorIdx]} h-20 flex items-center justify-center`}
                  >
                    <span className="text-3xl">{EMOJIS[card.colorIdx]}</span>
                  </div>

                  <div className="bg-gray-50 p-2">
                    <h3 className="text-xs font-semibold">{card.folder}</h3>

                    <p className="text-xs text-gray-500">
                      Class: {card.className}
                    </p>

                    <p className="text-xs text-gray-500">
                      📎 {card.files.length} files
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
"use client";

import { useState, useEffect } from "react";

const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
];

const EMOJIS = ["📘", "📗", "📙", "📕", "📒"];

const STORAGE_KEY = "__vaultCards_v1";

function getSharedCards() {
  try {
    const raw = window[STORAGE_KEY];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function setSharedCards(cards) {
  window[STORAGE_KEY] = cards;
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold backdrop-blur-md border transition-all animate-bounce-in
        ${
          type === "success"
            ? "bg-emerald-500/90 text-white border-emerald-400"
            : "bg-rose-500/90 text-white border-rose-400"
        }`}
    >
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      {msg}
    </div>
  );
}

export default function Assignment() {
  const [cards, setCards] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [userDocName, setUserDocName] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState(null);
  const [lastUploaded, setLastUploaded] = useState(null);

  const showToast = (msg, type) => setToast({ msg, type });

  useEffect(() => {
    setCards(getSharedCards());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const shared = getSharedCards();
      if (JSON.stringify(shared) !== JSON.stringify(cards)) {
        setCards(shared);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cards]);

  const classes = [...new Set(cards.map((c) => c.className))];

  const handleSubmit = () => {
    if (!selectedClass || selectedClass === "Select Class") {
      showToast("Pehle class select karo!", "error");
      return;
    }
    if (!password) {
      showToast("Password daalo!", "error");
      return;
    }
    if (!userDocName && !file) {
      showToast("Document ka naam ya file zaroori hai!", "error");
      return;
    }

    let wrongPass = false;
    let classNotFound = true;

    const updated = cards.map((card) => {
      if (card.className === selectedClass) {
        classNotFound = false;
        if (card.password !== password) {
          wrongPass = true;
          return card;
        }
        return {
          ...card,
          files: [
            ...card.files,
            { name: userDocName || file?.name || "Untitled", url },
          ],
        };
      }
      return card;
    });

    if (classNotFound) {
      showToast("Class nahi mili!", "error");
      return;
    }
    if (wrongPass) {
      showToast("Wrong Password!", "error");
      return;
    }

    setSharedCards(updated);
    setCards(updated);
    setLastUploaded({
      name: userDocName || file?.name || "Untitled",
      class: selectedClass,
    });
    setUserDocName("");
    setPassword("");
    setUrl("");
    setFile(null);
    setSelectedClass("");
    showToast("Document upload ho gaya!", "success");
  };

  return (
    <div className="min-h-screen mt-[30px] ml-[250px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 font-sans">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 mb-4 shadow-lg shadow-indigo-500/10">
            <span className="text-3xl">📂</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Document Vault
          </h1>
          <p className="text-slate-400 mt-2 text-sm tracking-widest uppercase">
            Academic Document Management System
          </p>
          <div className="mt-4 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </div>

        {/* Success Banner */}
        {lastUploaded && (
          <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
            <span className="text-lg">✅</span>
            <span>
              <strong className="text-emerald-200">{lastUploaded.name}</strong>{" "}
              — "{lastUploaded.class}" folder mein upload ho gaya!
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <span className="text-sm">⬆️</span>
              </div>
              <h2 className="text-lg font-bold text-white">Document Upload</h2>
            </div>

            <div className="space-y-3">
              {/* Class Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-slate-800/60 border border-white/10 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all cursor-pointer"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls, i) => (
                    <option key={i} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Document Name
                </label>
                <input
                  placeholder="e.g. Assignment_Unit3.pdf"
                  value={userDocName}
                  onChange={(e) => setUserDocName(e.target.value)}
                  className="w-full bg-slate-800/60 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Folder Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/60 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Document URL{" "}
                  <span className="text-slate-600 normal-case">(optional)</span>
                </label>
                <input
                  placeholder="https://drive.google.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-800/60 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Or Upload File
                </label>
                <label className="flex items-center gap-3 w-full bg-slate-800/60 border border-dashed border-white/20 text-slate-400 rounded-xl px-4 py-3 text-sm cursor-pointer hover:border-indigo-500/50 hover:text-indigo-300 transition-all group">
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    📎
                  </span>
                  <span className="truncate">
                    {file ? file.name : "Click to choose a file"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold py-3 rounded-xl text-sm tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Upload Document
              </button>
            </div>
          </div>

          {/* Folders Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <span className="text-sm">🗂️</span>
                </div>
                <h2 className="text-lg font-bold text-white">
                  Available Folders
                </h2>
              </div>
              {cards.length > 0 && (
                <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full border border-white/5">
                  {cards.length} folder{cards.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {cards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-3 opacity-30">📭</div>
                <p className="text-slate-500 text-sm">
                  No folders available yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedClass(card.className)}
                    className={`relative cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group
                      ${
                        selectedClass === card.className
                          ? "border-indigo-500/60 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/40"
                          : "border-white/10 hover:border-white/20"
                      }`}
                  >
                    {/* Folder tab */}
                    <div
                      className={`bg-gradient-to-br ${GRADIENTS[card.colorIdx]} h-20 flex items-center justify-center relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/10" />
                      <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform duration-200">
                        {EMOJIS[card.colorIdx]}
                      </span>
                      {selectedClass === card.className && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Folder info */}
                    <div className="bg-slate-800/80 px-3 py-2.5">
                      <h3 className="text-white text-xs font-semibold truncate">
                        {card.className}
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        📎 {card.files.length} file
                        {card.files.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-10 tracking-widest uppercase">
          Document Vault • Academic System
        </p>
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

"use client";
import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Poll() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleAddOption = () => {
    if (options.length < 6) setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = () => {
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      alert("⚠️ Please fill in all fields before creating your poll!");
      return;
    }

    const newPoll = { question, options };
    console.log("✅ Poll Created:", newPoll);

    // Send to backend or chat logic can be added here

    router.back(); // Go back after creating
  };

  return (
    <div className="relative p-6 bg-white rounded-3xl shadow-lg">
      {/* Decorative Background Glow */}  
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 to-purple-100/20 rounded-3xl blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 ml-3 tracking-tight">
            Create a Poll
          </h2>
        </div>

       
      </div>

      {/* Poll Question */}
      
      <label className="block mb-2 text-sm font-medium text-slate-600">
        Poll Question
      </label>
      <input
        type="text"
        placeholder="e.g. What should we order for lunch?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-3 border rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-5 placeholder:text-slate-400 text-slate-800"
      />

      {/* Poll Options */}
      <label className="block mb-2 text-sm font-medium text-slate-600">
        Options
      </label>
      <div className="space-y-3 mb-6">
        {options.map((opt, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="flex-1 p-3 border rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400 text-slate-800"
            />
            {options.length > 2 && (
              <button
                onClick={() => handleRemoveOption(idx)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Option Button */}
      {options.length < 6 && (
        <button
          onClick={handleAddOption}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8 transition-transform hover:scale-[1.03]"
        >
          <Plus className="w-4 h-4 mr-2" /> Add another option
        </button>
      )}

      {/* Create Poll Button */}
      <button
        onClick={handleCreatePoll}
        className="w-full py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02]"
      >
        Create Poll 🚀
      </button>

      {/* Info */}
      <p className="text-center text-sm text-slate-500 mt-4">
        You can add up to <span className="font-semibold">6 options</span> per
        poll.
      </p>
    </div>
  );
}

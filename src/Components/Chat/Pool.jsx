
"use client";
import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
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
      alert("Please fill in all fields!");
      return;
    }

    const newPoll = { question, options };
    console.log("Poll Created:", newPoll);

    router.back();
  };

  return (
    <div className="relative p-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold ml-3 text-gray-800">Create a Poll</h2>
      </div>

      {/* Poll Question */}
      <label className="block text-sm font-medium mb-1 text-gray-700">
        Poll Question
      </label>
      <input
        type="text"
        placeholder="e.g. What should we order for lunch?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
      />

      {/* Poll Options */}
      <label className="block text-sm font-medium mb-1 text-gray-700">
        Options
      </label>
      <div className="space-y-2 mb-4">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="flex-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500"
            />
            {options.length > 2 && (
              <button
                onClick={() => handleRemoveOption(idx)}
                className="p-2 hover:bg-red-50 rounded-md text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Option */}
      {options.length < 6 && (
        <button
          onClick={handleAddOption}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <Plus className="w-4 h-4 mr-1" /> Add option
        </button>
      )}

      {/* Create Poll Button */}
      <button
        onClick={handleCreatePoll}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Create Poll
      </button>

      {/* Info */}
      <p className="text-center text-sm text-gray-500 mt-2">
        You can add up to <strong>6 options</strong> per poll.
      </p>
    </div>
  );
}

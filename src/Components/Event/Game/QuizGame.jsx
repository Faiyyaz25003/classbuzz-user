"use client";
import { useState } from "react";

const DEFAULT_QUESTIONS = [
  {
    q: "What is the capital of India?",
    options: ["_GP Mumbai", "Delhi", "Kolkata", "Chennai"],
    ans: 1,
  },
  {
    q: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    ans: 1,
  },
  {
    q: "In which direction does the Sun rise?",
    options: ["West", "North", "South", "East"],
    ans: 3,
  },
  {
    q: "What is the chemical formula of water?",
    options: ["CO2", "H2O", "O2", "NaCl"],
    ans: 1,
  },
  {
    q: "How many states are there in India?",
    options: ["25", "28", "29", ".Relative 30"],
    ans: 1,
  },
];

export default function QuizGame({ game, userName }) {
  const questions = game?.questions?.length
    ? game.questions
    : DEFAULT_QUESTIONS;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].ans) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setAnswered(false);
  };

  if (done)
    return (
      <div className="text-center py-10 px-4">
        <div className="text-7xl mb-4">
          {score >= questions.length * 0.7
            ? "🏆"
            : score >= questions.length * 0.4
              ? "👍"
              : "😅"}
        </div>
        <h2 className="text-3xl font-black mb-2">Quiz Khatam!</h2>
        <p className="text-white/50 mb-4">{userName}, tumhara score:</p>
        <div className="text-6xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          {score}/{questions.length}
        </div>
        <p className="text-white/40 text-sm mb-8">
          {score === questions.length
            ? "Perfect! Zabardast! 🔥"
            : score >= questions.length * 0.7
              ? "Bahut achha! 🎉"
              : score >= questions.length * 0.4
                ? "Theek-Thaak! 💪"
                : "Aur mehnat karo! 📚"}
        </p>
        <button
          onClick={restart}
          className="bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition"
        >
          🔄 Dobara Khelo
        </button>
      </div>
    );

  const q = questions[current];
  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/40">
          Question {current + 1} of {questions.length}
        </span>
        <span className="text-xs font-bold text-violet-400">
          Score: {score}
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
        <div
          className="bg-gradient-to-r from-violet-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${(current / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
        <p className="text-lg font-bold leading-relaxed">{q.q}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {q.options.map((opt, idx) => {
          let cls =
            "bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10";
          if (answered) {
            if (idx === q.ans) cls = "bg-green-500/20 border border-green-500";
            else if (idx === selected)
              cls = "bg-red-500/20 border border-red-500";
            else cls = "bg-white/3 border border-white/5 opacity-50";
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={`${cls} rounded-xl px-5 py-4 text-left font-medium transition-all duration-200 flex items-center gap-3`}
            >
              <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                {["A", "B", "C", "D"][idx]}
              </span>
              {opt}
              {answered && idx === q.ans && <span className="ml-auto">✅</span>}
              {answered && idx === selected && idx !== q.ans && (
                <span className="ml-auto">❌</span>
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <button
          onClick={next}
          className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 py-3 rounded-xl font-bold hover:opacity-90 transition"
        >
          {current + 1 >= questions.length
            ? "Result Dekho 🏆"
            : "Agla Sawaal →"}
        </button>
      )}
    </div>
  );
}

"use client";
import { useState, useCallback } from "react";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

export default function TicTacToe({ userName }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null);
  const [mode, setMode] = useState(null); // "pvp" or "ai"

  const checkWinner = (b) => {
    for (const [a, c, d] of WIN_LINES) {
      if (b[a] && b[a] === b[c] && b[a] === b[d])
        return { w: b[a], line: [a, c, d] };
    }
    if (b.every(Boolean)) return { w: "draw", line: null };
    return null;
  };

  const aiMove = useCallback((b) => {
    // Try to win
    for (const [a, c, d] of WIN_LINES) {
      if (b[a] === "O" && b[c] === "O" && !b[d]) return d;
      if (b[a] === "O" && b[d] === "O" && !b[c]) return c;
      if (b[c] === "O" && b[d] === "O" && !b[a]) return a;
    }
    // Block player
    for (const [a, c, d] of WIN_LINES) {
      if (b[a] === "X" && b[c] === "X" && !b[d]) return d;
      if (b[a] === "X" && b[d] === "X" && !b[c]) return c;
      if (b[c] === "X" && b[d] === "X" && !b[a]) return a;
    }
    // Take center
    if (!b[4]) return 4;
    // Random empty
    const emp = b.map((v, i) => (v ? null : i)).filter((v) => v !== null);
    return emp[Math.floor(Math.random() * emp.length)];
  }, []);

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const nb = [...board];
    nb[i] = xTurn ? "X" : "O";
    const res = checkWinner(nb);
    setBoard(nb);
    setXTurn(!xTurn);
    if (res) {
      setWinner(res.w);
      setWinLine(res.line);
      return;
    }

    // AI move after player
    if (mode === "ai") {
      setTimeout(() => {
        const move = aiMove(nb);
        if (move === undefined) return;
        const nb2 = [...nb];
        nb2[move] = "O";
        const res2 = checkWinner(nb2);
        setBoard(nb2);
        setXTurn(true);
        if (res2) {
          setWinner(res2.w);
          setWinLine(res2.line);
        }
      }, 350);
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXTurn(true);
    setWinner(null);
    setWinLine(null);
  };

  // Mode selection screen
  if (!mode)
    return (
      <div className="flex flex-col items-center gap-6 py-10 px-4">
        <div className="text-6xl">⭕❌</div>
        <h3 className="text-2xl font-black">X-O Game</h3>
        <p className="text-white/40 text-sm">{userName}, kaise khelna hai?</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => setMode("pvp")}
            className="bg-gradient-to-br from-violet-600 to-indigo-700 px-6 py-5 rounded-2xl font-bold hover:opacity-90 transition text-center min-w-[130px]"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-black">2 Players</div>
            <div className="text-xs text-white/50 mt-1">
              Dost ke saath khelo
            </div>
          </button>
          <button
            onClick={() => setMode("ai")}
            className="bg-gradient-to-br from-rose-600 to-pink-700 px-6 py-5 rounded-2xl font-bold hover:opacity-90 transition text-center min-w-[130px]"
          >
            <div className="text-3xl mb-2">🤖</div>
            <div className="font-black">vs AI</div>
            <div className="text-xs text-white/50 mt-1">Computer se lado</div>
          </button>
        </div>
      </div>
    );

  const getStatusText = () => {
    if (winner === "draw") return "Barabar! 🤝";
    if (winner === "X")
      return mode === "ai"
        ? `${userName} Jeet Gaya! 🎉`
        : "Player X Jeet Gaya! 🎉";
    if (winner === "O")
      return mode === "ai" ? "AI Jeet Gaya! 🤖" : "Player O Jeet Gaya! 🎉";
    if (!xTurn && mode === "ai") return "AI soch raha hai... 🤔";
    return `${xTurn ? "X" : "O"} ki baari`;
  };

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      {/* Status */}
      <div
        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
          winner
            ? "bg-gradient-to-r from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/30"
            : "bg-white/10 border border-white/10"
        }`}
      >
        {getStatusText()}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2">
        {board.map((val, i) => {
          const isWin = winLine?.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!winner || (mode === "ai" && !xTurn)}
              className={`w-24 h-24 rounded-2xl text-4xl font-black transition-all duration-200 flex items-center justify-center
                ${
                  isWin
                    ? "bg-gradient-to-br from-violet-600 to-cyan-500 scale-105 shadow-lg shadow-violet-500/40"
                    : val
                      ? "bg-white/10 border border-white/20"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/40 hover:scale-105"
                }`}
            >
              <span className={val === "X" ? "text-rose-400" : "text-cyan-400"}>
                {val}
              </span>
            </button>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2 bg-white/10 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/15 transition"
        >
          🔄 Reset
        </button>
        <button
          onClick={() => {
            setMode(null);
            reset();
          }}
          className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/40 hover:text-white transition"
        >
          ← Mode Badlo
        </button>
      </div>
    </div>
  );
}

// "use client";
// import { useState, useEffect, useRef, useCallback } from "react";
// import axios from "axios";

// // ─────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────
// const categoryColors = {
//   Sports: {
//     bg: "from-green-500/20 to-emerald-600/10",
//     border: "border-green-500/30",
//     badge: "bg-green-500/20 text-green-400",
//   },
//   Education: {
//     bg: "from-blue-500/20 to-cyan-600/10",
//     border: "border-blue-500/30",
//     badge: "bg-blue-500/20 text-blue-400",
//   },
//   Adventure: {
//     bg: "from-orange-500/20 to-red-600/10",
//     border: "border-orange-500/30",
//     badge: "bg-orange-500/20 text-orange-400",
//   },
//   Puzzle: {
//     bg: "from-purple-500/20 to-violet-600/10",
//     border: "border-purple-500/30",
//     badge: "bg-purple-500/20 text-purple-400",
//   },
//   Trivia: {
//     bg: "from-yellow-500/20 to-amber-600/10",
//     border: "border-yellow-500/30",
//     badge: "bg-yellow-500/20 text-yellow-400",
//   },
//   Strategy: {
//     bg: "from-indigo-500/20 to-blue-600/10",
//     border: "border-indigo-500/30",
//     badge: "bg-indigo-500/20 text-indigo-400",
//   },
//   Other: {
//     bg: "from-gray-500/20 to-slate-600/10",
//     border: "border-gray-500/30",
//     badge: "bg-gray-500/20 text-gray-400",
//   },
// };
// const gameTypeIcons = {
//   quiz: "❓",
//   puzzle: "🧩",
//   trivia: "🧠",
//   challenge: "⚡",
//   snake: "🐍",
//   xo: "⭕",
//   tictactoe: "❌",
//   other: "🎮",
// };
// const gameTypeBg = {
//   quiz: "from-pink-600 to-rose-700",
//   puzzle: "from-purple-600 to-violet-700",
//   trivia: "from-blue-600 to-cyan-700",
//   challenge: "from-yellow-600 to-orange-700",
//   snake: "from-green-600 to-emerald-700",
//   xo: "from-indigo-600 to-violet-700",
//   tictactoe: "from-indigo-600 to-violet-700",
//   other: "from-gray-600 to-slate-700",
// };

// // ─────────────────────────────────────────────
// // QUIZ GAME
// // ─────────────────────────────────────────────
// function QuizGame({ game, userName }) {
//   const questions = game.questions || [
//     {
//       q: "Bharat ki rajdhani kya hai?",
//       options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
//       ans: 1,
//     },
//     { q: "2 + 2 = ?", options: ["3", "4", "5", "6"], ans: 1 },
//     {
//       q: "Surya kis disha mein ugta hai?",
//       options: ["Paschim", "Uttar", "Dakshin", "Purv"],
//       ans: 3,
//     },
//     {
//       q: "Pani ka chemical formula kya hai?",
//       options: ["CO2", "H2O", "O2", "NaCl"],
//       ans: 1,
//     },
//     {
//       q: "Bharat mein kitne rajya hain?",
//       options: ["25", "28", "29", "30"],
//       ans: 1,
//     },
//   ];

//   const [current, setCurrent] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [score, setScore] = useState(0);
//   const [done, setDone] = useState(false);
//   const [answered, setAnswered] = useState(false);

//   const handleSelect = (idx) => {
//     if (answered) return;
//     setSelected(idx);
//     setAnswered(true);
//     if (idx === questions[current].ans) setScore((s) => s + 1);
//   };

//   const next = () => {
//     if (current + 1 >= questions.length) {
//       setDone(true);
//       return;
//     }
//     setCurrent((c) => c + 1);
//     setSelected(null);
//     setAnswered(false);
//   };

//   const restart = () => {
//     setCurrent(0);
//     setSelected(null);
//     setScore(0);
//     setDone(false);
//     setAnswered(false);
//   };

//   if (done)
//     return (
//       <div className="text-center py-10 px-4">
//         <div className="text-7xl mb-4">
//           {score >= questions.length * 0.7
//             ? "🏆"
//             : score >= questions.length * 0.4
//               ? "👍"
//               : "😅"}
//         </div>
//         <h2 className="text-3xl font-black mb-2">Quiz Khatam!</h2>
//         <p className="text-white/50 mb-6">{userName}, tumhara score:</p>
//         <div className="text-6xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">
//           {score}/{questions.length}
//         </div>
//         <p className="text-white/40 text-sm mb-8">
//           {score === questions.length
//             ? "Perfect! Zabardast! 🔥"
//             : score >= questions.length * 0.7
//               ? "Bahut achha! 🎉"
//               : score >= questions.length * 0.4
//                 ? "Theek-Thaak! 💪"
//                 : "Aur mehnat karo! 📚"}
//         </p>
//         <button
//           onClick={restart}
//           className="bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition"
//         >
//           🔄 Dobara Khelo
//         </button>
//       </div>
//     );

//   const q = questions[current];
//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       {/* Progress */}
//       <div className="flex items-center justify-between mb-4">
//         <span className="text-xs text-white/40">
//           Question {current + 1} of {questions.length}
//         </span>
//         <span className="text-xs font-bold text-violet-400">
//           Score: {score}
//         </span>
//       </div>
//       <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
//         <div
//           className="bg-gradient-to-r from-violet-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
//           style={{ width: `${(current / questions.length) * 100}%` }}
//         />
//       </div>

//       {/* Question */}
//       <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
//         <p className="text-lg font-bold leading-relaxed">{q.q}</p>
//       </div>

//       {/* Options */}
//       <div className="grid grid-cols-1 gap-3 mb-6">
//         {q.options.map((opt, idx) => {
//           let cls =
//             "bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10";
//           if (answered) {
//             if (idx === q.ans) cls = "bg-green-500/20 border border-green-500";
//             else if (idx === selected)
//               cls = "bg-red-500/20 border border-red-500";
//             else cls = "bg-white/3 border border-white/5 opacity-50";
//           }
//           return (
//             <button
//               key={idx}
//               onClick={() => handleSelect(idx)}
//               disabled={answered}
//               className={`${cls} rounded-xl px-5 py-4 text-left font-medium transition-all duration-200 flex items-center gap-3`}
//             >
//               <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
//                 {["A", "B", "C", "D"][idx]}
//               </span>
//               {opt}
//               {answered && idx === q.ans && <span className="ml-auto">✅</span>}
//               {answered && idx === selected && idx !== q.ans && (
//                 <span className="ml-auto">❌</span>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {answered && (
//         <button
//           onClick={next}
//           className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 py-3 rounded-xl font-bold hover:opacity-90 transition"
//         >
//           {current + 1 >= questions.length
//             ? "Result Dekho 🏆"
//             : "Agla Sawaal →"}
//         </button>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // SNAKE GAME
// // ─────────────────────────────────────────────
// const GRID = 20;
// const CELL = 20;
// const DIRS = {
//   ArrowUp: [0, -1],
//   ArrowDown: [0, 1],
//   ArrowLeft: [-1, 0],
//   ArrowRight: [1, 0],
// };

// function SnakeGame({ userName }) {
//   const canvasRef = useRef(null);
//   const stateRef = useRef({
//     snake: [{ x: 10, y: 10 }],
//     dir: [1, 0],
//     nextDir: [1, 0],
//     food: { x: 5, y: 5 },
//     score: 0,
//     running: false,
//     dead: false,
//     started: false,
//   });
//   const [display, setDisplay] = useState({
//     score: 0,
//     dead: false,
//     started: false,
//     running: false,
//   });
//   const intervalRef = useRef(null);

//   const randomFood = (snake) => {
//     let pos;
//     do {
//       pos = {
//         x: Math.floor(Math.random() * GRID),
//         y: Math.floor(Math.random() * GRID),
//       };
//     } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
//     return pos;
//   };

//   const draw = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     const s = stateRef.current;
//     ctx.fillStyle = "#0a0a1a";
//     ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);
//     // Grid dots
//     ctx.fillStyle = "rgba(255,255,255,0.03)";
//     for (let x = 0; x < GRID; x++)
//       for (let y = 0; y < GRID; y++) {
//         ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
//       }
//     // Food
//     ctx.fillStyle = "#f43f5e";
//     ctx.shadowBlur = 12;
//     ctx.shadowColor = "#f43f5e";
//     ctx.beginPath();
//     ctx.arc(
//       s.food.x * CELL + CELL / 2,
//       s.food.y * CELL + CELL / 2,
//       CELL / 2 - 2,
//       0,
//       Math.PI * 2,
//     );
//     ctx.fill();
//     ctx.shadowBlur = 0;
//     // Snake
//     s.snake.forEach((seg, i) => {
//       const ratio = 1 - (i / s.snake.length) * 0.5;
//       ctx.fillStyle = i === 0 ? "#7c3aed" : `rgba(139,92,246,${ratio})`;
//       ctx.shadowBlur = i === 0 ? 10 : 0;
//       ctx.shadowColor = "#7c3aed";
//       ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
//     });
//     ctx.shadowBlur = 0;
//   }, []);

//   const tick = useCallback(() => {
//     const s = stateRef.current;
//     if (!s.running) return;
//     const [dx, dy] = s.nextDir;
//     s.dir = s.nextDir;
//     const head = { x: s.snake[0].x + dx, y: s.snake[0].y + dy };
//     if (
//       head.x < 0 ||
//       head.x >= GRID ||
//       head.y < 0 ||
//       head.y >= GRID ||
//       s.snake.some((seg) => seg.x === head.x && seg.y === head.y)
//     ) {
//       s.running = false;
//       s.dead = true;
//       setDisplay((d) => ({ ...d, dead: true, running: false }));
//       draw();
//       return;
//     }
//     s.snake.unshift(head);
//     if (head.x === s.food.x && head.y === s.food.y) {
//       s.score++;
//       s.food = randomFood(s.snake);
//       setDisplay((d) => ({ ...d, score: s.score }));
//     } else {
//       s.snake.pop();
//     }
//     draw();
//   }, [draw]);

//   const startGame = () => {
//     const s = stateRef.current;
//     s.snake = [{ x: 10, y: 10 }];
//     s.dir = [1, 0];
//     s.nextDir = [1, 0];
//     s.food = randomFood(s.snake);
//     s.score = 0;
//     s.running = true;
//     s.dead = false;
//     s.started = true;
//     setDisplay({ score: 0, dead: false, started: true, running: true });
//     clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(tick, 130);
//     draw();
//   };

//   useEffect(() => {
//     draw();
//     const handleKey = (e) => {
//       if (DIRS[e.key]) {
//         e.preventDefault();
//         const s = stateRef.current;
//         const nd = DIRS[e.key];
//         if (nd[0] !== -s.dir[0] || nd[1] !== -s.dir[1]) s.nextDir = nd;
//       }
//       if (e.key === " " || e.key === "Enter") {
//         if (!stateRef.current.running) startGame();
//       }
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => {
//       window.removeEventListener("keydown", handleKey);
//       clearInterval(intervalRef.current);
//     };
//   }, [tick, draw]);

//   const dirs2 = [
//     { label: "↑", key: "ArrowUp", col: "col-start-2" },
//     { label: "←", key: "ArrowLeft", col: "col-start-1" },
//     { label: "↓", key: "ArrowDown", col: "col-start-2" },
//     { label: "→", key: "ArrowRight", col: "col-start-3" },
//   ];

//   const handleMobile = (key) => {
//     const s = stateRef.current;
//     if (!s.running) return;
//     const nd = DIRS[key];
//     if (nd[0] !== -s.dir[0] || nd[1] !== -s.dir[1]) s.nextDir = nd;
//   };

//   return (
//     <div className="flex flex-col items-center p-4 gap-4">
//       <div className="flex items-center gap-6">
//         <div className="text-center">
//           <p className="text-xs text-white/40">Score</p>
//           <p className="text-2xl font-black text-violet-400">{display.score}</p>
//         </div>
//         {display.dead && (
//           <div className="text-center">
//             <p className="text-xs text-red-400">Game Over!</p>
//             <p className="text-sm font-bold">{userName} 😅</p>
//           </div>
//         )}
//       </div>

//       <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/40">
//         <canvas ref={canvasRef} width={GRID * CELL} height={GRID * CELL} />
//         {!display.started && (
//           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
//             <div className="text-5xl">🐍</div>
//             <p className="text-white/60 text-sm">Arrow keys se snake chalao</p>
//             <p className="text-white/40 text-xs">
//               Lal food khao, score badhao!
//             </p>
//             <button
//               onClick={startGame}
//               className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition"
//             >
//               ▶ Start Karo
//             </button>
//           </div>
//         )}
//         {display.dead && (
//           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
//             <div className="text-5xl">💀</div>
//             <p className="text-xl font-black">Game Over!</p>
//             <p className="text-white/50">
//               Score:{" "}
//               <span className="text-violet-400 font-bold">{display.score}</span>
//             </p>
//             <button
//               onClick={startGame}
//               className="bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition"
//             >
//               🔄 Phir Khelo
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Mobile Controls */}
//       <div className="grid grid-cols-3 gap-2 mt-1">
//         {dirs2.map(({ label, key, col }) => (
//           <button
//             key={key}
//             onTouchStart={() => handleMobile(key)}
//             onClick={() => handleMobile(key)}
//             className={`${col} w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-xl font-bold active:bg-white/20 hover:bg-white/15 transition select-none`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>
//       <p className="text-white/20 text-xs">
//         Mobile: buttons use karo | Desktop: arrow keys
//       </p>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // TIC-TAC-TOE (X-O) GAME
// // ─────────────────────────────────────────────
// const WIN_LINES = [
//   [0, 1, 2],
//   [3, 4, 5],
//   [6, 7, 8],
//   [0, 3, 6],
//   [1, 4, 7],
//   [2, 5, 8],
//   [0, 4, 8],
//   [2, 4, 6],
// ];

// function TicTacToe({ userName }) {
//   const [board, setBoard] = useState(Array(9).fill(null));
//   const [xTurn, setXTurn] = useState(true);
//   const [winner, setWinner] = useState(null);
//   const [winLine, setWinLine] = useState(null);
//   const [mode, setMode] = useState(null); // "pvp" or "ai"

//   const checkWinner = (b) => {
//     for (const [a, c, d] of WIN_LINES) {
//       if (b[a] && b[a] === b[c] && b[a] === b[d])
//         return { w: b[a], line: [a, c, d] };
//     }
//     if (b.every(Boolean)) return { w: "draw", line: null };
//     return null;
//   };

//   const aiMove = useCallback((b) => {
//     // Minimax lite - try to win, block, else random
//     for (const [a, c, d] of WIN_LINES) {
//       if (b[a] === "O" && b[c] === "O" && !b[d]) return d;
//       if (b[a] === "O" && b[d] === "O" && !b[c]) return c;
//       if (b[c] === "O" && b[d] === "O" && !b[a]) return a;
//     }
//     for (const [a, c, d] of WIN_LINES) {
//       if (b[a] === "X" && b[c] === "X" && !b[d]) return d;
//       if (b[a] === "X" && b[d] === "X" && !b[c]) return c;
//       if (b[c] === "X" && b[d] === "X" && !b[a]) return a;
//     }
//     if (!b[4]) return 4;
//     const emp = b.map((v, i) => (v ? null : i)).filter((v) => v !== null);
//     return emp[Math.floor(Math.random() * emp.length)];
//   }, []);

//   const handleClick = (i) => {
//     if (board[i] || winner) return;
//     const nb = [...board];
//     nb[i] = xTurn ? "X" : "O";
//     const res = checkWinner(nb);
//     setBoard(nb);
//     setXTurn(!xTurn);
//     if (res) {
//       setWinner(res.w);
//       setWinLine(res.line);
//       return;
//     }
//     // AI move
//     if (mode === "ai") {
//       setTimeout(() => {
//         const move = aiMove(nb);
//         if (move === undefined) return;
//         const nb2 = [...nb];
//         nb2[move] = "O";
//         const res2 = checkWinner(nb2);
//         setBoard(nb2);
//         setXTurn(true);
//         if (res2) {
//           setWinner(res2.w);
//           setWinLine(res2.line);
//         }
//       }, 300);
//     }
//   };

//   const reset = () => {
//     setBoard(Array(9).fill(null));
//     setXTurn(true);
//     setWinner(null);
//     setWinLine(null);
//   };

//   if (!mode)
//     return (
//       <div className="flex flex-col items-center gap-6 py-10 px-4">
//         <div className="text-6xl">⭕❌</div>
//         <h3 className="text-2xl font-black">X-O Game</h3>
//         <p className="text-white/40 text-sm">{userName}, kaise khelna hai?</p>
//         <div className="flex gap-4">
//           <button
//             onClick={() => setMode("pvp")}
//             className="bg-gradient-to-br from-violet-600 to-indigo-700 px-6 py-4 rounded-2xl font-bold hover:opacity-90 transition text-center"
//           >
//             <div className="text-2xl mb-1">👥</div>
//             <div>2 Players</div>
//             <div className="text-xs text-white/50 mt-1">
//               Dost ke saath khelo
//             </div>
//           </button>
//           <button
//             onClick={() => setMode("ai")}
//             className="bg-gradient-to-br from-rose-600 to-pink-700 px-6 py-4 rounded-2xl font-bold hover:opacity-90 transition text-center"
//           >
//             <div className="text-2xl mb-1">🤖</div>
//             <div>vs AI</div>
//             <div className="text-xs text-white/50 mt-1">Computer se lado</div>
//           </button>
//         </div>
//       </div>
//     );

//   const status = winner
//     ? winner === "draw"
//       ? "Barabar! 🤝"
//       : `${winner === "X" ? (mode === "ai" ? userName : "Player X") : mode === "ai" ? "AI 🤖" : "Player O"} Jeet Gaya! 🎉`
//     : `${xTurn ? "X" : "O"} ki baari ${mode === "ai" && !xTurn ? "(AI soch raha hai...)" : ""}`;

//   return (
//     <div className="flex flex-col items-center gap-5 py-6 px-4">
//       <div
//         className={`px-5 py-2 rounded-full text-sm font-bold ${winner ? "bg-gradient-to-r from-violet-600 to-cyan-500" : "bg-white/10 border border-white/10"}`}
//       >
//         {status}
//       </div>

//       <div className="grid grid-cols-3 gap-2">
//         {board.map((val, i) => {
//           const isWin = winLine?.includes(i);
//           return (
//             <button
//               key={i}
//               onClick={() => handleClick(i)}
//               disabled={!!winner || (mode === "ai" && !xTurn)}
//               className={`w-24 h-24 rounded-2xl text-4xl font-black transition-all duration-200 flex items-center justify-center
//                 ${
//                   isWin
//                     ? "bg-gradient-to-br from-violet-600 to-cyan-500 scale-105 shadow-lg shadow-violet-500/40"
//                     : val
//                       ? "bg-white/10 border border-white/20"
//                       : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/40 hover:scale-105"
//                 }`}
//             >
//               <span className={val === "X" ? "text-rose-400" : "text-cyan-400"}>
//                 {val}
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       <div className="flex gap-3">
//         <button
//           onClick={reset}
//           className="px-5 py-2 bg-white/10 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/15 transition"
//         >
//           🔄 Reset
//         </button>
//         <button
//           onClick={() => {
//             setMode(null);
//             reset();
//           }}
//           className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/40 hover:text-white transition"
//         >
//           ← Mode Badlo
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // TRIVIA GAME (same as quiz but styled differently)
// // ─────────────────────────────────────────────
// function TriviaGame({ game, userName }) {
//   return <QuizGame game={game} userName={userName} />;
// }

// // ─────────────────────────────────────────────
// // GAME RENDERER - decides which game to show
// // ─────────────────────────────────────────────
// function GameRenderer({ game, userName }) {
//   const type = game.gameType?.toLowerCase();
//   if (type === "quiz") return <QuizGame game={game} userName={userName} />;
//   if (type === "trivia") return <TriviaGame game={game} userName={userName} />;
//   if (type === "snake") return <SnakeGame userName={userName} />;
//   if (type === "xo" || type === "tictactoe" || type === "x0")
//     return <TicTacToe userName={userName} />;
//   // Default fallback - show quiz
//   return <QuizGame game={game} userName={userName} />;
// }

// // ─────────────────────────────────────────────
// // MAIN PAGE
// // ─────────────────────────────────────────────
// export default function UserGamePage() {
//   const [games, setGames] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [pendingGame, setPendingGame] = useState(null);
//   const [password, setPassword] = useState("");
//   const [verifying, setVerifying] = useState(false);
//   const [accessError, setAccessError] = useState("");
//   const [unlockedGame, setUnlockedGame] = useState(null);
//   const [filter, setFilter] = useState("All");
//   const [playingGame, setPlayingGame] = useState(false);

//   useEffect(() => {
//     fetchAllGames();
//   }, []);

//   const fetchAllGames = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:5000/api/games/all");
//       setGames(res.data.filter((g) => g.isActive));
//     } catch (err) {
//       console.error("Error fetching games:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGameClick = (game) => {
//     setPendingGame(game);
//     setPassword("");
//     setAccessError("");
//     setShowPasswordModal(true);
//   };

//   const handleVerifyPassword = async () => {
//     if (!password.trim()) {
//       setAccessError("Password daalo pehle!");
//       return;
//     }
//     setVerifying(true);
//     setAccessError("");
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/games/verify-access",
//         { gameId: pendingGame._id, password: password.trim() },
//       );
//       const gameData = { ...res.data.game, userName: res.data.user?.name };
//       setUnlockedGame(gameData);
//       setSelectedGame(res.data.game);
//       setShowPasswordModal(false);
//       setPlayingGame(false);
//     } catch (err) {
//       setAccessError(err.response?.data?.message || "Galat password hai!");
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const categories = ["All", ...new Set(games.map((g) => g.category))];
//   const filteredGames =
//     filter === "All" ? games : games.filter((g) => g.category === filter);

//   return (
//     <div className="min-h-screen bg-[#080814] text-white">
//       {/* Password Modal */}
//       {showPasswordModal && pendingGame && (
//         <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
//             <div
//               className={`bg-gradient-to-r ${gameTypeBg[pendingGame.gameType] || gameTypeBg.other} p-6`}
//             >
//               <div className="text-4xl text-center mb-2">
//                 {gameTypeIcons[pendingGame.gameType] || "🎮"}
//               </div>
//               <h2 className="text-xl font-bold text-center">
//                 {pendingGame.title}
//               </h2>
//               <p className="text-white/60 text-sm text-center mt-1">
//                 {pendingGame.category}
//               </p>
//             </div>
//             <div className="p-6">
//               <div className="bg-white/5 rounded-xl p-4 mb-5 text-center">
//                 <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
//                   Game Access
//                 </p>
//                 <p className="text-sm text-white/70">
//                   Yeh game sirf unke liye hai jinhein admin ne access diya hai.
//                   Apna password enter karo jo aapko email par mila tha.
//                 </p>
//               </div>
//               <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
//                 Access Password
//               </label>
//               <input
//                 type="text"
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value.toUpperCase());
//                   setAccessError("");
//                 }}
//                 onKeyDown={(e) => e.key === "Enter" && handleVerifyPassword()}
//                 placeholder="e.g. A3F9C1"
//                 maxLength={6}
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.5em] outline-none focus:border-violet-500 transition placeholder-white/20 mb-1"
//               />
//               {accessError && (
//                 <p className="text-red-400 text-xs text-center mt-2 mb-3">
//                   {accessError}
//                 </p>
//               )}
//               <div className="flex gap-3 mt-4">
//                 <button
//                   onClick={handleVerifyPassword}
//                   disabled={verifying}
//                   className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-violet-500/20"
//                 >
//                   {verifying
//                     ? "⏳ Verify ho raha hai..."
//                     : "🎮 Game Khelna Hai"}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowPasswordModal(false);
//                     setPassword("");
//                     setAccessError("");
//                   }}
//                   className="px-5 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition text-sm"
//                 >
//                   Wapas
//                 </button>
//               </div>
//               <p className="text-center text-white/20 text-xs mt-4">
//                 Password nahi mila? Admin se contact karo.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Unlocked Game View */}
//       {selectedGame && unlockedGame && (
//         <div className="fixed inset-0 z-50 bg-[#080814] overflow-y-auto">
//           <div className="max-w-3xl mx-auto px-4 py-8">
//             <button
//               onClick={() => {
//                 setSelectedGame(null);
//                 setUnlockedGame(null);
//                 setPlayingGame(false);
//               }}
//               className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition"
//             >
//               ← Wapas Games Par Jao
//             </button>

//             {!playingGame ? (
//               <>
//                 <div
//                   className={`bg-gradient-to-br ${gameTypeBg[selectedGame.gameType] || gameTypeBg.other} rounded-2xl p-8 mb-6 text-center`}
//                 >
//                   <div className="text-6xl mb-4">
//                     {gameTypeIcons[selectedGame.gameType] || "🎮"}
//                   </div>
//                   <h1 className="text-3xl font-black">{selectedGame.title}</h1>
//                   <p className="text-white/70 mt-2">
//                     Welcome,{" "}
//                     <span className="text-white font-bold">
//                       {unlockedGame.userName}
//                     </span>
//                     ! 🎉
//                   </p>
//                 </div>

//                 <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 mb-6">
//                   <h2 className="font-bold mb-3 text-white/80">
//                     Game ke Baare Mein
//                   </h2>
//                   <p className="text-white/60 leading-relaxed">
//                     {selectedGame.description}
//                   </p>
//                   <div className="grid grid-cols-2 gap-4 mt-6">
//                     <div className="bg-white/5 rounded-xl p-4 text-center">
//                       <p className="text-xs text-white/40 mb-1">Category</p>
//                       <p className="font-bold">{selectedGame.category}</p>
//                     </div>
//                     <div className="bg-white/5 rounded-xl p-4 text-center">
//                       <p className="text-xs text-white/40 mb-1">Type</p>
//                       <p className="font-bold capitalize">
//                         {selectedGame.gameType}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => setPlayingGame(true)}
//                   className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 py-5 rounded-2xl font-bold text-xl hover:opacity-90 transition shadow-2xl shadow-violet-500/30 flex items-center justify-center gap-3"
//                 >
//                   <span className="text-2xl">
//                     {gameTypeIcons[selectedGame.gameType] || "🎮"}
//                   </span>
//                   Play Now — Game Shuru Karo!
//                 </button>
//               </>
//             ) : (
//               /* ACTUAL GAME PLAYING */
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <h2 className="font-black text-xl">{selectedGame.title}</h2>
//                     <p className="text-white/40 text-xs capitalize">
//                       {selectedGame.gameType} • {selectedGame.category}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setPlayingGame(false)}
//                     className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/40 hover:text-white transition"
//                   >
//                     ← Info
//                   </button>
//                 </div>
//                 <div className="bg-[#0d0d1f] border border-violet-500/20 rounded-2xl overflow-hidden">
//                   <GameRenderer
//                     game={selectedGame}
//                     userName={unlockedGame.userName}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Main Page */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-full text-violet-400 text-xs font-semibold mb-4">
//             🎮 Game Portal
//           </div>
//           <h1 className="text-4xl font-black mb-3">
//             <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
//               Apni Games
//             </span>{" "}
//             Khelein
//           </h1>
//           <p className="text-white/40 max-w-lg mx-auto text-sm">
//             Kisi bhi game par click karo aur apna password enter karke access lo
//           </p>
//         </div>

//         <div className="flex gap-2 flex-wrap justify-center mb-8">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setFilter(cat)}
//               className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${filter === cat ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg" : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/30"}`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {loading ? (
//           <div className="text-center py-24">
//             <div className="text-5xl mb-4 animate-pulse">🎮</div>
//             <p className="text-white/30">Games load ho rahe hain...</p>
//           </div>
//         ) : filteredGames.length === 0 ? (
//           <div className="text-center py-24">
//             <div className="text-6xl mb-4">🕹️</div>
//             <p className="text-white/30 text-lg">Koi games nahi hain abhi</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {filteredGames.map((game) => {
//               const colors =
//                 categoryColors[game.category] || categoryColors.Other;
//               return (
//                 <div
//                   key={game._id}
//                   onClick={() => handleGameClick(game)}
//                   className={`group relative bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300`}
//                 >
//                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center z-10">
//                     <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 backdrop-blur rounded-2xl px-5 py-3 text-center">
//                       <div className="text-2xl">🔐</div>
//                       <p className="text-xs font-semibold mt-1">
//                         Password Enter Karo
//                       </p>
//                     </div>
//                   </div>
//                   <div
//                     className={`h-28 bg-gradient-to-br ${gameTypeBg[game.gameType] || gameTypeBg.other} relative flex items-center justify-center`}
//                   >
//                     {game.imageUrl ? (
//                       <img
//                         src={game.imageUrl}
//                         alt={game.title}
//                         className="w-full h-full object-cover opacity-70"
//                       />
//                     ) : (
//                       <span className="text-5xl opacity-80">
//                         {gameTypeIcons[game.gameType] || "🎮"}
//                       </span>
//                     )}
//                   </div>
//                   <div className="p-4">
//                     <div className="flex items-start justify-between gap-2 mb-2">
//                       <h3 className="font-bold text-sm leading-tight">
//                         {game.title}
//                       </h3>
//                       <span
//                         className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${colors.badge}`}
//                       >
//                         {game.category}
//                       </span>
//                     </div>
//                     <p className="text-white/40 text-xs line-clamp-2 leading-relaxed">
//                       {game.description}
//                     </p>
//                     <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
//                       <span>{gameTypeIcons[game.gameType] || "🎮"}</span>
//                       <span className="capitalize">{game.gameType}</span>
//                       <span className="ml-auto">🔒 Password Required</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// ── Game Components Import ──────────────────────────────
import QuizGame from "./Game/QuizGame";
import SnakeGame from "./Game/SnakeGame";
import TicTacToe from "./Game/TicTacToe";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const categoryColors = {
  Sports: {
    bg: "from-green-500/20 to-emerald-600/10",
    border: "border-green-500/30",
    badge: "bg-green-500/20 text-green-400",
  },
  Education: {
    bg: "from-blue-500/20 to-cyan-600/10",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-400",
  },
  Adventure: {
    bg: "from-orange-500/20 to-red-600/10",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-400",
  },
  Puzzle: {
    bg: "from-purple-500/20 to-violet-600/10",
    border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-400",
  },
  Trivia: {
    bg: "from-yellow-500/20 to-amber-600/10",
    border: "border-yellow-500/30",
    badge: "bg-yellow-500/20 text-yellow-400",
  },
  Strategy: {
    bg: "from-indigo-500/20 to-blue-600/10",
    border: "border-indigo-500/30",
    badge: "bg-indigo-500/20 text-indigo-400",
  },
  Other: {
    bg: "from-gray-500/20 to-slate-600/10",
    border: "border-gray-500/30",
    badge: "bg-gray-500/20 text-gray-400",
  },
};

const gameTypeIcons = {
  quiz: "❓",
  trivia: "🧠",
  puzzle: "🧩",
  challenge: "⚡",
  snake: "🐍",
  xo: "⭕",
  tictactoe: "❌",
  x0: "⭕",
  other: "🎮",
};

const gameTypeBg = {
  quiz: "from-pink-600 to-rose-700",
  trivia: "from-blue-600 to-cyan-700",
  puzzle: "from-purple-600 to-violet-700",
  challenge: "from-yellow-600 to-orange-700",
  snake: "from-green-600 to-emerald-700",
  xo: "from-indigo-600 to-violet-700",
  tictactoe: "from-indigo-600 to-violet-700",
  x0: "from-indigo-600 to-violet-700",
  other: "from-gray-600 to-slate-700",
};

// ─────────────────────────────────────────────
// GAME RENDERER
// gameType ke hisaab se sahi component render karta hai
// ─────────────────────────────────────────────
function GameRenderer({ game, userName }) {
  const type = game?.gameType?.toLowerCase();

  if (type === "quiz" || type === "trivia") {
    return <QuizGame game={game} userName={userName} />;
  }
  if (type === "snake") {
    return <SnakeGame userName={userName} />;
  }
  if (type === "xo" || type === "x0" || type === "tictactoe") {
    return <TicTacToe userName={userName} />;
  }

  // Fallback for unknown game types
  return (
    <div className="text-center py-16 px-6">
      <div className="text-6xl mb-4">🎮</div>
      <h3 className="text-xl font-bold mb-2">{game?.title}</h3>
      <p className="text-white/40 text-sm">
        Yeh game type (
        <span className="text-white/60 font-mono">{game?.gameType}</span>) abhi
        available nahi hai.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function UserGamePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingGame, setPendingGame] = useState(null);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [accessError, setAccessError] = useState("");

  // Unlocked game state
  const [selectedGame, setSelectedGame] = useState(null);
  const [unlockedUser, setUnlockedUser] = useState(null);
  const [playingGame, setPlayingGame] = useState(false);

  // Filter
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchAllGames();
  }, []);

  const fetchAllGames = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/games/all");
      setGames(res.data.filter((g) => g.isActive));
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

  // Game card click → open password modal
  const handleGameClick = (game) => {
    setPendingGame(game);
    setPassword("");
    setAccessError("");
    setShowPasswordModal(true);
  };

  // Password verify
  const handleVerifyPassword = async () => {
    if (!password.trim()) {
      setAccessError("Password daalo pehle!");
      return;
    }
    setVerifying(true);
    setAccessError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/games/verify-access",
        {
          gameId: pendingGame._id,
          password: password.trim(),
        },
      );
      setSelectedGame(res.data.game);
      setUnlockedUser(res.data.user?.name || "Player");
      setShowPasswordModal(false);
      setPlayingGame(false);
    } catch (err) {
      setAccessError(err.response?.data?.message || "Galat password hai!");
    } finally {
      setVerifying(false);
    }
  };

  const closeGame = () => {
    setSelectedGame(null);
    setUnlockedUser(null);
    setPlayingGame(false);
  };

  const categories = ["All", ...new Set(games.map((g) => g.category))];
  const filteredGames =
    filter === "All" ? games : games.filter((g) => g.category === filter);

  return (
    <div className="min-h-screen mt-[50px] ml-[290px]  bg-[#080814] text-white">
      {/* ── PASSWORD MODAL ───────────────────────────────── */}
      {showPasswordModal && pendingGame && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div
              className={`bg-gradient-to-r ${gameTypeBg[pendingGame.gameType] || gameTypeBg.other} p-6`}
            >
              <div className="text-4xl text-center mb-2">
                {gameTypeIcons[pendingGame.gameType] || "🎮"}
              </div>
              <h2 className="text-xl font-bold text-center">
                {pendingGame.title}
              </h2>
              <p className="text-white/60 text-sm text-center mt-1">
                {pendingGame.category}
              </p>
            </div>

            <div className="p-6">
              <div className="bg-white/5 rounded-xl p-4 mb-5 text-center">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
                  Game Access
                </p>
                <p className="text-sm text-white/70">
                  Yeh game sirf unke liye hai jinhein admin ne access diya hai.
                  Apna password enter karo jo aapko email par mila tha.
                </p>
              </div>

              <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                Access Password
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value.toUpperCase());
                  setAccessError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyPassword()}
                placeholder="e.g. A3F9C1"
                maxLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.5em] outline-none focus:border-violet-500 transition placeholder-white/20 mb-1"
              />
              {accessError && (
                <p className="text-red-400 text-xs text-center mt-2 mb-3">
                  {accessError}
                </p>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleVerifyPassword}
                  disabled={verifying}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-violet-500/20"
                >
                  {verifying
                    ? "⏳ Verify ho raha hai..."
                    : "🎮 Game Khelna Hai"}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword("");
                    setAccessError("");
                  }}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition text-sm"
                >
                  Wapas
                </button>
              </div>
              <p className="text-center text-white/20 text-xs mt-4">
                Password nahi mila? Admin se contact karo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── GAME VIEW (password unlock ke baad) ─────────── */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 bg-[#080814] overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <button
              onClick={closeGame}
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition"
            >
              ← Wapas Games Par Jao
            </button>

            {/* INFO SCREEN */}
            {!playingGame ? (
              <>
                <div
                  className={`bg-gradient-to-br ${gameTypeBg[selectedGame.gameType] || gameTypeBg.other} rounded-2xl p-8 mb-6 text-center`}
                >
                  <div className="text-6xl mb-4">
                    {gameTypeIcons[selectedGame.gameType] || "🎮"}
                  </div>
                  <h1 className="text-3xl font-black">{selectedGame.title}</h1>
                  <p className="text-white/70 mt-2">
                    Welcome,{" "}
                    <span className="text-white font-bold">{unlockedUser}</span>
                    ! 🎉
                  </p>
                </div>

                <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 mb-6">
                  <h2 className="font-bold mb-3 text-white/80">
                    Game ke Baare Mein
                  </h2>
                  <p className="text-white/60 leading-relaxed">
                    {selectedGame.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <p className="text-xs text-white/40 mb-1">Category</p>
                      <p className="font-bold">{selectedGame.category}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <p className="text-xs text-white/40 mb-1">Type</p>
                      <p className="font-bold capitalize">
                        {selectedGame.gameType}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setPlayingGame(true)}
                  className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 py-5 rounded-2xl font-bold text-xl hover:opacity-90 transition shadow-2xl shadow-violet-500/30 flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">
                    {gameTypeIcons[selectedGame.gameType] || "🎮"}
                  </span>
                  Play Now — Game Shuru Karo!
                </button>
              </>
            ) : (
              /* ACTUAL GAME */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-black text-xl">{selectedGame.title}</h2>
                    <p className="text-white/40 text-xs capitalize">
                      {selectedGame.gameType} • {selectedGame.category}
                    </p>
                  </div>
                  <button
                    onClick={() => setPlayingGame(false)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/40 hover:text-white transition"
                  >
                    ← Info
                  </button>
                </div>

                {/* ✅ GAME COMPONENT RENDER HOTA HAI YAHAN */}
                <div className="bg-[#0d0d1f] border border-violet-500/20 rounded-2xl overflow-hidden">
                  <GameRenderer game={selectedGame} userName={unlockedUser} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MAIN GAMES LIST PAGE ──────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-full text-violet-400 text-xs font-semibold mb-4">
            🎮 Game Portal
          </div>
          <h1 className="text-4xl font-black mb-3">
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Apni Games
            </span>{" "}
            Khelein
          </h1>
          <p className="text-white/40 max-w-lg mx-auto text-sm">
            Kisi bhi game par click karo aur apna password enter karke access lo
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === cat
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 animate-pulse">🎮</div>
            <p className="text-white/30">Games load ho rahe hain...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🕹️</div>
            <p className="text-white/30 text-lg">Koi games nahi hain abhi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredGames.map((game) => {
              const colors =
                categoryColors[game.category] || categoryColors.Other;
              return (
                <div
                  key={game._id}
                  onClick={() => handleGameClick(game)}
                  className={`group relative bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center z-10">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 backdrop-blur rounded-2xl px-5 py-3 text-center">
                      <div className="text-2xl">🔐</div>
                      <p className="text-xs font-semibold mt-1">
                        Password Enter Karo
                      </p>
                    </div>
                  </div>

                  <div
                    className={`h-28 bg-gradient-to-br ${gameTypeBg[game.gameType] || gameTypeBg.other} relative flex items-center justify-center`}
                  >
                    {game.imageUrl ? (
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className="w-full h-full object-cover opacity-70"
                      />
                    ) : (
                      <span className="text-5xl opacity-80">
                        {gameTypeIcons[game.gameType] || "🎮"}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-sm leading-tight">
                        {game.title}
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${colors.badge}`}
                      >
                        {game.category}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
                      <span>{gameTypeIcons[game.gameType] || "🎮"}</span>
                      <span className="capitalize">{game.gameType}</span>
                      <span className="ml-auto">🔒 Password Required</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const GRID = 20;
const CELL = 20;
const DIRS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

export default function SnakeGame({ userName }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: [1, 0],
    nextDir: [1, 0],
    food: { x: 5, y: 5 },
    score: 0,
    running: false,
    dead: false,
    started: false,
  });
  const [display, setDisplay] = useState({
    score: 0,
    dead: false,
    started: false,
    running: false,
  });
  const intervalRef = useRef(null);

  const randomFood = (snake) => {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
      };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    return pos;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;

    // Background
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);

    // Grid dots
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let x = 0; x < GRID; x++)
      for (let y = 0; y < GRID; y++)
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

    // Food
    ctx.fillStyle = "#f43f5e";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#f43f5e";
    ctx.beginPath();
    ctx.arc(
      s.food.x * CELL + CELL / 2,
      s.food.y * CELL + CELL / 2,
      CELL / 2 - 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    s.snake.forEach((seg, i) => {
      const ratio = 1 - (i / s.snake.length) * 0.5;
      ctx.fillStyle = i === 0 ? "#7c3aed" : `rgba(139,92,246,${ratio})`;
      ctx.shadowBlur = i === 0 ? 10 : 0;
      ctx.shadowColor = "#7c3aed";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;
    const [dx, dy] = s.nextDir;
    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + dx, y: s.snake[0].y + dy };

    // Wall or self collision
    if (
      head.x < 0 ||
      head.x >= GRID ||
      head.y < 0 ||
      head.y >= GRID ||
      s.snake.some((seg) => seg.x === head.x && seg.y === head.y)
    ) {
      s.running = false;
      s.dead = true;
      setDisplay((d) => ({ ...d, dead: true, running: false }));
      draw();
      return;
    }

    s.snake.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score++;
      s.food = randomFood(s.snake);
      setDisplay((d) => ({ ...d, score: s.score }));
    } else {
      s.snake.pop();
    }
    draw();
  }, [draw]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 10 }];
    s.dir = [1, 0];
    s.nextDir = [1, 0];
    s.food = randomFood(s.snake);
    s.score = 0;
    s.running = true;
    s.dead = false;
    s.started = true;
    setDisplay({ score: 0, dead: false, started: true, running: true });
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 130);
    draw();
  }, [tick, draw]);

  useEffect(() => {
    draw();
    const handleKey = (e) => {
      if (DIRS[e.key]) {
        e.preventDefault();
        const s = stateRef.current;
        const nd = DIRS[e.key];
        if (nd[0] !== -s.dir[0] || nd[1] !== -s.dir[1]) s.nextDir = nd;
      }
      if ((e.key === " " || e.key === "Enter") && !stateRef.current.running)
        startGame();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      clearInterval(intervalRef.current);
    };
  }, [tick, draw, startGame]);

  const handleMobile = (key) => {
    const s = stateRef.current;
    if (!s.running) return;
    const nd = DIRS[key];
    if (nd[0] !== -s.dir[0] || nd[1] !== -s.dir[1]) s.nextDir = nd;
  };

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      {/* Score */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-xs text-white/40">Score</p>
          <p className="text-2xl font-black text-violet-400">{display.score}</p>
        </div>
        {display.dead && (
          <div className="text-center">
            <p className="text-xs text-red-400">Game Over!</p>
            <p className="text-sm font-bold">{userName} 😅</p>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/40">
        <canvas ref={canvasRef} width={GRID * CELL} height={GRID * CELL} />

        {!display.started && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <div className="text-5xl">🐍</div>
            <p className="text-white/60 text-sm">Arrow keys se snake chalao</p>
            <p className="text-white/40 text-xs">
              Lal food khao, score badhao!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition"
            >
              ▶ Start Karo
            </button>
          </div>
        )}

        {display.dead && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="text-5xl">💀</div>
            <p className="text-xl font-black">Game Over!</p>
            <p className="text-white/50">
              Score:{" "}
              <span className="text-violet-400 font-bold">{display.score}</span>
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition"
            >
              🔄 Phir Khelo
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        <button
          onTouchStart={() => handleMobile("ArrowUp")}
          onClick={() => handleMobile("ArrowUp")}
          className="col-start-2 w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-xl font-bold active:bg-white/20 hover:bg-white/15 transition select-none"
        >
          ↑
        </button>
        <button
          onTouchStart={() => handleMobile("ArrowLeft")}
          onClick={() => handleMobile("ArrowLeft")}
          className="col-start-1 w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-xl font-bold active:bg-white/20 hover:bg-white/15 transition select-none"
        >
          ←
        </button>
        <button
          onTouchStart={() => handleMobile("ArrowDown")}
          onClick={() => handleMobile("ArrowDown")}
          className="col-start-2 w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-xl font-bold active:bg-white/20 hover:bg-white/15 transition select-none"
        >
          ↓
        </button>
        <button
          onTouchStart={() => handleMobile("ArrowRight")}
          onClick={() => handleMobile("ArrowRight")}
          className="col-start-3 w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-xl font-bold active:bg-white/20 hover:bg-white/15 transition select-none"
        >
          →
        </button>
      </div>
      <p className="text-white/20 text-xs">
        Mobile: buttons use karo | Desktop: arrow keys
      </p>
    </div>
  );
}

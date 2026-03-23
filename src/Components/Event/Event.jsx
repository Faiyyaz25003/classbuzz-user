

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
        <span className="text-white/60 font-mono">{game?.gameType}</span>) It is
        not available right now.
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
                  This game is only for users who have been granted access by
                  the admin. Enter the password you received in your email.
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
                  Go back
                </button>
              </div>
              <p className="text-center text-white/20 text-xs mt-4">
                Didn’t receive the password? Contact the admin.
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
              ← Go back to Games
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
                  Play Now — Start the Game!
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
              Play Your Games
            </span>{" "}
            Khelein
          </h1>
          <p className="text-white/40 max-w-lg mx-auto text-sm">
            Click on any game and enter your password to get access.
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
            <p className="text-white/30">Games are loading...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🕹️</div>
            <p className="text-white/30 text-lg">
              There are no games right now.
            </p>
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
                        Enter the password.
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
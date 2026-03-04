"use client";
import { useState, useEffect } from "react";
import axios from "axios";

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
  puzzle: "🧩",
  trivia: "🧠",
  challenge: "⚡",
  other: "🎮",
};
const gameTypeBg = {
  quiz: "from-pink-600 to-rose-700",
  puzzle: "from-purple-600 to-violet-700",
  trivia: "from-blue-600 to-cyan-700",
  challenge: "from-yellow-600 to-orange-700",
  other: "from-gray-600 to-slate-700",
};

export default function UserGamePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingGame, setPendingGame] = useState(null);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [accessError, setAccessError] = useState("");
  const [unlockedGame, setUnlockedGame] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchAllGames();
  }, []);

  const fetchAllGames = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/games/all");
      // Only show active games
      setGames(res.data.filter((g) => g.isActive));
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (game) => {
    setPendingGame(game);
    setPassword("");
    setAccessError("");
    setShowPasswordModal(true);
  };

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
      setUnlockedGame({ ...res.data.game, userName: res.data.user?.name });
      setShowPasswordModal(false);
      setSelectedGame(res.data.game);
    } catch (err) {
      setAccessError(err.response?.data?.message || "Galat password hai!");
    } finally {
      setVerifying(false);
    }
  };

  const categories = ["All", ...new Set(games.map((g) => g.category))];
  const filteredGames =
    filter === "All" ? games : games.filter((g) => g.category === filter);

  return (
    <div className="min-h-screen bg-[#080814] text-white">
      {/* Password Modal */}
      {showPasswordModal && pendingGame && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div
              className={`bg-gradient-to-r ${gameTypeBg[pendingGame.gameType] || gameTypeBg.other} p-6`}
            >
              <div className="text-4xl text-center mb-2">
                {gameTypeIcons[pendingGame.gameType]}
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

      {/* Unlocked Game View */}
      {selectedGame && unlockedGame && (
        <div className="fixed inset-0 z-50 bg-[#080814] overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-10">
            <button
              onClick={() => {
                setSelectedGame(null);
                setUnlockedGame(null);
              }}
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition"
            >
              ← Wapas Games Par Jao
            </button>

            <div
              className={`bg-gradient-to-br ${gameTypeBg[selectedGame.gameType] || gameTypeBg.other} rounded-2xl p-8 mb-6 text-center`}
            >
              <div className="text-6xl mb-4">
                {gameTypeIcons[selectedGame.gameType]}
              </div>
              <h1 className="text-3xl font-black">{selectedGame.title}</h1>
              <p className="text-white/70 mt-2">
                Welcome,{" "}
                <span className="text-white font-bold">
                  {unlockedGame.userName}
                </span>
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

            {/* Game Play Area */}
            <div className="bg-[#0d0d1f] border border-violet-500/30 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Game Start Karo!</h3>
              <p className="text-white/40 text-sm mb-6">
                Yahan aap apna actual game content / component render kar sakte
                ho
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 rounded-xl font-bold text-lg cursor-pointer hover:opacity-90 transition shadow-lg shadow-violet-500/20">
                ▶ Play Now
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Page */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
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
                  {/* Lock Icon Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center z-10">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 backdrop-blur rounded-2xl px-5 py-3 text-center">
                      <div className="text-2xl">🔐</div>
                      <p className="text-xs font-semibold mt-1">
                        Password Enter Karo
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
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
                        {gameTypeIcons[game.gameType]}
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
                      <span>{gameTypeIcons[game.gameType]}</span>
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

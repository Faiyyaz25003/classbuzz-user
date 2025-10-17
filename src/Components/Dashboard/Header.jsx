import React from "react";

const Header = () => {
  return (
    <header className="relative mb-[20px] rounded-2xl bg-gradient-to-br from-[#0a3d4a] via-[#0f4c5c] to-[#1e88a8] text-white shadow-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-12 bg-gradient-to-b from-teal-300 to-teal-500 rounded-full"></div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-teal-100 mt-1 text-sm font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Welcome back,{" "}
              <span className="font-semibold text-white">Faiyyaz Khan</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <svg
              className="w-5 h-5 text-teal-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-teal-50">
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur"></div>
            <div className="relative bg-gradient-to-br from-teal-400 to-cyan-500 p-0.5 rounded-full">
              <div className="w-10 h-10 bg-[#0f4c5c] rounded-full flex items-center justify-center text-lg font-bold">
                FK
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
    </header>
  );
};

export default Header;

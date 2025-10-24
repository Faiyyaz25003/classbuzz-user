import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Send, X, Play, Pause } from "lucide-react";

export default function VoiceMessage({ onSend, onClose }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else {
      clearInterval(timerInterval);
      if (!audioUrl) setRecordingTime(0);
    }
    return () => clearInterval(timerInterval);
  }, [isRecording, audioUrl]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop());
    setIsRecording(false);
  };

  const handleSendAudio = () => {
    if (audioUrl) {
      onSend({ audio: audioUrl });
      setAudioUrl(null);
      setRecordingTime(0);
      onClose();
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/50 to-black/70 backdrop-blur-md transition-all duration-300">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 relative transform transition-all duration-300 scale-100 hover:shadow-3xl border border-gray-200/50 dark:border-gray-700/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:rotate-90"
        >
          <X size={20} />
        </button>

        {/* Title with Icon */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Mic className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Voice Message
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8">
          {/* Recording Visual */}
          <div className="relative flex flex-col items-center w-full">
            {/* Outer Pulse Ring */}
            {isRecording && (
              <div className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-red-400 to-pink-400 opacity-20 animate-ping"></div>
            )}

            {/* Middle Ring */}
            {isRecording && (
              <div className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-red-500 to-pink-500 opacity-30 animate-pulse"></div>
            )}

            {/* Main Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={audioUrl !== null}
              className={`relative flex items-center justify-center w-32 h-32 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl ${
                isRecording
                  ? "bg-gradient-to-br from-red-500 via-red-600 to-pink-600 animate-pulse"
                  : "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 hover:shadow-green-500/50"
              }`}
            >
              {isRecording ? (
                <Square size={40} fill="white" />
              ) : (
                <Mic size={40} />
              )}
            </button>

            {/* Timer Display */}
            {(isRecording || audioUrl) && (
              <div className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-mono text-2xl rounded-full shadow-lg animate-fade-in">
                {formatTime(recordingTime)}
              </div>
            )}
          </div>

          {/* Animated Waveform */}
          {isRecording && (
            <div className="flex items-end justify-center w-full h-16 gap-1 px-8">
              {Array.from({ length: 30 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-t from-red-500 to-pink-500 w-1.5 rounded-full transition-all"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    animation: `wave 0.8s ease-in-out infinite`,
                    animationDelay: `${idx * 0.03}s`,
                  }}
                ></div>
              ))}
            </div>
          )}

          {/* Audio Preview */}
          {audioUrl && (
            <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-2 border-purple-200 dark:border-purple-700 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-lg">
              {/* Custom Audio Player */}
              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={togglePlayPause}
                  className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-110 transition-transform shadow-lg"
                >
                  {isPlaying ? (
                    <Pause size={24} fill="white" />
                  ) : (
                    <Play size={24} fill="white" />
                  )}
                </button>

                <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-0 transition-all"></div>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={audioUrl}
                className="hidden"
                onEnded={() => setIsPlaying(false)}
              ></audio>

              {/* Send Button */}
              <button
                onClick={handleSendAudio}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Send Voice Message</span>
                <Send
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          )}

          {/* Instruction Text */}
          {!audioUrl && !isRecording && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
              <span className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Ready to record
              </span>
              Tap the microphone to start capturing your voice
            </p>
          )}

          {isRecording && (
            <p className="text-center text-sm text-red-500 dark:text-red-400 font-medium animate-pulse">
              Recording in progress... Tap stop when done
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

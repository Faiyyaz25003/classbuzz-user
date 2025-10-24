"use client";
import React, { useState, useRef } from "react";

export default function VoiceMessage({ onSend, onClose }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSendAudio = () => {
    if (audioUrl) {
      onSend({ audio: audioUrl });
      setAudioUrl(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-6">Voice Message</h2>

        {/* Recording Button */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center w-24 h-24 rounded-full text-white font-semibold text-lg transition-all ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isRecording ? "Stop" : "Record"}
          </button>

          {/* Audio Preview */}
          {audioUrl && (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col items-center gap-3">
              <audio
                controls
                src={audioUrl}
                className="w-full outline-none"
              ></audio>
              <button
                onClick={handleSendAudio}
                className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all"
              >
                Send Voice
              </button>
            </div>
          )}

          {!audioUrl && !isRecording && (
            <p className="text-sm text-slate-500">
              Click "Record" to start capturing your voice
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

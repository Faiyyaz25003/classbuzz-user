

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Attendance = ({ onNavigateToHistory }) => {
  const [punchInTime, setPunchInTime] = useState("--:--:--");
  const [punchOutTime, setPunchOutTime] = useState("--:--:--");
  const [punchInLocation, setPunchInLocation] = useState("Not punched in yet");
  const [punchOutLocation, setPunchOutLocation] = useState(
    "Not punched out yet"
  );
  const [punchInPhoto, setPunchInPhoto] = useState(null);
  const [punchOutPhoto, setPunchOutPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState(null);
  const [stream, setStream] = useState(null);

  const router = useRouter();
  const backendURL = "http://localhost:5000/api/attendance"; // 👈 backend base URL

  const PunchHistory = () => router.push("/PunchinHistory");

  const getCurrentTime = () =>
    new Date().toLocaleTimeString("en-US", { hour12: false });

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            resolve(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
          },
          () => resolve("Location unavailable")
        );
      } else {
        resolve("Location not supported");
      }
    });
  };

  const openCamera = async (type) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      setShowCamera(true);
      setCameraType(type);

      setTimeout(() => {
        const videoElement = document.getElementById("camera-preview");
        if (videoElement) videoElement.srcObject = mediaStream;
      }, 100);
    } catch (error) {
      alert("Camera access denied or not available");
    }
  };

  const capturePhoto = async () => {
    const videoElement = document.getElementById("camera-preview");
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0);
    const photoDataUrl = canvas.toDataURL("image/jpeg");

    if (cameraType === "in") {
      setPunchInPhoto(photoDataUrl);
      await savePunch("in", punchInTime, punchInLocation, photoDataUrl);
    } else {
      setPunchOutPhoto(photoDataUrl);
      await savePunch("out", punchOutTime, punchOutLocation, photoDataUrl);
    }

    closeCamera();
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCameraType(null);
  };

  const handlePunchIn = async () => {
    const time = getCurrentTime();
    const location = await getCurrentLocation();
    setPunchInTime(time);
    setPunchInLocation(location);
    openCamera("in");
  };

  const handlePunchOut = async () => {
    const time = getCurrentTime();
    const location = await getCurrentLocation();
    setPunchOutTime(time);
    setPunchOutLocation(location);
    openCamera("out");
  };

  // ✅ Function to save Punch data to backend
  const savePunch = async (type, time, location, photo) => {
    try {
      const res = await fetch(`${backendURL}/punch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, time, location, photo }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(
          `${type === "in" ? "Punch In" : "Punch Out"} saved successfully!`
        );
      } else {
        alert(`Failed: ${data.message || "Server error"}`);
      }
    } catch (error) {
      console.error("Error saving punch:", error);
      alert("Error saving punch to server");
    }
  };

  const handleRefreshInLocation = async () => {
    const location = await getCurrentLocation();
    setPunchInLocation(location);
  };

  const handleRefreshOutLocation = async () => {
    const location = await getCurrentLocation();
    setPunchOutLocation(location);
  };

  return (
    <div className="min-h-screen mt-[50px] ml-[100px] bg-gray-50 p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <button
            onClick={PunchHistory}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Punch History
          </button>
          <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-1">
            ATTENDANCE
          </h1>
          <div className="text-gray-700 font-medium">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Main Section */}
        <div className="p-6">
          {/* Punch In Section */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-3">
              <label className="text-base font-bold text-gray-900 min-w-[180px]">
                Punch in Time:
              </label>
              <div className="flex-1 p-3 bg-gray-100 rounded-md border border-gray-300 text-base font-mono text-gray-900">
                {punchInTime}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <label className="text-base font-bold text-gray-900 min-w-[180px]">
                Punch in Location:
              </label>
              <div className="flex-1 p-3 bg-gray-100 rounded-md border border-gray-300 text-sm text-gray-700">
                {punchInLocation}
              </div>
              <button
                onClick={handleRefreshInLocation}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                🔄
              </button>
            </div>

            <div className="flex items-start gap-4 mb-3">
              <label className="text-base font-bold text-gray-900 min-w-[180px] pt-2">
                Punch In Photo:
              </label>
              <div className="w-32 h-32 bg-gray-100 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                {punchInPhoto ? (
                  <img
                    src={punchInPhoto}
                    alt="Punch In"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No photo</span>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center my-8">
            <button
              onClick={handlePunchIn}
              className="px-8 py-3 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              Punch In
            </button>
            <button
              onClick={handlePunchOut}
              className="px-8 py-3 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              Punch Out
            </button>
          </div>

          {/* Punch Out Section */}
          <div>
            <div className="flex items-center gap-4 mb-3">
              <label className="text-base font-bold text-gray-900 min-w-[180px]">
                Punch Out Time:
              </label>
              <div className="flex-1 p-3 bg-gray-100 rounded-md border border-gray-300 text-base font-mono text-gray-900">
                {punchOutTime}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <label className="text-base font-bold text-gray-900 min-w-[180px]">
                Punch Out Location:
              </label>
              <div className="flex-1 p-3 bg-gray-100 rounded-md border border-gray-300 text-sm text-gray-700">
                {punchOutLocation}
              </div>
              <button
                onClick={handleRefreshOutLocation}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                🔄
              </button>
            </div>

            <div className="flex items-start gap-4">
              <label className="text-base font-bold text-gray-900 min-w-[180px] pt-2">
                Punch Out Photo:
              </label>
              <div className="w-32 h-32 bg-gray-100 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                {punchOutPhoto ? (
                  <img
                    src={punchOutPhoto}
                    alt="Punch Out"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No photo</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {cameraType === "in" ? "Punch In" : "Punch Out"} Photo
              </h2>
              <button
                onClick={closeCamera}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <video
                id="camera-preview"
                autoPlay
                playsInline
                className="w-full rounded-lg bg-black"
              ></video>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={capturePhoto}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  ⏺ Capture Photo
                </button>
                <button
                  onClick={closeCamera}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

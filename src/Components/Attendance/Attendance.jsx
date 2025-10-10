
// "use client";
// import React, { useState } from "react";

// const Attendance = () => {
//   const [punchInTime, setPunchInTime] = useState("--:--:--");
//   const [punchOutTime, setPunchOutTime] = useState("--:--:--");
//   const [punchInLocation, setPunchInLocation] = useState("Not punched in yet");
//   const [punchOutLocation, setPunchOutLocation] = useState(
//     "Not punched out yet"
//   );
//   const [punchInPhoto, setPunchInPhoto] = useState(null);
//   const [punchOutPhoto, setPunchOutPhoto] = useState(null);
//   const [showCamera, setShowCamera] = useState(false);
//   const [cameraType, setCameraType] = useState(null);
//   const [stream, setStream] = useState(null);
//   const [locationError, setLocationError] = useState(null);

//   const ALLOWED_LOCATION =
//     "Unit No. 6, Alpine Industrial Estate, Military Rd, Bhavani Nagar, Marol, Andheri East, Mumbai, Maharashtra 400059";

//   const getCurrentTime = () => {
//     const now = new Date();
//     return now.toLocaleTimeString("en-US", { hour12: false });
//   };

//   const getCurrentLocation = () => {
//     return new Promise((resolve, reject) => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             const lat = position.coords.latitude;
//             const lon = position.coords.longitude;

//             try {
//               // Reverse geocoding using Nominatim API
//               const response = await fetch(
//                 `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
//                 {
//                   headers: {
//                     "User-Agent": "AttendanceApp/1.0",
//                   },
//                 }
//               );
//               const data = await response.json();

//               if (data && data.display_name) {
//                 resolve(data.display_name);
//               } else {
//                 resolve(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
//               }
//             } catch (error) {
//               // Fallback to coordinates if API fails
//               resolve(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
//             }
//           },
//           (error) => {
//             resolve("Location unavailable");
//           }
//         );
//       } else {
//         resolve("Location not supported");
//       }
//     });
//   };

//   const savePunchToDB = async (type, time, location, photo) => {
//     const response = await fetch("http://localhost:5000/api/attendance/punch", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         studentName: "John Doe", // later dynamic kar sakte ho
//         punchType: type,
//         time,
//         location,
//         photo, // Base64 photo
//       }),
//     });

//     const data = await response.json();
//     console.log("Punch saved:", data);
//   };

//   const checkLocationMatch = (currentLocation) => {
//     // Normalize both locations for comparison
//     const normalize = (str) =>
//       str.toLowerCase().replace(/\s+/g, "").replace(/[,.-]/g, "");

//     const currentNormalized = normalize(currentLocation);
//     const allowedNormalized = normalize(ALLOWED_LOCATION);

//     // Check if the main address components are present
//     const allowedParts = [
//       "alpineindustrialestate",
//       "marol",
//       "andherierast",
//       "400059",
//     ];
//     const matchCount = allowedParts.filter((part) =>
//       currentNormalized.includes(part)
//     ).length;

//     // If at least 3 out of 4 key parts match, consider it valid
//     return matchCount >= 3;
//   };

//   const openCamera = async (type) => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user" },
//         audio: false,
//       });
//       setStream(mediaStream);
//       setShowCamera(true);
//       setCameraType(type);

//       setTimeout(() => {
//         const videoElement = document.getElementById("camera-preview");
//         if (videoElement) {
//           videoElement.srcObject = mediaStream;
//         }
//       }, 100);
//     } catch (error) {
//       alert("Camera access denied or not available");
//       console.error("Camera error:", error);
//     }
//   };

//   const capturePhoto = async () => {
//     const videoElement = document.getElementById("camera-preview");
//     const canvas = document.createElement("canvas");
//     canvas.width = videoElement.videoWidth;
//     canvas.height = videoElement.videoHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(videoElement, 0, 0);
//     const photoDataUrl = canvas.toDataURL("image/jpeg");

//     if (cameraType === "in") {
//       setPunchInPhoto(photoDataUrl);
//       await savePunchToDB("in", punchInTime, punchInLocation, photoDataUrl);
//     } else {
//       setPunchOutPhoto(photoDataUrl);
//       await savePunchToDB("out", punchOutTime, punchOutLocation, photoDataUrl);
//     }

//     closeCamera();
//   };

//   const closeCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//     }
//     setShowCamera(false);
//     setCameraType(null);
//   };

//   const handlePunchIn = async () => {
//     setLocationError(null);
//     const time = getCurrentTime();
//     const location = await getCurrentLocation();
//     setPunchInTime(time);
//     setPunchInLocation(location);

//     // Allow camera from any location
//     openCamera("in");
//   };

//   const handlePunchOut = async () => {
//     setLocationError(null);
//     const time = getCurrentTime();
//     const location = await getCurrentLocation();
//     setPunchOutTime(time);
//     setPunchOutLocation(location);

//     // Allow camera from any location
//     openCamera("out");
//   };

//   const handleRefreshInLocation = async () => {
//     const location = await getCurrentLocation();
//     setPunchInLocation(location);
//   };

//   const handleRefreshOutLocation = async () => {
//     const location = await getCurrentLocation();
//     setPunchOutLocation(location);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
//         <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
//           <div className="flex justify-between items-center mb-2">
//             <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all">
//               Punch History
//             </button>
//             <div className="text-white text-sm font-medium">03/10/2025</div>
//           </div>
//           <h1 className="text-3xl font-bold text-white text-center">
//             ATTENDANCE
//           </h1>
//         </div>

//         <div className="p-6 space-y-6">
//           {locationError && (
//             <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//               <svg
//                 className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                 />
//               </svg>
//               <div>
//                 <h3 className="font-semibold text-red-800">Location Error</h3>
//                 <p className="text-sm text-red-600 mt-1">{locationError}</p>
//                 <p className="text-xs text-red-500 mt-2">
//                   Required: {ALLOWED_LOCATION}
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-700">
//               Punch in Time:
//             </label>
//             <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-lg font-mono text-gray-800">
//               {punchInTime}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-700">
//               Punch in Location:
//             </label>
//             <div className="flex gap-2">
//               <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 break-words">
//                 {punchInLocation}
//               </div>
//               <button
//                 onClick={handleRefreshInLocation}
//                 className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
//               >
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                 >
//                   <path
//                     d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-700">
//               Punch In Photo:
//             </label>
//             <div className="w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
//               {punchInPhoto ? (
//                 <img
//                   src={punchInPhoto}
//                   alt="Punch In"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <svg
//                   width="64"
//                   height="64"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#9ca3af"
//                 >
//                   <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
//                   <path
//                     d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <button
//               onClick={handlePunchIn}
//               className="py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//               >
//                 <circle cx="12" cy="12" r="10" strokeWidth="2" />
//                 <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
//               </svg>
//               Punch In
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//               >
//                 <path
//                   d="M9 18l6-6-6-6"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </button>

//             <button
//               onClick={handlePunchOut}
//               className="py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//               >
//                 <circle cx="12" cy="12" r="10" strokeWidth="2" />
//                 <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
//               </svg>
//               Punch Out
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//               >
//                 <path
//                   d="M9 18l6-6-6-6"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </button>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-700">
//               Punch Out Time:
//             </label>
//             <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-lg font-mono text-gray-800">
//               {punchOutTime}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-700">
//               Punch Out Location:
//             </label>
//             <div className="flex gap-2">
//               <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 break-words">
//                 {punchOutLocation}
//               </div>
//               <button
//                 onClick={handleRefreshOutLocation}
//                 className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
//               >
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                 >
//                   <path
//                     d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-700">
//               Punch Out Photo:
//             </label>
//             <div className="w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
//               {punchOutPhoto ? (
//                 <img
//                   src={punchOutPhoto}
//                   alt="Punch Out"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <svg
//                   width="64"
//                   height="64"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#9ca3af"
//                 >
//                   <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
//                   <path
//                     d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Camera Modal */}
//       {showCamera && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
//             <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 flex justify-between items-center">
//               <h2 className="text-xl font-bold text-white">
//                 {cameraType === "in" ? "Punch In" : "Punch Out"} Photo
//               </h2>
//               <button
//                 onClick={closeCamera}
//                 className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                 >
//                   <path
//                     d="M18 6L6 18M6 6l12 12"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="p-4">
//               <video
//                 id="camera-preview"
//                 autoPlay
//                 playsInline
//                 className="w-full rounded-lg bg-black"
//               ></video>
//               <div className="flex gap-3 mt-4">
//                 <button
//                   onClick={capturePhoto}
//                   className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
//                 >
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <circle cx="12" cy="12" r="10" />
//                   </svg>
//                   Capture Photo
//                 </button>
//                 <button
//                   onClick={closeCamera}
//                   className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Attendance;




"use client";
import React, { useState } from "react";
import PunchHistory from "./PunchinHistory";
import { useRouter } from "next/navigation";
// Attendance Component
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
  const [locationError, setLocationError] = useState(null);
 const router = useRouter();

 const PunchHistory = () => {
   router.push("/PunchinHistory"); // yahan aapka target page ka path
 };


  const ALLOWED_LOCATION =
    "Unit No. 6, Alpine Industrial Estate, Military Rd, Bhavani Nagar, Marol, Andheri East, Mumbai, Maharashtra 400059";

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour12: false });
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
                {
                  headers: {
                    "User-Agent": "AttendanceApp/1.0",
                  },
                }
              );
              const data = await response.json();

              if (data && data.display_name) {
                resolve(data.display_name);
              } else {
                resolve(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
              }
            } catch (error) {
              resolve(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
            }
          },
          (error) => {
            resolve("Location unavailable");
          }
        );
      } else {
        resolve("Location not supported");
      }
    });
  };

  const openCamera = async (type) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      setShowCamera(true);
      setCameraType(type);

      setTimeout(() => {
        const videoElement = document.getElementById("camera-preview");
        if (videoElement) {
          videoElement.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      alert("Camera access denied or not available");
      console.error("Camera error:", error);
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
    } else {
      setPunchOutPhoto(photoDataUrl);
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
    setLocationError(null);
    const time = getCurrentTime();
    const location = await getCurrentLocation();
    setPunchInTime(time);
    setPunchInLocation(location);
    openCamera("in");
  };

  const handlePunchOut = async () => {
    setLocationError(null);
    const time = getCurrentTime();
    const location = await getCurrentLocation();
    setPunchOutTime(time);
    setPunchOutLocation(location);
    openCamera("out");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={PunchHistory}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
            >
              Punch History
            </button>
            <div className="text-white text-sm font-medium">03/10/2025</div>
          </div>
          <h1 className="text-3xl font-bold text-white text-center">
            ATTENDANCE
          </h1>
        </div>

        <div className="p-6 space-y-6">
          {locationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-red-800">Location Error</h3>
                <p className="text-sm text-red-600 mt-1">{locationError}</p>
                <p className="text-xs text-red-500 mt-2">
                  Required: {ALLOWED_LOCATION}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Punch in Time:
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-lg font-mono text-gray-800">
              {punchInTime}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Punch in Location:
            </label>
            <div className="flex gap-2">
              <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 break-words">
                {punchInLocation}
              </div>
              <button
                onClick={handleRefreshInLocation}
                className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Punch In Photo:
            </label>
            <div className="w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {punchInPhoto ? (
                <img
                  src={punchInPhoto}
                  alt="Punch In"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                >
                  <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
                  <path
                    d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handlePunchIn}
              className="py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Punch In
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M9 18l6-6-6-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={handlePunchOut}
              className="py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Punch Out
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M9 18l6-6-6-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Punch Out Time:
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-lg font-mono text-gray-800">
              {punchOutTime}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Punch Out Location:
            </label>
            <div className="flex gap-2">
              <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 break-words">
                {punchOutLocation}
              </div>
              <button
                onClick={handleRefreshOutLocation}
                className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Punch Out Photo:
            </label>
            <div className="w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {punchOutPhoto ? (
                <img
                  src={punchOutPhoto}
                  alt="Punch Out"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                >
                  <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
                  <path
                    d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
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
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
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
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Capture Photo
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
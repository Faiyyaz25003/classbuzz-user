// "use client";
// import { useEffect, useState } from "react";
// import {
//   Video,
//   BookOpen,
//   ArrowLeft,
//   Search,
//   Filter,
//   Plus,
//   X,
//   Calendar,
//   Tag,
//   Play,
//   Clock,
//   TrendingUp,
// } from "lucide-react";

// export default function RecordedLectures() {
//   const [lectures, setLectures] = useState({});
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [showAdminPanel, setShowAdminPanel] = useState(false);

//   // Admin form states
//   const [className, setClassName] = useState("");
//   const [title, setTitle] = useState("");
//   const [subject, setSubject] = useState("");
//   const [date, setDate] = useState("");
//   const [videoUrl, setVideoUrl] = useState("");

//   // Lecture filter states
//   const [filterSubject, setFilterSubject] = useState("");
//   const [filterDate, setFilterDate] = useState("");
//   const [searchTitle, setSearchTitle] = useState("");

//   // Class filter states
//   const [classSearch, setClassSearch] = useState("");
//   const [classSort, setClassSort] = useState("az");

//   // Convert ANY YouTube URL to EMBED
//   const getEmbedUrl = (url) => {
//     if (!url) return "";
//     if (url.includes("embed")) return url;

//     if (url.includes("watch?v=")) {
//       const videoId = url.split("v=")[1]?.split("&")[0];
//       return `https://www.youtube.com/embed/${videoId}`;
//     }

//     if (url.includes("youtu.be")) {
//       const videoId = url.split("youtu.be/")[1]?.split("?")[0];
//       return `https://www.youtube.com/embed/${videoId}`;
//     }

//     return url;
//   };

//   // Fetch lectures
//   const fetchLectures = async () => {
//     const res = await fetch("http://localhost:5000/api/lectures");
//     const data = await res.json();

//     const grouped = {};
//     data.forEach((lec) => {
//       if (!grouped[lec.className]) grouped[lec.className] = [];
//       grouped[lec.className].push(lec);
//     });

//     setLectures(grouped);
//   };

//   useEffect(() => {
//     fetchLectures();
//   }, []);

//   // Add Lecture
//   const addLecture = async () => {
//     if (!className || !title || !videoUrl) {
//       alert("Please fill all required fields");
//       return;
//     }

//     await fetch("http://localhost:5000/api/lectures", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         className,
//         title,
//         subject,
//         date,
//         videoUrl,
//       }),
//     });

//     fetchLectures();
//     setTitle("");
//     setSubject("");
//     setDate("");
//     setVideoUrl("");
//     setClassName("");
//     alert("Lecture Added ✅");
//   };

//   // Lecture filter logic
//   const filteredLectures =
//     lectures[selectedClass]?.filter((vid) => {
//       const matchSubject = filterSubject
//         ? vid.subject?.toLowerCase() === filterSubject.toLowerCase()
//         : true;

//       const matchDate = filterDate ? vid.date === filterDate : true;

//       const matchTitle = searchTitle
//         ? vid.title?.toLowerCase().includes(searchTitle.toLowerCase())
//         : true;

//       return matchSubject && matchDate && matchTitle;
//     }) || [];

//   // Subjects dropdown
//   const subjects =
//     lectures[selectedClass]
//       ?.map((v) => v.subject)
//       .filter(Boolean)
//       .filter((v, i, a) => a.indexOf(v) === i) || [];

//   // Filtered + Sorted Classes
//   const filteredClasses = Object.keys(lectures)
//     .filter((cls) =>
//       classSearch ? cls.toLowerCase().includes(classSearch.toLowerCase()) : true
//     )
//     .sort((a, b) =>
//       classSort === "az" ? a.localeCompare(b) : b.localeCompare(a)
//     );

//   // Stats
//   const totalClasses = Object.keys(lectures).length;
//   const totalLectures = Object.values(lectures).flat().length;

//   return (
//     <div className="ml-[300px] mt-[70px] min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
//       {/* Header */}
//       <div className="bg-white shadow-lg border-b-4 border-indigo-500">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
//               <Video className="text-white" size={28} />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 EduStream
//               </h1>
//               <p className="text-sm text-gray-500">Learn Anytime, Anywhere</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Bar */}
//       {!selectedClass && (
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-indigo-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium">
//                     Total Classes
//                   </p>
//                   <p className="text-3xl font-bold text-indigo-600">
//                     {totalClasses}
//                   </p>
//                 </div>
//                 <BookOpen className="text-indigo-500" size={40} />
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium">
//                     Total Lectures
//                   </p>
//                   <p className="text-3xl font-bold text-purple-600">
//                     {totalLectures}
//                   </p>
//                 </div>
//                 <Play className="text-purple-500" size={40} />
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-pink-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium">
//                     Active Learning
//                   </p>
//                   <p className="text-3xl font-bold text-pink-600">24/7</p>
//                 </div>
//                 <TrendingUp className="text-pink-500" size={40} />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Admin Panel */}
//       {showAdminPanel && (
//         <div className="max-w-4xl mx-auto px-6 py-6">
//           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//               <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//                 <Plus /> Upload New Lecture
//               </h2>
//               <p className="text-indigo-100 text-sm mt-1">
//                 Add a new video lecture to the platform
//               </p>
//             </div>

//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Class Name *
//                 </label>
//                 <input
//                   placeholder="e.g., Mathematics Grade 10"
//                   className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
//                   value={className}
//                   onChange={(e) => setClassName(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Lecture Title *
//                 </label>
//                 <input
//                   placeholder="e.g., Introduction to Algebra"
//                   className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Subject
//                   </label>
//                   <input
//                     placeholder="e.g., Algebra"
//                     className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Date
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   YouTube Video URL *
//                 </label>
//                 <input
//                   placeholder="https://www.youtube.com/watch?v=..."
//                   className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
//                   value={videoUrl}
//                   onChange={(e) => setVideoUrl(e.target.value)}
//                 />
//               </div>

//               <button
//                 onClick={addLecture}
//                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
//               >
//                 <Plus size={20} />
//                 Add Lecture
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CLASS FILTER BAR */}
//       {!selectedClass && (
//         <div className="max-w-7xl mx-auto px-6 pb-6">
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <div className="flex items-center gap-2 mb-4">
//               <Filter className="text-indigo-600" size={20} />
//               <h3 className="font-bold text-gray-800">Filter Classes</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-3.5 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   placeholder="Search class..."
//                   className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
//                   value={classSearch}
//                   onChange={(e) => setClassSearch(e.target.value)}
//                 />
//               </div>

//               <select
//                 className="border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
//                 value={classSort}
//                 onChange={(e) => setClassSort(e.target.value)}
//               >
//                 <option value="az">Sort A–Z</option>
//                 <option value="za">Sort Z–A</option>
//               </select>

//               <button
//                 onClick={() => {
//                   setClassSearch("");
//                   setClassSort("az");
//                 }}
//                 className="bg-gray-100 hover:bg-gray-200 rounded-xl px-4 font-semibold transition"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Class List */}
//       {!selectedClass && (
//         <div className="max-w-7xl mx-auto px-6 pb-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {filteredClasses.length === 0 && (
//               <div className="col-span-full text-center py-16">
//                 <BookOpen className="mx-auto mb-4 text-gray-300" size={64} />
//                 <p className="text-gray-500 text-lg">No classes found</p>
//               </div>
//             )}

//             {filteredClasses.map((cls) => (
//               <div
//                 key={cls}
//                 onClick={() => setSelectedClass(cls)}
//                 className="group bg-white rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden"
//               >
//                 <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex items-center justify-center">
//                   <BookOpen
//                     className="text-white group-hover:scale-110 transition"
//                     size={48}
//                   />
//                 </div>
//                 <div className="p-6">
//                   <h3 className="font-bold text-lg text-gray-800 mb-2">
//                     {cls}
//                   </h3>
//                   <div className="flex items-center gap-2 text-sm text-gray-500">
//                     <Play size={16} />
//                     <span>{lectures[cls].length} Lectures</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Videos + Filters */}
//       {selectedClass && (
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <button
//             onClick={() => setSelectedClass(null)}
//             className="mb-6 flex gap-2 items-center text-indigo-600 font-semibold hover:text-indigo-800 transition"
//           >
//             <ArrowLeft /> Back to Classes
//           </button>

//           <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//             <div className="flex items-center gap-2 mb-4">
//               <Filter className="text-indigo-600" size={20} />
//               <h3 className="font-bold text-gray-800">Filter Lectures</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-3.5 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   placeholder="Search by title"
//                   className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
//                   value={searchTitle}
//                   onChange={(e) => setSearchTitle(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <Tag
//                   className="absolute left-3 top-3.5 text-gray-400"
//                   size={20}
//                 />
//                 <select
//                   className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl focus:border-indigo-500 focus:outline-none transition appearance-none"
//                   value={filterSubject}
//                   onChange={(e) => setFilterSubject(e.target.value)}
//                 >
//                   <option value="">All Subjects</option>
//                   {subjects.map((sub) => (
//                     <option key={sub} value={sub}>
//                       {sub}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="relative">
//                 <Calendar
//                   className="absolute left-3 top-3.5 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type="date"
//                   className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
//                   value={filterDate}
//                   onChange={(e) => setFilterDate(e.target.value)}
//                 />
//               </div>

//               <button
//                 onClick={() => {
//                   setSearchTitle("");
//                   setFilterSubject("");
//                   setFilterDate("");
//                 }}
//                 className="bg-gray-100 hover:bg-gray-200 rounded-xl px-4 font-semibold transition"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>

//           {/* Videos */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {filteredLectures.length === 0 && (
//               <div className="col-span-full text-center py-16">
//                 <Video className="mx-auto mb-4 text-gray-300" size={64} />
//                 <p className="text-gray-500 text-lg">No lectures found</p>
//               </div>
//             )}

//             {filteredLectures.map((vid) => (
//               <div
//                 key={vid._id}
//                 className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
//               >
//                 <div className="aspect-video relative overflow-hidden bg-gray-900">
//                   <iframe
//                     src={`${getEmbedUrl(
//                       vid.videoUrl
//                     )}?controls=1&modestbranding=1&rel=0&iv_load_policy=3&fs=1&playsinline=1`}
//                     className="w-full h-full"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                   />
//                 </div>

//                 <div className="p-6">
//                   <h3 className="font-bold text-xl text-gray-800 mb-3">
//                     {vid.title}
//                   </h3>

//                   <div className="flex flex-wrap gap-2">
//                     {vid.subject && (
//                       <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
//                         <Tag size={14} />
//                         {vid.subject}
//                       </span>
//                     )}

//                     {vid.date && (
//                       <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
//                         <Clock size={14} />
//                         {new Date(vid.date).toLocaleDateString()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import {
  Video,
  BookOpen,
  ArrowLeft,
  Search,
  Filter,
  Plus,
  X,
  Calendar,
  Tag,
  Play,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function RecordedLectures() {
  const [lectures, setLectures] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Admin form states
  const [className, setClassName] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Lecture filter states
  const [filterSubject, setFilterSubject] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  // Class filter states
  const [classSearch, setClassSearch] = useState("");
  const [classSort, setClassSort] = useState("az");

  // Convert ANY YouTube URL to EMBED
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed")) return url;

    if (url.includes("watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  // Fetch lectures
  const fetchLectures = async () => {
    const res = await fetch("http://localhost:5000/api/lectures");
    const data = await res.json();

    const grouped = {};
    data.forEach((lec) => {
      if (!grouped[lec.className]) grouped[lec.className] = [];
      grouped[lec.className].push(lec);
    });

    setLectures(grouped);
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  // Add Lecture
  const addLecture = async () => {
    if (!className || !title || !videoUrl) {
      alert("Please fill all required fields");
      return;
    }

    await fetch("http://localhost:5000/api/lectures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        className,
        title,
        subject,
        date,
        videoUrl,
      }),
    });

    fetchLectures();
    setTitle("");
    setSubject("");
    setDate("");
    setVideoUrl("");
    setClassName("");
    alert("Lecture Added ✅");
  };

  // Lecture filter logic
  const filteredLectures =
    lectures[selectedClass]?.filter((vid) => {
      const matchSubject = filterSubject
        ? vid.subject?.toLowerCase() === filterSubject.toLowerCase()
        : true;

      const matchDate = filterDate ? vid.date === filterDate : true;

      const matchTitle = searchTitle
        ? vid.title?.toLowerCase().includes(searchTitle.toLowerCase())
        : true;

      return matchSubject && matchDate && matchTitle;
    }) || [];

  // Subjects dropdown
  const subjects =
    lectures[selectedClass]
      ?.map((v) => v.subject)
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i) || [];

  // Filtered + Sorted Classes
  const filteredClasses = Object.keys(lectures)
    .filter((cls) =>
      classSearch ? cls.toLowerCase().includes(classSearch.toLowerCase()) : true
    )
    .sort((a, b) =>
      classSort === "az" ? a.localeCompare(b) : b.localeCompare(a)
    );

  // Stats
  const totalClasses = Object.keys(lectures).length;
  const totalLectures = Object.values(lectures).flat().length;

  return (
    <div className="ml-[300px] mt-[70px] min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="mb-[20px] bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
              <Video className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Recorded Lecture
              </h1>
              <p className="text-sm text-gray-500">Learn Anytime, Anywhere</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      {showAdminPanel && (
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus /> Upload New Lecture
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                Add a new video lecture to the platform
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class Name *
                </label>
                <input
                  placeholder="e.g., Mathematics Grade 10"
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lecture Title *
                </label>
                <input
                  placeholder="e.g., Introduction to Algebra"
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    placeholder="e.g., Algebra"
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube Video URL *
                </label>
                <input
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              <button
                onClick={addLecture}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Lecture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLASS FILTER BAR */}
      {!selectedClass && (
        <div className="max-w-7xl mx-auto px-6 pb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="text-indigo-600" size={20} />
              <h3 className="font-bold text-gray-800">Filter Classes</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  placeholder="Search class..."
                  className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                />
              </div>

              <select
                className="border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                value={classSort}
                onChange={(e) => setClassSort(e.target.value)}
              >
                <option value="az">Sort A–Z</option>
                <option value="za">Sort Z–A</option>
              </select>

              <button
                onClick={() => {
                  setClassSearch("");
                  setClassSort("az");
                }}
                className="bg-gray-100 hover:bg-gray-200 rounded-xl px-4 font-semibold transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Class List */}
      {!selectedClass && (
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredClasses.length === 0 && (
              <div className="col-span-full text-center py-16">
                <BookOpen className="mx-auto mb-4 text-gray-300" size={64} />
                <p className="text-gray-500 text-lg">No classes found</p>
              </div>
            )}

            {filteredClasses.map((cls) => (
              <div
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className="group bg-white rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex items-center justify-center">
                  <BookOpen
                    className="text-white group-hover:scale-110 transition"
                    size={48}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {cls}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Play size={16} />
                    <span>{lectures[cls].length} Lectures</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos + Filters */}
      {selectedClass && (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => setSelectedClass(null)}
            className="mb-6 flex gap-2 items-center text-indigo-600 font-semibold hover:text-indigo-800 transition"
          >
            <ArrowLeft /> Back to Classes
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="text-indigo-600" size={20} />
              <h3 className="font-bold text-gray-800">Filter Lectures</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  placeholder="Search by title"
                  className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>

              <div className="relative">
                <Tag
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <select
                  className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl focus:border-indigo-500 focus:outline-none transition appearance-none"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                >
                  <option value="">All Subjects</option>
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Calendar
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="date"
                  className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <button
                onClick={() => {
                  setSearchTitle("");
                  setFilterSubject("");
                  setFilterDate("");
                }}
                className="bg-gray-100 hover:bg-gray-200 rounded-xl px-4 font-semibold transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLectures.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Video className="mx-auto mb-4 text-gray-300" size={64} />
                <p className="text-gray-500 text-lg">No lectures found</p>
              </div>
            )}

            {filteredLectures.map((vid) => (
              <div
                key={vid._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-900">
                  <iframe
                    src={`${getEmbedUrl(
                      vid.videoUrl
                    )}?controls=1&modestbranding=1&rel=0&iv_load_policy=3&fs=1&playsinline=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-3">
                    {vid.title}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {vid.subject && (
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Tag size={14} />
                        {vid.subject}
                      </span>
                    )}

                    {vid.date && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(vid.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
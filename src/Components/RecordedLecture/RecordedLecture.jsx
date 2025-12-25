import { useState } from "react";
import { Video, BookOpen, ArrowLeft, Play, Calendar, Book } from "lucide-react";

export default function RecordedLectures() {
  const [lectures, setLectures] = useState({
    "1st Standard": [
      {
        title: "Introduction to Numbers",
        subject: "Mathematics",
        date: "2024-01-15",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        title: "Basic Addition",
        subject: "Mathematics",
        date: "2024-01-20",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
    "2nd Standard": [
      {
        title: "Multiplication Tables",
        subject: "Mathematics",
        date: "2024-01-18",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  });

  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div className="ml-[300px] mt-[50px] min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* HEADER */}
      <div className="bg-white shadow-md border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-3 rounded-xl">
            <Video className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">EduStream</h1>
            <p className="text-sm text-gray-500">Recorded Lecture Library</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ================= CLASS LIST ================= */}
        {!selectedClass && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-800">
                Available Classes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(lectures).map((cls) => (
                <div
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-indigo-600 p-4 rounded-2xl mb-4">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {cls}
                    </h3>
                    <p className="text-gray-500">
                      {lectures[cls].length} Lectures Available
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= CLASS VIDEOS ================= */}
        {selectedClass && (
          <>
            <button
              onClick={() => setSelectedClass(null)}
              className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg mb-6 shadow border"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Classes
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border">
              <h2 className="text-3xl font-bold text-gray-800">
                {selectedClass}
              </h2>
              <p className="text-gray-600">
                {lectures[selectedClass].length} Recorded Lectures
              </p>
            </div>

            {/* HORIZONTAL VIDEO CARDS */}
            <div className="space-y-6">
              {lectures[selectedClass].map((vid, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden hover:shadow-2xl transition"
                >
                  {/* VIDEO */}
                  <div className="md:w-1/3 w-full bg-black">
                    <iframe
                      src={vid.videoUrl}
                      className="w-full h-[220px]"
                      allowFullScreen
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {vid.title}
                    </h3>

                    <div className="flex items-center gap-6 text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Book className="w-4 h-4" />
                        {vid.subject}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(vid.date).toLocaleDateString("en-GB")}
                      </div>
                    </div>

                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition">
                      <Play className="w-5 h-5" />
                      Watch Lecture
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// import React from 'react'

// const Schedule = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Schedule

'use client';

export default function Schedule() {
  const events = [
    { date: "02", day: "WED", title: "SKILL BUILDING WORKSHOP" },
    { date: "17", day: "WED", title: "UNIVERSITY EXAM TRYOUTS" },
    { date: "22", day: "WED", title: "SOCIAL ACTIVITIES & VOLUNTEER" },
    { date: "25", day: "WED", title: "STUDY ABROAD SIMULATION" },
  ];

  return (
    <main className="bg-white ml-[300px] shadow-lg rounded-lg p-8 w-[350px]">
      <div className="text-gray-700 text-sm font-semibold mb-2">
        SEPTEMBER ‘25
      </div>
      <h1 className="text-3xl font-extrabold text-blue-800 mb-6">SCHEDULE</h1>

      <div className="flex flex-col gap-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-center justify-between border border-blue-800 rounded-md px-4 py-3"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-800 leading-none">
                {event.date}
              </div>
              <div className="text-sm text-gray-500 font-semibold">
                {event.day}
              </div>
            </div>
            <div className="flex-1 ml-4 text-blue-800 font-semibold text-sm">
              {event.title}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

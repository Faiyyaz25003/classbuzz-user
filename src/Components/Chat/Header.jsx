// "use client";

// import React from "react";
// import { Phone, Video, MoreVertical } from "lucide-react";

// export default function Header({ user }) {
//   if (!user) return null;

//   return (
//     <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm">
//       <div className="flex items-center space-x-4">
//         <div className="relative">
//           <img
//             src={user.img}
//             alt={user.name}
//             className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
//           />
//           <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
//         </div>
//         <div>
//           <h2 className="font-bold text-slate-800 text-lg">{user.name}</h2>
//           <p className="text-sm text-blue-500 flex items-center">
//             <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>
//             typing...
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center space-x-2">
//         <button className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
//           <Phone className="w-5 h-5" />
//         </button>
//         <button className="p-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-colors">
//           <Video className="w-5 h-5" />
//         </button>
//         <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
//           <MoreVertical className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";
import { Phone, Video, MoreVertical } from "lucide-react";

export default function Header({ user, onHeaderClick }) {
  if (!user) return null;

  return (
    <div
      className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm cursor-pointer"
      onClick={onHeaderClick} // ✅ opens right panel
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={user.img}
            alt={user.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-lg">{user.name}</h2>
          <p className="text-sm text-blue-500 flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>
            typing...
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-colors">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

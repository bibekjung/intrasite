// import React, { useState } from 'react';

// export default function Sidebar() {
//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <button
//         className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-white focus:outline-none"
//         onClick={() => setOpen(!open)}
//         aria-label="Toggle sidebar"
//       >
//         <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>
//       <aside
//         className={`fixed left-0 top-0 z-40 h-full w-64 bg-white shadow-lg transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         <div className="flex h-16 items-center justify-center border-b">
//           <span className="text-xl font-bold text-blue-600">Logo</span>
//         </div>
//         <nav className="mt-4 flex flex-col gap-2 px-4">
//           <a href="#" className="rounded px-3 py-2 text-gray-700 hover:bg-blue-100">Home</a>
//           <a href="#" className="rounded px-3 py-2 text-gray-700 hover:bg-blue-100">About</a>
//         </nav>
//       </aside>
//     </>
//   );
// }

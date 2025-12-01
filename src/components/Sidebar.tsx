import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Menu,
  LogOut,
  IdCard,
  NotebookPen,
  Scale,
  ChevronDown,
  ChevronRight,
  Shield,
  Projector,
} from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setIsOpen } from '@/slices/sidebarSlice';
import { useLogout } from '@/hooks/useLogout';
import { useState } from 'react';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.sidebar);
  const { handleLogout } = useLogout();

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },

    // {
    //   name: 'Master Setting',
    //   path: '#',
    //   icon: <Settings size={20} />,
    //   children: [
    //     { name: 'User and Roles', path: '/settings/users' },
    //     { name: 'Permission', path: '/settings/roles' },
    //   ],
    // },
    {
      name: 'Authorization',
      path: '#',
      icon: <Shield size={20} />,
      children: [
        {
          name: 'Portal',
          path: '/authorization/portals',
          icon: <Projector size={18} />,
        },
        {
          name: 'Roles',
          path: '/authorization/roles',
          icon: <IdCard size={18} />,
        },
        {
          name: 'Permissions',
          path: '/authorization/permissions',
          icon: <NotebookPen size={18} />,
        },
      ],
    },

    {
      name: 'NID Search',
      path: '/nid-search',
      icon: <IdCard size={20} />,
    },

    {
      name: 'Directory',
      path: '/directory',
      icon: <NotebookPen size={20} />,
    },

    {
      name: 'Policy Document',
      path: '/policies',
      icon: <Scale size={20} />,
    },
  ];

  return (
    <div
      className={`bg-[#283A47] text-white flex flex-col justify-between 
      transition-all duration-300 ${isOpen ? 'w-64' : 'w-24'} 
      h-screen shadow-lg`}
    >
      <div>
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <img
            src={isOpen ? '/kskl.png' : '/logo.png'}
            alt="Logo"
            className={`object-contain transition-all duration-300 ${
              isOpen ? 'h-10 w-auto' : 'h-10 w-10 mx-auto'
            }`}
          />

          <button
            onClick={() => dispatch(setIsOpen(!isOpen))}
            className="text-gray-300 hover:text-white"
          >
            <Menu size={18} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === item.name ? null : item.name)
                    }
                    className={`flex items-center justify-between w-full
                      px-3 py-2 rounded-lg transition-all duration-200
                      text-gray-300 hover:bg-gray-700 hover:text-white`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className={`${isOpen ? 'block' : 'hidden'}`}>
                        {item.name}
                      </span>
                    </div>

                    {isOpen && (
                      <span>
                        {openMenu === item.name ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </span>
                    )}
                  </button>

                  {openMenu === item.name && (
                    <div className="ml-10 mt-1 flex flex-col gap-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 text-sm rounded-md transition
                            ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`
                          }
                        >
                          {child.icon && <span>{child.icon}</span>}
                          <span>{child.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  <span className={`${isOpen ? 'block' : 'hidden'}`}>
                    {item.name}
                  </span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white transition-all"
        >
          <LogOut size={20} />
          <span className={`${isOpen ? 'block' : 'hidden'}`}>Logout</span>
        </button>

        <p
          className={`text-xs text-gray-500 text-center py-2 ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          © 2025 CKYC
        </p>
      </div>
    </div>
  );
}

// import { NavLink } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Settings,
//   Menu,
//   LogOut,
//   IdCard,
//   NotebookPen,
//   Scale,
// } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/store/store';
// import { setIsOpen } from '@/slices/sidebarSlice';
// import { useLogout } from '@/hooks/useLogout';
// import { useState } from 'react';

// export default function Sidebar() {
//   const dispatch = useDispatch();
//   const { isOpen } = useSelector((state: RootState) => state.sidebar);
//   const { handleLogout } = useLogout();
// const [openMenu, setOpenMenu] = useState(null);

// const navItems = [
//   {
//     name: 'Dashboard',
//     path: '/dashboard',
//     icon: <LayoutDashboard size={20} />,
//   },

//   {
//     name: 'Master Setting',
//     path: '/settings',
//     icon: <Settings size={20} />,
//     children: [
//       {
//         name: 'User Management',
//         path: '/settings/users',
//       },
//       {
//         name: 'Role Management',
//         path: '/settings/roles',
//       },
//       {
//         name: 'Department Setup',
//         path: '/settings/departments',
//       },
//     ],
//   },

//   {
//     name: 'NID Search',
//     path: '/nid-search',
//     icon: <IdCard size={20} />
//   },

//   {
//     name: 'Directory',
//     path: '/directory',
//     icon: <NotebookPen size={20} />
//   },

//   {
//     name: 'Policy Document',
//     path: '/policies',
//     icon: <Scale size={20} />
//   },
// ];

//   return (
//     // <div
//     //   className={`bg-gradient-to-b from-gray-900 to-gray-900 text-white flex flex-col justify-between
//     //   transition-all duration-300 ${isOpen ? 'w-64' : 'w-24'} h-screen shadow-lg`}
//     // >

//     <div
//       className={`bg-[#283A47] text-white flex flex-col justify-between
//   transition-all duration-300 ${isOpen ? 'w-64' : 'w-24'} h-screen shadow-lg`}
//     >
//       <div>
//         <div className="flex items-center justify-between p-3 border-b border-gray-700">
//           <img
//             src={isOpen ? '/kskl.png' : '/logo.png'}
//             alt="Logo"
//             className={`object-contain transition-all duration-300 ${
//               isOpen ? 'h-10 w-auto' : 'h-10 w-10 mx-auto'
//             }`}
//           />

//           <button
//             onClick={() => dispatch(setIsOpen(!isOpen))}
//             className="text-gray-300 hover:text-white focus:outline-none"
//             aria-label="Toggle sidebar"
//             title="Toggle sidebar"
//           >
//             <Menu size={18} />
//           </button>
//         </div>

//         {/* <div className="flex items-center justify-between p-3 border-b border-gray-700">
//           <img
//             src="/logo.png"
//             alt="Logo"
//             className={`transition-all object-contain ${isOpen ? 'h-10 w-auto' : 'h-10 w-10'}`}
//           />
//           {isOpen && (
//             <span className="text-sm font-semibold truncate max-w-[13rem]">
//               कर्जा सूचना केन्द्र लिमिटेड
//             </span>
//           )}

//           <button
//             onClick={() => dispatch(setIsOpen(!isOpen))}
//             className="text-gray-300 hover:text-white focus:outline-none"
//             aria-label="Toggle sidebar"
//             title="Toggle sidebar"
//           >
//             <Menu size={18} />
//           </button>
//         </div> */}

//         <nav className="mt-6 flex flex-col gap-1 px-2">

//           {navItems.map((item) => (
//   <div key={item.name}>
//     {/* If item has children → make it expandable */}
//     {item.children ? (
//       <div className="w-full">
//         <button
//           onClick={() => setOpenMenu(item.name)}
//           className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-all duration-200
//             text-gray-300 hover:bg-gray-700 hover:text-white
//           `}
//         >
//           {item.icon}
//           <span className={`${isOpen ? 'block' : 'hidden'}`}>{item.name}</span>
//         </button>

//         {/* Submenu Items */}
//         {openMenu === item.name && (
//           <div className="ml-8 mt-1 flex flex-col gap-1">
//             {item.children.map((child) => (
//               <NavLink
//                 key={child.name}
//                 to={child.path}
//                 className={({ isActive }) =>
//                   `px-3 py-2 text-sm rounded-md transition
//                   ${
//                     isActive
//                       ? 'bg-blue-600 text-white'
//                       : 'text-gray-400 hover:bg-gray-700 hover:text-white'
//                   }`
//                 }
//               >
//                 {child.name}
//               </NavLink>
//             ))}
//           </div>
//         )}
//       </div>
//     ) : (
//       // Normal menu item
//       <NavLink
//         to={item.path}
//         className={({ isActive }) =>
//           `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
//             ${isActive
//               ? 'bg-blue-600 text-white shadow-md'
//               : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
//           `
//         }
//       >
//         {item.icon}
//         <span className={`${isOpen ? 'block' : 'hidden'}`}>{item.name}</span>
//       </NavLink>
//     )}
//   </div>
// ))}

//           {/* {navItems.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
//                 ${
//                   isActive
//                     ? 'bg-blue-600 text-white shadow-md'
//                     : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                 }`
//               }
//             >
//               {item.icon}
//               <span className={`${isOpen ? 'block' : 'hidden'}`}>
//                 {item.name}
//               </span>
//             </NavLink>
//           ))} */}

//         </nav>
//       </div>

//       <div className="border-t border-gray-700">
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white transition-all"
//         >
//           <LogOut size={20} />
//           <span className={`${isOpen ? 'block' : 'hidden'}`}>Logout</span>
//         </button>

//         <p
//           className={`text-xs text-gray-500 text-center py-2 ${
//             isOpen ? 'block' : 'hidden'
//           }`}
//         >
//           © 2025 CKYC
//         </p>
//       </div>
//     </div>
//   );
// }

import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { User, LogOut, KeyRound } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { clearAuth } from '@/slices/authSlice';

export default function MainLayout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef?.current?.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center relative">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-orange-400 to-blue-500 bg-clip-text text-transparent">
            INTRASITE
          </h1>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              <User size={20} />
              <span className="font-medium">Admin</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/profile');
                  }}
                >
                  <User size={18} />
                  <span>View Profile</span>
                </button>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/reset-password');
                  }}
                >
                  <KeyRound size={18} />
                  <span>Reset Password</span>
                </button>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 bg-white overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

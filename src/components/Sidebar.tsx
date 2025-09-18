import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`bg-gray-800 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        <span className={`${isOpen ? 'block' : 'hidden'} font-bold`}>
          My App
        </span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="mt-4 space-y-2">
        <Link
          to="/dashboard"
          className="block px-4 py-2 hover:bg-gray-700 rounded"
        >
          Dashboard
        </Link>
        <Link
          to="/settings"
          className="block px-4 py-2 hover:bg-gray-700 rounded"
        >
          Settings
        </Link>
      </nav>
    </div>
  );
}

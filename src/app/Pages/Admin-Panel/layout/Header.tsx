import { Menu } from 'lucide-react';
import React from 'react';

export default function Header({ openSidebar }: { openSidebar: () => void }) {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-yellow-300">
      <button
        onClick={openSidebar}
        className="p-1 rounded-md lg:hidden hover:bg-gray-200 focus:outline-none"
        aria-label="Open Sidebar"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-white">
          A
        </div>
        <span className="text-sm font-medium">Admin</span>
      </div>
    </header>
  );
}

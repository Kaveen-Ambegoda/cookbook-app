import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({ openSidebar }: { openSidebar: () => void }) {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-yellow-200 border-b">
      <button onClick={openSidebar} className="p-1 rounded-md lg:hidden hover:bg-gray-100">
        <Menu size={20} />
      </button>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-white">A</div>
        <span className="text-sm font-medium">Admin</span>
      </div>
    </header>
  );
}

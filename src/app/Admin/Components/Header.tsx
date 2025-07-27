import { Menu, Bell, User } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Header({ openSidebar }: { openSidebar: () => void }) {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-slate-200 bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center">
        <button
          onClick={openSidebar}
          className="p-2 rounded-md lg:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-slate-600 transition-colors duration-200"
          aria-label="Open Sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="hidden lg:flex items-center ml-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            A
          </div>
          <span className="ml-2 text-lg font-semibold text-slate-800">AdminPanel</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button  onClick={() => router.push('Admin/Layouts/notifications')}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600 relative transition-colors duration-200">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        
        {/* User Profile */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-medium shadow-sm">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-800">Admin User</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
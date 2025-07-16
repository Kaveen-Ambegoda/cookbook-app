import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookOpen, Cookie, ChefHat, Bell, X, LogOut, Home, Settings } from 'lucide-react';
import NavItem from './NavItem';
import Image from 'next/image';

const navItems = [
  { label: 'Dashboard', href: '/Layouts/dashboard', icon: <Home size={20} /> },
  { label: 'User Management', href: '/Layouts/users', icon: <Users size={20} /> },
  { label: 'Recipes', href: '/Layouts/recipes', icon: <BookOpen size={20} /> },
  { label: 'Events', href: '/Layouts/event', icon: <Cookie size={20} /> },
  { label: 'Host Management', href: '/Layouts/hosts', icon: <ChefHat size={20} /> },
  { label: 'Notifications', href: '/Layouts/notifications', icon: <Bell size={20} /> },
];

export default function Sidebar({ isOpen, closeSidebar }: { isOpen: boolean, closeSidebar: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900 bg-opacity-50 z-20 lg:hidden backdrop-blur-sm" 
          onClick={closeSidebar}
        />
      )}
      
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform shadow-xl transition-transform duration-300 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-gradient-to-b from-slate-800 to-slate-900 text-white`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <div className="flex items-center">
            <Image
            src="/logo.jpg"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-md object-cover"
          />
            <span className="ml-2 text-lg font-semibold text-white">CookBook Admin</span>
          </div>
          <button 
            onClick={closeSidebar} 
            className="p-1 rounded-md lg:hidden text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none transition-colors duration-200" 
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-3 py-4">
          <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-medium shadow-sm">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
          
          <nav className="space-y-1">
            <p className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider mt-4 mb-2">Main Menu</p>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <NavItem key={item.href} item={item} active={pathname?.startsWith(item.href)} />
              ))}
            </ul>
            
            <p className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider mt-6 mb-2">Settings</p>
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/Layouts/settings" 
                  className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors duration-200 ${pathname?.startsWith('/Layouts/settings') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                >
                  <Settings size={18} className="mr-3" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="pt-6 mt-6 border-t border-slate-700">
            <button className="flex items-center w-full px-4 py-2.5 text-sm text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white focus:outline-none transition-colors duration-200">
              <LogOut size={18} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, BookOpen, Cookie, ChefHat,Bell, X, LogOut, Home 
} from 'lucide-react';
import NavItem from './NavItem';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <Home size={20} /> },
  { label: 'User Management', href: '/users', icon: <Users size={20} /> },
  { label: 'Recipes', href: '/recipes', icon: <BookOpen size={20} /> },
  { label: 'Events', href: '/event', icon: <Cookie size={20} /> },
  { label: 'Host Management', href: '/hosts', icon: <ChefHat size={20} /> },
  { label: 'Notifications', href: '/notifications', icon: <Bell size={20} /> },
];

export default function Sidebar({ isOpen, closeSidebar }: { isOpen: boolean, closeSidebar: () => void }) {
  const pathname = usePathname();

  return (
    <div
      style={{ backgroundColor: "#FFD476" }}
      className={`fixed inset-y-0 left-0 z-30 w-64 transform shadow-lg transition-all duration-300 
      lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <span className="text-xl font-bold text-stone-900">CookBook Admin</span>
        <button onClick={closeSidebar} className="p-1 rounded-md lg:hidden hover:bg-gray-100">
          <X size={20} />
        </button>
      </div>
      <nav className="px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} active={pathname?.startsWith(item.href)} />
          ))}
        </ul>
        <div className="pt-8 mt-8 border-t">
          <button className="flex items-center w-full px-4 py-3 text-sm text-black rounded-md hover:bg-gray-100">
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

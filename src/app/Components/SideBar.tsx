// src/app/Components/SideBar.tsx
'use client';

import { usePathname } from 'next/navigation';
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaHeart,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

export default function Sidebar() {
  const pathname = usePathname();
  if (pathname?.toLowerCase().startsWith('/pages/login_register')) {
    return null;
  }

  return (
    <aside className="bg-green-800 text-white w-15 fixed top-0 left-0 h-full flex flex-col items-center py-20 space-y-20 transition-all duration-300">
      <FaHome size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaUtensils size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaClipboardList size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaHeart size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaCog size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaSignOutAlt size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
    </aside>
  );
}

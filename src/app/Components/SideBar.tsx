'use client'; // This ensures it's a client component

import { FaHome, FaUtensils, FaClipboardList, FaHeart, FaCog, FaSignOutAlt } from "react-icons/fa";
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="bg-green-800 text-white w-16 fixed top-0 left-0 h-full flex flex-col items-center py-20 space-y-12">
      
      {/* Home Icon */}
      <Link href="/">
        <FaHome size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      </Link>

      {/* Test Page Icon (Manage Recipe for now) */}
      <Link href="\Pages\RecipeManagement\ManageRecipe\ManageRecipe"> {/* Updated to navigate to ManageRecipe page */}
        <FaUtensils size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      </Link>

      {/* Other Icons */}
      <FaClipboardList size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaHeart size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaCog size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaSignOutAlt size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
    </div>
  );
};

export default Sidebar;

"use client";  // Fix: Mark as a client component
import { FaSearch, FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import Image from "next/image"; // Import Image from next.js for optimization

const Navbar = ({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <nav className="bg-yellow-400 px-6 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 w-full z-50">
      {/* Left - Logo and Title */}
      <div className="flex items-center space-x-3">
        <button
          className="text-gray-800 text-xl"
          onClick={() => setIsOpen((prev) => !prev)} // Toggle sidebar visibility
        >
          <FaBars />
        </button>

        <div className="relative w-8 h-8 mr-1 ml-4" >
          <Image 
            src="/image/logo.jpg" 
            alt="Logo"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>

        <h1 className="text-xl font-bold pl-2 text-gray-900">CookBook</h1>

      </div>

      {/* Right - Search Bar and Icons */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 rounded-full border bg-gray-50 border-gray-300 focus:outline-none w-96"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500" />
        </div>

        {/* Notification Icon */}
        <button className="text-gray-800 text-xl">
          <FaBell />
        </button>

        {/* Profile Icon */}
        <button className="text-gray-800 text-xl">
          <FaUserCircle />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

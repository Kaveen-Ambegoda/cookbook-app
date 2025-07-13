'use client';

import React, { useState } from "react";
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaHeart,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import Link from 'next/link';
import MenuPanel from './MenuPanel';
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [showMenuPanel, setShowMenuPanel] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const toggleMenuPanel = () => {
    setShowMenuPanel((prev) => !prev);
  };

  const hideMenuPanel = () => {
    setShowMenuPanel(false);
  };

  const handleIconClick = (label: string) => {
    if (label === "Manage Recipe") {
      if (!isAuthenticated) {
        router.push("/Login_Register/Login");
      } else {
        toggleMenuPanel();
      }
    } else if (label === "Clipboard List" || label === "Favorites") {
      if (!isAuthenticated) {
        router.push("/Login_Register/Login");
      } else {
        router.push(`/${label.replace(" ", "")}`); // Adjust if routes are different
      }
    } else if (label === "Logout") {
      logout();
      router.push("/");
    }
  };

  const iconData = [
    { icon: FaHome, label: "Home", href: "/" },
    { icon: FaUtensils, label: "Manage Recipe", restricted: true },
    { icon: FaClipboardList, label: "Clipboard List", restricted: true },
    { icon: FaHeart, label: "Favorites", restricted: true },
    { icon: FaCog, label: "Settings", href: "/Settings" },
    ...(isAuthenticated ? [{ icon: FaSignOutAlt, label: "Logout" }] : []),
  ];

  return (
    <>
      <div
        className={`bg-green-800 text-white fixed top-0 left-0 h-full flex flex-col items-center py-30 space-y-15 transition-all duration-300 overflow-visible
        ${isOpen ? "w-16" : "w-0"}`}
      >
        {iconData.map(({ icon: Icon, label, href }, i) => {
          const isHovered = hoveredIndex === i;
          const isActive = activeIndex === i;
          const showLabel = isHovered || (!isHovered && isActive);

          const iconElement = (
            <Icon
              size={24}
              className="cursor-pointer hover:text-yellow-400 transition-all duration-300"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleIconClick(label)}
            />
          );

          return href ? (
            <Link
              key={i}
              href={href}
              className="relative flex items-center justify-center w-full"
            >
              {iconElement}
              {showLabel && (
                <span className="absolute left-full ml-2 bg-black whitespace-nowrap text-white text-xs rounded px-2 py-1 z-50">
                  {label}
                </span>
              )}
            </Link>
          ) : (
            <div
              key={i}
              className="relative flex items-center justify-center w-full"
            >
              {iconElement}
              {showLabel && (
                <span className="absolute left-full ml-2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 z-50">
                  {label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {showMenuPanel && (
        <div className="fixed top-16 left-16 h-[calc(100%-4rem)] z-50">
          <MenuPanel onHideMenuPanel={hideMenuPanel} />
        </div>
      )}
    </>
  );
};

export default Sidebar;

'use client'; // This ensures it's a client component

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

interface SidebarProps {
  isOpen: boolean;
}

const iconData = [
  { icon: FaHome, label: "Home", href: "/" },
  { icon: FaUtensils, label: "Manage Recipe" },
  { icon: FaClipboardList, label: "Clipboard List" },
  { icon: FaHeart, label: "Favorites" },
  { icon: FaCog, label: "Settings" },
  { icon: FaSignOutAlt, label: "Logout" },
];

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [showMenuPanel, setShowMenuPanel] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleMenuPanel = () => {
    setShowMenuPanel((prev) => !prev);
  };

  const hideMenuPanel = () => {
    setShowMenuPanel(false);
  };

  const handleIconClick = (index: number) => {
    if (index === 1) {
      toggleMenuPanel();
      setActiveIndex(index);
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
      hideMenuPanel();
      if (activeIndex === 1) {
        setActiveIndex(null);
      }
      setActiveIndex(null);
    }
  };

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
              onClick={() => handleIconClick(i)}
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
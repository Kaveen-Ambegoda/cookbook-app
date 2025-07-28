'use client';

import React from "react";
import toast from "react-hot-toast";
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaHeart,
  FaSignOutAlt,
  FaTrophy,
  FaBell, // Replaced FaCog with FaBell for Notifications
} from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/app/context/authContext";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}

const SideBar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: FaHome, label: "Home", route: "/" },
    {
      icon: FaUtensils,
      label: "Manage Recipe",
      route: "/RecipeManagement/ManageRecipe/ManageRecipe",
    },
    {
      icon: FaHeart,
      label: "Favorites",
      route: "/RecipeManagement/FavoritePage",
    },
    { icon: FaClipboardList, label: "Recipe Forum", route: "/Forum" },
    { icon: FaTrophy, label: "Recipe Challenge", route: "/RecipeChallenge" },
    // ✅ Notifications replaces Settings
    { icon: FaBell, label: "Notifications", route: "/NotificationPage" },
  ];

  const logoutItem = isAuthenticated
    ? { icon: FaSignOutAlt, label: "LogOut", route: "/" }
    : null;

  const handleClick = (
    item: typeof navItems[0] | (typeof logoutItem)
  ) => {
    if (
      !isAuthenticated &&
      item &&
      [
        "Manage Recipe",
        "Recipe Forum",
        "Favorites",
        "Recipe Challenge",
        "Notifications",
      ].includes(item.label)
    ) {
      toast.error("Please login to access this feature.");
      router.push("/Login_Register/Login");
      return;
    }
    if (item && item.label.toLowerCase() === "logout") {
      logout();
      toast.success("You have successfully logged out.");
      router.push(item.route);
    } else if (item) {
      router.push(item.route);
    }
  };

  return (
    <div
      className={`
        fixed top-16 left-0 h-full bg-green-800 text-white
        flex flex-col justify-between items-center
        transition-all duration-300
        ${isOpen ? "w-16" : "w-0"}
      `}
    >
      {/* Navigation Icons */}
      <div className="flex flex-col items-center py-8 space-y-8">
        {navItems.map((item, idx) => {
          const IconComponent = item.icon;
          const isActive =
            pathname === item.route ||
            pathname.startsWith(item.route + "/");
          return (
            <Link
              key={idx}
              href={item.route}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item);
              }}
              className="group relative flex items-center justify-center w-full py-3 cursor-pointer"
            >
              <IconComponent
                className={`text-2xl transition-colors duration-200 ${
                  isActive
                    ? 'text-yellow-400'
                    : 'text-white group-hover:text-yellow-300'
                }`}
              />
              {/* Tooltip */}
              <span
                className="
                  absolute top-full left-1/2 transform -translate-x-1/2
                  mt-0 translate-y-0
                  px-2 py-1 text-white text-xs rounded-lg
                  opacity-0 group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-200 ease-out shadow-lg
                  pointer-events-none
                "
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Logout at Bottom */}
      {logoutItem && (
        <div className="flex flex-col items-center mb-8">
          <Link
            href={logoutItem.route}
            onClick={(e) => {
              e.preventDefault();
              handleClick(logoutItem);
            }}
            className="group relative flex items-center justify-center w-full py-3 cursor-pointer"
          >
            {/* Logout Icon with hover color change */}
            {React.createElement(logoutItem.icon, {
              className: `mb-24 text-2xl transition-colors duration-200
                text-white group-hover:text-red-500`,
            })}

            {/* Tooltip (popup) on hover */}
            <span
              className="
                absolute top-full left-1/2 transform -translate-x-1/2
                mt-2 px-2 py-1 text-white text-xs rounded-md
                opacity-0 group-hover:opacity-100 group-hover:translate-y-1
                transition-all duration-200 ease-out shadow-lg
                pointer-events-none z-10
              "
            >
              {logoutItem.label}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SideBar;

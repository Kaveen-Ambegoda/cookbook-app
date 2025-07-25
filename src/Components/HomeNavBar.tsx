// HomeNavBar.tsx
import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeNavBarProps {
  onFilterClick: () => void;
}

const HomeNavBar: React.FC<HomeNavBarProps> = ({ onFilterClick }) => {
  const navLinks = [
    "All Recipes",
    "Basic Courses",
    "Snacks",
    "Vegetarian",
    "Seasonals",
    "Desserts",
    "Seafood",
    "Quick and Easy",
  ];

  return (
    <nav className="bg-gray-100 border-b border-gray-300 px-0 py-3 flex items-center justify-between flex-wrap gap-x-6 text-sm font-semibold">
      <div className="flex flex-wrap gap-x-6">
        {navLinks.map((link, index) => (
          <a
            key={index}
            href="#"
            className={`hover:text-orange-500 ${
              link === "All Recipes" ? "text-orange-600 underline" : "text-black"
            }`}
          >
            {link}
          </a>
        ))}
      </div>
      <Button
        variant="outline"
        className="flex items-center gap-4 text-sm bg-orange-600 hover:bg-green-700 hover:text-white text-white"
        onClick={onFilterClick}
      >
        <Filter className="w-4 h-4" />
        Filter
      </Button>
    </nav>
  );
};

export default HomeNavBar;

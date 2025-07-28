import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar"; // Ensure this path is correct

interface HomeNavBarProps {
  onFilterClick: () => void;
  mealTypeOptions: string[];
  selectedMealType: string | null;
  onMealTypeClick: (mealType: string | null) => void;
}

const HomeNavBar: React.FC<HomeNavBarProps> = ({
  onFilterClick,
  mealTypeOptions,
  selectedMealType,
  onMealTypeClick,
}) => {
  return (
    <nav className="bg-gray-100 border-b border-gray-300 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm font-semibold">
      {/* Meal type links */}
      <div className="flex flex-wrap gap-x-6">
        <a
          href="#"
          onClick={() => onMealTypeClick(null)}
          className={`hover:text-orange-500 ${
            selectedMealType === null ? "text-orange-600 underline" : "text-black"
          }`}
        >
          All Recipies
        </a>
        {mealTypeOptions.map((mealType, index) => (
          <a
            key={index}
            href="#"
            onClick={() => onMealTypeClick(mealType)}
            className={`hover:text-orange-500 ${
              selectedMealType === mealType ? "text-orange-600 underline" : "text-black"
            }`}
          >
            {mealType}
          </a>
        ))}
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        <div className="w-full sm:w-96">
          <SearchBar />
        </div>
        <Button
          variant="outline"
          className="bg-orange-600 hover:bg-green-700 hover:text-white text-white"
          onClick={onFilterClick}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
    </nav>
  );
};

export default HomeNavBar;

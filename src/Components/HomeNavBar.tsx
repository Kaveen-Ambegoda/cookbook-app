// HomeNavBar.tsx
import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <nav className="bg-gray-100 border-b border-gray-300 px-0 py-3 flex items-center justify-between flex-wrap gap-x-6 text-sm font-semibold">
      <div className="flex flex-wrap gap-x-6 pl-4">
        <a
          href="#"
          onClick={() => onMealTypeClick(null)}
          className={`hover:text-orange-500 ${
            selectedMealType === null ? "text-orange-600 underline" : "text-black"
          }`}
        >
          All Recipes
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

      <Button
        variant="outline"
        className="flex items-center gap-4 text-sm bg-orange-600 hover:bg-green-700 hover:text-white text-white mr-4"
        onClick={onFilterClick}
      >
        <Filter className="w-4 h-4" />
        Filter
      </Button>
    </nav>
  );
};

export default HomeNavBar;

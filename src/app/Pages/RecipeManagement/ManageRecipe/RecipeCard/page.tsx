import React from 'react';

interface Recipe {
  title: string;
  image: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export default function RecipeCard({ recipe, onUpdate, onDelete }: RecipeCardProps) {
  return (
    <div className="border rounded-xl overflow-hidden shadow hover:shadow-md transition bg-white flex flex-col">
      
      <div className="p-4 flex flex-col items-center">
        <img
          src={recipe.image || "/image/default.jpg"}
          alt={recipe.title}
          className="rounded-full w-24 h-24 object-cover"
        />
        <h3 className="text-center mt-3 font-semibold text-lg">{recipe.title}</h3>
      </div>

      <div className="flex items-center justify-between bg-orange-100 px-4 py-2 mt-auto">
        <button
          onClick={onUpdate}
          className="text-orange-600 font-semibold hover:underline flex items-center gap-1"
        >
          ✏️ Update recipe
        </button>

        <button
          onClick={onDelete}
          className="text-red-500 hover:scale-110 transition text-xl"
        >
          🗑
        </button>

      </div>
    </div>
  );
}

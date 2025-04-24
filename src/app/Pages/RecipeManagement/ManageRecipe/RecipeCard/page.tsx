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
    <div className="border p-4 rounded-xl shadow hover:shadow-md transition bg-white">
      <img
        src="/image/cake.png"  // Replaced image with cake.jpg
        alt={recipe.title}
        className="rounded-full w-24 h-24 mx-auto object-cover"
      />
      <h3 className="text-center mt-3 font-semibold text-lg">{recipe.title}</h3>

      <div className="flex justify-between mt-4 px-2">
        <button
          onClick={onUpdate}
          className="text-orange-600 hover:underline"
        >
          Update
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:scale-110 transition"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

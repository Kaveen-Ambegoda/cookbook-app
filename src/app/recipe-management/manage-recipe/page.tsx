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

function RecipeCard({ recipe, onUpdate, onDelete }: RecipeCardProps) {
  return (
    <div className="border p-4 rounded-xl shadow hover:shadow-md transition bg-white">
      <img
        src={recipe.image}
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

const recipes: Recipe[] = new Array(6).fill({
  title: "Classic Spaghetti Aglio e Olio",
  image: "/images/spaghetti.jpg",
});

export default function ManageRecipes() {
  return (
    <div className="p-4">

      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage your Recipies</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4">
        
        <div className="flex items-center justify-center border-dashed border-2 rounded-lg h-48 cursor-pointer">
          + Add new recipe
        </div>
        
        {recipes.map((r, index) => (
          <RecipeCard key={index} recipe={r} />
        ))}
      </div>

     </div>
  );
}

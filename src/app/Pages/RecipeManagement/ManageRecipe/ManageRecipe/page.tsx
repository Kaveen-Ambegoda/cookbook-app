"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Recipe from '../RecipeCard/page';

interface RecipeType {
  id: number;
  title: string;
  img: string;
}

const recipesData: RecipeType[] = [
  { id: 1, title: "Classic Spaghetti Aglio e Olio", img: "/image/spaghetti.jpg" },
  { id: 2, title: "Delicious Pizza", img: "/image/pizza.jpg" },
  { id: 3, title: "Fresh Salad", img: "/image/salad.jpg" },
  { id: 4, title: "Tasty Noodles", img: "/image/noodles.jpg" },
  { id: 5, title: "Egg Delight", img: "/image/egg.jpg" },
  { id: 6, title: "Rice Bowl", img: "/image/rice.jpg" },
];

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState(recipesData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<RecipeType | null>(null);

  const handleDeleteClick = (recipe: RecipeType) => {
    setRecipeToDelete(recipe);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (recipeToDelete) {
      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
      setRecipeToDelete(null);
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setRecipeToDelete(null);
    setShowConfirm(false);
  };

  return (
    <div className="pt-16 pl-18 p-4">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-green-800">Manage your Recipes</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4">
        {/* Updated Add New Recipe Box */}
        <Link href="/Pages/RecipeManagement/ManageRecipe/CreateRecipeForm">
          <div className="border pt-14 pb-14 rounded-xl shadow hover:shadow-md transition bg-white flex flex-col items-center justify-center cursor-pointer">
            <div className="rounded-full w-20 h-20 bg-gray-100 flex items-center justify-center text-4xl text-gray-400">
              +
            </div>
            <h3 className="text-center mt-3 font-semibold text-lg">Add New</h3>
          </div>
        </Link>

        {/* Recipe Cards */}
        {recipes.map((recipe) => (
          <Recipe
            key={recipe.id}
            recipe={recipe}
            onDelete={() => handleDeleteClick(recipe)}
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete "{recipeToDelete?.title}"?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

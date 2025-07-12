"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import RecipeCard from '@/components/RecipeCard';
import SimpleFooter from '@/components/SimpleFooter';

interface RecipeType {
  id: number;
  title: string;
  image: string;
}

export default function ManageRecipes() {
  const router = useRouter(); 

  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<RecipeType | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated. Please log in.");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/myRecipes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleUpdateClick = (recipe: RecipeType) => {
    router.push(`UpdateRecipeForm?id=${recipe.id}`);
  };

  const handleDeleteClick = (recipe: RecipeType) => {
    setRecipeToDelete(recipe);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (recipeToDelete) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("User not authenticated. Please log in.");
          return;
        }

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/deleteRecipe/${recipeToDelete.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
        setRecipeToDelete(null);
        setShowConfirm(false);
        toast.success("Recipe deleted successfully!");
      } catch (error) {
        console.error("Failed to delete recipe:", error);
        toast.error("Failed to delete recipe. Please try again.");
      }
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

      {/* Loading and Error Messages */}
      {isLoading && (
        <p className="text-center text-gray-500 animate-pulse">
          Loading recipes...
        </p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4">
          <Link href="/RecipeManagement/ManageRecipe/CreateRecipeForm">
            <div className="border pt-14 pb-14 rounded-xl shadow hover:shadow-md transition bg-white flex flex-col items-center justify-center cursor-pointer">
              <div className="rounded-full w-20 h-20 bg-gray-100 flex items-center justify-center text-4xl text-gray-400">
                +
              </div>
              <h3 className="text-center mt-3 font-semibold text-lg">
                Add New
              </h3>
            </div>
          </Link>

          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onUpdate={() => handleUpdateClick(recipe)}
              onDelete={() => handleDeleteClick(recipe)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete "{recipeToDelete?.title}"?
            </p>
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

      <SimpleFooter />
    </div>
  );
}

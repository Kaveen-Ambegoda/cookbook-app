// Location: The file containing your ManageRecipes component.

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import API from "@/app/utils/axiosInstance"; // Make sure this path is correct
import toast from 'react-hot-toast';
import RecipeCard from '@/Components/RecipeCard';
import SimpleFooter from '@/Components/SimpleFooter';

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
        // --- THIS IS THE CRITICAL FIX ---
        // We now use a simple, relative path. Axios will automatically
        // prepend "http://localhost:5007", resulting in the correct URL.
        // The headers are also handled by the interceptor, so they are removed from here.
        const response = await API.get('/api/Recipe/myRecipes');
        setRecipes(response.data);
      } catch (error: any) {
        console.error("Error fetching recipes:", error);
        if (error.response?.status === 401) {
          setError("User not authenticated. Please log in.");
          toast.error("User not authenticated. Please log in.");
        } else {
          setError("Failed to load recipes. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleUpdateClick = (recipe: RecipeType) => {
    // Assuming your update form is at this path
    router.push(`/RecipeManagement/ManageRecipe/UpdateRecipeForm?id=${recipe.id}`);
  };

  const handleDeleteClick = (recipe: RecipeType) => {
    setRecipeToDelete(recipe);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (recipeToDelete) {
      try {
        // --- THIS IS THE SECOND CRITICAL FIX ---
        // The delete call is also simplified to a relative path.
        await API.delete(`/api/Recipe/${recipeToDelete.id}`);
        setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
        setRecipeToDelete(null);
        setShowConfirm(false);
        toast.success("Recipe deleted successfully!");
      } catch (error: any) {
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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-16 pl-18 p-4">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Manage your Recipes</h2>
        </div>

        {isLoading && (
          <p className="text-center text-gray-500 animate-pulse">
            Loading recipes...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
        )}

        {!isLoading && !error && recipes.length === 0 && (
           <div className="text-center py-10">
                <p className="text-gray-600">You haven't created any recipes yet.</p>
                <Link href="/RecipeManagement/ManageRecipe/CreateRecipeForm">
                    <span className="text-green-600 hover:underline cursor-pointer">Add your first recipe!</span>
                </Link>
           </div>
        )}

        {!isLoading && !error && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4">
            <Link href="/RecipeManagement/ManageRecipe/CreateRecipeForm">
              <div className="border pt-14 pb-14 rounded-xl shadow hover:shadow-md transition bg-white flex flex-col items-center justify-center cursor-pointer h-full">
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
      </main>

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
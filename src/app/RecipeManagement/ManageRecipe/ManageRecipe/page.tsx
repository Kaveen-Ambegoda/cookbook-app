// Location: The file containing your ManageRecipes component.

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import RecipeCard from "@/Components/RecipeCard"; 
import SimpleFooter from "@/Components/SimpleFooter";
import API from "@/app/utils/axiosInstance";

interface RecipeType {
  id: number;
  title: string;
  image: string | null;
  description?: string;
  cookingTime?: number;
  difficulty?: string;
  createdAt?: string;
}

export default function ManageRecipes() {
  const router = useRouter();

  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<RecipeType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

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
          headers: { Authorization: `Bearer ${token}` },
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

  const handleViewClick = (recipe: RecipeType) => {
    router.push(`/RecipeManagement/ManageRecipe/ViewRecipe/${recipe.id}`);
  };

  const handleUpdateClick = (recipe: RecipeType) => {
    router.push(`/RecipeManagement/ManageRecipe/UpdateRecipeForm?id=${recipe.id}`);
  };

  const handleDeleteClick = (recipe: RecipeType) => {
    setRecipeToDelete(recipe);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!recipeToDelete) return;

    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not authenticated. Please log in.");
        setIsDeleting(false);
        return;
      }

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/deleteRecipe/${recipeToDelete.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
      toast.success(`"${recipeToDelete.title}" deleted successfully!`);
      setShowConfirm(false);
      setRecipeToDelete(null);
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      toast.error("Failed to delete recipe. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setRecipeToDelete(null);
    setShowConfirm(false);
  };

  return (
    <div className=" pt-16 p-8">
      <main className="flex-grow max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-green-800 mb-8 mt-6">Manage Your Recipes</h2>

        {isLoading && (
          <p className="text-center text-gray-500 animate-pulse">Loading recipes...</p>
        )}

        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}

        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-10 w-full">
              <Link href="/RecipeManagement/ManageRecipe/CreateRecipeForm" className="group">
                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition cursor-pointer flex flex-col justify-center items-center min-h-[280px]">
                  <div className="rounded-full w-20 h-20 bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <span className="text-green-600 text-4xl font-bold">+</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 group-hover:text-green-700">Add New Recipe</h3>
                  <p className="text-sm text-gray-500 mt-2">Share your culinary creation</p>
                </div>
              </Link>

              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onView={() => handleViewClick(recipe)}
                    onUpdate={() => handleUpdateClick(recipe)}
                    onDelete={() => handleDeleteClick(recipe)}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-600 mt-10">
                  No recipes found. Create your first recipe!
                </p>
              )}
            </div>
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Delete Recipe</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete <strong>"{recipeToDelete?.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Recipe"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <SimpleFooter />
    </div>
  );
}
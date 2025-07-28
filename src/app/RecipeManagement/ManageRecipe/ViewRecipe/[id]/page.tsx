"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/utils/axiosInstance";
import FeedbackHighlight from '@/components/FeedbackHighlight';
import SimpleFooter from "@/components/SimpleFooter";

interface Recipe {
  id: number;
  title: string;
  image: string;
  cookingTime: number;
  portion: number;
  ingredients?: string | string[];
  instructions?: string | string[];
  calories?: number;
  protein?: number;
  carbohydrates?: number;
}

const ViewRecipe: React.FC = () => {
  const params = useParams();
  const { id } = params;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await API.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/${id}`);
        const data = response.data;

        if (typeof data.ingredients === "string") {
          data.ingredients = data.ingredients.split("\n").map((item: string) => item.trim());
        }

        if (typeof data.instructions === "string") {
          data.instructions = data.instructions.split("\n").map((item: string) => item.trim());
        }

        setRecipe(data);
      } catch {
        setError("Failed to fetch recipe details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading recipe details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!recipe) {
    return <div className="p-6 text-center">No recipe found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 font-sans bg-yellow-50">
      <div className="bg-green-200 p-6 rounded-xl mt-10">
        <h1 className="text-3xl font-bold text-center text-green-900 mb-8">
          {recipe.title}
        </h1>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <img
              src={recipe.image || "/image/default.jpg"}
              alt={recipe.title}
              className="w-[250px] h-[200px] object-cover rounded-lg shadow-md"
            />
            <div className="mt-6 flex gap-4">
              <button className="bg-red-400 text-white p-2 px-4 rounded-full w-20 hover:bg-red-500 transition">
                ❤️
              </button>
              <button className="bg-orange-400 text-white p-2 px-4 rounded-full w-20 hover:bg-orange-500 transition">
                🔗
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex flex-col justify-center self-center gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-400 shadow">
              <h3 className="text-orange-600 font-bold mb-2">General Info</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li><strong>Total Time:</strong> {recipe.cookingTime} minutes</li>
                <li><strong>Portion Size:</strong> {recipe.portion} servings</li>
                <li><strong>Category:</strong> Main course</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow">
              <h3 className="text-green-600 font-bold mb-2">Nutrition</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li><strong>Calories:</strong> {recipe.calories ?? 0}</li>
                <li><strong>Protein:</strong> {recipe.protein ?? 0}g</li>
                <li><strong>Carbohydrates:</strong> {recipe.carbohydrates ?? 0}g</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Ingredients:</h2>
        <ul className="space-y-1 text-gray-800">
          {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))
          ) : (
            <li>No ingredients listed.</li>
          )}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
        <ol className="space-y-2 text-gray-800">
          {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
            recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))
          ) : (
            <li>No instructions provided.</li>
          )}
        </ol>
      </div>

      <div className="py-12">
        <FeedbackHighlight recipe={recipe} />
      </div>

      <div><SimpleFooter/></div>

    </div>
  );
};

export default ViewRecipe;

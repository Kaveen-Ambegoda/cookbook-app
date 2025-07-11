'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface Recipe {
  id: number;
  title: string;
  image?: string;
  // Add other fields if needed, but make sure they match the backend DTO
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get('keyword');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!keyword) return;

      setLoading(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/search?keyword=${encodeURIComponent(keyword)}`;
        console.log("Fetching:", apiUrl);
        const response = await axios.get(apiUrl);
        setRecipes(response.data);

          if (response.data.length === 1) {
            const recipeId = response.data[0].id;
            router.push(`/RecipeManagement/ManageRecipe/ViewRecipe/${recipeId}`);
          }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [keyword, router]);

  return (
    <div className="p-6 mt-20">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for: <em>{keyword}</em>
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white shadow p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
              {recipe.image && (
                <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover rounded mb-2" />
              )}
              {/* Add other fields if needed */}
            </div>
          ))}
        </div>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
}

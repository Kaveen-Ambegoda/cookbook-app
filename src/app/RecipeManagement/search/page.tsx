'use client';
import HomeRecipeCard from '@/components/HomeRecipeCard';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface Recipe {
  id: number;
  title: string;
  image: string;
  cookingTime: number;
  portion: number;
  favorites?: number;
  reviews?: number;
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
            <HomeRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p>No recipes found.</p>
      )}

    </div>
  );
}

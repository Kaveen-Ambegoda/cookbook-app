"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import HomeRecipeCard from "@/components/HomeRecipeCard";
import SimpleFooter from "@/components/SimpleFooter";

interface Recipe {
  id: number;
  title: string;
  image: string;
  cookingTime: number;
  portion: number;
  favorites?: number;
  reviews?: number;
}

const FavoritePage = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view your favorites.");
        router.push("/login"); // change this to your actual login route
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/FavoriteRecipes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites(response.data);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
        toast.error("Could not load favorite recipes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [router]);

  return (
    <div>
      <h1 className="text-green-700 text-2xl font-semibold pl-4 pt-16">My Favorite Recipes</h1>

      {isLoading ? (
        <p className="text-center text-gray-500 py-8">Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <p className="text-center text-gray-600 py-8">No favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4">
          {favorites.map((recipe) => (
            <HomeRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      <SimpleFooter />
    </div>
  );
};

export default FavoritePage;

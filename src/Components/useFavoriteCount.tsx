import { useEffect, useState } from "react";
import axios from "axios";

export function useFavoriteCount(recipeId: number) {
  const [favoriteCount, setFavoriteCount] = useState<number>(0);

  useEffect(() => {
    const fetchFavoriteCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/FavoriteRecipes/count/${recipeId}`
        );
        setFavoriteCount(response.data);
      } catch (error) {
        console.error("Failed to fetch favorite count", error);
        setFavoriteCount(0);
      }
    };

    fetchFavoriteCount();
  }, [recipeId]);

  return favoriteCount;
}

import { useState, useEffect } from "react";

export function useIsFavorited(recipeId: number) {
  const [isFavorited, setIsFavorited] = useState(false);

  const fetchStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/FavoriteRecipes/is-favorited/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setIsFavorited(data.isFavorited);
  };

  useEffect(() => {
    fetchStatus();
  }, [recipeId]);

  return { isFavorited, setIsFavorited, refresh: fetchStatus };
}

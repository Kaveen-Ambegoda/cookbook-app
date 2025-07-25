import { useEffect, useState } from "react";

const useIsFavorited = (recipeId: number | string | undefined) => {
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!recipeId) {
      setIsFavorited(false);
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsFavorited(false);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/FavoriteRecipes/is-favorited/${recipeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setIsFavorited(false);
        } else {
          const data = await res.json();
          setIsFavorited(!!data);
        }
      } catch (error) {
        setIsFavorited(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [recipeId]);

  return isFavorited;
};

export default useIsFavorited;

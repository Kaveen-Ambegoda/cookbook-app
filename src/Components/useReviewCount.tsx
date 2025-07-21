import { useEffect, useState } from "react";
import axios from "axios";

export function useReviewCount(recipeId: number | undefined) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!recipeId) return;

    const fetchCount = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Review/count/${recipeId}`
        );
        setCount(res.data);
      } catch (err) {
        console.error("Failed to fetch review count", err);
      }
    };

    fetchCount();
  }, [recipeId]);

  return count;
}

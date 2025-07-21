"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewList({ recipeId }: { recipeId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadReviews = async () => {
    if (!recipeId || isNaN(recipeId)) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Review/${recipeId}`
      );
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [recipeId]);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-gray-100 p-3 rounded mb-2">
            <p className="font-medium">⭐ {review.rating} Stars</p>
            <p>{review.comment}</p>
            <p className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleString("en-LK", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

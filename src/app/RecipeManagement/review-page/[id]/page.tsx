"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";

export default function RecipePage() {
  const params = useParams();
  const recipeId = parseInt(params.id);

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const onReviewsChanged = () => {
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-20 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Average Rating</h2>
          <ReviewSummary recipeId={recipeId} refreshTrigger={refreshTrigger} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Write Your Review</h2>
          <ReviewForm recipeId={recipeId} onReviewChange={onReviewsChanged} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Feedback</h2>
        <ReviewList
          recipeId={recipeId}
          refreshTrigger={refreshTrigger}
          onReviewChange={onReviewsChanged}
        />
      </div>
    </div>
  );
}

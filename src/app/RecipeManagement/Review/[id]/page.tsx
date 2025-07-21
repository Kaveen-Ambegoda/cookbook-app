"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

export default function ReviewRecipePage() {
  const params = useParams();
  const recipeId = Number(params?.id);
  const [reloadFlag, setReloadFlag] = useState(false);
  const reloadReviews = () => setReloadFlag((prev) => !prev);

  if (!recipeId || isNaN(recipeId)) {
    return <div className="text-red-500 text-center mt-10">Invalid recipe ID</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Recipe Feedback</h1>
      <ReviewForm recipeId={recipeId} onReviewAdded={reloadReviews} />
      <ReviewList key={reloadFlag.toString()} recipeId={recipeId} />
    </div>
  );
}

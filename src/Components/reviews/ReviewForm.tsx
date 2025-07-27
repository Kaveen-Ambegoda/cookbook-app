"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/authContext";

interface ReviewFormProps {
  recipeId: number;
  existingUserReviewCount?: number;
  onReviewChange?: () => void;
}

export default function ReviewForm({
  recipeId,
  existingUserReviewCount = 0,
  onReviewChange,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (existingUserReviewCount >= 3) {
      toast.error("You can only submit up to 3 reviews per recipe.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Review`,
        { rating, comment, recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review submitted!");
      setRating(5);
      setComment("");

      if (onReviewChange) onReviewChange();
    } catch (err: any) {
      if (err.response?.status === 400) {
        toast.error("You can only add up to 3 reviews for this recipe.");
      } else {
        toast.error("Failed to submit review");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mt-4">
      <label className="block mb-2">Rating:</label>
      <select
        value={rating}
        onChange={(e) => setRating(+e.target.value)}
        className="w-full mb-4 border p-2 rounded"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {"⭐".repeat(r)} ({r})
          </option>
        ))}
      </select>

      <label className="block mb-2">Comment:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        placeholder="Write your review..."
        rows={3}
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit Review
      </button>
    </form>
  );
}

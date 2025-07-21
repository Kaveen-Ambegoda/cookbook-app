"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface ReviewFormProps {
  recipeId: number;
  onReviewAdded: () => void;
}

export default function ReviewForm({ recipeId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Login required");

    if (!comment.trim()) return toast.error("Write a comment");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Review`,
        { recipeId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review added");
      setRating(5);
      setComment("");
      onReviewAdded();
    } catch (err: any) {
      toast.error("Submit failed");
      console.error(err);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow mt-6">
      <h3 className="font-semibold text-lg mb-2">Leave a Review</h3>
      <select value={rating} onChange={(e) => setRating(+e.target.value)} className="w-full mb-2 p-2 border rounded">
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>{"⭐".repeat(r)} ({r})</option>
        ))}
      </select>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review"
        className="w-full border p-2 rounded mb-2"
        rows={3}
      />
      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Submit
      </button>
    </div>
  );
}

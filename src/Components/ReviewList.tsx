"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/authContext";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userId: number;
}

export default function ReviewList({ recipeId }: { recipeId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(5);
  const { userId, token } = useAuth();

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

  const handleDelete = async (reviewId: number) => {
    if (!token) return;

    const confirmed = window.confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Review/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Review deleted");
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const startEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditedComment("");
    setEditedRating(5);
  };

  const handleUpdate = async (reviewId: number) => {
    if (!token) return;
    if (!editedComment.trim()) {
      toast.error("Write a comment");
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Review/${reviewId}`,
        { comment: editedComment, rating: editedRating, recipeId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Review updated");
      setEditingReviewId(null);
      loadReviews();
    } catch {
      toast.error("Failed to update review");
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
        reviews.map((review) => {
          const isOwner = String(review.userId) === userId;
          const isEditing = editingReviewId === review.id;

          return (
            <div key={review.id} className="bg-gray-100 p-4 rounded mb-3 relative">
              {isEditing ? (
                <div className="p-4 border rounded bg-white shadow mt-2">
                  <select
                    value={editedRating}
                    onChange={(e) => setEditedRating(+e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {"⭐".repeat(r)} ({r})
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    placeholder="Write your review"
                    className="w-full border p-2 rounded mb-2"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate(review.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Submit
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-medium">⭐ {review.rating} Stars</p>
                  <p>{review.comment}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleString()}
                  </p>

                  {isOwner && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => startEdit(review)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

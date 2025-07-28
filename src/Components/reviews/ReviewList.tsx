"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/authContext";
import { Pencil, Trash2 } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userId: number;
  username: string;
}

interface ReviewListProps {
  recipeId: number;
  refreshTrigger?: boolean;
  onReviewChange?: () => void;
}

export default function ReviewList({
  recipeId,
  refreshTrigger,
  onReviewChange,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(5);
  const { userId, token } = useAuth();

  // Modal state for delete confirmation
  const [deleteConfirmReviewId, setDeleteConfirmReviewId] = useState<number | null>(null);

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
  }, [recipeId, refreshTrigger]);

  const confirmDelete = (reviewId: number) => {
    setDeleteConfirmReviewId(reviewId);
  };

  const cancelDelete = () => {
    setDeleteConfirmReviewId(null);
  };

  const handleDelete = async () => {
    if (!token || deleteConfirmReviewId === null) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Review/${deleteConfirmReviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Review deleted");
      setDeleteConfirmReviewId(null);

      if (onReviewChange) onReviewChange();
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
      toast.error("Please enter a comment.");
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

      if (onReviewChange) onReviewChange();
    } catch {
      toast.error("Failed to update review");
    }
  };

  return (
    <>
      <div className="mt-10">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const isOwner = String(review.userId) === userId;
              const isEditing = editingReviewId === review.id;

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-md p-4 relative border hover:shadow-lg transition"
                >
                  {isEditing ? (
                    <div>
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
                        className="w-full border p-2 rounded mb-2"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdate(review.id)}
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-yellow-500 text-lg">
                            {"⭐".repeat(review.rating)}{" "}
                            <span className="text-gray-600 text-sm">
                              ({review.rating})
                            </span>
                          </p>
                          <p className="text-sm text-gray-700 font-semibold">{review.username}</p>
                          <p className="mt-1">{review.comment}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(review.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {isOwner && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(review)}
                              className="text-blue-600 hover:text-blue-800"
                              aria-label="Edit review"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(review.id)}
                              className="text-red-600 hover:text-red-800"
                              aria-label="Delete review"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmReviewId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this review?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useReviewCount } from "./useReviewCount";
import useIsFavorited from "./useIsFavorited";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaCommentDots,
  FaShareAlt,
  FaClock,
  FaUtensils,
} from "react-icons/fa";

type RecipeProps = {
  recipe: {
    id: number;
    title: string;
    cookingTime: number;
    portion: number;
    image: string;
    favorites?: number;
    reviews?: number;
  };
  isFavorite?: boolean;
  onFavoriteChange?: () => void;
};

const HomeRecipeCard: React.FC<RecipeProps> = ({
  recipe,
  isFavorite,
  onFavoriteChange,
}) => {
  const hookIsFavorited = useIsFavorited(recipe.id);
  const reviewCount = useReviewCount(recipe.id);
  const router = useRouter();

  const initialIsFavorited =
    typeof isFavorite === "boolean" ? isFavorite : hookIsFavorited;

  const [favorited, setFavorited] = useState<boolean>(initialIsFavorited);
  const [showShareBox, setShowShareBox] = useState(false);

  useEffect(() => {
    setFavorited(initialIsFavorited);
  }, [initialIsFavorited]);

  const handleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to favorite this recipe.");
      router.push("/Login_Register/Login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/FavoriteRecipes/toggle`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recipe.id),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFavorited(data.isFavorited);
        toast.success(data.message);
        if (onFavoriteChange) onFavoriteChange();
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to update favorite.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error.");
    }
  };

  const shareUrl = `${window.location.origin}/RecipeManagement/ManageRecipe/ViewRecipe/${recipe.id}`;

  return (
    <div className="flex flex-col justify-between bg-white p-5 rounded-lg shadow-lg transition transform hover:scale-105 w-full max-w-sm mx-auto min-h-[480px] relative">
      {/* Image */}
      <div className="flex justify-center">
        <Image
          src={recipe.image || "/images/default.jpg"}
          width={300}
          height={200}
          alt={recipe.title}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Title */}
      <h3 className="mt-3 text-lg font-semibold text-center text-gray-800 line-clamp-2 h-12">
        {recipe.title}
      </h3>

      {/* Time & Portions */}
      <div className="flex flex-wrap justify-center items-center text-sm text-gray-600 mt-3 gap-4">
        <div className="flex items-center space-x-2">
          <FaClock className="text-gray-500 text-m" />
          <span className="font-medium">Time: {recipe.cookingTime} min</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaUtensils className="text-gray-500 text-m" />
          <span className="font-medium">Servings: {recipe.portion}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mt-5 w-full max-w-xs mx-auto relative">
        <button
          onClick={handleFavorite}
          className="flex items-center space-x-1 group"
          title={favorited ? "Remove from Favorites" : "Add to Favorites"}
        >
          <FaHeart
            className={`text-xl transition ${
              favorited
                ? "text-red-800"
                : "text-gray-400 group-hover:text-red-500"
            }`}
          />
        </button>

        <Link
          href={`/RecipeManagement/review-page/${recipe.id}`}
          className="flex items-center space-x-1 hover:scale-105 transition"
        >
          <FaCommentDots className="text-blue-500 text-xl" />
          <span className="text-gray-700 font-medium text-sm">
            {reviewCount ?? 0}
          </span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setShowShareBox((prev) => !prev)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition"
          >
            <FaShareAlt className="text-lg" />
            <span className="font-medium">Share</span>
          </button>

          {showShareBox && (
            <div className="absolute top-10 right-0 bg-white border border-gray-300 shadow-md rounded-md p-3 z-10 w-64">
              <p className="text-xs text-gray-700 break-all mb-2">{shareUrl}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied!");
                  setShowShareBox(false);
                }}
                className="text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-800"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View Button */}
      <div className="mt-5 text-center">
        <Link
          href={`/RecipeManagement/ManageRecipe/ViewRecipe/${recipe.id}`}
          className="text-white bg-green-700 px-3 py-1 rounded-xl hover:bg-green-900 transition text-sm"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default HomeRecipeCard;

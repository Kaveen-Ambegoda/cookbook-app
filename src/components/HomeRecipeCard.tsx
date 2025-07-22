"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useReviewCount } from "./useReviewCount";
import { useFavoriteCount } from "./useFavoriteCount";
import { useIsFavorited } from "./useIsFavorited";

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
};

const HomeRecipeCard: React.FC<RecipeProps> = ({ recipe }) => {
  const { isFavorited, setIsFavorited, refresh } = useIsFavorited(recipe.id);

  const favoriteCountFromHook = useFavoriteCount(recipe.id);
  const reviewCount = useReviewCount(recipe.id);
  const [favoriteCount, setFavoriteCount] = useState(favoriteCountFromHook);

  useEffect(() => {
    setFavoriteCount(favoriteCountFromHook);
  }, [favoriteCountFromHook]);

  const handleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to favorite this recipe.");
      return;
    }

    // Optimistically update UI
    const previousFavorited = isFavorited;
    const previousCount = favoriteCount;

    setIsFavorited(!previousFavorited);
    setFavoriteCount(previousFavorited ? favoriteCount - 1 : favoriteCount + 1);

    try {
      if (!previousFavorited) {
        // Add to favorites
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/FavoriteRecipes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(recipe.id),
          }
        );

        if (response.ok) {
          toast.success("Added to favorites!");
          refresh(); // re-check status
        } else {
          const error = await response.text();
          toast.error(error || "Failed to add favorite.");
          // Revert UI
          setIsFavorited(previousFavorited);
          setFavoriteCount(previousCount);
        }
      } else {
        // Remove from favorites
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/FavoriteRecipes/${recipe.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          toast.success("Removed from favorites!");
          refresh(); // re-check status
        } else {
          const error = await response.text();
          toast.error(error || "Failed to remove favorite.");
          // Revert UI
          setIsFavorited(previousFavorited);
          setFavoriteCount(previousCount);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
      // Revert UI
      setIsFavorited(previousFavorited);
      setFavoriteCount(previousCount);
    }
  };


  return (
    <div className="bg-white p-5 rounded-lg shadow-lg transition transform hover:scale-105 w-full max-w-sm mx-auto">
      {/* Image */}
      <div className="flex justify-center">
        <Image
          src={recipe.image || "/images/default.jpg"}
          width={300}
          height={400}
          alt={recipe.title}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Title */}
      <h3 className="mt-3 text-lg font-semibold text-center text-gray-800">
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
      <div className="flex flex-wrap justify-between items-center bg-gray-100 p-2 rounded-lg mt-5 space-x-1 w-full max-w-xs mx-auto">
        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className="flex items-center space-x-1 group"
          title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        >
          <FaHeart
            className={`text-xl transition ${
              isFavorited ? "text-red-800" : "text-gray-400 group-hover:text-red-500"
            }`}
          />

          <span className="text-gray-700 font-medium">{favoriteCount}</span>
        </button>

        {/* Reviews */}
        <Link
          href={`/RecipeManagement/Review/${recipe.id}`}
          className="flex items-center space-x-1 hover:scale-105 transition"
        >
          <FaCommentDots className="text-blue-500 text-xl" />
          <span className="text-gray-700 font-medium text-sm">
            {reviewCount ?? 0}
          </span>
        </Link>

        {/* Share */}
        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition">
          <FaShareAlt className="text-lg" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* View Recipe Button */}
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

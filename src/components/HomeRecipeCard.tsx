"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
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
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to favorite this recipe.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/FavoriteRecipes`, {
        method: "POST", // ✅ Ensure this line is present
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipe.id), // ✅ Backend expects raw int in body
      });

      if (response.ok) {
        setIsFavorited(true);
        toast.success("Added to favorites!");
      } else {
        const error = await response.text();
        toast.error(error || "Failed to add favorite.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
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
          disabled={isFavorited}
          title={isFavorited ? "Already in Favorites" : "Add to Favorites"}
        >
          <FaHeart
            className={`text-xl transition ${
              isFavorited
                ? "text-red-600"
                : "text-gray-400 group-hover:text-red-500"
            }`}
          />
          <span className="text-gray-700 font-medium">
            {isFavorited ? "✓" : recipe.favorites ?? 0}
          </span>
        </button>

        {/* Reviews */}
        <div className="flex items-center space-x-1">
          <FaCommentDots className="text-blue-500 text-xl hover:scale-110 transition" />
          <span className="text-gray-700 font-medium text-sm">
            {recipe.reviews ?? 0}
          </span>
        </div>

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
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default HomeRecipeCard;

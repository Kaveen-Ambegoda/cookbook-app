import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaCommentDots, FaShareAlt, FaClock, FaUtensils } from "react-icons/fa";

type RecipeProps = {
  recipe: {
    id: number;
    title: string;
    time: string;
    servings: string;
    img: string;
    favorites: number;
    reviews: number;
  };
};

const Recipe: React.FC<RecipeProps> = ({ recipe }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-lg transition transform hover:scale-105 w-full max-w-sm mx-auto">
      {/* Recipe Image */}
      <div className="flex justify-center">
        <Image
          src={recipe.img}
          width={300}
          height={300}
          alt={recipe.title}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Recipe Title */}
      <h3 className="mt-3 text-lg font-semibold text-center text-gray-800">{recipe.title}</h3>

      {/* Time & Servings Section */}
      <div className="flex flex-wrap justify-center items-center text-sm text-gray-600 mt-3 gap-4">
        <div className="flex items-center space-x-2" >
          <FaClock className="text-gray-500 text-m" />
          <span className="font-medium">Time: {recipe.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaUtensils className="text-gray-500 text-m" />
          <span className="font-medium">Servings: {recipe.servings}</span>
        </div>
      </div>

      {/* Favorite, Reviews & Share Section */}
      <div className="flex flex-wrap justify-between items-center bg-gray-100 p-2 rounded-lg mt-5 space-x-1 w-full max-w-xs mx-auto">
  <div className="flex items-center space-x-1">
    <FaHeart className="text-red-500 text-xl hover:scale-110 transition" />
    <span className="text-gray-700 font-medium">{recipe.favorites}</span>
  </div>
  <div className="flex items-center space-x-1">
    <FaCommentDots className="text-blue-500 text-xl hover:scale-110 transition" />
    <span className="text-gray-700 font-medium text-sm">{recipe.reviews}</span>
  </div>
  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition">
    <FaShareAlt className="text-lg" />
    <span className="font-medium">Share</span>
  </button>
</div>


      {/* View Recipe Button */}
      <div className="mt-5 text-center">
        <Link
          href={`/recipe/${recipe.id}`}
          className="text-white bg-green-700 px-2 py-1 rounded-xl hover:bg-green-900 transition text-sm"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default Recipe;

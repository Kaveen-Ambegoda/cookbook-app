"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeRecipeCard from "@/Components/HomeRecipeCard";
import HomeNavBar from "@/Components/HomeNavBar";
import Welcome from "../Welcome/page";
import Footer from "@/Components/Footer";

interface Recipe {
  id: number;
  title: string;
  cookingTime: number;
  portion: number;
  image: string;
  favorites?: number;
  reviews?: number;
}

const HomePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/Recipe/homePage`);
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <HomeNavBar />
      <Welcome />
      <h1 className="text-green-700 text-2xl font-medium pl-4 pb-2">All Recipes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4">
        {recipes.map((recipe) => {
          const image = recipe.image?.startsWith("http")
            ? recipe.image
            : "/image/default.jpg";

          return (
            <HomeRecipeCard
              key={recipe.id}
              recipe={{
                id: recipe.id,
                title: recipe.title,
                cookingTime: recipe.cookingTime,
                portion: recipe.portion,
                image: image,
                favorites: recipe.favorites,
                reviews: recipe.reviews,
              }}
            />
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;

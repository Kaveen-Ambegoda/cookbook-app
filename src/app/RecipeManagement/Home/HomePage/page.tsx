"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeRecipeCard from "@/components/HomeRecipeCard";
import HomeNavBar from "@/components/HomeNavBar";
import Welcome from "../Welcome/page";
import Footer from "@/components/Footer";
import FilterSheet, { RecipeFilters } from "@/components/FilterSheet";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initial empty filters
  const [filters, setFilters] = useState<RecipeFilters>({
    searchTerm: "",
    mealType: [],
    cuisine: [],
    diet: [],
    occasion: [],
    skillLevel: [],
    cookingTimeMax: "",
    caloriesMax: "",
    proteinMin: "",
    fatMin: "",
    carbsMin: "",
  });

  const [mealTypeOptions, setMealTypeOptions] = useState<string[]>([]);
  const [cuisineOptions, setCuisineOptions] = useState<string[]>([]);
  const [dietOptions, setDietOptions] = useState<string[]>([]);
  const [occasionOptions, setOccasionOptions] = useState<string[]>([]);
  const [skillLevelOptions, setSkillLevelOptions] = useState<string[]>([]);

  useEffect(() => {
  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/filter-options`);
      const data = response.data;

      setMealTypeOptions(data.mealTypes || []);
      setCuisineOptions(data.cuisines || []);
      setDietOptions(data.diets || []);
      setOccasionOptions(data.occasions || []);
      setSkillLevelOptions(data.skillLevels || []);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {

        const queryParams = new URLSearchParams();

        if (filters.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
        filters.mealType.forEach((v) => queryParams.append("mealType", v));
        filters.cuisine.forEach((v) => queryParams.append("cuisine", v));
        filters.diet.forEach((v) => queryParams.append("diet", v));
        filters.occasion.forEach((v) => queryParams.append("occasion", v));
        filters.skillLevel.forEach((v) => queryParams.append("skillLevel", v));
        if (filters.cookingTimeMax) queryParams.append("cookingTimeMax", filters.cookingTimeMax.toString());
        if (filters.caloriesMax) queryParams.append("caloriesMax", filters.caloriesMax.toString());
        if (filters.proteinMin) queryParams.append("proteinMin", filters.proteinMin.toString());
        if (filters.fatMin) queryParams.append("fatMin", filters.fatMin.toString());
        if (filters.carbsMin) queryParams.append("carbsMin", filters.carbsMin.toString());

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/homePage?${
          queryParams.toString()
        }`;

        const response = await axios.get(url);
          
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [filters]);

  return (
    <div>
      {/* Pass handler to open filter sheet */}
      <HomeNavBar onFilterClick={() => setIsFilterOpen(true)} />
      <Welcome />

      {/* Filter Sheet */}
      <FilterSheet
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        mealTypeOptions={mealTypeOptions}
        cuisineOptions={cuisineOptions}
        dietOptions={dietOptions}
        occasionOptions={occasionOptions}
        skillLevelOptions={skillLevelOptions}
      />

      <h1 className="text-green-700 text-2xl font-medium pl-4 pb-2">All Recipes</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
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

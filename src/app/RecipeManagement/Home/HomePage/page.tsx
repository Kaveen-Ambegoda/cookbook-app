"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeRecipeCard from "@/Components/HomeRecipeCard";
import HomeNavBar from "@/Components/HomeNavBar";
import Welcome from "../Welcome/page";
import Footer from "@/Components/Footer";
import FilterSheet, { RecipeFilters } from "@/Components/FilterSheet";

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
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

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

  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 4;

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/filter-options`
        );
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

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/homePage?${queryParams.toString()}`;
        const response = await axios.get(url);
          
        setRecipes(response.data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [filters]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  return (
    <div>
      <HomeNavBar
        onFilterClick={() => setIsFilterOpen(true)}
        mealTypeOptions={mealTypeOptions}
        selectedMealType={selectedMealType}
        onMealTypeClick={(mealType) => {
          setSelectedMealType(mealType);
          setFilters((prev) => ({
            ...prev,
            mealType: mealType ? [mealType] : [],
          }));
        }}
      />

      {!selectedMealType && <Welcome />}

      <FilterSheet
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          setSelectedMealType(null); // Clear nav selection if filters are used
        }}
        mealTypeOptions={mealTypeOptions}
        cuisineOptions={cuisineOptions}
        dietOptions={dietOptions}
        occasionOptions={occasionOptions}
        skillLevelOptions={skillLevelOptions}
      />

      <h1 className="text-green-700 text-2xl font-medium pl-4 pb-2">
        {selectedMealType ? selectedMealType : "All Recipes"}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
        {currentRecipes.map((recipe) => {
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-md transition ${
                currentPage === index + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;

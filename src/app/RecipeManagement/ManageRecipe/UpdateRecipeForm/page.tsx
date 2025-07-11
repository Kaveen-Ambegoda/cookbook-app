"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import toast from 'react-hot-toast';

type RecipeFormData = {
  title: string;
  ingredients: string;
  instructions: string;
  category: string;
  cookingTime: number;
  portion: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  imageFile: FileList;
};

const steps = ["Basic Info", "Details", "Nutrition & Image"];

const UpdateRecipePage = () => {
  const [step, setStep] = useState(0);
  const [isClient, setIsClient] = useState(false); // To track client-side rendering
  const [recipeData, setRecipeData] = useState<RecipeFormData | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RecipeFormData>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('id'); // Get the recipe ID from search params
  
  // Set client-side flag after the component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch recipe data when the page loads (client-side)
  useEffect(() => {
    if (recipeId && isClient) {
      console.log("Fetching recipe with ID:", recipeId); // Log the recipeId to ensure it's correct
      const fetchRecipeData = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/${recipeId}`);
          console.log("Fetched recipe data:", response.data); // Log the fetched recipe data
          setRecipeData(response.data);
          reset(response.data); // Populate the form with fetched data
        } catch (error) {
          console.error("Error fetching recipe data:", error);
          alert("Failed to load recipe data");
        }
      };
      fetchRecipeData();
    }
  }, [recipeId, isClient, reset]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: RecipeFormData) => {
    console.log("Form updated:", data); // Log the form data on submit
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("cookingTime", data.cookingTime.toString());
      formData.append("portion", data.portion.toString());
      formData.append("ingredients", data.ingredients);
      formData.append("instructions", data.instructions);
      formData.append("calories", data.calories.toString());
      formData.append("protein", data.protein.toString());
      formData.append("fat", data.fat.toString());
      formData.append("carbs", data.carbs.toString());

      if (data.imageFile && data.imageFile.length > 0) {
        formData.append("image", data.imageFile[0]); // backend must accept this as IFormFile
      }

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/updateRecipe/${recipeId}`, formData);
      console.log("Recipe updated successfully:", response.data);
      toast.success("Recipe updated successfully!");

      reset();
      setStep(0); // Reset to the first step after submission

        setTimeout(() => {
          router.replace('/RecipeManagement/ManageRecipe/ManageRecipe'); // Navigate to the RecipeManage page
        }, 500);
      
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        toast.error("Failed to update recipe: " + (error.response?.data?.message || error.message));
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (!isClient) return null; // Avoid rendering anything before client-side hydration
  if (!recipeData) return <p>Loading recipe data...</p>; // Show loading message until recipe data is fetched

  return (
    <div className="min-h-screen relative pl-16">
      <div
        className="absolute inset-y-0 left-0 right-0 bg-cover bg-center z-0 bg-[url('/image/bg.png')]"
      />
      <div className="relative z-10 max-w-4xl mx-auto pt-36 pb-12 px-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
            Update Your Recipe
          </h1>
          <div className="flex justify-between mb-8">
            {steps.map((label, index) => (
              <div
                key={index}
                className={`text-center flex-1 font-medium text-sm ${step === index
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-400"
                  }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Form section */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Step 1: Basic Info */}
              {step === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium">Recipe Title</label>
                    <input
                      {...register("title", { required: "Title is required" })}
                      className="w-full border rounded px-3 py-2"
                      defaultValue={recipeData.title}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                  </div>
                  <div>
                    <label className="block font-medium">Category</label>
                    <select
                      {...register("category", { required: "Category is required" })}
                      className="w-full border rounded px-3 py-2"
                      defaultValue={recipeData.category}
                    >
                      <option value="">-- Select --</option>
                      <option>Main course</option>
                      <option>Appetizer</option>
                      <option>Dessert</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                  </div>
                  <div>
                    <label className="block font-medium">Cooking Time</label>
                    <input
                      {...register("cookingTime", { required: "Cooking time is required" })}
                      className="w-full border rounded px-3 py-2"
                      defaultValue={recipeData.cookingTime}
                    />
                    {errors.cookingTime && <p className="text-red-500 text-sm">{errors.cookingTime.message}</p>}
                  </div>
                  <div>
                    <label className="block font-medium">Portion</label>
                    <input
                      {...register("portion", { required: "Portion size is required" })}
                      className="w-full border rounded px-3 py-2"
                      defaultValue={recipeData.portion}
                    />
                    {errors.portion && <p className="text-red-500 text-sm">{errors.portion.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Ingredients & Instructions */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium">Ingredients</label>
                    <textarea
                      {...register("ingredients", { required: "Ingredients are required" })}
                      className="w-full border rounded px-3 py-2 h-32"
                      defaultValue={recipeData.ingredients}
                    />
                    {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients.message}</p>}
                  </div>
                  <div>
                    <label className="block font-medium">Instructions</label>
                    <textarea
                      {...register("instructions", { required: "Instructions are required" })}
                      className="w-full border rounded px-3 py-2 h-40"
                      defaultValue={recipeData.instructions}
                    />
                    {errors.instructions && <p className="text-red-500 text-sm">{errors.instructions.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Nutrition & Image */}
              {step === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium">Calories</label>
                    <input
                      type="number"
                      {...register("calories", { required: "Calories are required" })}
                      className="w-full border rounded px-3 py-2"
                      defaultValue={recipeData.calories}
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Protein</label>
                    <input
                      type="number"
                      {...register("protein", { required: "Protein is required" })}
                      className="w-full border rounded px-3 py-2"
                      defaultValue={recipeData.protein}
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Fat</label>
                    <input
                      type="number"
                      {...register("fat", { required: "Fat is required" })}
                      className="w-full border rounded px-3 py-2"
                      defaultValue={recipeData.fat}
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Carbs</label>
                    <input
                      type="number"
                      {...register("carbs", { required: "Carbs are required" })}
                      className="w-full border rounded px-3 py-2"
                      defaultValue={recipeData.carbs}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-medium">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("imageFile")}
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors.imageFile && <p className="text-red-500 text-sm">{errors.imageFile.message}</p>}
                  </div>
                </div>
              )}
            </motion.div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2 border rounded text-gray-600 hover:bg-gray-100 ${step === 0 ? "invisible" : ""}`}
              >
                Back
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    nextStep();
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Update
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRecipePage;

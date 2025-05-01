"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type RecipeFormData = {
  title: string;
  ingredients: string;
  instructions: string;
  category: string;
  cookingTime: number;
  portion: number;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  imageUrl: string; 
};

const steps = ["Basic Info", "Details", "Nutrition & Image"];

const CreateRecipePage = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecipeFormData>();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: RecipeFormData) => {
    console.log("Form submitted:", data);

    try {
      const response = await axios.post('https://localhost:7205/api/Recipe/addRecipe', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Recipe added successfully:", response.data);
      toast.success("Recipe added successfully!");
      reset();
      setStep(0); // Reset to the first step after submission
      setTimeout(() => {
        router.replace('/Pages/RecipeManagement/ManageRecipe/ManageRecipe'); // Navigate to the RecipeManage page
      }, 500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        toast.error("Failed to add recipe: " + (error.response?.data?.message || error.message));
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };


  return (
    <div className="min-h-screen relative pl-16">
      <div
        className="absolute inset-y-0 left-16 right-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/image/bg.png')" }}
      />
      <div className="relative z-10 max-w-4xl mx-auto pt-36 pb-12 px-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
            Add Your Recipe
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {step === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium">Recipe Title</label>
                    <input
                      {...register("title", { required: "Title is required" })}
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">{errors.title.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium">Category</label>
                    <select
                      {...register("category", { required: "Category is required" })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">-- Select --</option>
                      <option>Main course</option>
                      <option>Appetizer</option>
                      <option>Dessert</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm">{errors.category.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium">Cooking Time</label>
                    <input
                      {...register("cookingTime", { required: "Required" })}
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors.cookingTime && (
                      <p className="text-red-500 text-sm">{errors.cookingTime.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium">Portion</label>
                    <input
                      {...register("portion", { required: "Required" })}
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors.portion && (
                      <p className="text-red-500 text-sm">{errors.portion.message}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium">Ingredients</label>
                    <textarea
                      {...register("ingredients", { required: "Required" })}
                      className="w-full border rounded px-3 py-2 h-32"
                    />
                    {errors.ingredients && (
                      <p className="text-red-500 text-sm">{errors.ingredients.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium">Instructions</label>
                    <textarea
                      {...register("instructions", { required: "Required" })}
                      className="w-full border rounded px-3 py-2 h-40"
                    />
                    {errors.instructions && (
                      <p className="text-red-500 text-sm">{errors.instructions.message}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium">Calories</label>
                    <input
                      {...register("calories", { required: "Required" })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Protein</label>
                    <input
                      {...register("protein", { required: "Required" })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Fat</label>
                    <input
                      {...register("fat", { required: "Required" })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Carbs</label>
                    <input
                      {...register("carbs", { required: "Required" })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-medium">Image URL</label>
                    <input
                      {...register("imageUrl", { required: "Image URL is required" })}
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors.imageUrl && (
                      <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2 border rounded text-gray-600 hover:bg-gray-100 ${
                  step === 0 ? "invisible" : ""
                }`}
              >
                Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;

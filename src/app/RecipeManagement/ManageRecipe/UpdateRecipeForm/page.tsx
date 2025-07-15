"use client"
import { useSearchParams } from "next/navigation"
import RecipeForm from "@/components/RecipeForm"

type RecipeFormData = {
  title: string
  ingredients: string
  instructions: string
  category: string
  cookingTime: number
  portion: number
  calories: number
  protein: number
  fat: number
  carbs: number
  imageFile: FileList
}

const steps = ["Basic Info", "Details", "Nutrition & Image"]

const recipeCategories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Main Course",
  "Appetizer",
  "Dessert",
  "Snack",
  "Beverage",
  "Soup",
  "Salad",
  "Side Dish",
  "Sauce",
  "Other",
]

const UpdateRecipePage = () => {
  const searchParams = useSearchParams()
  const recipeId = searchParams.get("id")

  if (!recipeId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Recipe ID Missing</h1>
          <p className="text-gray-600">No recipe ID provided for updating.</p>
        </div>
      </div>
    )
  }

  return <RecipeForm mode="update" recipeId={recipeId} />
}

export default UpdateRecipePage

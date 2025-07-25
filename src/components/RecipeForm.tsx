"use client"
import { useState, useEffect } from "react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { motion } from "framer-motion"
import axios from "axios" // Keep axios for general use, but use API for authenticated calls
import API from "@/app/utils/axiosInstance" // Import the configured axios instance
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

type RecipeFormData = {
  title: string
  ingredients: string
  instructions: string
  mealType?: string
  cuisine?: string
  diet?: string
  occasion?: string
  skillLevel?: string
  cookingTime: string
  portion: number
  calories: number
  protein: number
  fat: number
  carbs: number
  imageFile: FileList
}

interface RecipeFormProps {
  mode: "create" | "update"
  recipeId?: string
}

const steps = ["Basic Info", "Details", "Nutrition & Image"]

const mealTypeOptions = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Drinks & Smoothies"]

const cuisineOptions = [
  "Sri Lankan",
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Middle Eastern",
  "Thai",
  "American",
  "Mediterranean",
  "Japanese",
]

const dietOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Carb",
  "High-Protein",
  "Keto-Friendly",
  "Diabetic-Friendly",
  "Weight-Loss",
]

const occasionOptions = [
  "Family Dinners",
  "Quick Weeknight Meals",
  "Party & Celebration",
  "Holiday Specials",
  "Kids’ Favorites",
  "Budget Meals",
]

const skillLevelOptions = ["Beginner-Friendly", "Intermediate", "Advanced"]

const cookingTimeOptions = [
  { label: "Under 15 Minutes", value: "15" },
  { label: "Under 30 Minutes", value: "30" },
  { label: "30–60 Minutes", value: "60" },
  { label: "Over 1 Hour", value: "120" },
]

const getCookingTimeOptionValue = (time: number): string => {
  if (time <= 15) return "15"
  if (time <= 30) return "30"
  if (time <= 60) return "60"
  return "120"
}

function CategorySelect({
  name,
  label,
  options,
  required = false,
}: {
  name: keyof RecipeFormData
  label: string
  options: string[] | { label: string; value: string }[]
  required?: boolean
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeFormData>()

  const isObjectOptions = (opts: typeof options): opts is { label: string; value: string }[] =>
    typeof opts[0] === "object" && opts[0] !== null && "label" in opts[0] && "value" in opts[0]

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      <select
        {...register(name, { required: required ? `${label} is required` : false })}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        defaultValue=""
      >
        <option value="">-- Select --</option>
        {isObjectOptions(options)
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : (options as string[]).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
      </select>
      {errors[name] && <p className="text-red-500 text-sm mt-1">{(errors as any)[name]?.message}</p>}
    </div>
  )
}

const RecipeForm = ({ mode, recipeId }: RecipeFormProps) => {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(mode === "update")
  const [ingredientsPreview, setIngredientsPreview] = useState<string[]>([])
  const [instructionsPreview, setInstructionsPreview] = useState<string[]>([])
  const [currentImage, setCurrentImage] = useState<string>("") // Renamed from currentImageUrl
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const methods = useForm<RecipeFormData>()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    trigger,
  } = methods

  const watchedIngredients = watch("ingredients")
  const watchedInstructions = watch("instructions")
  const watchedImageFile = watch("imageFile")

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (watchedIngredients) {
      const list = watchedIngredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean)
      setIngredientsPreview(list)
    } else setIngredientsPreview([])
  }, [watchedIngredients])

  useEffect(() => {
    if (watchedInstructions) {
      const list = watchedInstructions
        .split(/\.\s+|\n/)
        .map((i) => i.trim())
        .filter(Boolean)
        .map((i) => (i.endsWith(".") ? i : i + "."))
      setInstructionsPreview(list)
    } else setInstructionsPreview([])
  }, [watchedInstructions])

  useEffect(() => {
    if (watchedImageFile && watchedImageFile.length > 0) {
      const file = watchedImageFile[0]
      const objectUrl = URL.createObjectURL(file)
      setImagePreviewUrl(objectUrl)
      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    } else {
      setImagePreviewUrl(null)
    }
  }, [watchedImageFile])

  useEffect(() => {
    if (mode === "update" && recipeId && isClient) {
      setIsLoading(true)
      // Use the configured API instance for fetching
      API.get(`/api/Recipe/${recipeId}`)
        .then((res) => {
          const data = res.data
          console.log("Fetched recipe data:", data) // Log the entire fetched data

          const parsedIngredients =
            data.ingredients
              ?.split("\n")
              .map((i: string) => i.replace(/^•\s*/, "").trim())
              .join(", ") || ""
          const parsedInstructions =
            data.instructions
              ?.split("\n")
              .map((i: string) => i.replace(/^\d+\.\s*/, "").trim())
              .join(". ") || ""

          const categoriesArray = data.categories || []
          console.log("Categories array from backend:", categoriesArray) // Log the categories array

          const resetData = {
            ...data,
            ingredients: parsedIngredients,
            instructions: parsedInstructions,
            mealType: data.mealType || categoriesArray[0] || "",
            cuisine: data.cuisine || categoriesArray[1] || "",
            diet: data.diet || categoriesArray[2] || "",
            occasion: data.occasion || categoriesArray[3] || "",
            skillLevel: data.skillLevel || categoriesArray[4] || "",
            cookingTime: getCookingTimeOptionValue(data.cookingTime),
          }
          console.log("Data being passed to reset:", resetData) // Log the data before reset

          reset(resetData)

          // IMPORTANT: Now looking for 'data.image' instead of 'data.imageUrl'
          console.log("Image URL from backend (data.image):", data.image)
          setCurrentImage(data.image || "") // Set currentImage from data.image
          console.log("Current image state after fetch:", data.image || "")
        })
        .catch((err) => {
          console.error("Error fetching recipe data:", err) // Log the full error
          let errorMessage = "Failed to load recipe data."
          if (axios.isAxiosError(err) && err.response) {
            errorMessage += ` Status: ${err.response.status}. Message: ${err.response.data?.message || err.message}`
          } else if (err instanceof Error) {
            errorMessage += ` Error: ${err.message}`
          }
          toast.error(errorMessage)
          router.push("/RecipeManagement/ManageRecipe/ManageRecipe")
        })
        .finally(() => setIsLoading(false))
    }
  }, [mode, recipeId, isClient, reset, router])

  const formatIngredientsForSubmission = (ingredients: string) =>
    ingredients
      .split(",")
      .map((item) => `• ${item.trim()}`)
      .filter((item) => item.length > 2)
      .join("\n")

  const formatInstructionsForSubmission = (instructions: string) => {
    const list = instructions
      .split(/\.\s+|\n/)
      .map((item) => item.trim())
      .filter(Boolean)
    return list.map((item, idx) => `${idx + 1}. ${item.endsWith(".") ? item : item + "."}`).join("\n")
  }

  const handleNextStep = async () => {
    let isValid = false
    if (step === 0) {
      isValid = await trigger([
        "title",
        "mealType",
        "cuisine",
        "diet",
        "occasion",
        "skillLevel",
        "cookingTime",
        "portion",
      ])
    } else if (step === 1) {
      isValid = await trigger(["ingredients", "instructions"])
    } else if (step === 2) {
      isValid = true // No specific validation for step 2 before moving forward
    }

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1))
    } else {
      toast.error("Please fill in all required fields in this section.")
    }
  }

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0))

  const onSubmit = async (data: RecipeFormData) => {
    try {
      const formData = new FormData()

      formData.append("title", data.title)

      const categories = [data.mealType, data.cuisine, data.diet, data.occasion, data.skillLevel].filter(Boolean)

      formData.append("categories", JSON.stringify(categories))

      formData.append("cookingTime", Number(data.cookingTime).toString())
      formData.append("portion", data.portion.toString())

      const formattedIngredients = formatIngredientsForSubmission(data.ingredients)
      const formattedInstructions = formatInstructionsForSubmission(data.instructions)

      formData.append("ingredients", formattedIngredients)
      formData.append("instructions", formattedInstructions)

      formData.append("calories", data.calories.toString())
      formData.append("protein", data.protein.toString())
      formData.append("fat", data.fat.toString())
      formData.append("carbs", data.carbs.toString())

      if (data.imageFile && data.imageFile.length > 0) {
        formData.append("image", data.imageFile[0])
      }

      const token = localStorage.getItem("token")
      if (!token) {
        toast.error(`You must be logged in to ${mode} a recipe.`)
        return
      }

      let response
      if (mode === "create") {
        response = await API.post(`/api/Recipe/addRecipe1`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
      } else {
        response = await API.put(`/api/Recipe/updateRecipe/${recipeId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
      }

      toast.success(`Recipe ${mode}d successfully!`)

      if (mode === "create") {
        reset()
        setStep(0)
        setIngredientsPreview([])
        setInstructionsPreview([])
        setImagePreviewUrl(null)
        setCurrentImage("") // Reset currentImage as well
      }

      router.push("/RecipeManagement/ManageRecipe/ManageRecipe")
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(`Failed to ${mode} recipe: ` + (error.response?.data?.message || error.message))
      } else {
        toast.error("An unexpected error occurred.")
      }
    }
  }

  if (!isClient) return null

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe data...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen relative pl-16">
      <div className="absolute inset-y-0 left-0 right-0 bg-cover bg-center z-0 bg-[url('/image/bg.png')]" />
      <div className="relative z-10 max-w-4xl mx-auto pt-36 pb-12 px-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
            {mode === "create" ? "Add Your Recipe" : "Update Your Recipe"}
          </h1>

          <div className="flex justify-between mb-8">
            {steps.map((label, index) => (
              <div
                key={index}
                className={`text-center flex-1 font-medium text-sm ${
                  step === index ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-400"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          <FormProvider {...methods}>
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
                      <label className="block font-medium mb-2">Recipe Title</label>
                      <input
                        {...register("title", { required: "Title is required" })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter recipe title"
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <CategorySelect name="mealType" label="Meal Type" options={mealTypeOptions} required />
                    <CategorySelect name="cuisine" label="Cuisine" options={cuisineOptions} />
                    <CategorySelect name="diet" label="Diet / Lifestyle" options={dietOptions} />
                    <CategorySelect name="occasion" label="Occasion" options={occasionOptions} />
                    <CategorySelect name="skillLevel" label="Skill Level" options={skillLevelOptions} />

                    <CategorySelect name="cookingTime" label="Cooking Time" options={cookingTimeOptions} required />

                    <div>
                      <label className="block font-medium mb-2">Servings</label>
                      <input
                        type="number"
                        {...register("portion", {
                          required: "Number of servings is required",
                          min: { value: 1, message: "Must serve at least 1 person" },
                        })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., 4"
                      />
                      {errors.portion && <p className="text-red-500 text-sm mt-1">{errors.portion.message}</p>}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium mb-2">
                        Ingredients
                        <span className="text-sm text-gray-500 font-normal">
                          (Separate each ingredient with a comma)
                        </span>
                      </label>
                      <textarea
                        {...register("ingredients", { required: "Ingredients are required" })}
                        className="w-full border rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., 2 cups flour, 1 cup sugar, 3 eggs, 1/2 cup butter"
                      />
                      {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>}

                      {ingredientsPreview.length > 0 && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Preview:</h4>
                          <ul className="space-y-1">
                            {ingredientsPreview.map((ingredient, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-700 mr-2">•</span>
                                <span className="text-gray-700">{ingredient}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        Instructions
                        <span className="text-sm text-gray-500 font-normal">
                          (Separate each step with a period and space, or use new lines)
                        </span>
                      </label>
                      <textarea
                        {...register("instructions", { required: "Instructions are required" })}
                        className="w-full border rounded px-3 py-2 h-40 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Preheat oven to 350°F. Mix flour and sugar in a bowl. Add eggs one at a time. Bake for 25 minutes."
                      />
                      {errors.instructions && (
                        <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>
                      )}

                      {instructionsPreview.length > 0 && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Preview:</h4>
                          <ol className="space-y-2">
                            {instructionsPreview.map((instruction, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-700 font-medium mr-3 mt-0.5">{index + 1}.</span>
                                <span className="text-gray-700">{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-2">Calories (per serving)</label>
                        <input
                          type="number"
                          {...register("calories", {
                            required: "Calories are required",
                            min: { value: 0, message: "Calories cannot be negative" },
                          })}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="e.g., 250"
                        />
                        {errors.calories && <p className="text-red-500 text-sm mt-1">{errors.calories.message}</p>}
                      </div>

                      <div>
                        <label className="block font-medium mb-2">Protein (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          {...register("protein", {
                            required: "Protein content is required",
                            min: { value: 0, message: "Protein cannot be negative" },
                          })}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="e.g., 15.5"
                        />
                        {errors.protein && <p className="text-red-500 text-sm mt-1">{errors.protein.message}</p>}
                      </div>

                      <div>
                        <label className="block font-medium mb-2">Fat (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          {...register("fat", {
                            required: "Fat content is required",
                            min: { value: 0, message: "Fat cannot be negative" },
                          })}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="e.g., 8.2"
                        />
                        {errors.fat && <p className="text-red-500 text-sm mt-1">{errors.fat.message}</p>}
                      </div>

                      <div>
                        <label className="block font-medium mb-2">Carbohydrates (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          {...register("carbs", {
                            required: "Carbohydrate content is required",
                            min: { value: 0, message: "Carbohydrates cannot be negative" },
                          })}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="e.g., 30.5"
                        />
                        {errors.carbs && <p className="text-red-500 text-sm mt-1">{errors.carbs.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-2">Recipe Image</label>
                      {mode === "update" && currentImage && !imagePreviewUrl && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Current image:</p>
                          <img
                            src={currentImage || "/image/default.png"} // Use currentImage
                            alt="Current recipe"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                      {imagePreviewUrl && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">New image preview:</p>
                          <img
                            src={imagePreviewUrl || "/placeholder.svg"}
                            alt="Recipe preview"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        {...register("imageFile")}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {mode === "update" && currentImage
                          ? "Upload a new image to replace the current one"
                          : "Upload a high-quality image of your finished recipe"}
                      </p>
                      {errors.imageFile && <p className="text-red-500 text-sm mt-1">{errors.imageFile.message}</p>}
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="flex justify-between mt-8">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                  >
                    Back
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded ml-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        {mode === "create" ? "Submitting..." : "Updating..."}
                      </>
                    ) : mode === "create" ? (
                      "Submit Recipe"
                    ) : (
                      "Update Recipe"
                    )}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default RecipeForm

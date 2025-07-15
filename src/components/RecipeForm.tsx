"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

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

interface RecipeFormProps {
  mode: "create" | "update"
  recipeId?: string
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

const RecipeForm = ({ mode, recipeId }: RecipeFormProps) => {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [recipeData, setRecipeData] = useState<RecipeFormData | null>(null)
  const [ingredientsPreview, setIngredientsPreview] = useState<string[]>([])
  const [instructionsPreview, setInstructionsPreview] = useState<string[]>([])
  const [customCategory, setCustomCategory] = useState("")
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(mode === "update")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RecipeFormData>()

  const watchedIngredients = watch("ingredients")
  const watchedInstructions = watch("instructions")
  const watchedCategory = watch("category")

  // Set client-side flag after the component is mounted
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Parse existing ingredients and instructions to display format
  const parseIngredientsFromBullets = (ingredients: string) => {
    if (!ingredients) return ""
    return ingredients
      .split("\n")
      .map((item) => item.replace(/^•\s*/, "").trim())
      .filter((item) => item.length > 0)
      .join(", ")
  }

  const parseInstructionsFromNumbers = (instructions: string) => {
    if (!instructions) return ""
    return instructions
      .split("\n")
      .map((item) => item.replace(/^\d+\.\s*/, "").trim())
      .filter((item) => item.length > 0)
      .join(". ")
  }

  // Fetch recipe data for update mode
  useEffect(() => {
    if (mode === "update" && recipeId && isClient) {
      console.log("Fetching recipe with ID:", recipeId)
      const fetchRecipeData = async () => {
        try {
          setIsLoading(true)
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/${recipeId}`)
          console.log("Fetched recipe data:", response.data)

          const fetchedData = response.data

          // Parse ingredients and instructions for editing
          const parsedData = {
            ...fetchedData,
            ingredients: parseIngredientsFromBullets(fetchedData.ingredients),
            instructions: parseInstructionsFromNumbers(fetchedData.instructions),
          }

          setRecipeData(parsedData)
          setCurrentImageUrl(fetchedData.imageUrl || "")

          // Check if category is custom (not in predefined list)
          if (!recipeCategories.includes(fetchedData.category)) {
            setCustomCategory(fetchedData.category)
            setShowCustomCategory(true)
            parsedData.category = "Other"
          }

          reset(parsedData)
        } catch (error) {
          console.error("Error fetching recipe data:", error)
          toast.error("Failed to load recipe data")
          router.push("/RecipeManagement/ManageRecipe/ManageRecipe")
        } finally {
          setIsLoading(false)
        }
      }
      fetchRecipeData()
    } else if (mode === "create") {
      setIsLoading(false)
    }
  }, [mode, recipeId, isClient, reset, router])

  // Handle ingredients formatting
  useEffect(() => {
    if (watchedIngredients) {
      const ingredientsList = watchedIngredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
      setIngredientsPreview(ingredientsList)
    } else {
      setIngredientsPreview([])
    }
  }, [watchedIngredients])

  // Handle instructions formatting
  useEffect(() => {
    if (watchedInstructions) {
      const instructionsList = watchedInstructions
        .split(/\.\s+|\n/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((item) => (item.endsWith(".") ? item : item + "."))
      setInstructionsPreview(instructionsList)
    } else {
      setInstructionsPreview([])
    }
  }, [watchedInstructions])

  // Handle custom category
  useEffect(() => {
    if (watchedCategory === "Other") {
      setShowCustomCategory(true)
    } else {
      setShowCustomCategory(false)
      if (watchedCategory && watchedCategory !== "Other") {
        setCustomCategory("")
      }
    }
  }, [watchedCategory])

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0))

  const formatIngredientsForSubmission = (ingredients: string) => {
    return ingredients
      .split(",")
      .map((item) => `• ${item.trim()}`)
      .filter((item) => item.length > 2)
      .join("\n")
  }

  const formatInstructionsForSubmission = (instructions: string) => {
    const instructionsList = instructions
      .split(/\.\s+|\n/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    return instructionsList.map((item, index) => `${index + 1}. ${item.endsWith(".") ? item : item + "."}`).join("\n")
  }

  const onSubmit = async (data: RecipeFormData) => {
    console.log(`Form ${mode}:`, data)
    try {
      const formData = new FormData()
      formData.append("title", data.title)

      // Use custom category if "Other" is selected
      const finalCategory = data.category === "Other" ? customCategory : data.category
      formData.append("category", finalCategory)

      formData.append("cookingTime", data.cookingTime.toString())
      formData.append("portion", data.portion.toString())

      // Format ingredients and instructions before submission
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
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/addRecipe1`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
      } else {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/updateRecipe/${recipeId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        )
      }

      console.log(`Recipe ${mode}d successfully:`, response.data)
      toast.success(`Recipe ${mode}d successfully!`)

      if (mode === "create") {
        reset()
        setStep(0)
        setIngredientsPreview([])
        setInstructionsPreview([])
        setCustomCategory("")
        setShowCustomCategory(false)
      }

      router.push("/RecipeManagement/ManageRecipe/ManageRecipe")
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(`Failed to ${mode} recipe: ` + (error.response?.data?.message || error.message))
      } else {
        console.error("Unexpected error:", error)
        toast.error("An unexpected error occurred.")
      }
    }
  }

  if (!isClient) return null

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe data...</p>
        </div>
      </div>
    )
  }

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

                  <div>
                    <label className="block font-medium mb-2">Category</label>
                    <select
                      {...register("category", { required: "Category is required" })}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">-- Select Category --</option>
                      {recipeCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}

                    {showCustomCategory && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Enter custom category"
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Cooking Time (minutes)</label>
                    <input
                      type="number"
                      {...register("cookingTime", {
                        required: "Cooking time is required",
                        min: { value: 1, message: "Cooking time must be at least 1 minute" },
                      })}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 30"
                    />
                    {errors.cookingTime && <p className="text-red-500 text-sm mt-1">{errors.cookingTime.message}</p>}
                  </div>

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
                      <span className="text-sm text-gray-500 font-normal">(Separate each ingredient with a comma)</span>
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
                              <span className="text-green-600 mr-2">•</span>
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
                    {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>}

                    {instructionsPreview.length > 0 && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Preview:</h4>
                        <ol className="space-y-2">
                          {instructionsPreview.map((instruction, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-600 font-medium mr-3 mt-0.5">{index + 1}.</span>
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
                    {mode === "update" && currentImageUrl && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Current image:</p>
                        <img
                          src={currentImageUrl || "/placeholder.svg"}
                          alt="Current recipe"
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
                      {mode === "update" && currentImageUrl
                        ? "Upload a new image to replace the current one"
                        : "Upload a high-quality image of your finished recipe"}
                    </p>
                    {errors.imageFile && <p className="text-red-500 text-sm mt-1">{errors.imageFile.message}</p>}
                  </div>
                </div>
              )}
            </motion.div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors ${
                  step === 0 ? "invisible" : ""
                }`}
              >
                Back
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {mode === "create" ? "Save Recipe" : "Update Recipe"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RecipeForm

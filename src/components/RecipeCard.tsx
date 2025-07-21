"use client"
import { Eye, Edit3, Trash2 } from "lucide-react"

interface Recipe {
  id: number
  title: string
  image: string | null
  description?: string
  cookingTime?: number
  difficulty?: string
  createdAt?: string
}

interface RecipeCardProps {
  recipe: Recipe
  onView?: () => void
  onUpdate?: () => void
  onDelete?: () => void
}

export default function RecipeCard({ recipe, onView, onUpdate, onDelete }: RecipeCardProps) {

  return (
    
    <div className="bg-white p-2 rounded-xl w-full max-w-sm group transition-all duration-200 overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1">
      {/* Recipe Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] rounded-lg">
      <img
        src={recipe.image || "/image/default.jpg"}
        alt={recipe.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>


      {/* Recipe Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1 text-center">{recipe.title}</h3>
        </div>

        {recipe.description && <p className="text-gray-600 text-sm line-clamp-2 mb-3">{recipe.description}</p>}
      </div>

      {/* Card Footer with Action Buttons */}
      <div className="p-4 pt-3 pb-3 bg-orange-100 border-t border-gray-200 rounded-lg">
        <div className="px-2 pb-3 gab-2 flex items-center justify-between w-full gap-2">
          {/* View Recipe Button */}
          <button
            onClick={onView}
            className=" text-sm font-medium text-green-700 bg-transparent rounded-md hover:bg-green-50 hover:border-green-300 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          {/* Update Button */}
          <button
            onClick={onUpdate}
            className=" text-sm font-medium text-black-700 bg-transparent rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="text-sm font-medium text-red-700 bg-transparent  rounded-md hover:bg-red-100 hover:border-red-200 transition-colors flex items-center justify-center"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Trash2, Info, X } from "lucide-react";

// Define interfaces for type safety
interface Recipe {
  id: number;
  name: string;
  author: string;
  description: string;
  ingredients: string[];
  instructions: string;
  visible: boolean;
  users: string[];
}

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([
    { 
      id: 1, 
      name: "Spaghetti Carbonara", 
      author: "Chef Alex", 
      description: "Classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
      ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan cheese", "Black pepper"],
      instructions: "Cook pasta, mix eggs with cheese, combine with hot pasta, add pancetta and pepper.",
      visible: true,
      users: ["user123", "user456"]
    },
    { 
      id: 2, 
      name: "Chicken Curry", 
      author: "Chef Priya", 
      description: "Spicy and aromatic Indian curry with tender chicken pieces.",
      ingredients: ["Chicken", "Curry powder", "Onions", "Garlic", "Tomatoes", "Coconut milk"],
      instructions: "Sauté onions and garlic, add chicken and spices, simmer with tomatoes and coconut milk.",
      visible: true,
      users: ["user789", "user123"] 
    },
    { 
      id: 3, 
      name: "Beef Tacos", 
      author: "Chef Maria", 
      description: "Mexican street-style tacos with seasoned beef.",
      ingredients: ["Ground beef", "Taco seasoning", "Tortillas", "Lettuce", "Cheese", "Salsa"],
      instructions: "Cook beef with seasoning, warm tortillas, assemble with toppings.",
      visible: false,
      users: ["user456"] 
    },
  ]);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const toggleVisibility = (id: number) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id ? {...recipe, visible: !recipe.visible} : recipe
    ));
  };

  const deleteRecipe = (id: number) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      if (selectedRecipe?.id === id) {
        setSelectedRecipe(null);
        setShowDetails(false);
      }
    }
  };

  const viewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Admin Recipe Management</h2>
      
      {/* Recipe Details Modal */}
      {showDetails && selectedRecipe ? (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-4">
          <div className="flex justify-between mb-4 items-center">
            <h3 className="text-xl sm:text-2xl font-bold">{selectedRecipe.name}</h3>
            <button 
              onClick={closeDetails}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-gray-700 mb-2"><span className="font-semibold">Author:</span> {selectedRecipe.author}</p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Visibility:</span> 
            <span className="inline-flex items-center gap-1 ml-1">
              {selectedRecipe.visible ? (
                <>
                  <Eye size={16} className="text-green-600" />
                  <span className="text-green-600">Visible</span>
                </>
              ) : (
                <>
                  <EyeOff size={16} className="text-red-600" />
                  <span className="text-red-600">Hidden</span>
                </>
              )}
            </span>
          </p>
          <p className="text-gray-700 mb-4">{selectedRecipe.description}</p>
          
          <div className="mb-4">
            <h4 className="font-semibold text-lg mb-2">Ingredients:</h4>
            <ul className="list-disc pl-5">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-lg mb-2">Instructions:</h4>
            <p className="text-gray-700">{selectedRecipe.instructions}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2">Associated Users:</h4>
            <ul className="list-disc pl-5">
              {selectedRecipe.users.map((user, index) => (
                <li key={index} className="text-gray-700">{user}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      
      {/* Recipe List */}
      {recipes.map((recipe) => (
        <div key={recipe.id} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">{recipe.name}</h2>
              <p className="text-gray-600">Author: {recipe.author}</p>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                {recipe.visible ? (
                  <>
                    <Eye size={16} className="text-green-600" />
                    <span className="text-green-600">Visible to users</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={16} className="text-red-600" />
                    <span className="text-red-600">Hidden from users</span>
                  </>
                )}
              </p>
              <p className="text-sm text-gray-500">Users: {recipe.users.length}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => viewDetails(recipe)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                title="View Details"
              >
                <Info size={16} /> 
                <span>Details</span>
              </button>
              <button
                onClick={() => toggleVisibility(recipe.id)}
                className={`px-3 py-1 ${recipe.visible ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} text-white rounded flex items-center gap-1`}
                title={recipe.visible ? "Hide Recipe" : "Show Recipe"}
              >
                {recipe.visible ? (
                  <>
                    <EyeOff size={16} />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    <span>Show</span>
                  </>
                )}
              </button>
              <button
                onClick={() => deleteRecipe(recipe.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                title="Delete Recipe"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {recipes.length === 0 && (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-700">No recipes available</p>
        </div>
      )}
    </div>
  );
}
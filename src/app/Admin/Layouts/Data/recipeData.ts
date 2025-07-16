// src/data/recipeData.ts

export interface Recipe {
  id?: number; // optional for POST
  name: string;
  author: string;
  description: string;
  ingredients: string[];
  instructions: string;
  visible: boolean;
  users: string[];
}

const API_BASE = "https://localhost:7155/api/recipes"; 

export const fetchRecipes = async (): Promise<Recipe[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
};

export const createRecipe = async (recipe: Recipe): Promise<Recipe> => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe),
  });
  if (!res.ok) throw new Error("Failed to create recipe");
  return res.json();
};

// (Optional: use later)
export const updateRecipe = async (id: number, recipe: Recipe): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe),
  });
  if (!res.ok) throw new Error("Failed to update recipe");
};

export const deleteRecipe = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete recipe");
};

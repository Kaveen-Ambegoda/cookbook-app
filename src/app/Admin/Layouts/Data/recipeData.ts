export interface Recipe {
  id?: number;
  title: string; // Primary field from API
  name?: string; // Computed property (maps to title)
  author?: string; // Will be populated from User data
  userID: number; // Changed to number to match your DTO
  description?: string; // Additional field
  ingredients: string;
  instructions: string;
  visible?: boolean; // Additional field for show/hide
  user?: number; // For compatibility with your component
  image?: string;   
  category?: string;
  cookingTime?: number;
  portion?: number;
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
}

const API_BASE = "https://localhost:7205/api/admin/AdminRecipes"; 

export const fetchRecipes = async (): Promise<Recipe[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
};





export const deleteRecipe = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete recipe");
};
export const mapApiRecipeToComponent = (apiRecipe: any): Recipe => ({
  id: apiRecipe.id,
  title: apiRecipe.title,
  name: apiRecipe.title, // Map title to name for component compatibility
  author: apiRecipe.author || `User ${apiRecipe.userID}`,
  userID: apiRecipe.userID,
  description: apiRecipe.description || '',
  ingredients: apiRecipe.ingredients,
  instructions: apiRecipe.instructions,
  visible: apiRecipe.visible ?? true,
  user: 1, // Set to 1 or actual user count as needed
  image: apiRecipe.image,
  category: apiRecipe.category,
  cookingTime: apiRecipe.cookingTime,
  portion: apiRecipe.portion,
  calories: apiRecipe.calories,
  carbs: apiRecipe.carbs,
  protein: apiRecipe.protein,
  fat: apiRecipe.fat
});

// For sending data to API
export const mapComponentRecipeToApi = (recipe: Recipe): any => ({
  id: recipe.id,
  title: recipe.name || recipe.title,
  category: recipe.category,
  cookingTime: recipe.cookingTime,
  portion: recipe.portion,
  calories: recipe.calories,
  carbs: recipe.carbs,
  protein: recipe.protein,
  fat: recipe.fat,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
  image: recipe.image,
  userID: recipe.userID,
  description: recipe.description,
  visible: recipe.visible
});

// Toggle recipe visibility - matches your backend exactly
export const toggleRecipeVisibility = async (id: number): Promise<{ visible: boolean }> => {
  try {
    console.log(`API Call: Toggling visibility for recipe ID: ${id}`);
    
    // Send empty body to let backend automatically toggle current state
    const response = await fetch(`${API_BASE}/${id}/toggle-visibility`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // Empty body = auto toggle
    });

    console.log(`API Response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorText = await response.text();
        errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      if (response.status === 404) {
        errorMessage = `Recipe with ID ${id} not found`;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('API Response result:', result);
    return result;
  } catch (error) {
    console.error('Error toggling recipe visibility:', error);
    throw error;
  }
};

// Alternative: Set specific visibility state
export const setRecipeVisibility = async (id: number, visible: boolean): Promise<{ visible: boolean }> => {
  try {
    const response = await fetch(`${API_BASE}/${id}/visibility`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ visible }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to set visibility: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error setting recipe visibility:', error);
    throw error;
  }
};
"use client";
import { toggleRecipeVisibility } from "@/app/Admin/Layouts/Data/recipeData";
import { Recipe, fetchRecipes, deleteRecipe as deleteRecipeApi } from "@/app/Admin/Layouts/Data/recipeData";
import { useEffect, useState, useMemo } from "react";
import { Eye, EyeOff, Trash2, Info, X, Search, RefreshCw, AlertCircle, CheckCircle, Users, Clock, ChefHat } from "lucide-react";

interface FilterState {
  search: string;
  visibility: 'all' | 'visible' | 'hidden';
  sortBy: 'name' | 'recent';
  sortOrder: 'asc' | 'desc';
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    visibility: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Filter and sort recipes with better logic
  const filteredRecipes = useMemo(() => {
    const normalizedSearch = (filters.search ?? '').toLowerCase();

    // Filter recipes
    let filtered = (recipes ?? []).filter(recipe => {
      const name = recipe?.title ?? '';
      const description = recipe?.description ?? '';
      const ingredients = recipe?.ingredients ?? '';
      const category = recipe?.category ?? '';

      const matchesSearch = !normalizedSearch || 
        name.toLowerCase().includes(normalizedSearch) ||
        description.toLowerCase().includes(normalizedSearch) ||
        ingredients.toLowerCase().includes(normalizedSearch) ||
        category.toLowerCase().includes(normalizedSearch);

      const matchesVisibility =
        filters.visibility === 'all' ||
        (filters.visibility === 'visible' && recipe?.visible) ||
        (filters.visibility === 'hidden' && !recipe?.visible);

      return matchesSearch && matchesVisibility;
    });

    // Sort recipes
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = (a?.title ?? '').localeCompare(b?.title ?? '');
          break;
        case 'recent':
          comparison = (a?.id ?? 0) - (b?.id ?? 0);
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [recipes, filters]);

  // Toast management
  const addToast = (type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch recipes
  const loadRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchRecipes();
      setRecipes(data);
      addToast('success', `Loaded ${data.length} recipes`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recipes';
      setError(errorMessage);
      addToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  // Toggle visibility
  const toggleVisibility = async (id: number) => {
    if (!id) {
      addToast('error', 'Invalid recipe ID');
      return;
    }

    // Find current recipe to get current visibility state
    const currentRecipe = recipes.find(r => r.id === id);
    if (!currentRecipe) {
      addToast('error', 'Recipe not found');
      return;
    }

    console.log(`Before toggle - Recipe ID: ${id}, Current visibility: ${currentRecipe.visible}`);

    try {
      // Optimistically update UI first
      const newVisibility = !currentRecipe.visible;
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, visible: newVisibility } : r))
      );

      // Call API - send empty body to let backend toggle automatically
      const result = await toggleRecipeVisibility(id);
      
      console.log(`After API call - Recipe ID: ${id}, New visibility: ${result.visible}`);
      
      // Update with actual result from server
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, visible: result.visible } : r))
      );
      
      addToast('success', `Recipe ${result.visible ? 'shown' : 'hidden'} successfully`);
    } catch (err) {
      // Revert optimistic update on error
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, visible: currentRecipe.visible } : r))
      );
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to update visibility';
      addToast('error', errorMessage);
      console.error('Toggle visibility error:', err);
    }
  };


  // Delete recipe
  const deleteRecipe = async (id: number) => {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    if (!confirm(`Delete "${recipe.title}"? This cannot be undone.`)) return;

    try {
      await deleteRecipeApi(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      addToast('success', `"${recipe.title}" deleted`);

      if (selectedRecipe?.id === id) {
        setSelectedRecipe(null);
        setShowDetails(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete recipe';
      addToast('error', errorMessage);
    }
  };

  // View recipe details
  const viewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowDetails(true);
  };

  // Update filter
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Get image URL with fallback
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return '/api/placeholder/300/200';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `/images/recipes/${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={32} />
          <p className="text-gray-600">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[320px] animate-slide-in ${
              toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
            <span className="flex-1 font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="hover:opacity-70 p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ChefHat className="text-orange-500" size={32} />
              Recipe Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and organize your recipe collection</p>
          </div>
          <button
            onClick={loadRecipes}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500" />
          <span className="flex-1">{error}</span>
          <button
            onClick={loadRecipes}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Recipes</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, ingredients, or category..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Visibility Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <select
              value={filters.visibility}
              onChange={(e) => updateFilter('visibility', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Recipes</option>
              <option value="visible">Visible Only</option>
              <option value="hidden">Hidden Only</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <span className="text-sm text-gray-600">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </span>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden group"
          >
            {/* Recipe Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img
                src={getImageUrl(recipe.image)}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/300/200';
                }}
              />
              <div className="absolute top-3 right-3">
                {recipe.visible ? (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Eye size={12} />
                    Visible
                  </span>
                ) : (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <EyeOff size={12} />
                    Hidden
                  </span>
                )}
              </div>
            </div>

            {/* Recipe Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {recipe.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {recipe.description || 'No description available'}
              </p>

              {/* Recipe Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{recipe.cookingTime || 0} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{recipe.portion || 1} servings</span>
                </div>
              </div>

              {/* Category Badge */}
              {recipe.category && (
                <div className="mb-4">
                  <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                    {recipe.category}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => viewDetails(recipe)}
                  className="flex-1 px-3 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <Info size={14} />
                  View
                </button>

                <button
                  onClick={() => toggleVisibility(recipe.id!)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center justify-center transition-colors ${
                    recipe.visible
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {recipe.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>

                <button
                  onClick={() => deleteRecipe(recipe.id!)}
                  className="px-3 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredRecipes.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-xl p-12 max-w-md mx-auto">
            <ChefHat className="mx-auto mb-4 text-gray-300" size={64} />
            {recipes.length === 0 ? (
              <>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No recipes yet</h3>
                <p className="text-gray-600">Start building your recipe collection!</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No matches found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search terms.</p>
                <button
                  onClick={() => setFilters({ search: '', visibility: 'all', sortBy: 'name', sortOrder: 'asc' })}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Clear Search
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Recipe Details Modal */}
      {showDetails && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedRecipe.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {selectedRecipe.cookingTime} minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {selectedRecipe.portion} servings
                    </span>
                    <span className={`flex items-center gap-1 ${selectedRecipe.visible ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedRecipe.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      {selectedRecipe.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image and Basic Info */}
                <div className="space-y-6">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(selectedRecipe.image)}
                      alt={selectedRecipe.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/api/placeholder/400/300';
                      }}
                    />
                  </div>

                  {/* Nutritional Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-lg mb-4">Nutritional Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Calories:</span>
                        <span className="font-medium ml-2">{selectedRecipe.calories || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Protein:</span>
                        <span className="font-medium ml-2">{selectedRecipe.protein || 0}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Carbs:</span>
                        <span className="font-medium ml-2">{selectedRecipe.carbs || 0}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fat:</span>
                        <span className="font-medium ml-2">{selectedRecipe.fat || 0}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Recipe Details */}
                <div className="space-y-6">
                  {selectedRecipe.description && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Description</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedRecipe.description}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-lg mb-3">Ingredients</h4>
                    <div className="bg-white border rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-line">{selectedRecipe.ingredients}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3">Instructions</h4>
                    <div className="bg-white border rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{selectedRecipe.instructions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
}
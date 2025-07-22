"use client";

import { Recipe, fetchRecipes, updateRecipe, deleteRecipe as deleteRecipeApi } from "@/app/Admin/Layouts/Data/recipeData";
import { useEffect, useState, useMemo } from "react";
import { Eye, EyeOff, Trash2, Info, X, Search, Filter, RefreshCw, AlertCircle, CheckCircle, Users, Calendar, SortAsc, SortDesc } from "lucide-react";

interface FilterState {
  search: string;
  visibility: 'all' | 'visible' | 'hidden';
  author: string;
  sortBy: 'name' | 'author' | 'users' | 'recent';
  sortOrder: 'asc' | 'desc';
  userFilter: string;
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
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    visibility: 'all',
    author: '',
    sortBy: 'name',
    sortOrder: 'asc',
    userFilter: ''
  });

  // Get unique authors and users for filter dropdowns
  const uniqueAuthors = useMemo(() => {
    const authors = recipes.map(recipe => recipe.author);
    return [...new Set(authors)].sort();
  }, [recipes]);

  const uniqueUsers = useMemo(() => {
    const users = recipes.flatMap(recipe => recipe.users);
    return [...new Set(users)].sort();
  }, [recipes]);

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesVisibility = filters.visibility === 'all' || 
                               (filters.visibility === 'visible' && recipe.visible) ||
                               (filters.visibility === 'hidden' && !recipe.visible);
      
      const matchesAuthor = !filters.author || recipe.author === filters.author;
      
      const matchesUser = !filters.userFilter || recipe.users.includes(filters.userFilter);
      
      return matchesSearch && matchesVisibility && matchesAuthor && matchesUser;
    });

    // Sort recipes
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'users':
          comparison = a.users.length - b.users.length;
          break;
        case 'recent':
          // Since we don't have timestamps, we'll sort by ID (assuming higher ID = more recent)
          comparison = (a.id || 0) - (b.id || 0);
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
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch recipes with error handling
  const loadRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchRecipes();
      setRecipes(data);
      addToast('success', `Loaded ${data.length} recipes successfully`);
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

  // Toggle visibility with error handling
  const toggleVisibility = async (id: number) => {
    try {
      const recipe = recipes.find(r => r.id === id);
      if (!recipe) return;

      const updatedRecipe = { ...recipe, visible: !recipe.visible };
      await updateRecipe(id, updatedRecipe);

      setRecipes(recipes.map(r => (r.id === id ? updatedRecipe : r)));
      addToast('success', `Recipe ${updatedRecipe.visible ? 'shown' : 'hidden'} successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle visibility';
      addToast('error', errorMessage);
    }
  };

  // Delete recipe with error handling
  const deleteRecipe = async (id: number) => {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    if (!confirm(`Are you sure you want to delete "${recipe.name}"? This action cannot be undone.`)) return;

    try {
      await deleteRecipeApi(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      addToast('success', `Recipe "${recipe.name}" deleted successfully`);

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

  // Close details modal
  const closeDetails = () => {
    setShowDetails(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      visibility: 'all',
      author: '',
      sortBy: 'name',
      sortOrder: 'asc',
      userFilter: ''
    });
  };

  // Update filter
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="animate-spin mr-2" size={20} />
        <span>Loading recipes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px] ${
              toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={16} />}
            {toast.type === 'error' && <AlertCircle size={16} />}
            {toast.type === 'info' && <Info size={16} />}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="hover:opacity-70"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Recipe Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Filter size={16} />
            Filters
          </button>
          <button
            onClick={loadRecipes}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={loadRecipes}
            className="ml-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium mb-1">Visibility</label>
              <select
                value={filters.visibility}
                onChange={(e) => updateFilter('visibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Recipes</option>
                <option value="visible">Visible Only</option>
                <option value="hidden">Hidden Only</option>
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <select
                value={filters.author}
                onChange={(e) => updateFilter('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Authors</option>
                {uniqueAuthors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>

            {/* User Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">User</label>
              <select
                value={filters.userFilter}
                onChange={(e) => updateFilter('userFilter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="author">Author</option>
                <option value="users">User Count</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <button
                onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                {filters.sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {filteredRecipes.length} of {recipes.length} recipes
            </span>
            <button
              onClick={resetFilters}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Recipe Details Modal */}
      {showDetails && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedRecipe.name}</h3>
                <button
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Author:</span> {selectedRecipe.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    {selectedRecipe.visible ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <Eye size={16} /> Visible
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <EyeOff size={16} /> Hidden
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-semibold">Description:</span>
                  <p className="mt-1 text-gray-700">{selectedRecipe.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Ingredients:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-700">{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Instructions:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedRecipe.instructions}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Users size={18} />
                    Associated Users ({selectedRecipe.users.length}):
                  </h4>
                  {selectedRecipe.users.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.users.map((user, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {user}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No users associated with this recipe</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe List */}
      <div className="space-y-4">
        {filteredRecipes.map(recipe => (
          <div
            key={recipe.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{recipe.name}</h3>
                <p className="text-gray-600 mb-2">Author: {recipe.author}</p>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {recipe.visible ? (
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
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users size={16} />
                    <span>{recipe.users.length} users</span>
                  </div>
                  
                  <div className="text-gray-500">
                    {recipe.ingredients.length} ingredients
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => viewDetails(recipe)}
                  className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 min-w-[100px] justify-center"
                >
                  <Info size={16} />
                  Details
                </button>

                <button
                  onClick={() => toggleVisibility(recipe.id!)}
                  className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 min-w-[100px] justify-center ${
                    recipe.visible
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {recipe.visible ? (
                    <>
                      <EyeOff size={16} />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      Show
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteRecipe(recipe.id!)}
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2 min-w-[100px] justify-center"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredRecipes.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-lg p-8">
            {recipes.length === 0 ? (
              <>
                <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">Get started by creating your first recipe.</p>
              </>
            ) : (
              <>
                <Search className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes match your filters</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria.</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
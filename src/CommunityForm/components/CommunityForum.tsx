"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  Users, 
  Heart, 
  Home,
  BookOpen,
  ChefHat,
  Utensils, 
  Salad, 
  Cake, 
  Gift, 
  Tag
} from 'lucide-react';
import useForums from '../hooks/UseForums';
import SearchFilters from './SearchFilters';
import ForumPost from './ForumPost';
import CreateForumModal from './CreateForumModal';
import { CreateForumData } from '../types/index';

interface CommunityForumProps {
  userId: string;
}

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'All':
      return <Home size={18} className="mr-2" />;
    case 'Vegetarian':
      return <Salad size={18} className="mr-2" />;
    case 'Baking':
      return <Cake size={18} className="mr-2" />;
    case 'Ingredients':
      return <Tag size={18} className="mr-2" />;
    case 'Holidays':
      return <Gift size={18} className="mr-2" />;
    case 'Dinner':
      return <Utensils size={18} className="mr-2" />;
    case 'Desserts':
      return <Cake size={18} className="mr-2" />;
    default:
      return <ChefHat size={18} className="mr-2" />;
  }
};

const CommunityForum: React.FC<CommunityForumProps> = ({ userId = 'CurrentUser' }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const {
    forums,
    comments,
    authors,
    categories,
    isLoading,
    error,
    filters,
    setFilter,
    activeCommentId,
    setActiveCommentId,
    fetchForums,
    fetchComments,
    toggleFavorite,
    handleUpvote,
    handleDownvote,
    createForum,
    addComment,
    addReply
  } = useForums({ currentUserId: userId });
  
  // Fetch forums only once when component mounts
  useEffect(() => {
    // Initial data loading
    fetchForums();
    
    // Reset filters on mount - do this only once
    setFilter('category', 'All');
    setFilter('showMyForums', false);
    setFilter('showFavorites', false);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only on mount
  
  // Fetch comments when activeCommentId changes
  useEffect(() => {
    if (activeCommentId) {
      fetchComments(activeCommentId);
    }
  }, [activeCommentId, fetchComments]);
  
  const handleToggleComments = (forumId: string) => {
    setActiveCommentId(activeCommentId === forumId ? null : forumId);
  };
  
  const handleCreateForum = async (data: CreateForumData) => {
    await createForum(data);
    setIsCreateModalOpen(false);
    // Reset category to "All" to ensure the new forum is visible
    setFilter('category', 'All');
  };

  // Handler for All Forums button
  const showAllForums = () => {
    setFilter('showMyForums', false);
    setFilter('showFavorites', false);
    setFilter('category', 'All');
  };
  
  // Handler for My Forums button
  const toggleMyForums = () => {
    setFilter('showMyForums', !filters.showMyForums);
    if (filters.showFavorites) {
      setFilter('showFavorites', false);
    }
  };
  
  // Handler for Favorites button
  const toggleFavorites = () => {
    setFilter('showFavorites', !filters.showFavorites);
    if (filters.showMyForums) {
      setFilter('showMyForums', false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <BookOpen size={24} className="mr-2 text-green-600" />
          Community Cookbook Forum
        </h1>
      </div>
      
      {/* Search and Filter Section */}
      <SearchFilters
        filters={filters}
        setFilter={setFilter}
        authors={authors}
        categories={categories}
      />
      
      {/* Action Buttons */}
      <div className="flex justify-between mb-8">
        <div className="flex gap-4">
          <button 
            className={`py-2 px-4 rounded-lg flex items-center ${!filters.showMyForums && !filters.showFavorites ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`}
            onClick={showAllForums}
          >
            <Home size={18} className="mr-2" />
            All Forums
          </button>

          <button 
            className={`py-2 px-4 rounded-lg flex items-center ${filters.showMyForums ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
            onClick={toggleMyForums}
          >
            <Users size={18} className="mr-2" />
            My Forums
          </button>
          
          <button 
            className={`py-2 px-4 rounded-lg flex items-center ${filters.showFavorites ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'}`}
            onClick={toggleFavorites}
          >
            <Heart size={18} className="mr-2" />
            Favorites
          </button>
        </div>
        <button 
          className="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} />
          Create Forum
        </button>
      </div>
      
      {/* Category Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`flex items-center text-sm py-1 px-3 rounded-full border ${filters.category === category ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setFilter('category', category)}
          >
            {getCategoryIcon(category)}
            {category}
          </button>
        ))}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-2 text-gray-500">Loading forums...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {forums.length > 0 ? (
            forums.map(forum => (
              <ForumPost
                key={forum.id}
                forum={forum}
                onToggleFavorite={toggleFavorite}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
                onToggleComments={handleToggleComments}
                activeCommentId={activeCommentId}
                onAddComment={addComment}
                onAddReply={addReply}
                comments={comments[forum.id] || []}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">
                {filters.showMyForums 
                  ? "You haven't created any forums yet." 
                  : filters.showFavorites
                    ? "You don't have any favorite forums."
                    : "No forums found matching your criteria."
                }
              </p>
              <button 
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg flex items-center gap-2 mx-auto"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={18} />
                Create Your First Forum
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Create Forum Modal */}
      {isCreateModalOpen && (
        <CreateForumModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onCreate={handleCreateForum}
          categories={categories.filter(cat => cat !== 'All')}
        />
      )}
    </div>
  );
};

export default CommunityForum;
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, SortDesc } from 'lucide-react';
import { inter, roboto } from '@/app/utils/fonts';
import useForums from '../hooks/UseForums';
import SearchFilters from './SearchFilters';
import ForumPost from './ForumPost';
import CreateForumModal from './CreateForumModal';
import { CreateForumData } from '../types/index';

const CommunityForum: React.FC = () => {
  const router = useRouter();
  
  // Always call useState hooks first - in same order every time
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Always call useForums hook - never conditionally
  const {
    forums,
    comments,
    authors,
    categories,
    isLoading,
    error,
    filters,
    authState,
    sortBy,
    setFilter,
    setSortBy,
    activeCommentId,
    setActiveCommentId,
    fetchForums,
    fetchComments,
    incrementView,
    toggleFavorite,
    handleUpvote,
    handleDownvote,
    createForum,
    updateForum,
    deleteForum,
    addComment,
    addReply
  } = useForums();
  
  // Always call useEffect hooks - never conditionally
  useEffect(() => {
    if (activeCommentId) {
      fetchComments(activeCommentId);
    }
  }, [activeCommentId, fetchComments]);

  // Auto-fetch forums when filters change
  useEffect(() => {
    if (authState.isAuthenticated && !authState.loading) {
      fetchForums();
    }
  }, [filters, sortBy, authState.isAuthenticated, authState.loading, fetchForums]);
  
  // Handler functions - these are regular functions, not hooks
  const handleToggleComments = (forumId: string) => {
    setActiveCommentId(activeCommentId === forumId ? null : forumId);
  };
  
  const handleCreateForum = async (data: CreateForumData) => {
    try {
      await createForum(data);
      setIsCreateModalOpen(false);
      // Reset category to "All" to ensure the new forum is visible
      setFilter('category', 'All');
    } catch (error) {
      console.error('Failed to create forum:', error);
    }
  };

  // Handler for All Forums button
  const showAllForums = () => {
    setFilter('showMyForums', false);
    setFilter('showFavorites', false);
    setFilter('category', 'All');
    setFilter('author', 'All');
    setFilter('searchQuery', '');
  };
  
  // Handler for My Forums button
  const toggleMyForums = () => {
    setFilter('showMyForums', !filters.showMyForums);
    setFilter('showFavorites', false);
    setFilter('category', 'All');
    setFilter('author', 'All');
  };
  
  // Handler for Favorites button
  const toggleFavorites = () => {
    setFilter('showFavorites', !filters.showFavorites);
    setFilter('showMyForums', false);
    setFilter('category', 'All');
    setFilter('author', 'All');
  };

  // Handler to increment view when forum is clicked
  const handleForumClick = (forumId: string) => {
    incrementView(forumId);
  };
  
  // Render loading state - no conditional hooks here
  if (authState.loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <p className={`mt-4 text-gray-500 ${inter.className}`}>Loading...</p>
        </div>
      </div>
    );
  }
  
  // Render login prompt - no conditional hooks here
  if (!authState.isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <h2 className={`text-2xl font-bold text-gray-800 mb-4 ${inter.className}`}>
            Welcome to Community Forum
          </h2>
          <p className={`text-gray-600 mb-6 ${roboto.className}`}>
            Please log in to participate in discussions and share your cooking experiences!
          </p>
          <div className="space-x-4">
            <button 
              className={`bg-[#F25019] text-white py-3 px-6 rounded-lg hover:bg-[#C93E0F] transition-colors ${roboto.className}`}
              onClick={() => router.push('/Pages/Login_Register/Login')}
            >
              Log In
            </button>
            <button 
              className={`bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors ${roboto.className}`}
              onClick={() => router.push('/Pages/Login_Register/Register')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine active filter for better UX (used in empty state)
  const getActiveFilterText = () => {
    if (filters.showMyForums) return 'My Forums';
    if (filters.showFavorites) return 'Favorites';
    return 'All Forums';
  };
  
  // Main component render - no conditional hooks here
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold text-gray-800 mb-2 ${inter.className}`}>
          Community Forum
        </h1>
        <p className={`text-gray-600 ${roboto.className}`}>
          Welcome back, {authState.user?.username}! Share your cooking journey with the community.
        </p>
      </div>

      {/* Search and Filter Section */}
      <SearchFilters
        filters={filters}
        setFilter={setFilter}
        authors={authors}
        categories={categories}
      />
      
      {/* Action Buttons and Sorting */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <button 
            className={`py-3 px-6 rounded-lg font-medium transition-all duration-200 border-2 ${
              !filters.showMyForums && !filters.showFavorites 
                ? 'bg-green-600 text-white border-green-600 shadow-lg transform scale-105' 
                : 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600 hover:shadow-md'
            } ${roboto.className}`}
            onClick={showAllForums}
          >
            All Forums
          </button>

          <button 
            className={`py-3 px-6 rounded-lg font-medium transition-all duration-200 border-2 ${
              filters.showMyForums 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105' 
                : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 hover:shadow-md'
            } ${roboto.className}`}
            onClick={toggleMyForums}
          >
            My Forums
          </button>
          
          <button 
            className={`py-3 px-6 rounded-lg font-medium transition-all duration-200 border-2 ${
              filters.showFavorites 
                ? 'bg-purple-600 text-white border-purple-600 shadow-lg transform scale-105' 
                : 'bg-purple-500 text-white border-purple-500 hover:bg-purple-600 hover:border-purple-600 hover:shadow-md'
            } ${roboto.className}`}
            onClick={toggleFavorites}
          >
            Favorites
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SortDesc size={20} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F25019] focus:border-[#F25019] ${roboto.className}`}
            >
              <option value="score">Best Score</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="views">Most Viewed</option>
              <option value="comments">Most Comments</option>
            </select>
          </div>

          <button 
            className={`bg-[#F25019] text-white py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-[#C93E0F] transition-all duration-200 shadow-md hover:shadow-lg ${roboto.className}`}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={18} />
            Create Forum
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
          <p className={roboto.className}>{error}</p>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <p className={`mt-2 text-gray-500 ${roboto.className}`}>Loading forums...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {forums.length > 0 ? (
            forums.map(forum => (
              <div key={forum.id} onClick={() => handleForumClick(forum.id)}>
                <ForumPost
                  forum={forum}
                  currentUserId={authState.user?.id}
                  onToggleFavorite={toggleFavorite}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  onToggleComments={handleToggleComments}
                  activeCommentId={activeCommentId}
                  onAddComment={addComment}
                  onAddReply={addReply}
                  onUpdateForum={updateForum}
                  onDeleteForum={deleteForum}
                  comments={comments[forum.id] || []}
                  categories={categories.filter(cat => cat !== 'All')}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <p className={`text-gray-500 mb-2 ${roboto.className}`}>
                {filters.showMyForums 
                  ? "You haven't created any forums yet." 
                  : filters.showFavorites
                    ? "You don't have any favorite forums."
                    : "No forums found matching your criteria."
                }
              </p>
              <p className={`text-sm text-gray-400 mb-4 ${roboto.className}`}>
                Current filter: {getActiveFilterText()}
              </p>
              <button 
                className={`bg-[#F25019] text-white py-3 px-6 rounded-lg hover:bg-[#C93E0F] transition-colors ${roboto.className}`}
                onClick={() => setIsCreateModalOpen(true)}
              >
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
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Forum, ForumFilters, Comment, CreateForumData, UpdateForumData, AuthState, User, VoteResponse } from '../types/index';

// API base URL (matches your backend configuration)
const API_URL = 'http://localhost:5007/api';

interface UseForumsProps {
  currentUserId?: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to get auth headers for FormData
const getAuthHeadersForFormData = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Separate auth hook - moved outside of useForums to avoid hooks order issues
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Decode token to get user info (you might want to validate with backend)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Try multiple possible claim names for user ID
        const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                      payload.nameid || 
                      payload.sub || 
                      payload.userId || 
                      payload.id;
                      
        // Try multiple possible claim names for username
        const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
                        payload.unique_name || 
                        payload.username || 
                        payload.name;
                        
        // Try multiple possible claim names for email
        const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 
                     payload.email || 
                     '';
        
        const user: User = {
          id: userId,
          username: username,
          email: email
        };
        
        setAuthState({
          isAuthenticated: true,
          user,
          token,
          loading: false
        });
      } catch (error) {
        console.error('Error parsing token:', error);
        localStorage.removeItem('token');
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false
    });
  }, []);

  return { authState, logout };
};

const useForums = ({ currentUserId }: UseForumsProps = {}) => {
  // Always call useAuth hook first - never conditionally
  const { authState } = useAuth();
  
  // All useState hooks - called in same order every time
  const [forums, setForums] = useState<Forum[]>([]);
  const [filteredForums, setFilteredForums] = useState<Forum[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [filters, setFilters] = useState<ForumFilters>({
    searchQuery: '',
    author: 'All',
    category: 'All',
    showFavorites: false,
    showMyForums: false
  });
  const [categories, setCategories] = useState<string[]>(['All', 'Recipes', 'Tips', 'Questions', 'General', 'Techniques', 'Ingredients']);
  const [authors, setAuthors] = useState<string[]>(['All']);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('score'); // New state for sorting

  // Use authenticated user ID if not provided
  const userId = currentUserId || authState.user?.id || '';

  // All useCallback hooks - called in same order every time
  const setFilter = useCallback((key: keyof ForumFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const fetchCategories = useCallback(async () => {
    // Only make API call if authenticated, but always define the function
    if (!authState.isAuthenticated) return;
    
    try {
      const response = await fetch(`${API_URL}/Community/categories`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch categories');

      const data = await response.json();
      setCategories(['All', ...data]);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Use default categories if API fails
      setCategories(['All', 'Recipes', 'Tips', 'Questions', 'General']);
    }
  }, [authState.isAuthenticated]);

  const fetchAuthors = useCallback(async () => {
    // Only make API call if authenticated, but always define the function
    if (!authState.isAuthenticated) return;
    
    try {
      const response = await fetch(`${API_URL}/Community/authors`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch authors');

      const data = await response.json();
      setAuthors(['All', ...data]);
    } catch (err) {
      console.error('Error fetching authors:', err);
      setAuthors(['All']);
    }
  }, [authState.isAuthenticated]);

  const fetchForums = useCallback(async () => {
    // Only make API call if authenticated, but always define the function
    if (!authState.isAuthenticated) {
      setForums([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      // Only add non-default filter values
      if (filters.searchQuery?.trim()) {
        queryParams.append('searchQuery', filters.searchQuery.trim());
      }
      if (filters.author && filters.author !== 'All') {
        queryParams.append('author', filters.author);
      }
      if (filters.category && filters.category !== 'All') {
        queryParams.append('category', filters.category);
      }
      if (filters.showFavorites) {
        queryParams.append('showFavorites', 'true');
      }
      if (filters.showMyForums) {
        queryParams.append('showMyForums', 'true');
      }
      if (userId) {
        queryParams.append('userId', userId);
      }
      // Add sort parameter
      queryParams.append('sortBy', sortBy);

      const url = `${API_URL}/Community?${queryParams.toString()}`;
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view forums');
        }
        throw new Error(`Failed to fetch forums: ${response.status}`);
      }

      const data = await response.json();
      setForums(data);
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch forums. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, userId, authState.isAuthenticated, sortBy]);

  const fetchComments = useCallback(async (forumId: string) => {
    // Only make API call if authenticated, but always define the function
    if (!authState.isAuthenticated || comments[forumId]) return;

    try {
      const response = await fetch(`${API_URL}/Community/${forumId}/comments`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();

      setComments(prev => ({
        ...prev,
        [forumId]: data
      }));
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  }, [comments, authState.isAuthenticated]);

  const incrementView = useCallback(async (id: string) => {
    if (!authState.isAuthenticated) return;
    
    try {
      const response = await fetch(`${API_URL}/Community/${id}/view`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        console.error('Failed to increment view');
        return;
      }

      const data = await response.json();

      // Update local forum data
      setForums(prev =>
        prev.map(forum =>
          forum.id === id ? { ...forum, views: data.views } : forum
        )
      );
    } catch (err) {
      console.error('Failed to increment view:', err);
    }
  }, [authState.isAuthenticated]);

  const toggleFavorite = useCallback(async (id: string) => {
    if (!authState.isAuthenticated) return;
    
    try {
      const response = await fetch(`${API_URL}/Community/${id}/favorite`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      const data = await response.json();

      setForums(prev =>
        prev.map(forum =>
          forum.id === id ? { ...forum, isFavorite: data.isFavorite } : forum
        )
      );
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  }, [authState.isAuthenticated]);

  // Updated smart voting functions
  const handleUpvote = useCallback(async (id: string) => {
    if (!authState.isAuthenticated) return;
    
    try {
      const response = await fetch(`${API_URL}/Community/${id}/upvote`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to upvote');
      }

      const data: VoteResponse = await response.json();

      setForums(prev => {
        const updatedForums = prev.map(forum =>
          forum.id === id ? { 
            ...forum, 
            upvotes: data.upvotes,
            downvotes: data.downvotes,
            userVote: data.userVote
          } : forum
        );
        
        // Re-sort if sorting by score
        if (sortBy === 'score') {
          return updatedForums.sort((a, b) => {
            const scoreA = a.upvotes - a.downvotes;
            const scoreB = b.upvotes - b.downvotes;
            return scoreB - scoreA;
          });
        }
        
        return updatedForums;
      });
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  }, [authState.isAuthenticated, sortBy]);

  const handleDownvote = useCallback(async (id: string) => {
    if (!authState.isAuthenticated) return;
    
    try {
      const response = await fetch(`${API_URL}/Community/${id}/downvote`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to downvote');
      }

      const data: VoteResponse = await response.json();

      setForums(prev => {
        const updatedForums = prev.map(forum =>
          forum.id === id ? { 
            ...forum, 
            upvotes: data.upvotes,
            downvotes: data.downvotes,
            userVote: data.userVote
          } : forum
        );
        
        // Re-sort if sorting by score
        if (sortBy === 'score') {
          return updatedForums.sort((a, b) => {
            const scoreA = a.upvotes - a.downvotes;
            const scoreB = b.upvotes - b.downvotes;
            return scoreB - scoreA;
          });
        }
        
        return updatedForums;
      });
    } catch (err) {
      console.error('Failed to downvote:', err);
    }
  }, [authState.isAuthenticated, sortBy]);

  const createForum = useCallback(async (data: CreateForumData) => {
    if (!authState.isAuthenticated) throw new Error('Please log in to create a forum');
    
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.url) formData.append('url', data.url);
      formData.append('category', data.category);
      if (data.image) formData.append('image', data.image);

      const response = await fetch(`${API_URL}/Community`, {
        method: 'POST',
        headers: getAuthHeadersForFormData(),
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create forum');
      }

      const createdForum = await response.json();

      setForums(prev => [createdForum, ...prev]);

      return createdForum;
    } catch (err) {
      console.error('Failed to create forum:', err);
      throw err;
    }
  }, [authState.isAuthenticated]);

  const addComment = useCallback(async (forumId: string, content: string) => {
    if (!authState.isAuthenticated) throw new Error('Please log in to comment');
    
    try {
      const response = await fetch(`${API_URL}/Community/${forumId}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();

      setComments(prev => ({
        ...prev,
        [forumId]: [...(prev[forumId] || []), newComment]
      }));

      setForums(prev =>
        prev.map(forum =>
          forum.id === forumId ? { ...forum, comments: forum.comments + 1 } : forum
        )
      );

      return newComment;
    } catch (err) {
      console.error('Failed to add comment:', err);
      throw err;
    }
  }, [authState.isAuthenticated]);

  const addReply = useCallback(async (forumId: string, commentId: string, content: string) => {
    if (!authState.isAuthenticated) throw new Error('Please log in to reply');
    
    try {
      const response = await fetch(`${API_URL}/Community/comments/${commentId}/replies`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      const newReply = await response.json();

      setComments(prev => {
        const forumComments = prev[forumId] || [];
        const updatedComments = forumComments.map(comment =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        );

        return {
          ...prev,
          [forumId]: updatedComments
        };
      });

      setForums(prev =>
        prev.map(forum =>
          forum.id === forumId ? { ...forum, comments: forum.comments + 1 } : forum
        )
      );

      return newReply;
    } catch (err) {
      console.error('Failed to add reply:', err);
      throw err;
    }
  }, [authState.isAuthenticated]);

  const updateForum = useCallback(async (data: UpdateForumData) => {
    if (!authState.isAuthenticated) throw new Error('Please log in to edit a forum');
    
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.url) formData.append('url', data.url);
      formData.append('category', data.category);
      if (data.image) formData.append('image', data.image);

      const response = await fetch(`${API_URL}/Community/${data.id}`, {
        method: 'PUT',
        headers: getAuthHeadersForFormData(),
        body: formData
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You can only edit your own forums');
        }
        throw new Error('Failed to update forum');
      }

      const updatedForum = await response.json();

      setForums(prev => 
        prev.map(forum => 
          forum.id === data.id ? updatedForum : forum
        )
      );

      return updatedForum;
    } catch (err) {
      console.error('Failed to update forum:', err);
      throw err;
    }
  }, [authState.isAuthenticated]);

  const deleteForum = useCallback(async (forumId: string) => {
    if (!authState.isAuthenticated) {
      throw new Error('Please log in to delete a forum');
    }
    
    console.log('Attempting to delete forum:', forumId);
    console.log('Current user ID:', userId);
    console.log('Auth token exists:', !!localStorage.getItem('token'));
    
    try {
      const url = `${API_URL}/Community/${forumId}`;
      console.log('Delete URL:', url);
      
      const headers = getAuthHeaders();
      console.log('Request headers:', headers);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);

      if (!response.ok) {
        // Get the response body for better error details
        let errorMessage = 'Failed to delete forum';
        
        try {
          // Try to read as JSON first
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.log('Error response data:', errorData);
            errorMessage = errorData.message || errorData.title || errorMessage;
          } else {
            // Read as text if not JSON
            const errorText = await response.text();
            console.log('Error response text:', errorText);
            if (errorText) {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        
        // Provide specific error messages based on status code
        if (response.status === 401) {
          errorMessage = 'Please log in to delete this forum';
        } else if (response.status === 403) {
          errorMessage = 'You can only delete your own forums';
        } else if (response.status === 404) {
          errorMessage = 'Forum not found or already deleted';
        } else if (response.status === 500) {
          errorMessage = 'Server error occurred while deleting the forum. Please try again.';
        }
        
        console.error('Delete failed with status:', response.status, 'Message:', errorMessage);
        throw new Error(errorMessage);
      }

      // Success - remove from local state
      setForums(prev => prev.filter(forum => forum.id !== forumId));
      
      // Remove comments for this forum
      setComments(prev => {
        const updated = { ...prev };
        delete updated[forumId];
        return updated;
      });

      console.log('Forum deleted successfully');
      return { success: true };
    } catch (err) {
      console.error('Delete forum error:', err);
      // Re-throw to let the component handle the error
      throw err;
    }
  }, [authState.isAuthenticated, userId]);

  // Filter forums when dependencies change - always run this effect
  useEffect(() => {
    if (forums.length === 0) return;
    
    let result = [...forums];

    if (filters.searchQuery) {
      result = result.filter(forum =>
        forum.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.author !== 'All') {
      result = result.filter(forum => forum.author === filters.author);
    }

    if (filters.category !== 'All') {
      result = result.filter(forum => forum.category === filters.category);
    }

    if (filters.showFavorites) {
      result = result.filter(forum => forum.isFavorite);
    }

    if (filters.showMyForums) {
      result = result.filter(forum => forum.userId === userId);
    }

    setFilteredForums(result);
  }, [forums, filters, userId]);

  // Initialize data when authenticated - always run this effect
  useEffect(() => {
    if (authState.isAuthenticated && !authState.loading) {
      fetchCategories();
      fetchAuthors();
      fetchForums();
    }
  }, [authState.isAuthenticated, authState.loading, fetchCategories, fetchAuthors, fetchForums]);

  return {
    // Data
    forums: filteredForums,
    comments,
    authors,
    categories,
    isLoading,
    error,
    activeCommentId,
    filters,
    sortBy,
    
    // Auth state
    authState,
    
    // Actions
    setFilter,
    setSortBy,
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
    addReply,
    setActiveCommentId
  };
};

export default useForums;
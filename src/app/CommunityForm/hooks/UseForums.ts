"use client";

import { useState, useEffect, useCallback } from 'react';
import { Forum, ForumFilters, Comment, CreateForumData, UpdateForumData, AuthState, User, VoteResponse } from '../types/index';

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;


// --- THIS IS THE FIX ---
// Define a default list of categories that will always be available.
const DEFAULT_CATEGORIES = ['Recipes', 'Tips', 'Questions', 'General', 'Techniques', 'Ingredients'];

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const getAuthHeadersForFormData = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

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
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.nameid || payload.sub;
        const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.unique_name;
        const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email;
        const user: User = { id: userId, username: username, email: email };
        setAuthState({ isAuthenticated: true, user, token, loading: false });
      } catch (error) {
        console.error('Error parsing token:', error);
        localStorage.removeItem('token');
        setAuthState({ isAuthenticated: false, user: null, token: null, loading: false });
      }
    } else {
      setAuthState({ isAuthenticated: false, user: null, token: null, loading: false });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({ isAuthenticated: false, user: null, token: null, loading: false });
  }, []);

  return { authState, logout };
};

type UseForumsProps = {
  currentUserId?: string;
};

const useForums = ({ currentUserId }: UseForumsProps = {}) => {
  const { authState } = useAuth();
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
  // Initialize state with the default categories, including 'All' for filtering.
  const [categories, setCategories] = useState<string[]>(['All', ...DEFAULT_CATEGORIES]);
  const [authors, setAuthors] = useState<string[]>(['All']);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('score');

  const userId = currentUserId || authState.user?.id || '';

  const setFilter = useCallback((key: keyof ForumFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const fetchCategories = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    
    try {
      const response = await fetch(`${API_URL}/Community/categories`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const fetchedCategories: string[] = await response.json();
      
      // --- THIS IS THE NEW LOGIC ---
      // Merge default and fetched categories, ensuring no duplicates, and add "All".
      const combined = [...DEFAULT_CATEGORIES, ...fetchedCategories];
      const unique = Array.from(new Set(combined)); // Remove duplicates
      setCategories(['All', ...unique.sort()]); // Add "All" for filtering and sort them

    } catch (err) {
      console.error('Error fetching categories:', err);
      // If the API fails, we still have the default list.
      setCategories(['All', ...DEFAULT_CATEGORIES]);
    }
  }, [authState.isAuthenticated]);

  const fetchAuthors = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    try {
      const response = await fetch(`${API_URL}/Community/authors`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to fetch authors');
      const data = await response.json();
      setAuthors(['All', ...data]);
    } catch (err) {
      console.error('Error fetching authors:', err);
      setAuthors(['All']);
    }
  }, [authState.isAuthenticated]);

  const fetchForums = useCallback(async () => {
    if (!authState.isAuthenticated) {
      setForums([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({ userId, sortBy });
      if (filters.searchQuery?.trim()) queryParams.append('searchQuery', filters.searchQuery.trim());
      if (filters.author && filters.author !== 'All') queryParams.append('author', filters.author);
      if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
      if (filters.showFavorites) queryParams.append('showFavorites', 'true');
      if (filters.showMyForums) queryParams.append('showMyForums', 'true');

      const url = `${API_URL}/Community?${queryParams.toString()}`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Please log in to view forums' : `Failed to fetch forums: ${response.status}`);
      }
      const data = await response.json();
      setForums(data);
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch forums.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, userId, authState.isAuthenticated, sortBy]);

  // (The rest of the file remains the same... just copy and paste the entire block)

  const fetchComments = useCallback(async (forumId: string) => {
    if (!authState.isAuthenticated) return;
    try {
      const response = await fetch(`${API_URL}/Community/forums/${forumId}/comments`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(prev => ({ ...prev, [forumId]: data }));
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  }, [authState.isAuthenticated]);

  const incrementView = useCallback(async (id: string) => {
    if (!authState.isAuthenticated) return;
    try {
      const response = await fetch(`${API_URL}/Community/${id}/view`, { method: 'POST', headers: getAuthHeaders() });
      if (!response.ok) return;
      const data = await response.json();
      setForums(prev => prev.map(forum => forum.id === id ? { ...forum, views: data.views } : forum));
    } catch (err) {
      console.error('Failed to increment view:', err);
    }
  }, [authState.isAuthenticated]);

  const toggleFavorite = useCallback(async (id: string) => {
    if (!authState.isAuthenticated) return;
    try {
      const response = await fetch(`${API_URL}/Community/${id}/favorite`, { method: 'POST', headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to toggle favorite');
      const data = await response.json();
      setForums(prev => prev.map(forum => forum.id === id ? { ...forum, isFavorite: data.isFavorite } : forum));
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  }, [authState.isAuthenticated]);

  const handleUpvote = useCallback(async (id: string) => {
    if (!authState.isAuthenticated) return;
    try {
      const response = await fetch(`${API_URL}/Community/${id}/upvote`, { method: 'POST', headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to upvote');
      const data: VoteResponse = await response.json();
      setForums(prev => prev.map(forum => forum.id === id ? { ...forum, upvotes: data.upvotes, downvotes: data.downvotes, userVote: data.userVote } : forum));
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  }, [authState.isAuthenticated, sortBy]);

  const handleDownvote = useCallback(async (id: string) => {
    if (!authState.isAuthenticated) return;
    try {
      const response = await fetch(`${API_URL}/Community/${id}/downvote`, { method: 'POST', headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to downvote');
      const data: VoteResponse = await response.json();
      setForums(prev => prev.map(forum => forum.id === id ? { ...forum, upvotes: data.upvotes, downvotes: data.downvotes, userVote: data.userVote } : forum));
    } catch (err) {
      console.error('Failed to downvote:', err);
    }
  }, [authState.isAuthenticated, sortBy]);

  const createForum = useCallback(async (data: CreateForumData) => {
    if (!authState.isAuthenticated) throw new Error('Please log in to create a forum');
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
    if (!response.ok) throw new Error('Failed to create forum');
    const createdForum = await response.json();
    setForums(prev => [createdForum, ...prev]);
    return createdForum;
  }, [authState.isAuthenticated]);

  const addComment = useCallback(async (forumId: string, content: string) => {
    if (!authState.isAuthenticated) throw new Error('Please log in to comment');
    const response = await fetch(`${API_URL}/Community/forums/${forumId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error('Failed to add comment');
    const newComment = await response.json();
    setComments(prev => ({ ...prev, [forumId]: [...(prev[forumId] || []), newComment] }));
    setForums(prev => prev.map(forum => forum.id === forumId ? { ...forum, comments: forum.comments + 1 } : forum));
    return newComment;
  }, [authState.isAuthenticated]);

  const addReply = useCallback(async (forumId: string, commentId: string, content: string) => {
    if (!authState.isAuthenticated) throw new Error('Please log in to reply');
    const response = await fetch(`${API_URL}/Community/comments/${commentId}/replies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error('Failed to add reply');
    const newReply = await response.json();
    setComments(prev => {
      const updatedComments = (prev[forumId] || []).map(comment =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, newReply] } : comment
      );
      return { ...prev, [forumId]: updatedComments };
    });
    setForums(prev => prev.map(forum => forum.id === forumId ? { ...forum, comments: forum.comments + 1 } : forum));
    return newReply;
  }, [authState.isAuthenticated]);

  const updateForum = useCallback(async (data: UpdateForumData) => {
    if (!authState.isAuthenticated) throw new Error('Please log in to edit a forum');
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
    if (!response.ok) throw new Error(response.status === 403 ? 'You can only edit your own forums' : 'Failed to update forum');
    const updatedForum = await response.json();
    setForums(prev => prev.map(forum => forum.id === data.id ? updatedForum : forum));
    return updatedForum;
  }, [authState.isAuthenticated]);

  const deleteForum = useCallback(async (forumId: string) => {
    if (!authState.isAuthenticated) throw new Error('Please log in to delete a forum');
    const response = await fetch(`${API_URL}/Community/${forumId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error(response.status === 403 ? 'You can only delete your own forums' : 'Failed to delete forum');
    setForums(prev => prev.filter(forum => forum.id !== forumId));
    setComments(prev => {
      const updated = { ...prev };
      delete updated[forumId];
      return updated;
    });
    return { success: true };
  }, [authState.isAuthenticated, userId]);

  useEffect(() => {
    let result = [...forums];
    if (filters.searchQuery) result = result.filter(forum => forum.title.toLowerCase().includes(filters.searchQuery.toLowerCase()));
    if (filters.author !== 'All') result = result.filter(forum => forum.author === filters.author);
    if (filters.category !== 'All') result = result.filter(forum => forum.category === filters.category);
    if (filters.showFavorites) result = result.filter(forum => forum.isFavorite);
    if (filters.showMyForums) result = result.filter(forum => forum.userId.toString() === userId.toString());
    setFilteredForums(result);
  }, [forums, filters, userId]);

  useEffect(() => {
    if (authState.isAuthenticated && !authState.loading) {
      fetchCategories();
      fetchAuthors();
      fetchForums();
    }
  }, [authState.isAuthenticated, authState.loading, fetchCategories, fetchAuthors, fetchForums]);

  return {
    forums: filteredForums,
    comments,
    authors,
    categories,
    isLoading,
    error,
    activeCommentId,
    filters,
    sortBy,
    authState,
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
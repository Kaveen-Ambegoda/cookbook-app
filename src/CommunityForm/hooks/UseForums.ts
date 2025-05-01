"use client";

import { useState, useEffect, useCallback } from 'react';
import { Forum, ForumFilters, Comment, Reply, CreateForumData } from '../types/index';

// API base URL
const API_URL = 'http://localhost:5007/api';

interface UseForumsProps {
  currentUserId: string;
}

const useForums = ({ currentUserId }: UseForumsProps) => {
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

  const [categories, setCategories] = useState<string[]>(['All']);
  const [authors, setAuthors] = useState<string[]>(['All']);

  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  // Fetch categories - Note: wrapped in try-catch with proper template strings
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/forum/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Fetch authors - Note: wrapped in try-catch with proper template strings
  const fetchAuthors = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/forum/authors`);
      if (!response.ok) throw new Error('Failed to fetch authors');

      const data = await response.json();
      setAuthors(data);
    } catch (err) {
      console.error('Error fetching authors:', err);
    }
  }, []);

  // Filter forums when dependencies change
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
      result = result.filter(forum => forum.author === currentUserId);
    }

    setFilteredForums(result);
  }, [forums, filters, currentUserId]);

  const setFilter = useCallback((key: keyof ForumFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const fetchForums = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (filters.searchQuery) queryParams.append('searchQuery', filters.searchQuery);
      if (filters.author !== 'All') queryParams.append('author', filters.author);
      if (filters.category !== 'All') queryParams.append('category', filters.category);
      if (filters.showFavorites) queryParams.append('showFavorites', 'true');
      if (filters.showMyForums) queryParams.append('showMyForums', 'true');
      queryParams.append('userId', currentUserId);

      const response = await fetch(`${API_URL}/forum?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch forums');
      }

      const data = await response.json();
      setForums(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError('Failed to fetch forums. Please try again later.');
      setIsLoading(false);
    }
  }, [filters, currentUserId]);

  const fetchComments = useCallback(async (forumId: string) => {
    if (comments[forumId]) return;

    try {
      const response = await fetch(`${API_URL}/comment/forum/${forumId}`);

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
  }, [comments]);

  const toggleFavorite = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/forum/${id}/favorite?userId=${currentUserId}`, {
        method: 'POST'
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
  }, [currentUserId]);

  const handleUpvote = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/forum/${id}/upvote`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to upvote');
      }

      const data = await response.json();

      setForums(prev =>
        prev.map(forum =>
          forum.id === id ? { ...forum, upvotes: data.upvotes } : forum
        )
      );
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  }, []);

  const handleDownvote = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/forum/${id}/downvote`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to downvote');
      }

      const data = await response.json();

      setForums(prev =>
        prev.map(forum =>
          forum.id === id ? { ...forum, downvotes: data.downvotes } : forum
        )
      );
    } catch (err) {
      console.error('Failed to downvote:', err);
    }
  }, []);

  const createForum = useCallback(async (data: CreateForumData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.url) formData.append('url', data.url);
      formData.append('category', data.category);
      if (data.image) formData.append('image', data.image);

      const response = await fetch(`${API_URL}/forum?userId=${currentUserId}`, {
        method: 'POST',
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
  }, [currentUserId]);

  const addComment = useCallback(async (forumId: string, content: string) => {
    try {
      const response = await fetch(`${API_URL}/comment/forum/${forumId}?userId=${currentUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
  }, [currentUserId]);

  const addReply = useCallback(async (forumId: string, commentId: string, content: string) => {
    try {
      const response = await fetch(`${API_URL}/comment/${commentId}/reply?userId=${currentUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
  }, [currentUserId]);

  return {
    forums: filteredForums,
    comments,
    authors,
    categories,
    isLoading,
    error,
    activeCommentId,
    filters,
    setFilter,
    fetchForums,
    fetchComments,
    toggleFavorite,
    handleUpvote,
    handleDownvote,
    createForum,
    addComment,
    addReply,
    setActiveCommentId
  };
};

export default useForums;
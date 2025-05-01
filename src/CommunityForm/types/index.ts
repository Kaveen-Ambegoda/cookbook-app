"use client";

// Forum Types
export interface Forum {
  id: string;
  title: string;
  image: string;
  url: string;
  timestamp: string;
  comments: number;
  views: number;
  upvotes: number;
  downvotes: number;
  author: string;
  category: string;
  isFavorite: boolean;
}

export interface CreateForumData {
  title: string;
  url?: string;
  category: string;
  image?: File | null;
}

// Comment Types
export interface Comment {
  id: string;
  forumId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  commentId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

export interface CommentFormData {
  content: string;
}

export interface ReplyFormData {
  content: string;
}

// User Type
export interface User {
  id: string;
  username: string;
  avatar?: string;
}

// Filter Types
export interface ForumFilters {
  searchQuery: string;
  author: string;
  category: string;
  showFavorites: boolean;
  showMyForums: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
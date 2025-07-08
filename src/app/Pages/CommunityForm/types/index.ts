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
  userId: string;
  userVote?: string | null; // Add this: "upvote", "downvote", or null
}

export interface CreateForumData {
  title: string;
  url?: string;
  category: string;
  image?: File | null;
}

export interface UpdateForumData {
  id: string;
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

// User Type (Enhanced for auth)
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
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

// Voting Response Type
export interface VoteResponse {
  upvotes: number;
  downvotes: number;
  score: number;
  userVote: string | null; // "upvote", "downvote", or null
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Heart, MessageCircle, Eye, ThumbsUp, ThumbsDown, Edit, Trash2, Send, Reply, X, ChefHat, Users, Clock } from 'lucide-react';

// Configuration - Change your base URL here
const BASE_URL = 'https://localhost:7205'; // Change this to your backend URL

// Types
interface Forum {
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

interface Comment {
  id: string;
  forumId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  commentId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

interface CreateForumData {
  title: string;
  url: string;
  category: string;
  image?: File;
}

const ForumPage = () => {
  // State
  const [forums, setForums] = useState<Forum[]>([]);
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingForum, setEditingForum] = useState<Forum | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMyForums, setShowMyForums] = useState(false);
  
  // Forms
  const [newForum, setNewForum] = useState<CreateForumData>({
    title: '',
    url: '',
    category: ''
  });
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Current user (for demo purposes)
  const currentUserId = 'CurrentUser';

  // Fetch functions
  const fetchForums = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('searchQuery', searchQuery);
      if (selectedAuthor !== 'All') params.append('author', selectedAuthor);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (showFavorites) params.append('showFavorites', 'true');
      if (showMyForums) params.append('showMyForums', 'true');
      params.append('userId', currentUserId);

      const response = await fetch(`${BASE_URL}/api/forum?${params}`);
      const data = await response.json();
      setForums(data);
    } catch (error) {
      console.error('Error fetching forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/forum/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/forum/authors`);
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchComments = async (forumId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/comment/forum/${forumId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Forum operations
  const createForum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newForum.title);
      formData.append('url', newForum.url);
      formData.append('category', newForum.category);
      if (newForum.image) {
        formData.append('image', newForum.image);
      }

      const response = await fetch(`${BASE_URL}/api/forum?userId=${currentUserId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowCreateForm(false);
        setNewForum({ title: '', url: '', category: '' });
        fetchForums();
      }
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  const updateForum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForum) return;

    try {
      const formData = new FormData();
      formData.append('title', newForum.title);
      formData.append('url', newForum.url);
      formData.append('category', newForum.category);
      if (newForum.image) {
        formData.append('image', newForum.image);
      }

      const response = await fetch(`${BASE_URL}/api/forum/${editingForum.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setShowEditForm(false);
        setEditingForum(null);
        setNewForum({ title: '', url: '', category: '' });
        fetchForums();
        if (selectedForum?.id === editingForum.id) {
          setSelectedForum(null);
        }
      }
    } catch (error) {
      console.error('Error updating forum:', error);
    }
  };

  const deleteForum = async (forumId: string) => {
    if (!confirm('Are you sure you want to delete this forum?')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/forum/${forumId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchForums();
        if (selectedForum?.id === forumId) {
          setSelectedForum(null);
        }
      }
    } catch (error) {
      console.error('Error deleting forum:', error);
    }
  };

  const toggleFavorite = async (forumId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/forum/${forumId}/favorite?userId=${currentUserId}`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchForums();
        if (selectedForum?.id === forumId) {
          const updatedForum = forums.find(f => f.id === forumId);
          if (updatedForum) {
            setSelectedForum({ ...updatedForum, isFavorite: !updatedForum.isFavorite });
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const vote = async (forumId: string, type: 'upvote' | 'downvote') => {
    try {
      const response = await fetch(`${BASE_URL}/api/forum/${forumId}/${type}`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchForums();
      }
    } catch (error) {
      console.error(`Error ${type}ing forum:`, error);
    }
  };

  // Comment operations
  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForum || !newComment.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/api/comment/forum/${selectedForum.id}?userId=${currentUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments(selectedForum.id);
        fetchForums(); // Refresh to update comment count
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const addReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyContent.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/api/comment/${replyingTo}/reply?userId=${currentUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
      });

      if (response.ok) {
        setReplyingTo(null);
        setReplyContent('');
        if (selectedForum) {
          fetchComments(selectedForum.id);
          fetchForums(); // Refresh to update comment count
        }
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/comment/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (selectedForum) {
          fetchComments(selectedForum.id);
          fetchForums(); // Refresh to update comment count
        }
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const deleteReply = async (replyId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/comment/reply/${replyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (selectedForum) {
          fetchComments(selectedForum.id);
          fetchForums(); // Refresh to update comment count
        }
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const openForum = async (forum: Forum) => {
    try {
      // Fetch full forum details (this will increment view count)
      const response = await fetch(`${BASE_URL}/api/forum/${forum.id}?userId=${currentUserId}`);
      const updatedForum = await response.json();
      setSelectedForum(updatedForum);
      fetchComments(forum.id);
      fetchForums(); // Refresh to update view count
    } catch (error) {
      console.error('Error opening forum:', error);
    }
  };

  const startEdit = (forum: Forum) => {
    setEditingForum(forum);
    setNewForum({
      title: forum.title,
      url: forum.url,
      category: forum.category,
    });
    setShowEditForm(true);
  };

  // Effects
  useEffect(() => {
    fetchForums();
    fetchCategories();
    fetchAuthors();
  }, [searchQuery, selectedAuthor, selectedCategory, showFavorites, showMyForums]);

  return (
    <div className="min-h-screen bg-gradient-to-br mt-16 from-green-50 via-teal-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-green-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-6">
            <ChefHat className="h-12 w-12 text-yellow-400 mr-4" />
            <h1 className="text-4xl font-bold text-white text-center">
              Culinary Community
            </h1>
            <ChefHat className="h-12 w-12 text-yellow-400 ml-4" />
          </div>
          <p className="text-center text-green-100 text-lg max-w-2xl mx-auto">
            Share your favorite recipes, cooking tips, and culinary adventures with fellow food enthusiasts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedForum ? (
          <>
            {/* Controls */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-green-100 p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="relative group">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-teal-500 group-focus-within:text-teal-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search delicious recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                  />
                </div>

                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                >
                  {authors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Share Recipe
                </button>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFavorites}
                    onChange={(e) => setShowFavorites(e.target.checked)}
                    className="mr-3 w-5 h-5 text-teal-600 border-2 border-green-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-gray-700 group-hover:text-teal-700 transition-colors font-medium">
                    ❤️ Show Favorites Only
                  </span>
                </label>
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMyForums}
                    onChange={(e) => setShowMyForums(e.target.checked)}
                    className="mr-3 w-5 h-5 text-teal-600 border-2 border-green-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-gray-700 group-hover:text-teal-700 transition-colors font-medium">
                    👨‍🍳 Show My Recipes Only
                  </span>
                </label>
              </div>
            </div>

            {/* Forums List */}
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full animate-spin mb-4">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
                <p className="text-teal-700 text-lg font-medium">Cooking up something delicious...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {forums.map(forum => (
                  <div key={forum.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-green-100 hover:border-teal-300 transform hover:-translate-y-2 group">
                    <div className="relative overflow-hidden">
                      <img
                        src={forum.image.startsWith('http') ? forum.image : `${BASE_URL}${forum.image}`}
                        alt={forum.title}
                        className="w-full h-56 object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                        onClick={() => openForum(forum)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <button
                        onClick={() => toggleFavorite(forum.id)}
                        className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          forum.isFavorite 
                            ? 'bg-red-500 text-white shadow-lg' 
                            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${forum.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <h3 
                        className="text-xl font-bold mb-3 cursor-pointer hover:text-teal-700 transition-colors duration-300 line-clamp-2"
                        onClick={() => openForum(forum)}
                      >
                        {forum.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                          {forum.category}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {forum.author}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {forum.timestamp}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                            <Eye className="h-4 w-4 mr-1 text-blue-600" />
                            <span className="font-medium">{forum.views}</span>
                          </span>
                          <span className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
                            <MessageCircle className="h-4 w-4 mr-1 text-purple-600" />
                            <span className="font-medium">{forum.comments}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => vote(forum.id, 'upvote')}
                            className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-300 border border-green-200 hover:border-green-300"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span className="font-medium">{forum.upvotes}</span>
                          </button>
                          <button
                            onClick={() => vote(forum.id, 'downvote')}
                            className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300 border border-red-200 hover:border-red-300"
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            <span className="font-medium">{forum.downvotes}</span>
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          {forum.author === currentUserId && (
                            <>
                              <button
                                onClick={() => startEdit(forum)}
                                className="p-2 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors duration-300"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteForum(forum.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Forum Detail View */
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-green-100">
            <div className="p-8 border-b-2 border-green-100">
              <button
                onClick={() => {
                  setSelectedForum(null);
                  setComments([]);
                }}
                className="mb-6 flex items-center text-teal-600 hover:text-teal-800 transition-colors font-medium text-lg"
              >
                ← Back to Recipe Collection
              </button>
              
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg">
                <img
                  src={selectedForum.image.startsWith('http') ? selectedForum.image : `${BASE_URL}${selectedForum.image}`}
                  alt={selectedForum.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4 text-gray-900">{selectedForum.title}</h1>
              
              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                  {selectedForum.category}
                </span>
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {selectedForum.author}
                </span>
                <span className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {selectedForum.timestamp}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-gray-600">
                  <span className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                    <Eye className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">{selectedForum.views} views</span>
                  </span>
                  <span className="flex items-center bg-purple-50 px-4 py-2 rounded-full">
                    <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
                    <span className="font-medium">{selectedForum.comments} comments</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => vote(selectedForum.id, 'upvote')}
                    className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200 hover:border-green-300"
                  >
                    <ThumbsUp className="h-5 w-5 mr-2" />
                    <span className="font-medium">{selectedForum.upvotes}</span>
                  </button>
                  <button
                    onClick={() => vote(selectedForum.id, 'downvote')}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                  >
                    <ThumbsDown className="h-5 w-5 mr-2" />
                    <span className="font-medium">{selectedForum.downvotes}</span>
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedForum.id)}
                    className={`p-3 rounded-full transition-colors ${
                      selectedForum.isFavorite 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${selectedForum.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Add Comment Form */}
            <div className="p-6 border-b-2 border-green-100 bg-gradient-to-r from-green-50/50 to-teal-50/50">
              <form onSubmit={addComment} className="flex space-x-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this recipe..."
                  className="flex-1 px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Comment
                </button>
              </form>
            </div>

            {/* Comments */}
            <div className="p-6">
              {comments.map(comment => (
                <div key={comment.id} className="mb-6 p-6 bg-gradient-to-r from-white/80 to-green-50/30 rounded-xl border border-green-100 last:mb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-semibold text-gray-900">{comment.username}</span>
                      <span className="text-gray-500 text-sm ml-3">{comment.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="text-teal-600 hover:text-teal-800 text-sm flex items-center hover:bg-teal-50 px-3 py-1 rounded-lg transition-colors"
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Reply
                      </button>
                      {comment.userId === currentUserId && (
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="text-red-600 hover:text-red-800 text-sm hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-800 mb-4 leading-relaxed">{comment.content}</p>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <form onSubmit={addReply} className="mb-4 ml-8 p-4 bg-white/60 rounded-lg border border-teal-200">
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a thoughtful reply..."
                          className="flex-1 px-3 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all text-sm bg-white/80"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all text-sm shadow-md hover:shadow-lg"
                        >
                          Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Replies */}
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="ml-8 mt-4 p-4 bg-gradient-to-r from-yellow-50/80 to-green-50/60 rounded-lg border border-yellow-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm text-gray-900">{reply.username}</span>
                          <span className="text-gray-500 text-xs ml-2">{reply.timestamp}</span>
                        </div>
                        {reply.userId === currentUserId && (
                          <button
                            onClick={() => deleteReply(reply.id)}
                            className="text-red-600 hover:text-red-800 text-sm hover:bg-red-50 p-1 rounded transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Forum Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border-2 border-green-200 transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <ChefHat className="h-6 w-6 text-teal-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Share New Recipe</h2>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewForum({ title: '', url: '', category: '' });
                  }}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={createForum} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Title</label>
                  <input
                    type="text"
                    required
                    value={newForum.title}
                    onChange={(e) => setNewForum({ ...newForum, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                    placeholder="Enter your delicious recipe name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe URL</label>
                  <input
                    type="url"
                    required
                    value={newForum.url}
                    onChange={(e) => setNewForum({ ...newForum, url: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                    placeholder="https://example.com/my-recipe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    required
                    value={newForum.category}
                    onChange={(e) => setNewForum({ ...newForum, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                  >
                    <option value="">Select a category</option>
                    {categories.filter(c => c !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewForum({ ...newForum, image: e.target.files?.[0] })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                  />
                  <p className="text-sm text-gray-500 mt-2">Upload a mouth-watering photo of your dish!</p>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Share Recipe
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewForum({ title: '', url: '', category: '' });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Forum Modal */}
        {showEditForm && editingForum && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border-2 border-green-200 transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Edit className="h-6 w-6 text-teal-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Edit Recipe</h2>
                </div>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingForum(null);
                    setNewForum({ title: '', url: '', category: '' });
                  }}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={updateForum} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Title</label>
                  <input
                    type="text"
                    required
                    value={newForum.title}
                    onChange={(e) => setNewForum({ ...newForum, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe URL</label>
                  <input
                    type="url"
                    required
                    value={newForum.url}
                    onChange={(e) => setNewForum({ ...newForum, url: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    required
                    value={newForum.category}
                    onChange={(e) => setNewForum({ ...newForum, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                  >
                    <option value="">Select a category</option>
                    {categories.filter(c => c !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Recipe Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewForum({ ...newForum, image: e.target.files?.[0] })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 bg-white/80"
                  />
                  <p className="text-sm text-gray-500 mt-2">Leave empty to keep current image</p>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-teal-600 to-green-600 text-white py-3 px-4 rounded-xl hover:from-teal-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Update Recipe
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingForum(null);
                      setNewForum({ title: '', url: '', category: '' });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
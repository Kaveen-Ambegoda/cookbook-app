"use client";

import React from 'react';
import { Forum } from '../types';
import { 
  Clock, 
  MessageSquare, 
  Eye, 
  Heart, 
  ChevronUp, 
  ChevronDown,
  Utensils,
  Cake,
  Coffee,
  Gift,
  Salad,
  Pizza,
  ChefHat,
  Scissors
} from 'lucide-react';
import CommentSection from './CommentSection';

// Category icon mapping
const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'Vegetarian':
      return <Salad size={16} className="mr-1" />;
    case 'Baking':
      return <Cake size={16} className="mr-1" />;
    case 'Ingredients':
      return <Scissors size={16} className="mr-1" />;
    case 'Holidays':
      return <Gift size={16} className="mr-1" />;
    case 'Dinner':
      return <Utensils size={16} className="mr-1" />;
    case 'Desserts':
      return <Coffee size={16} className="mr-1" />;
    default:
      return <ChefHat size={16} className="mr-1" />;
  }
};

interface ForumPostProps {
  forum: Forum;
  onToggleFavorite: (id: string) => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onToggleComments: (id: string) => void;
  activeCommentId: string | null;
  onAddComment: (forumId: string, content: string) => Promise<any>;
  onAddReply: (forumId: string, commentId: string, content: string) => Promise<any>;
  comments: any[];
}

const ForumPost: React.FC<ForumPostProps> = ({
  forum,
  onToggleFavorite,
  onUpvote,
  onDownvote,
  onToggleComments,
  activeCommentId,
  onAddComment,
  onAddReply,
  comments = []
}) => {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
      <div className="flex">
        {/* Voting Section */}
        <div className="flex flex-col items-center justify-center p-2 bg-gray-50 w-16">
          <button 
            className="text-gray-500 hover:text-green-500 focus:outline-none"
            onClick={() => onUpvote(forum.id)}
            aria-label="Upvote"
          >
            <ChevronUp size={24} />
          </button>
          <span className="font-bold text-gray-700">{forum.upvotes}</span>
          <span className="my-1 h-px bg-gray-300 w-8"></span>
          <span className="font-bold text-gray-700">{forum.downvotes}</span>
          <button 
            className="text-gray-500 hover:text-red-500 focus:outline-none"
            onClick={() => onDownvote(forum.id)}
            aria-label="Downvote"
          >
            <ChevronDown size={24} />
          </button>
        </div>
        
        {/* Forum Image */}
        <div className="w-24 md:w-40 flex-shrink-0">
          <div className="w-full h-full relative overflow-hidden">
            <img 
              src={forum.image} 
              alt={forum.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Forum Content */}
        <div className="p-4 flex-1">
          <div className="flex items-center mb-2">
            {getCategoryIcon(forum.category)}
            <h3 className="text-lg font-medium text-gray-900">{forum.title}</h3>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            {forum.url && (
              <a href={forum.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {forum.url}
              </a>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {forum.timestamp}
            </div>
            <button 
              className="flex items-center hover:text-blue-500"
              onClick={() => onToggleComments(forum.id)}
            >
              <MessageSquare size={16} className="mr-1" />
              {forum.comments}
            </button>
            <div className="flex items-center">
              <Eye size={16} className="mr-1" />
              {forum.views.toLocaleString()}
            </div>
            <button 
              className={`flex items-center ${forum.isFavorite ? 'text-red-500' : 'hover:text-red-500'}`}
              onClick={() => onToggleFavorite(forum.id)}
            >
              <Heart size={16} className="mr-1" fill={forum.isFavorite ? 'currentColor' : 'none'} />
              {forum.isFavorite ? 'Remove Favorite' : 'Add to Favorite'}
            </button>
            <div className="flex items-center">
              {getCategoryIcon(forum.category)}
              {forum.category}
            </div>
          </div>
          
          {/* Comments Section (Conditionally rendered when active) */}
          {activeCommentId === forum.id && (
            <div className="mt-4 pt-4 border-t">
              <CommentSection 
                forumId={forum.id}
                comments={comments}
                onAddComment={onAddComment}
                onAddReply={onAddReply}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
"use client";

import React, { useState } from 'react';
import { Forum } from '../types';
import { Clock, MessageSquare, Eye, Heart, ChevronUp, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { roboto, inter } from '@/app/utils/fonts';
import CommentSection from './CommentSection';
import EditForumModal from './EditForumModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface ForumPostProps {
  forum: Forum;
  currentUserId: string | undefined;
  onToggleFavorite: (id: string) => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onToggleComments: (id: string) => void;
  activeCommentId: string | null;
  onAddComment: (forumId: string, content: string) => Promise<any>;
  onAddReply: (forumId: string, commentId: string, content: string) => Promise<any>;
  onUpdateForum: (data: any) => Promise<any>;
  onDeleteForum: (forumId: string) => Promise<any>;
  comments: any[];
  categories: string[];
}

const ForumPost: React.FC<ForumPostProps> = ({
  forum,
  currentUserId,
  onToggleFavorite,
  onUpvote,
  onDownvote,
  onToggleComments,
  activeCommentId,
  onAddComment,
  onAddReply,
  onUpdateForum,
  onDeleteForum,
  comments = [],
  categories
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const isOwner = currentUserId && forum.userId && currentUserId.toString() === forum.userId.toString();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await onDeleteForum(forum.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete operation failed:', error);
      let errorMessage = 'Failed to delete forum. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteModalClose = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setDeleteError(null);
    }
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVoting) return;
    setIsVoting(true);
    try {
      await onUpvote(forum.id);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVoting) return;
    setIsVoting(true);
    try {
      await onDownvote(forum.id);
    } finally {
      setIsVoting(false);
    }
  };

  const handleToggleComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComments(forum.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(forum.id);
  };

  const getVoteButtonStyle = (voteType: 'upvote' | 'downvote') => {
    const isActive = forum.userVote === voteType;
    const baseStyle = "p-1 rounded transition-all duration-200 ";
    
    if (voteType === 'upvote') {
      return baseStyle + (isActive 
        ? "text-green-600 bg-green-100 hover:bg-green-200" 
        : "text-gray-500 hover:text-green-500 hover:bg-green-50");
    } else {
      return baseStyle + (isActive 
        ? "text-red-600 bg-red-100 hover:bg-red-200" 
        : "text-gray-500 hover:text-red-500 hover:bg-red-50");
    }
  };

  return (
    <>
      <div className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow duration-200">
        <div className="flex">
          {/* Voting Section */}
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 w-20">
            <button 
              className={getVoteButtonStyle('upvote')}
              onClick={handleUpvote}
              disabled={isVoting}
              aria-label={forum.userVote === 'upvote' ? 'Remove upvote' : 'Upvote'}
              title={forum.userVote === 'upvote' ? 'Click to remove your upvote' : 'Click to upvote'}
            >
              <ChevronUp size={24} />
            </button>
            <span className={`font-bold text-lg mt-1 mb-2 ${inter.className} ${
              forum.userVote === 'upvote' ? 'text-green-600' : 'text-gray-700'
            }`}>
              {forum.upvotes}
            </span>
            
            <div className="my-1 h-px bg-gray-300 w-10"></div>
            
            <span className={`font-bold text-lg mt-2 mb-1 ${inter.className} ${
              forum.userVote === 'downvote' ? 'text-red-600' : 'text-gray-700'
            }`}>
              {forum.downvotes}
            </span>
            <button 
              className={getVoteButtonStyle('downvote')}
              onClick={handleDownvote}
              disabled={isVoting}
              aria-label={forum.userVote === 'downvote' ? 'Remove downvote' : 'Downvote'}
              title={forum.userVote === 'downvote' ? 'Click to remove your downvote' : 'Click to downvote'}
            >
              <ChevronDown size={24} />
            </button>
            
            <div className="mt-2 text-xs text-gray-500 font-medium">
              Score: {forum.upvotes - forum.downvotes}
            </div>
          </div>
          
          {/* Forum Image */}
          <div className="w-32 md:w-48 flex-shrink-0">
            <div className="w-full h-32 md:h-48 relative overflow-hidden bg-gray-100">
              <img 
                src={forum.image.startsWith('http') ? forum.image : `http://localhost:5007${forum.image}`} 
                alt={forum.title}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  console.log('Image failed to load:', forum.image);
                  e.currentTarget.src = '/image/cookbook_app.png';
                }}
              />
            </div>
          </div>
          
          {/* Forum Content */}
          <div className="p-4 flex-1">
            <div className="flex justify-between items-start mb-3">
              <h3 className={`text-xl font-semibold text-gray-900 hover:text-[#F25019] transition-colors cursor-pointer ${inter.className}`}>
                {forum.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs text-white bg-[#F25019] px-2 py-1 rounded-full ${roboto.className}`}>
                  {forum.category}
                </span>
                {isOwner && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleEditClick}
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit Forum"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      disabled={isDeleting}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                      title="Delete Forum"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {forum.url && (
              <div className="mb-3">
                <a 
                  href={forum.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`text-blue-500 hover:text-blue-600 hover:underline text-sm transition-colors ${roboto.className}`}
                >
                  🔗 {forum.url}
                </a>
              </div>
            )}
            
            <div className={`flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3 ${roboto.className}`}>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{forum.timestamp}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">By:</span>
                <span className="text-[#F25019] font-medium">{forum.author}</span>
                {isOwner && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">You</span>}
              </div>
              {forum.userVote && (
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    forum.userVote === 'upvote' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    You {forum.userVote === 'upvote' ? '↑' : '↓'} voted
                  </span>
                </div>
              )}
            </div>
            
            <div className={`flex flex-wrap items-center gap-6 text-sm ${roboto.className}`}>
              <button 
                className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                onClick={handleToggleComments}
              >
                <MessageSquare size={16} />
                <span>{forum.comments} comments</span>
              </button>
              
              <div className="flex items-center gap-1 text-gray-500">
                <Eye size={16} />
                <span>{forum.views.toLocaleString()} views</span>
              </div>
              
              <button 
                className={`flex items-center gap-1 transition-colors ${
                  forum.isFavorite 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-500 hover:text-red-500'
                }`}
                onClick={handleToggleFavorite}
              >
                <Heart 
                  size={16} 
                  fill={forum.isFavorite ? 'currentColor' : 'none'} 
                />
                <span>{forum.isFavorite ? 'Favorited' : 'Add to favorites'}</span>
              </button>
            </div>
            
            {activeCommentId === forum.id && (
              <div className="mt-6 pt-4 border-t border-gray-200">
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

      {isEditModalOpen && (
        <EditForumModal
          forum={forum}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={onUpdateForum}
          categories={categories}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Forum"
        message={`Are you sure you want to delete "${forum.title}"? This action cannot be undone and will permanently remove the forum and all its comments.`}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};

export default ForumPost;
"use client";

import React, { useState } from 'react';
import { Comment } from '../types';
import { User } from 'lucide-react';
import { roboto, inter, abeezee } from '@/app/utils/fonts';

interface CommentSectionProps {
  forumId: string;
  comments: Comment[];
  onAddComment: (forumId: string, content: string) => Promise<any>;
  onAddReply: (forumId: string, commentId: string, content: string) => Promise<any>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  forumId,
  comments = [],
  onAddComment,
  onAddReply
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle submitting a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onAddComment(forumId, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle submitting a reply
  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onAddReply(forumId, commentId, replyContent.trim());
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };
  
  return (
    <div className="space-y-6">
      <h4 className={`font-semibold text-lg text-gray-800 ${inter.className}`}>
        Comments ({comments.length})
      </h4>
      
      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#F25019] rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`font-semibold text-gray-800 ${inter.className}`}>
                      {comment.username}
                    </span>
                    <span className={`text-xs text-gray-500 ${roboto.className}`}>
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className={`text-gray-700 leading-relaxed mb-3 ${roboto.className}`}>
                    {comment.content}
                  </p>
                  <button 
                    className={`text-sm text-[#F25019] hover:text-[#C93E0F] font-medium transition-colors ${roboto.className}`}
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    {replyingTo === comment.id ? 'Cancel Reply' : 'Reply'}
                  </button>
                  
                  {/* Reply form */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 bg-white rounded-lg p-3 border">
                      <textarea
                        className={`w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F25019] focus:border-[#F25019] transition-all resize-none ${roboto.className}`}
                        rows={3}
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        maxLength={500}
                      ></textarea>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs text-gray-500 ${roboto.className}`}>
                          {replyContent.length}/500 characters
                        </span>
                        <div className="flex gap-2">
                          <button 
                            className={`text-sm text-gray-500 hover:text-gray-700 transition-colors ${roboto.className}`}
                            onClick={cancelReply}
                          >
                            Cancel
                          </button>
                          <button 
                            className={`text-sm bg-[#F25019] text-white px-4 py-2 rounded-lg hover:bg-[#C93E0F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${roboto.className}`}
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={!replyContent.trim() || isSubmitting}
                          >
                            {isSubmitting ? 'Posting...' : 'Post Reply'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-6 mt-4 space-y-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="bg-white rounded-lg p-3 border-l-4 border-[#F25019]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <User size={12} className="text-gray-600" />
                            </div>
                            <span className={`font-medium text-sm text-gray-800 ${inter.className}`}>
                              {reply.username}
                            </span>
                            <span className={`text-xs text-gray-500 ${roboto.className}`}>
                              {reply.timestamp}
                            </span>
                          </div>
                          <p className={`text-sm text-gray-700 leading-relaxed ${roboto.className}`}>
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className={`text-gray-500 ${roboto.className}`}>
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
      
      {/* New comment form */}
      <form onSubmit={handleSubmitComment} className="bg-white border rounded-lg p-4">
        <h5 className={`font-medium text-gray-800 mb-3 ${inter.className}`}>
          Add a Comment
        </h5>
        <textarea
          className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F25019] focus:border-[#F25019] transition-all resize-none ${roboto.className}`}
          rows={4}
          placeholder="Share your thoughts on this forum..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={1000}
        ></textarea>
        <div className="flex justify-between items-center mt-3">
          <span className={`text-sm text-gray-500 ${roboto.className}`}>
            {newComment.length}/1000 characters
          </span>
          <button 
            type="submit"
            className={`bg-[#F25019] text-white px-6 py-2 rounded-lg hover:bg-[#C93E0F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${roboto.className}`}
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
"use client";

import React, { useState } from 'react';
import { Comment } from '../types';
import { User } from 'lucide-react';

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
      await onAddComment(forumId, newComment);
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
      await onAddReply(forumId, commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Comments</h4>
      
      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="border-b pb-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.username}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                  <button 
                    className="text-sm text-blue-500 mt-1"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    Reply
                  </button>
                  
                  {/* Reply form */}
                  {replyingTo === comment.id && (
                    <div className="mt-2">
                      <textarea
                        className="w-full border rounded-lg p-2 text-sm"
                        rows={2}
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end gap-2 mt-1">
                        <button 
                          className="text-sm text-gray-500"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyContent.trim() || isSubmitting}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-6 mt-2 space-y-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="border-l-2 border-gray-200 pl-3 pt-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{reply.username}</span>
                            <span className="text-xs text-gray-500">{reply.timestamp}</span>
                          </div>
                          <p className="text-sm mt-1">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        )}
      </div>
      
      {/* New comment form */}
      <form onSubmit={handleSubmitComment} className="mt-4">
        <textarea
          className="w-full border rounded-lg p-3"
          rows={3}
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
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
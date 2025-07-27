"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { roboto, inter, abeezee } from '@/app/utils/fonts';
import { UpdateForumData, Forum } from '../types';

interface EditForumModalProps {
  forum: Forum;
  onClose: () => void;
  onUpdate: (data: UpdateForumData) => Promise<any>;
  categories: string[];
}

const EditForumModal: React.FC<EditForumModalProps> = ({
  forum,
  onClose,
  onUpdate,
  categories
}) => {
  const [title, setTitle] = useState(forum.title);
  const [url, setUrl] = useState(forum.url || '');
  const [category, setCategory] = useState(forum.category);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [keepCurrentImage, setKeepCurrentImage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Set initial image preview
  useEffect(() => {
    if (forum.image) {
      setImagePreview(forum.image.startsWith('http') ? forum.image : `http://localhost:5007${forum.image}`);
    }
  }, [forum.image]);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setImage(file);
      setKeepCurrentImage(false);
      setError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove selected image and revert to current
  const revertToCurrentImage = () => {
    setImage(null);
    setKeepCurrentImage(true);
    if (forum.image) {
      setImagePreview(forum.image.startsWith('http') ? forum.image : `http://localhost:5007${forum.image}`);
    } else {
      setImagePreview(null);
    }
    // Reset file input
    const fileInput = document.getElementById('edit-forum-image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long');
      return;
    }
    
    if (url && !isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await onUpdate({
        id: forum.id,
        title: title.trim(),
        url: url.trim() || undefined,
        category,
        image: keepCurrentImage ? null : image // Only send new image if changed
      });
      
      // Close modal after successful update
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update forum. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  // URL validation helper
  const isValidUrl = (string: string) => {
    try {
      new URL(string.startsWith('http') ? string : `https://${string}`);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-2xl font-semibold text-gray-800 ${inter.className}`}>
              Edit Forum
            </h3>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
              <p className={abeezee.className}>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="edit-forum-title" className={`block text-sm font-medium text-gray-700 mb-2 ${abeezee.className}`}>
                  Forum Title *
                </label>
                <input
                  id="edit-forum-title"
                  type="text"
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F25019] focus:border-[#F25019] transition-all ${roboto.className}`}
                  placeholder="Enter a descriptive title for your forum"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={100}
                />
                <p className={`text-xs text-gray-500 mt-1 ${roboto.className}`}>
                  {title.length}/100 characters
                </p>
              </div>
              
              <div>
                <label htmlFor="edit-forum-url" className={`block text-sm font-medium text-gray-700 mb-2 ${abeezee.className}`}>
                  Website URL (optional)
                </label>
                <input
                  id="edit-forum-url"
                  type="text"
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F25019] focus:border-[#F25019] transition-all ${roboto.className}`}
                  placeholder="https://example.com or www.example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="edit-forum-category" className={`block text-sm font-medium text-gray-700 mb-2 ${abeezee.className}`}>
                  Category *
                </label>
                <select
                  id="edit-forum-category"
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F25019] focus:border-[#F25019] transition-all ${roboto.className}`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${abeezee.className}`}>
                  Forum Image
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className={`text-gray-400 text-xs text-center ${roboto.className}`}>
                        No image
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="edit-forum-image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="space-y-2">
                      <label 
                        htmlFor="edit-forum-image"
                        className={`bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm cursor-pointer inline-block transition-colors ${roboto.className}`}
                      >
                        Change Image
                      </label>
                      {!keepCurrentImage && (
                        <button
                          type="button"
                          onClick={revertToCurrentImage}
                          className={`block text-sm text-blue-500 hover:text-blue-600 transition-colors ${roboto.className}`}
                        >
                          Keep Current Image
                        </button>
                      )}
                    </div>
                    <p className={`text-xs text-gray-500 mt-2 ${roboto.className}`}>
                      Max file size: 5MB. Supported formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                className={`px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${roboto.className}`}
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-3 bg-[#F25019] text-white rounded-lg hover:bg-[#C93E0F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${roboto.className}`}
                disabled={isSubmitting || !title.trim()}
              >
                {isSubmitting ? 'Updating...' : 'Update Forum'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditForumModal;
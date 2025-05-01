"use client";

import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Heading, 
  Link as LinkIcon, 
  Tag,
  ChefHat
} from 'lucide-react';
import { CreateForumData } from '../types';

interface CreateForumModalProps {
  onClose: () => void;
  onCreate: (data: CreateForumData) => Promise<void>;
  categories: string[];
}

const CreateForumModal: React.FC<CreateForumModalProps> = ({ onClose, onCreate, categories }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(categories[0] || 'General');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image (JPG or PNG)');
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    // Basic URL validation
    if (url && !url.match(/^(http|https):\/\/[^ "]+$/)) {
      setError('Please enter a valid URL');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('title', title);
      if (url) formData.append('url', url);
      formData.append('category', category);
      if (image) formData.append('image', image);
      
      await onCreate({
        title,
        url,
        category,
        image
      });
      
      onClose();
    } catch (err) {
      setError('Failed to create forum. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold flex items-center">
            <ChefHat size={24} className="mr-2 text-green-600" />
            Create New Forum
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
              <Heading size={16} className="mr-1" />
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter forum title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          {/* URL Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
              <LinkIcon size={16} className="mr-1" />
              URL (optional)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
              placeholder="https://example.com/recipe"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          {/* Category Select */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
              <Tag size={16} className="mr-1" />
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
              <Upload size={16} className="mr-1" />
              Image (optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 mx-auto object-cover rounded"
                    />
                    <button
                      type="button"
                      className="mt-2 text-sm text-red-600 hover:underline"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <Upload
                    className="mx-auto h-12 w-12 text-gray-400"
                    strokeWidth={1}
                  />
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                  >
                    <span>Upload an image</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg focus:outline-none flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                "Create Forum"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateForumModal;
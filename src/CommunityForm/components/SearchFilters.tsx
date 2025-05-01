"use client";

import React from 'react';
import { Search, Filter, User, Tag } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    searchQuery: string;
    author: string;
    category: string;
    showFavorites: boolean;
    showMyForums: boolean;
  };
  setFilter: (key: string, value: any) => void;
  authors: string[];
  categories: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  setFilter,
  authors,
  categories
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
<div className="flex-1 py-6">
  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
    <Search size={18} className="text-gray-400 mr-2" />
    <input
      type="text"
      className="w-full outline-none text-sm placeholder-gray-400"
      placeholder="Search forum posts..."
      value={filters.searchQuery || ''}
      onChange={(e) => setFilter('searchQuery', e.target.value)}
    />
  </div>
</div>

        
        {/* Author Filter */}
        <div className="w-full md:w-64">
          <div className="flex items-center mb-1">
            <User size={16} className="mr-1 text-gray-500" />
            <label className="text-sm text-gray-600">Author</label>
          </div>
          <select
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-green-500 focus:border-green-500"
            value={filters.author || 'All'}
            onChange={(e) => setFilter('author', e.target.value)}
          >
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>
        
        {/* Category Filter */}
        <div className="w-full md:w-64">
          <div className="flex items-center mb-1">
            <Tag size={16} className="mr-1 text-gray-500" />
            <label className="text-sm text-gray-600">Category</label>
          </div>
          <select
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-green-500 focus:border-green-500"
            value={filters.category || 'All'}
            onChange={(e) => setFilter('category', e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
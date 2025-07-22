"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { roboto, inter } from '@/app/utils/fonts';
import { ForumFilters } from '../types';

interface SearchFiltersProps {
  filters: ForumFilters;
  setFilter: (key: keyof ForumFilters, value: string | boolean) => void;
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
    <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm">
      {/* Search Input */}
      <div className="relative w-full lg:w-1/2">
        <input
          type="text"
          placeholder="Search forums..."
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25019] focus:border-[#F25019] transition-all ${roboto.className}`}
          value={filters.searchQuery}
          onChange={(e) => setFilter('searchQuery', e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-3 w-full lg:w-auto">
        {/* Author Filter */}
        <div className="relative min-w-[150px]">
          <select 
            className={`w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-[#F25019] focus:border-[#F25019] transition-all ${roboto.className}`}
            value={filters.author}
            onChange={(e) => setFilter('author', e.target.value)}
          >
            {authors.map((author, index) => (
              <option key={`author-${index}-${author}`} value={author}>
                {author === 'All' ? 'All Authors' : author}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="relative min-w-[150px]">
          <select 
            className={`w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-[#F25019] focus:border-[#F25019] transition-all ${roboto.className}`}
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={`category-${index}-${category}`} value={category}>
                {category === 'All' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
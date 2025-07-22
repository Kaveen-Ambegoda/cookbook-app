'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  // 👉 Auto-redirect to homepage when input is cleared
  useEffect(() => {
    if (keyword.trim() === '') {
      router.push('/');
    }
  }, [keyword, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      router.push(`/RecipeManagement/search?keyword=${encodeURIComponent(trimmedKeyword)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search recipes..."
        className="px-4 py-2 rounded-full border bg-gray-50 border-gray-300 focus:outline-none w-96"
      />
      <button type="submit" className="absolute right-3 top-2.5">
        <FaSearch className="text-gray-500" />
      </button>
    </form>
  );
}

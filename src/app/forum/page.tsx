"use client";

import React from 'react';
import CommunityForum from '@/CommunityForm/components/CommunityForum';

export default function ForumPage() {
  // In a real application, you would get the user ID from authentication
  const currentUserId = 'CurrentUser';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-20">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center text-green-700">Community Forum</h1>
          <p className="text-gray-600 text-center mt-2">
            Join the conversation and share your cooking knowledge with the community
          </p>
        </header>
        
        <CommunityForum userId={currentUserId} />
      </div>
    </div>
  );
}
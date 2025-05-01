"use client";

import Link from 'next/link';
import RecipeList from "./Pages/Recipe Management/Home/RecipeList";

export default function Home() {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="mb-8 bg-gradient-to-r from-green-600 to-green-500 rounded-lg shadow-md p-16">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to Recipe Community</h1>
        <p className="text-white mb-4">Discover delicious recipes and connect with other cooking enthusiasts</p>
        <Link href="/forum" className="inline-block bg-white text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition">
          Visit Community Forum
        </Link>
      </div>
      
      {/* Featured Sections */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-2"> */}
        {/* <div className="bg-white rounded-lg shadow-md p-16">
          <h2 className="text-xl font-semibold text-green-700 mb-2 ">Recipe Collection</h2>
          <p className="text-gray-600 mb-4">Browse through our collection of delicious recipes for every occasion.</p>
        </div> */}
        {/* <div className="bg-white rounded-lg shadow-md p-6"> */}
          {/* <h2 className="text-xl font-semibold text-green-700 mb-2">Community Forum</h2> */}
          {/* <p className="text-gray-600 mb-4">Join discussions, share tips, and connect with other cooking enthusiasts.</p>
          <Link href="/forum" className="text-green-600 font-medium hover:underline">
            Join the conversation →
          </Link>
        </div>
      </div> */}
      
      {/* Original Content */}
      <div className="pl-25 pr-10 pt-4">
        <h1 className="text-green-700 text-xl font-medium pl-4 pb-2">Basic Courses</h1>
        <RecipeList />
      </div>
    </div>
  );
}
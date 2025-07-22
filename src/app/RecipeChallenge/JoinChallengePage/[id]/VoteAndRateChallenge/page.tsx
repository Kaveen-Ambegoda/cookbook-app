'use client';

import { useState } from 'react';
import { FaStar, FaThumbsUp, FaArrowLeft, FaUser, FaClock, FaUtensils, FaHeart, FaComment } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';


interface Recipe {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  votes: number;
  rating: number;
  totalRatings: number;
}

export default function VoteAndRateChallenge() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id;
  
  // State for navbar
  const [isOpen, setIsOpen] = useState(false);
  
  // Decode the URL-encoded challenge title
  const decodedChallengeTitle = challengeId ? decodeURIComponent(challengeId as string) : '';

  // Dummy data for recipes in the challenge
  const [recipes] = useState<Recipe[]>([
    {
      id: '1',
      title: 'Ginger Man',
      author: 'Sarah Johnson',
      image: '/image/gingerman.jpg',
      description: 'A fragrant and spicy stir-fry with fresh Thai basil and tender chicken.',
      ingredients: ['500g chicken breast', '2 tbsp Thai basil', '3 cloves garlic', '2 chilies', '2 tbsp oyster sauce'],
      instructions: ['Cut chicken into strips', 'Heat oil in wok', 'Stir-fry chicken until cooked', 'Add basil and serve'],
      votes: 24,
      rating: 4.5,
      totalRatings: 12
    },
    {
      id: '2',
      title: 'Mediterranean Quinoa Bowl',
      author: 'Mike Chen',
      image: '/image/2.jpg',
      description: 'A healthy and colorful bowl packed with Mediterranean flavors.',
      ingredients: ['1 cup quinoa', '200g feta cheese', '1 cucumber', '2 tomatoes', '1/4 cup olives'],
      instructions: ['Cook quinoa', 'Dice vegetables', 'Mix all ingredients', 'Drizzle with olive oil'],
      votes: 18,
      rating: 4.2,
      totalRatings: 8
    },
    {
      id: '3',
      title: 'Chocolate Lava Cake',
      author: 'Emma Davis',
      image: '/image/3.jpg',
      description: 'Decadent chocolate cake with a molten center that flows like lava.',
      ingredients: ['100g dark chocolate', '2 eggs', '50g butter', '2 tbsp flour', '1 tbsp sugar'],
      instructions: ['Melt chocolate and butter', 'Mix with eggs', 'Add flour and sugar', 'Bake for 12 minutes'],
      votes: 31,
      rating: 4.8,
      totalRatings: 15
    },
    {
      id: '4',
      title: 'Spicy Ramen Bowl',
      author: 'Takashi Yamamoto',
      image: '/image/2.jpg',
      description: 'Authentic Japanese ramen with rich broth and perfect toppings.',
      ingredients: ['2 ramen noodles', '1L chicken broth', '2 eggs', '100g pork belly', '2 green onions'],
      instructions: ['Prepare broth', 'Cook noodles', 'Add toppings', 'Serve hot'],
      votes: 27,
      rating: 4.6,
      totalRatings: 11
    },
  ]);

  const [userVotes, setUserVotes] = useState<{[key: string]: 'up' | 'down' | null}>({});
  const [userRatings, setUserRatings] = useState<{[key: string]: number}>({});

  const handleVote = (recipeId: string, voteType: 'up' | 'down') => {
    setUserVotes(prev => ({
      ...prev,
      [recipeId]: prev[recipeId] === voteType ? null : voteType
    }));
  };

  const handleRating = (recipeId: string, rating: number) => {
    setUserRatings(prev => ({
      ...prev,
      [recipeId]: rating
    }));
  };

  const renderStars = (rating: number, recipeId: string, interactive: boolean = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <FaStar
          key={index}
          className={`${
            starValue <= (interactive ? (userRatings[recipeId] || 0) : rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400 hover:scale-110' : ''} text-lg transition-all duration-200`}
          onClick={interactive ? () => handleRating(recipeId, starValue) : undefined}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Navbar */}
      
      
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-16">
        {/* Header with improved gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 mb-4"
            >
              <FaArrowLeft className="text-sm" />
              <span className="text-sm font-medium">Back to Challenge</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                Vote & Rate 
              </h1>
              <div className="text-lg sm:text-xl font-medium text-orange-100 mb-2">
                {decodedChallengeTitle}
              </div>
              <p className="text-orange-100 text-sm sm:text-base max-w-2xl mx-auto">
                Cast your votes and rate the submitted recipes to help determine the winner
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{recipes.length}</div>
                <div className="text-sm text-gray-600">Total Recipes</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">
                  {recipes.reduce((sum, recipe) => sum + recipe.votes, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Votes</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-600">
                  {recipes.reduce((sum, recipe) => sum + recipe.totalRatings, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Ratings</div>
              </div>
            </div>
          </div>

          {/* Recipe Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                {/* Recipe Image */}
                <div className="h-48 sm:h-56 relative overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Recipe Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 flex-1 line-clamp-2">
                      {recipe.title}
                    </h3>
                  </div>

                  {/* Author */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-xs" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{recipe.author}</span>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {recipe.description}
                  </p>

                  {/* Current Rating */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(recipe.rating, recipe.id)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {recipe.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {recipe.totalRatings} ratings
                    </span>
                  </div>

                  {/* Voting Section */}
                  <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Community Vote</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleVote(recipe.id, 'up')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                          userVotes[recipe.id] === 'up'
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-600 hover:bg-green-100 hover:text-green-600 shadow-sm'
                        }`}
                      >
                        <FaThumbsUp className="text-sm" />
                        <span className="text-sm font-semibold">{recipe.votes}</span>
                      </button>
                    </div>
                  </div>

                  {/* Rating Section */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Rate this recipe:
                      </span>
                      {userRatings[recipe.id] && (
                        <span className="text-xs text-green-600 font-medium">
                          Rated {userRatings[recipe.id]} ⭐
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-3 bg-yellow-50 rounded-xl">
                      {renderStars(0, recipe.id, true)}
                    </div>
                    {userRatings[recipe.id] && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 text-center font-medium">
                          Thank you for rating! Your vote helps the community.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Challenge Voting Period
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Voting closes in 3 days. Make sure to rate all recipes!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                  View Results
                </button>
                <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200">
                  Share Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
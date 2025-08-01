'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaThumbsUp, FaArrowLeft, FaUser, FaUtensils } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useAuth } from "@/app/context/authContext"; // Add this import
import toast from 'react-hot-toast';

interface Recipe {
  id: string;
  fullName: string;
  recipeName: string;
  recipeImage: string | null;
  recipeDescription: string;
  ingredients: string[];
  challengeCategory: string;
  votes: number;
  rating: number;
  totalRatings: number;
}

export default function VoteAndRateChallenge() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;
  const { data: session } = useSession();
  const { user } = useAuth(); // Get user from AuthProvider

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userVotes, setUserVotes] = useState<{ [key: string]: 'up' | null }>({});
  const [userRatings, setUserRatings] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challengeName, setChallengeName] = useState<string>('');
  const [raterCount, setRaterCount] = useState(0);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Submission/challenge/${challengeId}`
        );
        const data = response.data;
        console.log("API data:", data); 
        if (Array.isArray(data)) {
          const mapped = data.map((recipe: any) => ({
            id: recipe.submissionId,
            fullName: recipe.fullName,
            recipeName: recipe.recipeName,
            ingredients: recipe.ingredients,
            recipeDescription: recipe.recipeDescription,
            recipeImage: recipe.recipeImage,
            challengeCategory: recipe.challengeCategory,
            votes: recipe.votes,
            rating: recipe.averageRating ?? recipe.rating ?? 0, // <-- always use averageRating first
            totalRatings: recipe.totalRatings ?? 0,
          }));
          setRecipes(mapped);
        } else {
          setRecipes([]);
        }
      } catch (err) {
        setError('Failed to load recipes. Please try again later.');
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }
    if (challengeId) fetchRecipes();
  }, [challengeId]);

  useEffect(() => {
    async function fetchChallengeDetails() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Challenges/details/${challengeId}`
        );
        setChallengeName(response.data.title); // Use 'title' from ChallengeDetailDto
      } catch (err) {
        setChallengeName('');
      }
    }
    if (challengeId) fetchChallengeDetails();
  }, [challengeId]);

  useEffect(() => {
    async function fetchUserVotes() {
      const userEmail = user?.email || session?.user?.email || localStorage.getItem('userEmail');
      if (!userEmail || !challengeId) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Vote/user?userEmail=${userEmail}&challengeId=${challengeId}`
        );
        const votes: { [key: string]: 'up' } = {};
        res.data.forEach((vote: any) => {
          votes[vote.submissionId] = 'up';
        });
        setUserVotes(votes);
      } catch {
        // ignore error
      }
    }
    fetchUserVotes();
  }, [user, session, challengeId]);

  useEffect(() => {
    async function fetchRaterCount() {
      if (!challengeId) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Vote/raters?challengeId=${challengeId}`
        );
        setRaterCount(res.data.count || 0);
      } catch {
        setRaterCount(0);
      }
    }
    fetchRaterCount();
  }, [challengeId]);

  useEffect(() => {
    async function fetchUserRatings() {
      const userEmail = user?.email || session?.user?.email || localStorage.getItem('userEmail');
      if (!userEmail || !challengeId) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Vote/user-ratings?userEmail=${userEmail}&challengeId=${challengeId}`
        );
        // Convert array to object: { [submissionId]: stars }
        const ratingsObj: { [submissionId: string]: number } = {};
        res.data.forEach((r: { submissionId: string, stars: number }) => {
          ratingsObj[r.submissionId] = r.stars;
        });
        setUserRatings(ratingsObj);
        localStorage.setItem('userRatings', JSON.stringify(ratingsObj)); // Optional: keep local cache
      } catch {
        // fallback to localStorage if needed
        const storedRatings = localStorage.getItem('userRatings');
        if (storedRatings) setUserRatings(JSON.parse(storedRatings));
      }
    }
    fetchUserRatings();
  }, [user, session, challengeId]);

  const handleVote = async (recipeId: string, voteType: 'up') => {
    if (userVotes[recipeId] === 'up') return;
    try {
      const userEmail = user?.email || session?.user?.email || localStorage.getItem('userEmail');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Vote`,
        {
          userEmail,
          submissionId: recipeId,
          challengeId,
        }
      );
      if (res.data && res.data.success) {
        // Refetch all recipes to get the latest vote counts
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Submission/challenge/${challengeId}`
        );
        const data = response.data;
        if (Array.isArray(data)) {
          const mapped = data.map((recipe: any) => ({
            id: recipe.submissionId,
            fullName: recipe.fullName,
            recipeName: recipe.recipeName,
            ingredients: recipe.ingredients,
            recipeDescription: recipe.recipeDescription,
            recipeImage: recipe.recipeImage,
            challengeCategory: recipe.challengeCategory,
            votes: recipe.votes,
            rating: recipe.rating,
            totalRatings: recipe.totalRatings,
          }));
          setRecipes(mapped);
        } else {
          setRecipes([]);
        }
        setUserVotes(prev => ({
          ...prev,
          [recipeId]: voteType
        }));
      } else {
        toast.error(res.data.message || 'Failed to vote. Please try again.');
        setError(res.data.message || 'Failed to vote. Please try again.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to vote. Please try again.');
      setError(err?.response?.data?.message || 'Failed to vote. Please try again.');
    }
  };

  const handleRating = async (recipeId: string, rating: number) => {
    setUserRatings(prev => ({
      ...prev,
      [recipeId]: rating
    }));
    await handleSubmitRating(recipeId, rating);
  };

  const handleSubmitRating = async (recipeId: string, rating: number) => {
    const userEmail = user?.email || session?.user?.email || localStorage.getItem('userEmail');
    if (!userEmail || !challengeId) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Vote/rate`,
        {
          userEmail,
          submissionId: recipeId,
          challengeId,
          stars: rating,
        }
      );
      if (res.data && res.data.success) {
        toast.success('Rating submitted successfully!');
        // Refetch recipes to update ratings
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Submission/challenge/${challengeId}`
        );
        const data = response.data;
        if (Array.isArray(data)) {
          const mapped = data.map((recipe: any) => ({
            id: recipe.submissionId,
            fullName: recipe.fullName,
            recipeName: recipe.recipeName,
            ingredients: recipe.ingredients,
            recipeDescription: recipe.recipeDescription,
            recipeImage: recipe.recipeImage,
            challengeCategory: recipe.challengeCategory,
            votes: recipe.votes,
            rating: recipe.rating,
            totalRatings: recipe.totalRatings,
          }));
          setRecipes(mapped);
        } else {
          setRecipes([]);
        }
      } else {
        toast.error(res.data.message || 'Failed to rate. Please try again.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to rate. Please try again.');
    }
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
      <div className="pt-16">
        {/* Header */}
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
              <div className="text-4xl sm:text-xl font-medium text-orange-100 mb-2">
                {challengeName}
              </div>
              <p className="text-orange-100 text-sm sm:text-base max-w-2xl mx-auto">
                Cast your votes and rate the submitted recipes to help determine the winner
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <span className="text-orange-500 font-semibold text-lg">Loading recipes...</span>
            </div>
          )}

          {/* Always show recipe cards */}
          {!loading && (
            <>
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
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-600">
                      {recipes.reduce((sum, recipe) => sum + (recipe.totalRatings ?? 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Rates</div>
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
                        src={recipe.recipeImage || '/default.jpg'}
                        alt={recipe.recipeName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    {/* Recipe Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 mb-2">
                            {recipe.recipeName || "No Name"}
                          </h3>
                        </div>
                        <div className="ml-3 flex-shrink-0">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200">
                            <FaUtensils className="mr-1 text-xs" />
                            {recipe.challengeCategory}
                          </span>
                        </div>
                      </div>
                      {/* Author */}
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                          <FaUser className="text-white text-xs" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{recipe.fullName}</span>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                        {recipe.recipeDescription}
                      </p>
                      {/* Ingredients */}
                      <div className="mb-4">
                        <span className="block text-sm font-semibold text-gray-700 mb-1">Ingredients:</span>
                        <ul className="list-disc list-inside text-gray-600 text-sm">
                          {(Array.isArray(recipe.ingredients) ? recipe.ingredients : []).map((ingredient: string, idx: number) => (
                            <li key={idx}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      {/* Current Rating */}
                      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(recipe.rating, recipe.id)}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {(recipe.rating ?? 0).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {recipe.totalRatings} ratings
                        </span>
                      </div>
                      {/* Voting Section */}
                      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Vote</span>
                        <button
                          onClick={() => {
                            if (userVotes[recipe.id] === 'up') {
                              toast('You have already voted for this recipe!');
                              return;
                            }
                            handleVote(recipe.id, 'up');
                          }}
                          className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 border border-gray-200 cursor-pointer
                            ${userVotes[recipe.id] === 'up'
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                            }`}
                        >
                          <span className="relative group">
                            <FaThumbsUp className={`text-sm ${userVotes[recipe.id] === 'up' ? 'text-green-200' : 'text-gray-400'}`} />
                            {userVotes[recipe.id] === 'up' && (
                              <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-green-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                You already voted!
                              </span>
                            )}
                          </span>
                          <span className="text-sm font-medium ml-2">{recipe.votes}</span>
                        </button>
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
                          {renderStars(userRatings[recipe.id] || 0, recipe.id, true)}
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
                    <button 
                      onClick={() => router.push(`/RecipeChallenge/JoinChallengePage/${challengeId}/leaderBoard`)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      View Results
                    </button> 
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
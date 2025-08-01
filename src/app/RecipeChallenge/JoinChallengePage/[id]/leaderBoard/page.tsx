"use client";

import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaTrophy, FaMedal, FaUsers, FaStar, FaUtensils, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

export interface LeaderboardEntry {
  id: string;
  name: string;
  recipeName: string;
  recipeImage: string;
  recipeDescription: string;
  score: number;
  votes: number;
  rating: number;
  totalRatings: number;
  challengeCategory: string;
  rank: number;
}

const LeaderboardPage = () => {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [challengeName, setChallengeName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 items per page

  // Pagination calculations
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = leaderboardData.slice(startIndex, endIndex);

  useEffect(() => {
    async function fetchChallengeDetails() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Challenges/details/${challengeId}`
        );
        setChallengeName(response.data.title);
      } catch (err) {
        setChallengeName('Recipe Challenge');
      }
    }
    if (challengeId) fetchChallengeDetails();
  }, [challengeId]);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Submission/challenge/${challengeId}/leaderboard`
        );
        setLeaderboardData(response.data);
      } catch (err) {
        setLeaderboardData([]);
      }
      setLoading(false);
    }
    if (challengeId) fetchLeaderboard();
  }, [challengeId]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "1";
    if (rank === 2) return "2";
    if (rank === 3) return "3";
    return `#${rank}`;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <FaStar
          key={index}
          className={`${
            starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
          } text-sm`}
        />
      );
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of leaderboard section
    document.getElementById('leaderboard-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <FaChevronLeft className="text-xs" />
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            i === currentPage
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <FaChevronRight className="text-xs" />
      </button>
    );

    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        {pages}
      </div>
    );
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
                🏆 Challenge Leaderboard
              </h1>
              <div className="text-xl sm:text-2xl font-medium text-orange-100 mb-2">
                {challengeName}
              </div>
              <p className="text-orange-100 text-sm sm:text-base max-w-2xl mx-auto">
                See how you rank among fellow chefs and discover the winning recipes!
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <span className="text-orange-500 font-semibold text-lg">Loading leaderboard...</span>
            </div>
          )}

          {!loading && (
            <>
              {/* Full Leaderboard */}
              <div id="leaderboard-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-100 to-red-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Full Leaderboard</h2>
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, leaderboardData.length)} of {leaderboardData.length} participants
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Recipe</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Chef</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Votes</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentItems.map((entry, index) => (
                        <tr key={entry.id} className={`hover:bg-gray-50 transition-colors ${entry.rank <= 3 ? 'bg-orange-25' : ''}`}>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${getRankStyle(entry.rank ?? index + 1)}`}>
                              {getRankBadge(entry.rank ?? index + 1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 relative rounded-lg overflow-hidden">
                                <Image
                                  src={entry.recipeImage || '/default.jpg'}
                                  alt={entry.recipeName}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{entry.recipeName}</div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <FaUtensils className="mr-1" />
                                  {entry.challengeCategory}
                                </div>
                                
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="flex items-center space-x-1">
                              {renderStars(entry.rating)}
                              <span className="text-sm text-gray-600 ml-1">({entry.rating})</span>
                            </div>
                              <div className="text-xs text-gray-400 mt-1">
                                  {entry.totalRatings} {entry.totalRatings === 1 ? 'rating' : 'ratings'}
                              </div>
                            </div>
                            
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{entry.votes}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-lg font-semibold">
                              {entry.score}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">/100</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-200">
                  {currentItems.map((entry, index) => (
                    <div key={entry.id} className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${getRankStyle(entry.rank)}`}>
                          {getRankBadge(entry.rank)}
                        </span>
                        <div className="h-12 w-12 relative rounded-lg overflow-hidden">
                          <Image
                            src={entry.recipeImage || '/default.jpg'}
                            alt={entry.recipeName}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{entry.recipeName}</div>
                          <div className="text-xs text-gray-500">{entry.name}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold">
                            {entry.score}
                          </span>
                          <div className="text-xs text-gray-500">/100</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          {renderStars(entry.rating)}
                          <span className="text-gray-600 ml-1">({entry.rating})</span>
                        </div>
                        <div className="text-gray-600">{entry.votes} votes</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    {renderPagination()}
                    <div className="text-center mt-3 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    🎉 Challenge Complete!
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Congratulations to all participants! Check out the winning recipes and try them yourself.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={() => router.push(`/RecipeChallenge/JoinChallengePage/${challengeId}/VoteAndRateChallenge`)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      View All Recipes
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
};

export default LeaderboardPage;
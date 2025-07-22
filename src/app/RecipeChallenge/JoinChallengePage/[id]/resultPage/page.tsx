"use client";

import React from "react";
import { Star, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const ResultPage = () => {
  const reviews = [
    {
      id: 1,
      name: "Jonas Sousa",
      username: "@designerjr",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Isabela Silveira",
      username: "@belezainadorada",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Diego Curumim",
      username: "@diegocurumim",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Diego Curumim",
      username: "@diegocurumim",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-orange-400 text-orange-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 mt-16">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-300 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-400 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Current Recipe Challenge Results</h1>
          <p className="text-gray-600 mt-2">See how your recipe stacks up against others!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">{renderStars(5)}</div>
                <span className="text-sm text-gray-500">211 mil avaliações</span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{review.name}</h3>
                        <p className="text-sm text-gray-500">{review.username}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Votes and Ranking Section */}
          <div className="space-y-6">
            {/* Votes Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Votes</h2>
              <div className="flex items-center space-x-2">
                <ThumbsUp className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-semibold text-gray-700">4 votes</span>
              </div>
            </div>

            {/* Current Rank Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-8xl font-bold text-gray-800 mb-2">05</div>
              <div className="text-xl font-semibold text-orange-500 mb-6">Current Rank</div>
              <div className="border-t border-gray-200 pt-6">
                <Link href={`/RecipeChallenge/JoinChallengePage/${id}/leaderBoard`}>
                  <h3 className="text-2xl font-bold text-orange-500 cursor-pointer p-2 rounded-lg transition-colors hover:bg-orange-500 hover:text-white">
                    Leaderboard
                  </h3>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
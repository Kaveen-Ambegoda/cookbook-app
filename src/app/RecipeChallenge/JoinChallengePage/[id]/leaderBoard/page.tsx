"use client";

import React from "react";

const LeaderboardPage = () => {
  // Dummy leaderboard data
  const leaderboardData = [
    { id: 1, name: "John Doe", score: 95, rank: 1 },
    { id: 2, name: "Jane Smith", score: 90, rank: 2 },
    { id: 3, name: "Alice Johnson", score: 85, rank: 3 },
    { id: 4, name: "Bob Brown", score: 80, rank: 4 },
    { id: 5, name: "Emma Wilson", score: 75, rank: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Challenge Leaderboard
        </h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Rank</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{entry.rank}</td>
                  <td className="p-4">{entry.name}</td>
                  <td className="p-4">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
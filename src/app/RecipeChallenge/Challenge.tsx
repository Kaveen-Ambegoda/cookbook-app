// components/Challenge.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaTrophy, FaShareAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export interface ChallengeDetail {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  date: string;
  sponsor: string;
}

interface ChallengeProps {
  challenge: ChallengeDetail;
}

const Challenge: React.FC<ChallengeProps> = ({ challenge }) => {
  const router = useRouter();

  const handleLeaderboardClick = () => {
    router.push(`/RecipeChallenge/JoinChallengePage/${challenge.id}/leaderBoard`);
  };

  return (
    <div>
      <div className="min-h-[80vh] rounded-lg flex items-center justify-center py-8 px-4 bg-black/10">
        <div className="bg-white/95 p-5 rounded-lg shadow-2xl transition transform hover:scale-[1.01] border border-white/20">
          <div className="text-center mb-5">
            <h3 className="text-3xl font-extrabold text-orange-500 md:text-5xl tracking-wide drop-shadow">
              {challenge.title}
            </h3>
            {challenge.subtitle && (
              <p className="text-slate-700 mt-1 text-lg md:text-xl">
                {challenge.subtitle}
              </p>
            )}
          </div>

          {/* Content Area */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Section */}
            <div className="flex-shrink-0 w-full md:w-2/5">
              {challenge.img ? (
                <img
                  src={challenge.img}
                  width={400}
                  height={300}
                  alt={challenge.title}
                  style={{ borderRadius: '12px', objectFit: 'cover', width: '400px', height: '300px' }}
                />

              ) : (
                <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="flex-1 flex flex-col">
              <div className="space-y-4 md:pt-10">
                <div className="flex items-center text-gray-800 text-lg">
                  <FaCalendarAlt className="mr-3 text-orange-400 text-2xl" />
                  <span>
                    Date:{" "}
                    <span className="font-semibold">{challenge.date}</span>
                  </span>
                </div>
                <div className="flex items-center text-gray-800 text-lg">
                  <FaTrophy className="mr-3 text-orange-400 text-2xl" />
                  <span>
                    Sponsor:{" "}
                    <span className="font-semibold">{challenge.sponsor}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto pt-6 space-y-3">
                {/* First row - Secondary actions */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                  <button
                    className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium w-full sm:w-auto min-w-[140px]"
                    onClick={handleLeaderboardClick}
                  >
                    <FaTrophy className="text-sm" />
                    <span>Leaderboard</span>
                  </button>

                  <Link
                    href={`/RecipeChallenge/JoinChallengePage/${challenge.id}/VoteAndRateChallenge`}
                    className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium w-full sm:w-auto min-w-[140px]"
                  >
                    <span>Vote & Rate</span>
                  </Link>
                </div>

                {/* Second row - Primary action */}
                <div className="flex justify-center">
                  <Link
                    href={`/RecipeChallenge/JoinChallengePage/${challenge.id}`}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-100 w-full sm:w-[314px]"
                  >
                    <span>Join Challenge</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenge;

// challenge component

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaTrophy, FaUsers, FaShareAlt } from "react-icons/fa";
import { challenges } from "./ChallengeCard";

type ChallengeProps = {
  challenge: {
    id: number;
    title: string;  
    subtitle: string;
    date: string;
    Sponsor: string;
    img: string;
    participants?: number;
  };
}; 

const Challenge: React.FC<ChallengeProps> = ({ challenge }) => {
  return (
    <div >
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
              {/* Image section */}
              <div className="flex-shrink-0 w-full md:w-2/5">
                <Image
                  src={challenge.img}
                  width={400}
                  height={300}
                  alt={challenge.title}
                  className="rounded-lg object-cover w-full h-full shadow-md"
                  priority
                />
              </div>

              {/* Details section */}
              <div className="flex-1 flex flex-col">
                <div className="space-y-4 md:pt-10">
                  <div className="flex items-center text-gray-800 text-lg">
                    <FaCalendarAlt className="mr-3 text-orange-400 text-2xl" />
                    <span>Date: <span className="font-semibold">{challenge.date}</span></span>
                  </div>
                  
                  <div className="flex items-center text-gray-800 text-lg">
                    <FaTrophy className="mr-3 text-orange-400 text-2xl" />
                    <span>Sponsor: <span className="font-semibold">{challenge.Sponsor}</span></span>
                  </div>
                  
                  {challenge.participants && (
                    <div className="flex items-center text-gray-800 text-lg">
                      <FaUsers className="mr-3 text-orange-400 text-xl" />
                      <span><span className="font-semibold">{challenge.participants}</span> participants</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <button className="flex items-center space-x-2 text-slate-600 hover:text-orange-500 transition">
                    <FaShareAlt className="text-lg" />
                    <span className="font-medium">Share Challenge</span>
                  </button>
                  
                  <Link
                    href={`/RecipeChallenge/JoinChallengePage/${encodeURIComponent(challenge.title)}`}
                    className="text-white bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition font-medium w-full sm:w-auto text-center shadow-md hover:shadow-lg">
                    Join Challenge
                  </Link>
                </div>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default Challenge;

// components/JoinChallengePage.tsx
import React from "react";
import JoinForm from "./JoinForm";

interface JoinChallengePageProps {
  params: {
    id: string;
  };
}

function JoinChallengePage({ params }: JoinChallengePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-orange-600">
              Join the "{params.id}"!
            </h1>
            <p className="mt-2 text-gray-600">
              Fill out the form below to participate in this challenge.
            </p>
          </div>
          <JoinForm challengeId={params.id} />
        </div>
      </div>
    </div>
  );
}

export default JoinChallengePage;
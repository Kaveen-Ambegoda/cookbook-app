"use client";
import React, { useEffect, useState } from "react";
import JoinForm from "./JoinForm";
import axios from "axios";
import { ChallengeType, ChallengeDetail } from "../../../../utils/challengeUtils";

interface JoinChallengePageProps {
  params: {
    id: string;
  };
}

function JoinChallengePage({ params }: JoinChallengePageProps) {
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      axios
        .get<ChallengeDetail[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Challenges/details`)
        .then((res) => {
          const found = res.data.find((c) => c.id.toString() === params.id);
          setChallenge(found || null);
        })
        .finally(() => setLoading(false));
    }
  }, [params?.id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold text-orange-600">
              Join the "{challenge ? challenge.title : "Unknown Challenge"}"!
            </h1>
            <p className="mt-2 text-gray-600">
              Fill out the form below to participate in this challenge.
            </p>
          </div>
          <JoinForm challenge={challenge} />
        </div>
      </div>
    </div>
  );
}

export default JoinChallengePage;
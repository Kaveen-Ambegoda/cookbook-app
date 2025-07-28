"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Challenge, { ChallengeDetail } from "./Challenge";

const ChallengeList: React.FC = () => {
  const [challenges, setChallenges] = useState<ChallengeDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<ChallengeDetail[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Challenges/details`
      )
      .then((res) => setChallenges(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {challenges.map((challenge, idx) => (
        <Challenge key={idx} challenge={challenge} />
      ))}
    </div>
  );
};

export default ChallengeList;
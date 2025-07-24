import React, { useEffect, useState } from "react";
import Challenge from "./Challenge";
import axios from "axios";

const ChallengeCard = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.get(`${apiUrl}/Challenges/details`)
      .then(res => setChallenges(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {challenges.map((challenge) => (
        <Challenge key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
};

export default ChallengeCard;






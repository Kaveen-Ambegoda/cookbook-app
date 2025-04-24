import React from "react";


import { SiPocket } from "react-icons/si";

import JoinChallengeRoute from "./JoinChallengeRoute";
import { title } from "process";

const joinchallenges = [
  {
    id: 1,
    title: "Mystery Box Challenge",
  }

  
];

const JoinChallengePage = () => {
  return (
    <div className="grid grid-cols-1  gap-8 p-4">
      {joinchallenges.map((joinchallenge) => (
        <JoinChallengeRoute key={joinchallenge.id} joinchallenge={joinchallenge} />
      ))}
    </div>
  );
};                            

export default JoinChallengePage;

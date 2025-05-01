import React from "react";
import { SiPocket } from "react-icons/si";
import Challenge from "./Challenge";
import { it } from "node:test";


// Hardcoded because it's come from backend and enter data by admin user
export const challenges = [
  { 
    id: 1, 
    title: "Mystery Box Challenge",
    subtitle: "Cook with Creativity!",
    date: "26 APRIL 2025 - 3 JUNE 2025",
    Sponsor: "Chef's Co",
    img: "/image/1.jpg",
    
  },
  { 
    id: 2, 
    title: "Santa's Spread", 
    subtitle: "Spread holiday cheer with your festive culinary creations!",
    date: "26 APRIL 2025 - 3 JUNE 2025",
    Sponsor: "Chef's Co",
    img: "/image/2.jpg",
  },
  { 
    id: 3, 
    title: "5-Ingredient Challenge",
    subtitle: "Less is More! Create Magic with Just 5 Items.",
    date: "26 APRIL 2025 - 3 JUNE 2025",
    Sponsor: "Chef's Co",
    img: "/image/3.jpg",
  },
  { 
    id: 4, 
    title: "Leftover Remix",
    subtitle: "Waste Not, Wow More! Turn Leftovers into Gourmet.",
    date: "26 APRIL 2025 - 3 JUNE 2025",
    Sponsor: "Chef's Co",
    img: "/image/4.jpg",
  },
  
];

const ChallengeCard = () => {
  return (
    <div className="grid grid-cols-1 gap-8 p-4">
      {challenges.map((challenge) => (
        <Challenge key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
};                            

export default ChallengeCard;






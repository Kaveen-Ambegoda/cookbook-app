import React from "react";
import { SiPocket } from "react-icons/si";
import Challenge from "./Challenge";

// Updated challenges with detailed information
export const challenges = [
  { 
    id: 1, 
    title: "Mystery Box Challenge",
    subtitle: "Cook with Creativity!",
    date: "26 APRIL 2025 - 3 JUNE 2025",
    Sponsor: "Chef's Co",
    img: "/image/1.jpg",
    description: "Test your culinary skills with mystery ingredients! Create something amazing with whatever you're given.",
    requirements: [
      "Use only 3 mystery ingredients",
      "Submit a high-quality photo of your dish along with a brief recipe description",
      "Optional: Share your creative process and inspiration"
    ],
    timeline: {
      registration: "Apr 1-25, 2025",
      judging: "May 26-28, 2025",
      winnersAnnounced: "May 30, 2025"
    }
  },
  { 
    id: 2, 
    title: "Christmas Cookies Challenge",
    subtitle: "Spread holiday cheer with your festive culinary creations!",
    date: "26 APRIL 2025 - 3 JUNE 2025",
    Sponsor: "Chef's Co",
    img: "/image/2.jpg",
    description: "Celebrate the joy of Christmas with your favorite recipes! Whether it is a savory feast or a sweet cake, we want to see your most creative and festive dishes.",
    requirements: [
      "Use at least 4 Christmas-themed ingredients",
      "Submit a high-quality photo of your dish along with a brief recipe description",
      "Optional: Add a festive story about why this dish is special to you"
    ],
    timeline: {
      registration: "Dec 1-20, 2024",
      judging: "Dec 21-23, 2024",
      winnersAnnounced: "Dec 24, 2024"
    }
  },
  { 
    id: 3, 
    title: "5-Ingredient Challenge",
    subtitle: "Less is More! Create Magic with Just 5 Items.",
    date: "26 APRIL 2025 - 3 JUNE 2025",
    Sponsor: "Chef's Co",
    img: "/image/3.jpg",
    description: "Prove that great cooking doesn't require a long ingredient list! Create delicious dishes using only 5 ingredients.",
    requirements: [
      "Use exactly 5 ingredients (salt, pepper, and basic spices don't count)",
      "Submit a high-quality photo of your dish along with a brief recipe description",
      "Optional: Explain your ingredient choices and cooking technique"
    ],
    timeline: {
      registration: "Apr 1-25, 2025",
      judging: "May 26-28, 2025",
      winnersAnnounced: "May 30, 2025"
    }
  },
  { 
    id: 4, 
    title: "Leftover Remix",
    subtitle: "Waste Not, Wow More! Turn Leftovers into Gourmet.",
    date: "26 APRIL 2025 - 3 JUNE 2025",
    Sponsor: "Chef's Co",
    img: "/image/4.jpg",
    description: "Transform your leftovers into culinary masterpieces! Show us how you can make yesterday's meal into today's gourmet experience.",
    requirements: [
      "Use at least 2 and maximum is 5 leftover ingredients",
      "Submit a high-quality photo of your dish along with a brief recipe description",
      "Optional: Share before and after photos of your transformation"
    ],
    timeline: {
      registration: "Apr 1-25, 2025",
      judging: "May 26-28, 2025",
      winnersAnnounced: "May 30, 2025"
    }
  },
];

// Export challenge type for use in other components
export interface ChallengeType {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  Sponsor: string;
  img: string;
  description: string;
  requirements: string[];
  timeline: {
    registration: string;
    judging: string;
    winnersAnnounced: string;
  };
}

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






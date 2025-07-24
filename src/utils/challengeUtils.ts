export type ChallengeType = {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  date: string;
  sponsor: string;
  description: string;
  requirements: string[];
  timeline: {
    registration: string;
    judging: string;
    winnersAnnounced: string;
  };
};

export interface ChallengeDetail extends ChallengeType {
  // ...additional fields if needed
}

// Example challenges array (replace with your actual data or import)
const challenges: ChallengeType[] = [
  // { id: "1", title: "Challenge 1", subtitle: "...", img: "...", date: "...", sponsor: "..." },
  // ...other challenges
];

export const getChallengeById = (challengeId: string): ChallengeType | null => {
  const challenge = challenges.find((c: ChallengeType) => c.id.toString() === challengeId || c.title === challengeId);
  return challenge || null;
};

export const getChallengeByTitle = (title: string): ChallengeType | null => {
  const challenge = challenges.find((c: ChallengeType) => c.title.toLowerCase() === title.toLowerCase());
  return challenge || null;
};
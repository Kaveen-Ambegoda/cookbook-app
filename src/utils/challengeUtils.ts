import { challenges, ChallengeType } from '../app/RecipeChallenge/ChallengeCard';

export const getChallengeById = (challengeId: string): ChallengeType | null => {
  const challenge = challenges.find(c => c.id.toString() === challengeId || c.title === challengeId);
  return challenge || null;
};

export const getChallengeByTitle = (title: string): ChallengeType | null => {
  const challenge = challenges.find(c => c.title.toLowerCase() === title.toLowerCase());
  return challenge || null;
};
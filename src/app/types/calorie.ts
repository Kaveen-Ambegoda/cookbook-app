// src/app/types/calorie.ts

export interface UserData {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  bodyFat?: number;
  goal: 'maintain' | 'lose' | 'gain';
}




export interface CalorieResults {
  bmr: number;
  maintenance: number;
  weightLoss: number;
  weightGain: number;
  userData: UserData;
}

export interface FormErrors {
  age?: string;
  gender?: string;
  weight?: string;
  height?: string;
  activity?: string;
  goal?: string;
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,      // Little to no exercise
  light: 1.375,        // Light exercise 1-3 days/week
  moderate: 1.55,      // Moderate exercise 3-5 days/week
  active: 1.725,       // Heavy exercise 6-7 days/week
  very_active: 1.9     // Very heavy exercise, physical job
} as const;

export const ACTIVITY_LABELS = {
  sedentary: 'Sedentary (Little to no exercise)',
  light: 'Light (Light exercise 1-3 days/week)',
  moderate: 'Moderate (Moderate exercise 3-5 days/week)',
  active: 'Active (Heavy exercise 6-7 days/week)',
  very_active: 'Very Active (Very heavy exercise, physical job)'
} as const;

export const GOAL_LABELS = {
  maintain: 'Maintain Weight',
  lose: 'Weight Loss',
  gain: 'Weight Gain'
} as const;
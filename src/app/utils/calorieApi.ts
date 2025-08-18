// File: src/app/utils/calorieApi.ts

// *** THIS IS THE FINAL AND CORRECT FIX FOR THE NETWORK ERROR ***
// The URL is now updated to match the exact address your backend server is running on.
const API_BASE_URL = 'https://localhost:7205/api';

// --- TYPE DEFINITIONS ---
// (No changes are needed below this line)

// Generic API response structure from the backend
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

// Payload for creating/updating a user profile
export interface UserProfileRequest {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  bodyFatPercentage?: number;
  goal: 'maintain' | 'lose' | 'gain';
}

// Response object for a user profile
export interface UserProfileResponse {
  id: number;
  userId: number;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  bodyFatPercentage?: number;
  goal: 'maintain' | 'lose' | 'gain';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Details for a single macronutrient
export interface MacronutrientDto {
  grams: number;
  calories: number;
  percentage: number;
}

// The complete macronutrient breakdown
export interface MacronutrientBreakdown {
  protein: MacronutrientDto;
  carbs: MacronutrientDto;
  fat: MacronutrientDto;
}

// The full response from a successful calorie calculation
export interface CalorieCalculationResponse {
  id: number;
  userId: number;
  userProfile: UserProfileResponse;
  bmr: number;
  maintenanceCalories: number;
  weightLossCalories: number;
  weightGainCalories: number;
  bmi: number;
  bmiCategory: string;
  idealWeightMin: number;
  idealWeightMax: number;
  macros: MacronutrientBreakdown;
  calculatedAt: string; // ISO date string
}

// A single item in the user's calculation history
export interface CalorieHistory {
  id: number;
  bmr: number;
  maintenanceCalories: number;
  weightLossCalories: number;
  weightGainCalories: number;
  bmi: number;
  weight: number;
  goal: 'maintain' | 'lose' | 'gain';
  calculatedAt: string; // ISO date string
}


// --- API HELPER FUNCTIONS ---

const getCurrentUserId = (): number => {
  if (typeof window === 'undefined') return 1;
  return parseInt(localStorage.getItem('userId') || '1');
};

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

const getHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const responseText = await response.text();
  
  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseText) as ApiResponse<T>;
      const errorMessage = errorData.errors?.join(', ') || errorData.message || `API Error: ${response.status}`;
      throw new Error(errorMessage);
    } catch {
      throw new Error(`HTTP Error: ${response.status}. Could not parse error response.`);
    }
  }

  if (!responseText) {
    return { success: true, message: "Operation successful.", data: null as T, errors: [] };
  }
  
  return JSON.parse(responseText);
};


// --- API SERVICE CLASS ---

export class CalorieCalculatorAPI {

  static async calculateCalories(profileData: UserProfileRequest, userId?: number): Promise<CalorieCalculationResponse> {
    try {
      const targetUserId = userId || getCurrentUserId();
      const response = await fetch(`${API_BASE_URL}/CalorieCalculator/calculate/${targetUserId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
      const result = await handleApiResponse<CalorieCalculationResponse>(response);
      return result.data;
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network Error: Could not connect to the API. Please ensure the backend server is running and accessible.');
      }
      throw error;
    }
  }

  static async getLatestCalculation(userId?: number): Promise<CalorieCalculationResponse | null> {
    try {
      const targetUserId = userId || getCurrentUserId();
      const response = await fetch(`${API_BASE_URL}/CalorieCalculator/latest/${targetUserId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const result = await handleApiResponse<CalorieCalculationResponse>(response);
      return result.data;
    } catch (error: any) {
      console.error('Error fetching latest calculation:', error.message);
      return null;
    }
  }

  static async getCalculationHistory(userId?: number, limit: number = 10): Promise<CalorieHistory[]> {
    try {
      const targetUserId = userId || getCurrentUserId();
      const response = await fetch(`${API_BASE_URL}/CalorieCalculator/history/${targetUserId}?limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const result = await handleApiResponse<CalorieHistory[]>(response);
      return result.data || [];
    } catch (error: any) {
      console.error('Error fetching calculation history:', error.message);
      return [];
    }
  }
}
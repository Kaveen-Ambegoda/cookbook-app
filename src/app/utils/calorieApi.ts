// src/app/utils/calorieApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7001/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export interface UserProfileRequest {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  bodyFatPercentage?: number;
  goal: 'maintain' | 'lose' | 'gain';
}

export interface UserProfileResponse {
  id: number;
  userId: number;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  bodyFatPercentage?: number;
  goal: string;
  createdAt: string;
  updatedAt: string;
}

export interface MacronutrientDto {
  grams: number;
  calories: number;
  percentage: number;
}

export interface MacronutrientBreakdown {
  protein: MacronutrientDto;
  carbs: MacronutrientDto;
  fat: MacronutrientDto;
}

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
  calculatedAt: string;
}

export interface CalorieHistory {
  id: number;
  bmr: number;
  maintenanceCalories: number;
  weightLossCalories: number;
  weightGainCalories: number;
  bmi: number;
  weight: number;
  goal: string;
  calculatedAt: string;
}

// Get auth token from localStorage or your auth context
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Create headers with auth token
const getHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle API errors
const handleApiError = (response: Response, data: any) => {
  if (!response.ok) {
    const errorMessage = data?.message || `HTTP error! status: ${response.status}`;
    const errors = data?.errors || [];
    throw new Error(errors.length > 0 ? errors.join(', ') : errorMessage);
  }
};

export class CalorieCalculatorAPI {
  // Get user profile
  static async getUserProfile(): Promise<UserProfileResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/CalorieCalculator/profile`, {
        method: 'GET',
        headers: getHeaders(),
      });

      const result: ApiResponse<UserProfileResponse> = await response.json();
      handleApiError(response, result);

      return result.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Calculate calories
  static async calculateCalories(profileData: UserProfileRequest): Promise<CalorieCalculationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/CalorieCalculator/calculate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });

      const result: ApiResponse<CalorieCalculationResponse> = await response.json();
      handleApiError(response, result);

      return result.data;
    } catch (error) {
      console.error('Error calculating calories:', error);
      throw error;
    }
  }

  // Get latest calculation
  static async getLatestCalculation(): Promise<CalorieCalculationResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/CalorieCalculator/latest`, {
        method: 'GET',
        headers: getHeaders(),
      });

      const result: ApiResponse<CalorieCalculationResponse> = await response.json();
      handleApiError(response, result);

      return result.data;
    } catch (error) {
      console.error('Error fetching latest calculation:', error);
      throw error;
    }
  }

  // Get calculation history
  static async getCalculationHistory(limit: number = 10): Promise<CalorieHistory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/CalorieCalculator/history?limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      const result: ApiResponse<CalorieHistory[]> = await response.json();
      handleApiError(response, result);

      return result.data;
    } catch (error) {
      console.error('Error fetching calculation history:', error);
      throw error;
    }
  }

  // Delete calculation
  static async deleteCalculation(calculationId: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/CalorieCalculator/calculation/${calculationId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      const result: ApiResponse<boolean> = await response.json();
      handleApiError(response, result);

      return result.data;
    } catch (error) {
      console.error('Error deleting calculation:', error);
      throw error;
    }
  }
}

// Hook for React components
export const useCalorieCalculator = () => {
  const calculateCalories = async (profileData: UserProfileRequest) => {
    return await CalorieCalculatorAPI.calculateCalories(profileData);
  };

  const getUserProfile = async () => {
    return await CalorieCalculatorAPI.getUserProfile();
  };

  const getLatestCalculation = async () => {
    return await CalorieCalculatorAPI.getLatestCalculation();
  };

  const getCalculationHistory = async (limit?: number) => {
    return await CalorieCalculatorAPI.getCalculationHistory(limit);
  };

  const deleteCalculation = async (calculationId: number) => {
    return await CalorieCalculatorAPI.deleteCalculation(calculationId);
  };

  return {
    calculateCalories,
    getUserProfile,
    getLatestCalculation,
    getCalculationHistory,
    deleteCalculation,
  };
};
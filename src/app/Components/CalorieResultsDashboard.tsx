'use client';

import { CalorieCalculationResponse, UserProfileRequest } from '../utils/calorieApi';

interface CalorieResultsDashboardProps {
  results: CalorieCalculationResponse;
  onReset: () => void;
}

// Utility functions for calculations
const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

const calculateMacros = (calories: number, goal: string) => {
  // Standard macro ratios: 30% protein, 40% carbs, 30% fat
  const proteinCalories = Math.round(calories * 0.3);
  const carbCalories = Math.round(calories * 0.4);
  const fatCalories = Math.round(calories * 0.3);

  return {
    protein: {
      grams: Math.round(proteinCalories / 4),
      calories: proteinCalories
    },
    carbs: {
      grams: Math.round(carbCalories / 4),
      calories: carbCalories
    },
    fat: {
      grams: Math.round(fatCalories / 9),
      calories: fatCalories
    }
  };
};

export default function CalorieResultsDashboard({ results, onReset }: CalorieResultsDashboardProps) {
  // Extract data from the API response structure
  const bmr = results.bmr;
  const maintenance = results.maintenanceCalories;
  const weightLoss = results.weightLossCalories;
  const weightGain = results.weightGainCalories;
  const bmi = results.bmi;
  const bmiCategory = results.bmiCategory;
  const idealWeightMin = results.idealWeightMin;
  const idealWeightMax = results.idealWeightMax;
  
  // Extract user profile data
  const userProfile = results.userProfile;
  const age = userProfile.age;
  const gender = userProfile.gender as 'male' | 'female';
  const height = userProfile.height;
  const weight = userProfile.weight;
  const activityLevel = userProfile.activityLevel;
  const goal = userProfile.goal;

  // Use the macros from API if available, otherwise calculate them
  const macros = results.macros ? {
    protein: {
      grams: results.macros.protein.grams,
      calories: results.macros.protein.calories
    },
    carbs: {
      grams: results.macros.carbs.grams,
      calories: results.macros.carbs.calories
    },
    fat: {
      grams: results.macros.fat.grams,
      calories: results.macros.fat.calories
    }
  } : calculateMacros(maintenance, goal);

  const activityLabels: Record<string, string> = {
    sedentary: 'Sedentary',
    light: 'Light Activity',
    moderate: 'Moderate Activity',
    active: 'Active',
    very_active: 'Very Active'
  };

  const goalLabels: Record<string, string> = {
    maintain: 'Maintain Weight',
    lose: 'Weight Loss',
    gain: 'Weight Gain'
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Calorie Results</h1>
        <p className="text-gray-600">Personalized recommendations based on your profile</p>
      </div>

      {/* Main Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* BMR Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{bmr.toLocaleString()}</div>
              <div className="text-sm text-gray-500">calories/day</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Basal Metabolic Rate</h3>
          <p className="text-sm text-gray-600">Calories burned at rest</p>
        </div>

        {/* Maintenance Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚖️</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{maintenance.toLocaleString()}</div>
              <div className="text-sm text-gray-500">calories/day</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Maintenance Calories</h3>
          <p className="text-sm text-gray-600">To maintain current weight</p>
        </div>

        {/* Weight Loss Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📉</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{weightLoss.toLocaleString()}</div>
              <div className="text-sm text-gray-500">calories/day</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Weight Loss</h3>
          <p className="text-sm text-gray-600">For losing 0.5kg/week</p>
        </div>

        {/* Weight Gain Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{weightGain.toLocaleString()}</div>
              <div className="text-sm text-gray-500">calories/day</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Weight Gain</h3>
          <p className="text-sm text-gray-600">For gaining 0.5kg/week</p>
        </div>
      </div>

      {/* BMI and Health Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* BMI Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Body Mass Index</h3>
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">{bmi}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              bmi < 18.5 ? 'bg-blue-100 text-blue-800' :
              bmi < 25 ? 'bg-green-100 text-green-800' :
              bmi < 30 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {bmiCategory}
            </div>
          </div>
        </div>

        {/* Ideal Weight Range */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Ideal Weight Range</h3>
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-800">
                {idealWeightMin} - {idealWeightMax} kg
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Based on BMI 18.5-24.9
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              weight >= idealWeightMin && weight <= idealWeightMax
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {weight >= idealWeightMin && weight <= idealWeightMax
                ? 'Within ideal range'
                : weight < idealWeightMin
                ? 'Below ideal range'
                : 'Above ideal range'
              }
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Weight Loss</span>
                <span className="font-bold text-red-600">-0.5 kg/week</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Maintenance</span>
                <span className="font-bold text-green-600">0 kg/week</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Weight Gain</span>
                <span className="font-bold text-blue-600">+0.5 kg/week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Macronutrient Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Daily Macronutrient Breakdown</h3>
        <p className="text-gray-600 mb-6">Based on your {maintenance} maintenance calories</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Protein */}
          <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🥩</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Protein</h4>
            <div className="text-2xl font-bold text-red-600 mb-1">{macros.protein.grams}g</div>
            <div className="text-sm text-gray-600">{macros.protein.calories} calories</div>
            <div className="text-xs text-gray-500 mt-2">
              {Math.round((macros.protein.calories / maintenance) * 100)}% of total calories
            </div>
          </div>

          {/* Carbohydrates */}
          <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🍞</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Carbohydrates</h4>
            <div className="text-2xl font-bold text-orange-600 mb-1">{macros.carbs.grams}g</div>
            <div className="text-sm text-gray-600">{macros.carbs.calories} calories</div>
            <div className="text-xs text-gray-500 mt-2">
              {Math.round((macros.carbs.calories / maintenance) * 100)}% of total calories
            </div>
          </div>

          {/* Fats */}
          <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🥑</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Fats</h4>
            <div className="text-2xl font-bold text-yellow-600 mb-1">{macros.fat.grams}g</div>
            <div className="text-sm text-gray-600">{macros.fat.calories} calories</div>
            <div className="text-xs text-gray-500 mt-2">
              {Math.round((macros.fat.calories / maintenance) * 100)}% of total calories
            </div>
          </div>
        </div>
      </div>

      {/* User Profile and Daily Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl text-white">👤</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Your Profile</h3>
              <p className="text-gray-600">Current Information</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-800">{age}</div>
              <div className="text-sm text-gray-600">Years</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-800 capitalize">{gender}</div>
              <div className="text-sm text-gray-600">Gender</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-800">{weight} kg</div>
              <div className="text-sm text-gray-600">Weight</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-800">{height} cm</div>
              <div className="text-sm text-gray-600">Height</div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Activity Level</span>
              <span className="text-sm font-bold text-blue-700">{activityLabels[activityLevel] || 'Sedentary'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Goal</span>
              <span className="text-sm font-bold text-green-700">{goalLabels[goal] || 'Maintain Weight'}</span>
            </div>
          </div>
        </div>

        {/* Daily Calorie Targets */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Daily Calorie Targets</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔥</span>
                <span className="font-medium text-gray-700">BMR</span>
              </div>
              <span className="text-lg font-bold text-orange-600">{bmr} Cal</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚖️</span>
                <span className="font-medium text-gray-700">Maintenance</span>
              </div>
              <span className="text-lg font-bold text-green-600">{maintenance} Cal</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📉</span>
                <span className="font-medium text-gray-700">Weight Loss</span>
              </div>
              <span className="text-lg font-bold text-red-600">{weightLoss} Cal</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📈</span>
                <span className="font-medium text-gray-700">Weight Gain</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{weightGain} Cal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{activityLabels[activityLevel] || 'Sedentary'}</div>
            <div className="text-sm text-gray-600 mb-2">Activity Level</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{idealWeightMin}-{idealWeightMax} kg</div>
            <div className="text-sm text-gray-600 mb-2">Ideal Weight Range</div>
            <div className="text-xs text-gray-500">Weekly Goal</div>
            <div className="text-xs text-gray-500">{goalLabels[goal] || 'Maintain Weight'}</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">BMI: {bmi}</div>
            <div className="text-sm text-gray-600 mb-2">{bmiCategory}</div>
            <div className="text-xs text-gray-500 mt-2">Health Status</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
        >
          Recalculate
        </button>
        <button
          onClick={() => window.print()}
          className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Results
        </button>
        <button
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          onClick={() => window.location.href = '/recipes'}
        >
          Explore Recipes
        </button>
      </div>
    </div>
  );
}
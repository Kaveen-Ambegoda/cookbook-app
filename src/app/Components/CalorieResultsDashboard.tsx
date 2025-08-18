'use client';

import CommunityForum from '../Pages/CommunityForm/components/CommunityForum';
import { useState } from 'react';
import { User, Activity, Target, TrendingUp, TrendingDown, BarChart3, Printer, RotateCcw, ChefHat, Info, Zap, Scale, Heart } from 'lucide-react';

// Mock data structure to match your API response
interface CalorieCalculationResponse {
  bmr: number;
  maintenanceCalories: number;
  weightLossCalories: number;
  weightGainCalories: number;
  bmi: number;
  bmiCategory: string;
  idealWeightMin: number;
  idealWeightMax: number;
  userProfile: {
    age: number;
    gender: 'male' | 'female';
    weight: number;
    height: number;
    activityLevel: string;
    goal: string;
  };
  macros: {
    protein: { grams: number; calories: number };
    carbs: { grams: number; calories: number };
    fat: { grams: number; calories: number };
  };
}

interface CalorieResultsDashboardProps {
  results: CalorieCalculationResponse;
  onReset: () => void;
}

// Sample data for demonstration
const sampleResults: CalorieCalculationResponse = {
  bmr: 1650,
  maintenanceCalories: 2310,
  weightLossCalories: 1810,
  weightGainCalories: 2810,
  bmi: 23.5,
  bmiCategory: 'Normal',
  idealWeightMin: 55,
  idealWeightMax: 72,
  userProfile: {
    age: 28,
    gender: 'female',
    weight: 65,
    height: 165,
    activityLevel: 'moderate',
    goal: 'maintain'
  },
  macros: {
    protein: { grams: 173, calories: 693 },
    carbs: { grams: 231, calories: 924 },
    fat: { grams: 77, calories: 693 }
  }
};

export default function CalorieResultsDashboard({ results = sampleResults, onReset }: CalorieResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Extract data from the API response structure
  const {
    bmr,
    maintenanceCalories: maintenance,
    weightLossCalories: weightLoss,
    weightGainCalories: weightGain,
    bmi,
    bmiCategory,
    idealWeightMin,
    idealWeightMax,
    userProfile,
    macros
  } = results;

  const { age, gender, height, weight, activityLevel, goal } = userProfile;

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

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return { bg: 'bg-blue-500', text: 'text-blue-600', bgLight: 'bg-blue-50', border: 'border-blue-200' };
    if (bmi < 25) return { bg: 'bg-emerald-500', text: 'text-emerald-600', bgLight: 'bg-emerald-50', border: 'border-emerald-200' };
    if (bmi < 30) return { bg: 'bg-amber-500', text: 'text-amber-600', bgLight: 'bg-amber-50', border: 'border-amber-200' };
    return { bg: 'bg-red-500', text: 'text-red-600', bgLight: 'bg-red-50', border: 'border-red-200' };
  };

  const bmiColors = getBMIColor(bmi);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'macros', label: 'Macros', icon: Target },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 mt-7">
      <div className="max-w-7xl mx-auto">
        {/* Header with Animation */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-110 transition-all duration-300">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-lg">✨</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Your Personalized Results
          </h1>
          
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-white/20">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/80'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-slide-in">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Main Calorie Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: 'Basal Metabolic Rate',
                    value: bmr,
                    icon: '🔥',
                    color: 'from-orange-500 to-red-500',
                    bgColor: 'from-orange-50 to-red-50',
                    description: 'Calories burned at rest',
                    trend: null
                  },
                  {
                    label: 'Maintenance',
                    value: maintenance,
                    icon: '⚖️',
                    color: 'from-emerald-500 to-teal-500',
                    bgColor: 'from-emerald-50 to-teal-50',
                    description: 'To maintain weight',
                    trend: null
                  },
                  {
                    label: 'Weight Loss',
                    value: weightLoss,
                    icon: '📉',
                    color: 'from-pink-500 to-rose-500',
                    bgColor: 'from-pink-50 to-rose-50',
                    description: 'Target for -0.5kg/week',
                    trend: 'down'
                  },
                  {
                    label: 'Weight Gain',
                    value: weightGain,
                    icon: '📈',
                    color: 'from-blue-500 to-indigo-500',
                    bgColor: 'from-blue-50 to-indigo-50',
                    description: 'Target for +0.5kg/week',
                    trend: 'up'
                  }
                ].map((card, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <span className="text-2xl">{card.icon}</span>
                        </div>
                        {card.trend && (
                          <div className="flex items-center">
                            {card.trend === 'up' ? (
                              <TrendingUp className="w-5 h-5 text-blue-500" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-pink-500" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right mb-4">
                        <div className="text-3xl font-bold text-gray-800 mb-1">
                          {card.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">calories/day</div>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{card.label}</h3>
                      <p className="text-sm text-gray-600">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* BMI and Health Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* BMI Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 text-center">
                  <div className="mb-6">
                    <Heart className="w-8 h-8 text-pink-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Body Mass Index</h3>
                  </div>
                  <div className={`w-24 h-24 ${bmiColors.bg} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <span className="text-2xl font-bold text-white">{bmi}</span>
                  </div>
                  <div className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${bmiColors.text} ${bmiColors.bgLight} ${bmiColors.border} border`}>
                    {bmiCategory}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Healthy range: 18.5-24.9
                  </div>
                </div>

                {/* Ideal Weight */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 text-center">
                  <div className="mb-6">
                    <Scale className="w-8 h-8 text-indigo-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Ideal Weight</h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {idealWeightMin} - {idealWeightMax} kg
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Based on BMI 18.5-24.9
                  </div>
                  <div className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                    weight >= idealWeightMin && weight <= idealWeightMax
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-amber-50 text-amber-600 border-amber-200'
                  } border`}>
                    {weight >= idealWeightMin && weight <= idealWeightMax
                      ? '✅ Within range'
                      : weight < idealWeightMin
                      ? '⬆️ Below range'
                      : '⬇️ Above range'
                    }
                  </div>
                </div>

                {/* Current Status */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 text-center">
                  <div className="mb-6">
                    <Target className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Goal</h3>
                  </div>
                  <div className="text-xl font-bold text-gray-800 mb-4">
                    {goalLabels[goal]}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Weight</span>
                      <span className="font-bold text-gray-800">{weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Target Calories</span>
                      <span className="font-bold text-cyan-600">
                        {goal === 'lose' ? weightLoss : goal === 'gain' ? weightGain : maintenance} cal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Macros Tab */}
          {activeTab === 'macros' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Macronutrient Breakdown</h2>
                <p className="text-gray-600">Optimized for your {maintenance.toLocaleString()} daily calories</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                {
                    name: 'Protein',
                    grams: Math.round(macros.protein.grams * 100) / 100, // Rounded to 2 decimal places
                    calories: macros.protein.calories,
                    percentage: Math.round((macros.protein.calories / maintenance) * 100),
                    icon: '🥩',
                    color: 'from-red-500 to-pink-500',
                    bgColor: 'from-red-50 to-pink-50',
                    borderColor: 'border-red-200',
                    description: 'Muscle building & repair'
                  },
                    {
                    name: 'Carbohydrates', 
                    grams: Math.round(macros.carbs.grams * 100) / 100, // Rounded to 2 decimal places
                    calories: macros.carbs.calories,
                    percentage: Math.round((macros.carbs.calories / maintenance) * 100),
                    icon: '🍞',
                    color: 'from-amber-500 to-orange-500',
                    bgColor: 'from-amber-50 to-orange-50',
                    borderColor: 'border-amber-200',
                    description: 'Primary energy source'
                  },
                  {
                  name: 'Fats',
                  grams: Math.round(macros.fat.grams * 100) / 100, // This rounds to 2 decimal places
                  calories: macros.fat.calories,
                  percentage: Math.round((macros.fat.calories / maintenance) * 100),
                  icon: '🥑',
                  color: 'from-emerald-500 to-green-500',
                  bgColor: 'from-emerald-50 to-green-50',
                  borderColor: 'border-emerald-200',
                  description: 'Hormone production & absorption'
      }
                ].map((macro, index) => (
                  <div key={index} className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border ${macro.borderColor} border-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                    <div className={`w-20 h-20 bg-gradient-to-r ${macro.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <span className="text-3xl">{macro.icon}</span>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{macro.name}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="text-4xl font-bold text-gray-800">{macro.grams}g</div>
                        <div className="text-lg text-gray-600">{macro.calories} calories</div>
                      </div>
                      <div className={`inline-flex px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${macro.bgColor} border ${macro.borderColor}`}>
                        {macro.percentage}% of total
                      </div>
                      <p className="text-sm text-gray-600 mt-4">{macro.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Macro Distribution Visualization */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Daily Distribution</h3>
                <div className="flex rounded-2xl overflow-hidden h-8 shadow-inner">
                  <div className="bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm" 
                       style={{width: `${Math.round((macros.protein.calories / maintenance) * 100)}%`}}>
                    {Math.round((macros.protein.calories / maintenance) * 100)}%
                  </div>
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm"
                       style={{width: `${Math.round((macros.carbs.calories / maintenance) * 100)}%`}}>
                    {Math.round((macros.carbs.calories / maintenance) * 100)}%
                  </div>
                  <div className="bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-sm"
                       style={{width: `${Math.round((macros.fat.calories / maintenance) * 100)}%`}}>
                    {Math.round((macros.fat.calories / maintenance) * 100)}%
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <span className="text-red-600 font-semibold">Protein</span>
                  <span className="text-amber-600 font-semibold">Carbs</span>
                  <span className="text-emerald-600 font-semibold">Fats</span>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
                      <p className="text-gray-600">Your current profile</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Age', value: `${age} years`, icon: '📅' },
                      { label: 'Gender', value: gender.charAt(0).toUpperCase() + gender.slice(1), icon: '👤' },
                      { label: 'Weight', value: `${weight} kg`, icon: '⚖️' },
                      { label: 'Height', value: `${height} cm`, icon: '📏' }
                    ].map((item, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 text-center border border-gray-200 hover:shadow-md transition-all">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <div className="text-lg font-bold text-gray-800">{item.value}</div>
                        <div className="text-sm text-gray-600">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                      <div className="flex items-center">
                        <Activity className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="font-semibold text-gray-700">Activity Level</span>
                      </div>
                      <span className="font-bold text-blue-700">{activityLabels[activityLevel]}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-emerald-600 mr-3" />
                        <span className="font-semibold text-gray-700">Goal</span>
                      </div>
                      <span className="font-bold text-emerald-700">{goalLabels[goal]}</span>
                    </div>
                  </div>
                </div>

                {/* Calorie Targets */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-yellow-500" />
                    Daily Calorie Targets
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'BMR', value: bmr, color: 'from-orange-500 to-red-500', icon: '🔥', desc: 'Base metabolic rate' },
                      { label: 'Maintenance', value: maintenance, color: 'from-emerald-500 to-teal-500', icon: '⚖️', desc: 'Maintain weight' },
                      { label: 'Weight Loss', value: weightLoss, color: 'from-pink-500 to-rose-500', icon: '📉', desc: 'Lose 0.5kg/week' },
                      { label: 'Weight Gain', value: weightGain, color: 'from-blue-500 to-indigo-500', icon: '📈', desc: 'Gain 0.5kg/week' }
                    ].map((target, index) => (
                      <div key={index} className={`flex items-center justify-between p-5 bg-gradient-to-r ${target.color.replace('500', '50')} rounded-2xl border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1`}>
                        <div className="flex items-center">
                          <div className={`w-12 h-12 bg-gradient-to-r ${target.color} rounded-xl flex items-center justify-center mr-4 shadow-md`}>
                            <span className="text-xl">{target.icon}</span>
                          </div>
                          <div>
                            <span className="font-bold text-gray-800">{target.label}</span>
                            <div className="text-sm text-gray-600">{target.desc}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-800">{target.value.toLocaleString()}</span>
                          <div className="text-sm text-gray-600">cal/day</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Health Insights */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                  <Info className="w-6 h-6 mr-3 text-blue-500" />
                  Health Insights
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                    <div className="text-3xl mb-3">💪</div>
                    <div className="text-lg font-bold text-gray-800 mb-2">Activity Level</div>
                    <div className="text-blue-600 font-semibold">{activityLabels[activityLevel]}</div>
                    <div className="text-sm text-gray-600 mt-2">Current lifestyle</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                    <div className="text-3xl mb-3">🎯</div>
                    <div className="text-lg font-bold text-gray-800 mb-2">Weight Goal</div>
                    <div className="text-emerald-600 font-semibold">{idealWeightMin}-{idealWeightMax} kg</div>
                    <div className="text-sm text-gray-600 mt-2">Healthy range</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                    <div className="text-3xl mb-3">❤️</div>
                    <div className="text-lg font-bold text-gray-800 mb-2">BMI Status</div>
                    <div className="text-purple-600 font-semibold">{bmi} - {bmiCategory}</div>
                    <div className="text-sm text-gray-600 mt-2">Health indicator</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-12">
          <button
            onClick={onReset}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            Recalculate
          </button>
          
          <button
            onClick={() => window.print()}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <Printer className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Save Results
          </button>
          
          <button
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            onClick={() => window.location.href = '/CommunityForum'}
          >
            <ChefHat className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Explore Recipes
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
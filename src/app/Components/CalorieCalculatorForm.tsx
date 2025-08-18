'use client';

import { useState } from 'react';
import { Activity, Target, User, Weight, Ruler, Calendar } from 'lucide-react';

interface UserProfileRequest {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}

interface CalorieCalculatorFormProps {
  onCalculate: (userData: UserProfileRequest) => void;
}

export default function CalorieCalculatorForm({ onCalculate }: CalorieCalculatorFormProps) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '' as 'male' | 'female' | '',
    weight: '',
    height: '',
    activityLevel: '' as UserProfileRequest['activityLevel'] | '',
    goal: '' as UserProfileRequest['goal'] | ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.age || parseInt(formData.age) < 15 || parseInt(formData.age) > 100) {
      newErrors.age = 'Please enter a valid age between 15-100';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    if (!formData.weight || parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300) {
      newErrors.weight = 'Please enter a valid weight between 30-300 kg';
    }
    if (!formData.height || parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
      newErrors.height = 'Please enter a valid height between 100-250 cm';
    }
    if (!formData.activityLevel) {
      newErrors.activityLevel = 'Please select your activity level';
    }
    if (!formData.goal) {
      newErrors.goal = 'Please select your goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const userData: UserProfileRequest = {
        age: parseInt(formData.age),
        gender: formData.gender as 'male' | 'female',
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        activityLevel: formData.activityLevel as UserProfileRequest['activityLevel'],
        goal: formData.goal as UserProfileRequest['goal']
      };
      
      onCalculate(userData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const activityLevels = [
    {
      value: 'sedentary',
      title: 'Sedentary',
      description: 'Desk job, little to no exercise',
      icon: '🪑',
      gradient: 'from-teal-100 to-cyan-100',
      border: 'border-teal-200',
      selected: 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50'
    },
    {
      value: 'light',
      title: 'Light Activity',
      description: 'Light exercise 1-3 days/week',
      icon: '🚶‍♀️',
      gradient: 'from-teal-200 to-cyan-200',
      border: 'border-teal-300',
      selected: 'border-teal-500 bg-gradient-to-br from-teal-100 to-cyan-100'
    },
    {
      value: 'moderate',
      title: 'Moderate',
      description: 'Exercise 3-5 days/week',
      icon: '🏃‍♂️',
      gradient: 'from-teal-300 to-cyan-300',
      border: 'border-teal-400',
      selected: 'border-teal-600 bg-gradient-to-br from-teal-200 to-cyan-200'
    },
    {
      value: 'active',
      title: 'Active',
      description: 'Heavy exercise 6-7 days/week',
      icon: '💪',
      gradient: 'from-teal-400 to-cyan-400',
      border: 'border-teal-500',
      selected: 'border-teal-600 bg-gradient-to-br from-teal-300 to-cyan-300'
    },
    {
      value: 'very_active',
      title: 'Very Active',
      description: 'Intense exercise + physical job',
      icon: '🏋️‍♂️',
      gradient: 'from-teal-500 to-cyan-500',
      border: 'border-teal-600',
      selected: 'border-teal-700 bg-gradient-to-br from-teal-400 to-cyan-400'
    }
  ];

  const goals = [
    {
      value: 'lose',
      title: 'Weight Loss',
      description: 'Create a calorie deficit',
      icon: '📉',
      color: 'from-rose-500 to-pink-600',
      bg: 'from-rose-50 to-pink-50',
      border: 'border-rose-200',
      selected: 'border-rose-500 bg-gradient-to-br from-rose-100 to-pink-100'
    },
    {
      value: 'maintain',
      title: 'Maintain Weight',
      description: 'Balance calories in vs out',
      icon: '⚖️',
      color: 'from-teal-500 to-cyan-600',
      bg: 'from-teal-50 to-cyan-50',
      border: 'border-teal-200',
      selected: 'border-teal-500 bg-gradient-to-br from-teal-100 to-cyan-100'
    },
    {
      value: 'gain',
      title: 'Weight Gain',
      description: 'Create a calorie surplus',
      icon: '📈',
      color: 'from-emerald-500 to-green-600',
      bg: 'from-emerald-50 to-green-50',
      border: 'border-emerald-200',
      selected: 'border-emerald-500 bg-gradient-to-br from-emerald-100 to-green-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 py-12 px-4 mt-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-105 transition-transform">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Nutrition Calculator
          </h1>
          {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create your personalized nutrition plan with our cookbook-inspired calorie calculator
          </p> */}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          <div className="space-y-10">
            {/* Personal Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-teal-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    Age (years) *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all bg-white/50 ${
                      errors.age ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Enter your age"
                    min="15"
                    max="100"
                  />
                  {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="w-4 h-4 text-teal-600" />
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all bg-white/50 ${
                      errors.gender ? 'border-red-400' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Weight className="w-4 h-4 text-teal-600" />
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all bg-white/50 ${
                      errors.weight ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Enter your weight"
                    min="30"
                    max="300"
                    step="0.1"
                  />
                  {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Ruler className="w-4 h-4 text-teal-600" />
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all bg-white/50 ${
                      errors.height ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Enter your height"
                    min="100"
                    max="250"
                  />
                  {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
                </div>
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-teal-600" />
                Activity Level *
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {activityLevels.map((activity) => (
                  <button
                    key={activity.value}
                    type="button"
                    onClick={() => handleInputChange('activityLevel', activity.value)}
                    className={`p-6 border-2 rounded-2xl text-center transition-all hover:shadow-lg hover:scale-105 transform ${
                      formData.activityLevel === activity.value
                        ? activity.selected
                        : `${activity.border} bg-white/60 hover:${activity.border}`
                    }`}
                  >
                    <div className="text-3xl mb-3">{activity.icon}</div>
                    <div className="font-bold text-gray-800 mb-2">{activity.title}</div>
                    <div className="text-xs text-gray-600 leading-tight">{activity.description}</div>
                  </button>
                ))}
              </div>
              {errors.activityLevel && <p className="text-red-500 text-sm">{errors.activityLevel}</p>}
            </div>

            {/* Goals */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-teal-600" />
                Your Goal *
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => handleInputChange('goal', goal.value)}
                    className={`p-8 border-2 rounded-2xl text-center transition-all hover:shadow-xl hover:scale-105 transform relative overflow-hidden ${
                      formData.goal === goal.value
                        ? goal.selected
                        : `${goal.border} bg-white/60 hover:${goal.border}`
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="text-4xl mb-4">{goal.icon}</div>
                      <div className="font-bold text-xl text-gray-800 mb-2">{goal.title}</div>
                      <div className="text-sm text-gray-600">{goal.description}</div>
                    </div>
                    {formData.goal === goal.value && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${goal.bg} opacity-50`}></div>
                    )}
                  </button>
                ))}
              </div>
              {errors.goal && <p className="text-red-500 text-sm">{errors.goal}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-5 px-8 rounded-2xl hover:from-teal-600 hover:to-cyan-700 focus:ring-4 focus:ring-teal-200 transition-all transform hover:scale-105 shadow-xl text-2xl"
              >
                Calculate My Calories 🧮
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🔬', title: 'Scientific Accuracy', desc: 'Mifflin-St Jeor equation' },
            { icon: '📊', title: 'Comprehensive', desc: 'BMI & macro breakdowns' },
            { icon: '🎯', title: 'Goal-Oriented', desc: 'Tailored recommendations' }
          ].map((feature, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { UserProfileRequest } from '../utils/calorieApi';

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
    bodyFat: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
          <p className="text-gray-600">Fill in your details to calculate your daily caloric needs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age and Gender Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age (years) *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your age"
                min="15"
                max="100"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
          </div>

          {/* Weight and Height Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your weight"
                min="30"
                max="300"
                step="0.1"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.height ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your height"
                min="100"
                max="250"
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Activity Level *
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) => handleInputChange('activityLevel', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.activityLevel ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (Little to no exercise)</option>
              <option value="light">Light (Light exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (Moderate exercise 3-5 days/week)</option>
              <option value="active">Active (Heavy exercise 6-7 days/week)</option>
              <option value="very_active">Very Active (Very heavy exercise, physical job)</option>
            </select>
            {errors.activityLevel && <p className="text-red-500 text-sm mt-1">{errors.activityLevel}</p>}
          </div>

          {/* Body Fat Percentage (Optional) - Removed for now since it's not in UserProfileRequest */}
          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Body Fat Percentage (Optional)
            </label>
            <input
              type="number"
              value={formData.bodyFat}
              onChange={(e) => handleInputChange('bodyFat', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter body fat percentage (if known)"
              min="5"
              max="50"
              step="0.1"
            />
            <p className="text-gray-500 text-sm mt-1">
              This helps provide more accurate calculations (optional)
            </p>
          </div> */}

          {/* Goal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Goal *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'lose', label: 'Weight Loss', icon: '📉', color: 'red' },
                { value: 'maintain', label: 'Maintain Weight', icon: '⚖️', color: 'green' },
                { value: 'gain', label: 'Weight Gain', icon: '📈', color: 'blue' }
              ].map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => handleInputChange('goal', goal.value)}
                  className={`p-4 border-2 rounded-lg text-center transition-all hover:shadow-md ${
                    formData.goal === goal.value
                      ? `border-${goal.color}-500 bg-${goal.color}-50`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">{goal.icon}</div>
                  <div className="font-semibold text-gray-700">{goal.label}</div>
                </button>
              ))}
            </div>
            {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all transform hover:scale-105 shadow-lg"
          >
            Calculate My Calories 🧮
          </button>
        </form>
      </div>
    </div>
  );
}
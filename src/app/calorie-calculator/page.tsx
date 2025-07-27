'use client';

import { useState, useEffect } from 'react';
import CalorieCalculatorForm from '../Components/CalorieCalculatorForm';
import CalorieResultsDashboard from '../Components/CalorieResultsDashboard';
import LoadingSpinner from '../Components/LoadingSpinner';
import SuccessAnimation from '../Components/SuccessAnimation';
import { CalorieCalculatorAPI, UserProfileRequest, CalorieCalculationResponse } from '../utils/calorieApi';

export default function CalorieCalculatorPage() {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [results, setResults] = useState<CalorieCalculationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    checkAuth();

    // Check for existing calculations when page loads
    if (isAuthenticated) {
      loadLatestCalculation();
    }
  }, [isAuthenticated]);

  const loadLatestCalculation = async () => {
    try {
      const latestCalculation = await CalorieCalculatorAPI.getLatestCalculation();
      if (latestCalculation) {
        setResults(latestCalculation);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error loading latest calculation:', error);
      // Don't show error for this, just continue normally
    }
  };



  const handleCalculate = async (userData: UserProfileRequest) => {
    if (!isAuthenticated) {
      setError('You must be logged in to use the calorie calculator.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Call backend API instead of frontend calculation
      const calculationResult = await CalorieCalculatorAPI.calculateCalories(userData);
      
      setResults(calculationResult);
      setIsLoading(false);
      setShowSuccess(true);
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || 'An error occurred while calculating calories. Please try again.');
      console.error('Error calculating calories:', error);
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setResults(null);
    setError(null);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to use the calorie calculator. 
              Please sign in to access your personalized nutrition analysis.
            </p>
            <div className="space-x-4">
              <a
                href="/Pages/Login_Register/Login"
                className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                Sign In
              </a>
              <a
                href="/Pages/Login_Register/Register"
                className="inline-block bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all"
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:scale-105 transition-transform">
            <span className="text-3xl">🧮</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Calorie Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover your daily caloric needs with our advanced calculator. Get personalized recommendations based on your unique profile and fitness goals.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">⚠️</span>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
            </div>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner message="Calculating your personalized results..." />
        ) : !showResults ? (
          <div className="animate-fadeInUp">
            <CalorieCalculatorForm onCalculate={handleCalculate} />
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <CalorieResultsDashboard 
              results={results!} 
              onReset={handleReset} 
            />
          </div>
        )}

        {/* Success Animation Overlay */}
        {showSuccess && (
          <SuccessAnimation 
            onComplete={handleSuccessComplete}
            duration={2000}
          />
        )}

        {/* Features Section */}
        {!showResults && !isLoading && !error && (
          <div className="mt-16 animate-fadeInUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Why Choose Our Calculator?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get the most accurate calorie calculations with our scientifically-backed formulas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '🔬',
                  title: 'Scientific Accuracy',
                  description: 'Uses Mifflin-St Jeor equation for precise BMR calculations'
                },
                {
                  icon: '📊',
                  title: 'Comprehensive Analysis',
                  description: 'BMI, ideal weight range, and macro breakdowns included'
                },
                {
                  icon: '🎯',
                  title: 'Goal-Oriented',
                  description: 'Tailored recommendations for weight loss, gain, or maintenance'
                },
                {
                  icon: '💾',
                  title: 'Data Persistence',
                  description: 'Your calculations are saved and can be accessed anytime'
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// File: app/calorie-calculator/page.tsx

'use client';

import { useState } from 'react';
import CalorieCalculatorForm from '../Components/CalorieCalculatorForm';
import CalorieResultsDashboard from '../Components/CalorieResultsDashboard';
import LoadingSpinner from '../Components/LoadingSpinner'; // Assuming you have this component
import SuccessAnimation from '../Components/SuccessAnimation'; // Assuming you have this component
import { CalorieCalculatorAPI, UserProfileRequest, CalorieCalculationResponse } from '../utils/calorieApi';

export default function CalorieCalculatorPage() {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [results, setResults] = useState<CalorieCalculationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (userData: UserProfileRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This is the API call that was failing
      const calculationResult = await CalorieCalculatorAPI.calculateCalories(userData);
      
      setResults(calculationResult);
      setIsLoading(false);
      setShowSuccess(true);
    } catch (error: any) {
      setIsLoading(false);
      // This correctly catches the fetch error and displays it
      setError(error.message || 'An error occurred. Please ensure the backend is running and try again.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50">
      {/* Error Message */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
          <div className="flex items-center">
             <div className="font-bold mr-2">Error</div>
             <p>{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="absolute top-1 right-1 px-2 py-1 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner message="Calculating your personalized results..." />
      ) : !showResults ? (
        <CalorieCalculatorForm onCalculate={handleCalculate} />
      ) : results ? (
        <div className="py-8 px-4">
          <CalorieResultsDashboard 
            results={results} 
            onReset={handleReset} 
          />
        </div>
      ) : null}

      {/* Success Animation Overlay */}
      {showSuccess && (
        <SuccessAnimation 
          onComplete={handleSuccessComplete}
          duration={2000}
        />
      )}
    </div>
  );
}
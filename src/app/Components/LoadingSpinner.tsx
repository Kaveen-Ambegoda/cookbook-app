// src/app/Components/LoadingSpinner.tsx
'use client';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Calculating your results..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-xl p-8">
      {/* Animated Calculator Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
          </svg>
        </div>
        
        {/* Spinning ring */}
        <div className="absolute -inset-2 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
      </div>

      {/* Loading message */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
      <p className="text-gray-600 text-center max-w-md">
        We're analyzing your data and calculating your personalized calorie recommendations.
      </p>

      {/* Progress bars */}
      <div className="w-full max-w-md mt-8 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Calculating BMR</span>
          <span>✓</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Determining TDEE</span>
          <span className="animate-spin">⟳</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Creating recommendations</span>
          <span>⏳</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
        </div>
      </div>

      {/* Fun facts while loading */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 Did you know?</span> Your basal metabolic rate accounts for about 70% of your daily calorie burn!
        </p>
      </div>
    </div>
  );
}
// src/app/Components/SuccessAnimation.tsx
'use client';

import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export default function SuccessAnimation({ onComplete, duration = 2000 }: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 300); // Wait for fade out
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-3xl p-8 shadow-2xl transform animate-pulse">
        {/* Success checkmark animation */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <svg 
              className="w-12 h-12 text-white animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7"
                className="animate-pulse"
              />
            </svg>
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
          <div className="absolute inset-2 bg-green-400 rounded-full animate-ping opacity-20 animation-delay-300"></div>
        </div>

        {/* Success message */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Calculation Complete! 🎉
          </h3>
          <p className="text-gray-600">
            Your personalized calorie results are ready
          </p>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-green-${400 + (i % 3) * 100} rounded-full animate-bounce`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
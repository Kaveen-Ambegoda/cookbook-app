'use client';

import { useState, useEffect } from 'react';
import { Calculator, Activity, Target, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Calculating your results..." }: LoadingSpinnerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { 
      label: "Analyzing your profile", 
      icon: Calculator, 
      color: "from-teal-400 to-cyan-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    { 
      label: "Calculating BMR", 
      icon: Zap, 
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    { 
      label: "Determining TDEE", 
      icon: Activity, 
      color: "from-cyan-400 to-blue-500",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    },
    { 
      label: "Creating recommendations", 
      icon: Target, 
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ];

  const funFacts = [
    "💡 Your basal metabolic rate accounts for about 70% of your daily calorie burn!",
    "🔥 Muscle tissue burns more calories at rest than fat tissue.",
    "⚡ Your brain uses about 20% of your daily calories!",
    "🏃‍♂️ Regular exercise can increase your metabolic rate for hours after.",
    "🌙 You burn calories even while sleeping!"
  ];

  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev + 2) % 101);
    }, 100);

    const factInterval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % funFacts.length);
    }, 3000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(factInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Main Loading Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          
          {/* Animated Central Icon */}
          <div className="relative mb-8 flex justify-center">
            {/* Outer rotating ring */}
            <div className="absolute w-32 h-32 border-4 border-transparent border-t-teal-400 border-r-cyan-400 rounded-full animate-spin"></div>
            
            {/* Inner pulsing ring */}
            <div className="absolute w-24 h-24 border-2 border-teal-200 rounded-full animate-pulse"></div>
            
            {/* Center icon container */}
            <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
              <span className="text-3xl animate-bounce">🍽️</span>
            </div>
            
            {/* Floating particles */}
            <div className="absolute w-2 h-2 bg-teal-400 rounded-full animate-ping" style={{ top: '10%', left: '20%', animationDelay: '0s' }}></div>
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ top: '80%', right: '15%', animationDelay: '1s' }}></div>
            <div className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ top: '30%', right: '10%', animationDelay: '0.5s' }}></div>
          </div>

          {/* Loading Message */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              {message}
            </h3>
            <p className="text-gray-600">
              We're analyzing your data and creating your personalized nutrition plan
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Current Step Indicator */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border-2 transition-all duration-500 ${
                      isActive 
                        ? `${step.bgColor} ${step.borderColor} scale-105 shadow-lg` 
                        : isCompleted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isActive 
                          ? `bg-gradient-to-r ${step.color}` 
                          : isCompleted
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-gray-800' : isCompleted ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fun Facts Carousel */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentFact * 100}%)` }}
            >
              {funFacts.map((fact, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200"
                >
                  <p className="text-sm text-teal-800 text-center font-medium">
                    {fact}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {funFacts.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentFact ? 'bg-teal-500 w-8' : 'bg-teal-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Estimated Time */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              This usually takes a few seconds...
            </p>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
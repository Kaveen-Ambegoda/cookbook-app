'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, TrendingUp } from 'lucide-react';

interface SuccessAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export default function SuccessAnimation({ onComplete, duration = 3000 }: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Phase progression: 0 -> 1 -> 2 -> complete
    const phaseTimers = [
      setTimeout(() => setAnimationPhase(1), 500),
      setTimeout(() => setAnimationPhase(2), 1200),
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(onComplete, 400);
        }
      }, duration)
    ];

    return () => phaseTimers.forEach(clearTimeout);
  }, [duration, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-teal-900/30 to-cyan-900/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="relative">
        {/* Main Success Card */}
        <div className={`bg-white/95 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 transform transition-all duration-700 ${
          animationPhase >= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          
          {/* Animated Success Icon */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Outer rotating ring */}
            <div className={`absolute inset-0 border-4 border-transparent border-t-teal-400 border-r-cyan-400 rounded-full transition-all duration-1000 ${
              animationPhase >= 1 ? 'animate-spin' : ''
            }`}></div>
            
            {/* Middle pulsing ring */}
            <div className={`absolute inset-4 border-2 border-teal-200 rounded-full transition-all duration-700 ${
              animationPhase >= 1 ? 'animate-pulse' : ''
            }`}></div>
            
            {/* Success checkmark container */}
            <div className={`absolute inset-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${
              animationPhase >= 1 ? 'scale-100' : 'scale-0'
            }`}>
              <CheckCircle className={`w-12 h-12 text-white transition-all duration-700 ${
                animationPhase >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`} />
            </div>

            {/* Celebration particles */}
            {animationPhase >= 2 && (
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full animate-ping"
                    style={{
                      background: `linear-gradient(45deg, ${['#14b8a6', '#06b6d4', '#0ea5e9', '#10b981'][i % 4]}, transparent)`,
                      left: `${50 + 40 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                      top: `${50 + 40 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                      animationDelay: `${i * 100}ms`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Success Message */}
          <div className={`text-center transition-all duration-700 delay-300 ${
            animationPhase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-teal-500 animate-pulse" />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Success!
              </h3>
              <Sparkles className="w-6 h-6 text-cyan-500 animate-pulse" />
            </div>
            
            <p className="text-xl font-semibold text-gray-800 mb-3">
              Your Personalized Results Are Ready
            </p>
            
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              We've calculated your optimal calorie intake and created a customized nutrition plan just for you.
            </p>
          </div>

          {/* Achievement Badges */}
          <div className={`flex justify-center gap-4 mt-8 transition-all duration-700 delay-500 ${
            animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {[
              { icon: '🎯', label: 'Personalized', color: 'from-teal-400 to-cyan-400' },
              { icon: '🔬', label: 'Science-Based', color: 'from-cyan-400 to-blue-400' },
              { icon: '📊', label: 'Detailed Analysis', color: 'from-blue-400 to-indigo-400' }
            ].map((badge, index) => (
              <div
                key={index}
                className={`p-3 bg-gradient-to-r ${badge.color} rounded-2xl text-white text-center min-w-[80px] shadow-lg transform hover:scale-105 transition-all`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-medium">{badge.label}</div>
              </div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className={`mt-6 transition-all duration-700 delay-700 ${
            animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>Redirecting to your results...</span>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-teal-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-cyan-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 -left-8 w-24 h-24 bg-emerald-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        {/* Floating Success Particles */}
        {animationPhase >= 2 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 300}ms`,
                  animationDuration: '3s'
                }}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                  ['from-teal-400 to-cyan-400', 'from-cyan-400 to-blue-400', 'from-emerald-400 to-teal-400'][i % 3]
                } animate-ping`}></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
            opacity: 0.8;
          }
          25% {
            transform: translateY(-10px) rotate(90deg) scale(1.1);
            opacity: 1;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg) scale(0.9); 
            opacity: 0.6;
          }
          75% {
            transform: translateY(-10px) rotate(270deg) scale(1.1);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
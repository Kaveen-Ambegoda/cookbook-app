// components/SimpleFooter.tsx
import React from 'react';

const SimpleFooter: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full ml-16 bg-yellow-200 py-4 shadow-inner">
      <div className="text-center text-xs text-black">
        © 2025 Cookbook App. Crafted with ❤️ for food lovers.
      </div>
    </footer>
  );
};

export default SimpleFooter;

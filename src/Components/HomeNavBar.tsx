import React from 'react';

const HomeNavBar = () => {
  const navLinks = [
    'All Recipies',
    'Basic Courses',
    'Snacks',
    'Vegetarian',
    'Seasonals',
    'Desserts',
    'Seafood',
    'Quick and Easy',
  ];

  return (
    <nav className="bg-gray-100 border-b border-gray-300 px-6 py-3 flex flex-wrap gap-x-6 text-sm font-semibold">
      {navLinks.map((link, index) => (
        <a
          key={index}
          href="#"
          className={`hover:text-orange-500 ${
            link === 'All Recipies' ? 'text-orange-600 underline' : 'text-black'
          }`}
        >
          {link}
        </a>
      ))}
    </nav>
  );
};

export default HomeNavBar;

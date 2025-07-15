// components/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-yellow-200 text-black py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
        
        <div>
          <h4 className="font-semibold mb-2">Explore Recipes</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">All Recipes</a></li>
            <li><a href="#" className="hover:underline">Popular Recipes</a></li>
            <li><a href="#" className="hover:underline">Basic Courses</a></li>
            <li><a href="#" className="hover:underline">Snacks</a></li>
            <li><a href="#" className="hover:underline">Desserts</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Seasonal & Tips</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Seasonal Picks</a></li>
            <li><a href="#" className="hover:underline">Seafood Dishes</a></li>
            <li><a href="#" className="hover:underline">Easy Cooking Tips</a></li>
            <li><a href="#" className="hover:underline">Meal Planning</a></li>
            <li><a href="#" className="hover:underline">Healthy Eating</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Community</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Submit a Recipe</a></li>
            <li><a href="#" className="hover:underline">Join Our Newsletter</a></li>
            <li><a href="#" className="hover:underline">Blog & Stories</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
          </ul>
        </div>


        <div>
          <h4 className="font-semibold mb-2">About Cookbook</h4>
          <p className="text-xs mb-3">
            Your kitchen companion — discover, share, and enjoy delightful recipes every day.
          </p>
          <div className="flex space-x-2 mb-2 mt-4">
            <a href="#"><img src="/image/fb.jpg" alt="Youtube" className="w-5 h-5 rounded-full" /></a>
            <a href="#"><img src="/image/insta.jpg" alt="Inasta" className="w-5 h-5 rounded-full" /></a>
            <a href="#"><img src="/image/yt.jpg" alt="Facebook" className="w-5 h-5 rounded-full" /></a>
          </div>
          <button className="bg-white text-[#4d7c5a] px-3 mt-4 py-1.5 rounded font-medium text-sm hover:bg-gray-200 transition">
            Contact Us
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-black-100">
        © 2025 Cookbook App. Crafted with ❤️ for food lovers.
      </div>
    </footer>
  );
};

export default Footer;

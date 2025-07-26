// components/Footer.tsx

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Footer: React.FC = () => {
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [diets, setDiets] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);

  // Fetch category values from backend
  useEffect(() => {
  axios
    .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Recipe/filter-options`)
    .then((res) => {
      setMealTypes(res.data.mealTypes || []);
      setCuisines(res.data.cuisines || []);
      setDiets(res.data.diets || []);
      setOccasions(res.data.occasions || []);
      setSkillLevels(res.data.skillLevels || []);
    })
    .catch((err) => console.error("Failed to fetch categories", err));
}, []);


  const renderLinks = (items: string[]) =>
    items.map((item, index) => (
      <li key={index}>
        <a href="#" className="hover:underline capitalize">
          {item}
        </a>
      </li>
    ));

  return (
    <footer className="bg-yellow-200 text-black py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">

        <div>
          <h4 className="font-semibold mb-2">Meal Types</h4>
          <ul className="space-y-1">{renderLinks(mealTypes)}</ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Cuisines</h4>
          <ul className="space-y-1">{renderLinks(cuisines)}</ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Diets & Skills</h4>
          <ul className="space-y-1">
            {renderLinks(diets)}
            {renderLinks(skillLevels)}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Occasions & Info</h4>
          <ul className="space-y-1">{renderLinks(occasions)}</ul>
          <p className="text-xs mt-4">
            Your kitchen companion — discover, share, and enjoy delightful recipes every day.
          </p>
          <div className="flex space-x-2 my-3">
            <a href="#"><img src="/image/fb.jpg" alt="Facebook" className="w-5 h-5 rounded-full" /></a>
            <a href="#"><img src="/image/insta.jpg" alt="Instagram" className="w-5 h-5 rounded-full" /></a>
            <a href="#"><img src="/image/yt.jpg" alt="YouTube" className="w-5 h-5 rounded-full" /></a>
          </div>
          <button className="bg-white text-[#4d7c5a] px-3 py-1.5 rounded font-medium text-sm hover:bg-gray-200 transition">
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

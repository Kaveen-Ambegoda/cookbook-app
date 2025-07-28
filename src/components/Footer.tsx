"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [diets, setDiets] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);
  const [openSection, setOpenSection] = useState<string | null>(null);

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

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const renderLinks = (items: string[]) =>
    items.map((item, index) => (
      <li key={index}>
        <a href="#" className="hover:underline capitalize">
          {item}
        </a>
      </li>
    ));

  const renderSection = (
    label: string,
    content: JSX.Element,
    key: string
  ) => (
    <div>
      {/* Mobile - Collapsible */}
      <div
        className="flex items-center justify-between md:hidden cursor-pointer font-semibold mb-2"
        onClick={() => toggleSection(key)}
      >
        {label}
        {openSection === key ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {/* Desktop - Always visible heading */}
      <h4 className="hidden md:block font-semibold mb-2">{label}</h4>

      {/* Content: shown if open (mobile) or always visible on desktop */}
      <ul
        className={`space-y-1 ${
          openSection === key ? "block" : "hidden"
        } md:block`}
      >
        {content}
      </ul>
    </div>
  );

// ... your existing imports and code ...

return (
  <footer className="bg-yellow-200 text-black py-8 px-4 mt-12">
    {/* --- Category Sections --- */}
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
      {renderSection("Meal Types", renderLinks(mealTypes), "meal")}
      {renderSection("Cuisines", renderLinks(cuisines), "cuisine")}
      {renderSection(
        "Diets & Skills",
        <>
          {renderLinks(diets)}
          {renderLinks(skillLevels)}
        </>,
        "diet"
      )}
      <div>
        {renderSection("Occasions & Info", renderLinks(occasions), "occasion")}
      </div>
    </div>

    {/* --- Mobile-only bottom details --- */}
    <div className="md:hidden mt-8 text-center border-t border-gray-300 pt-6">
      <p className="text-xs mb-3">
        Your kitchen companion — discover, share, and enjoy delightful recipes every day.
      </p>
      <div className="flex justify-center space-x-3 mb-3">
        <a href="#"><img src="/image/fb.jpg" alt="Facebook" className="w-6 h-6 rounded-full" /></a>
        <a href="#"><img src="/image/insta.jpg" alt="Instagram" className="w-6 h-6 rounded-full" /></a>
        <a href="#"><img src="/image/yt.jpg" alt="YouTube" className="w-6 h-6 rounded-full" /></a>
      </div>
      <Link href="/contactUs">
        <button className="bg-white text-[#4d7c5a] px-4 py-2 rounded font-medium text-sm hover:bg-gray-200 transition">
          Contact Us
        </button>
      </Link>
    </div>

    {/* --- Desktop-only bottom details (added!) --- */}
    <div className="hidden md:block mt-8 text-center border-t border-gray-300 pt-6 max-w-6xl mx-auto">
      <p className="text-xs mb-3">
        Your kitchen companion — discover, share, and enjoy delightful recipes every day.
      </p>
      <div className="flex justify-center space-x-3 mb-3">
        <a href="#"><img src="/image/fb.jpg" alt="Facebook" className="w-6 h-6 rounded-full" /></a>
        <a href="#"><img src="/image/insta.jpg" alt="Instagram" className="w-6 h-6 rounded-full" /></a>
        <a href="#"><img src="/image/yt.jpg" alt="YouTube" className="w-6 h-6 rounded-full" /></a>
      </div>
      <Link href="/contactUs">
        <button className="bg-white text-[#4d7c5a] px-4 py-2 rounded font-medium text-sm hover:bg-gray-200 transition">
          Contact Us
        </button>
      </Link>
    </div>

    {/* --- Bottom copyright --- */}
    <div className="mt-8 text-center text-xs text-gray-700">
      © 2025 Cookbook App. Crafted with ❤️ for food lovers.
    </div>
  </footer>
);
}
export default Footer;

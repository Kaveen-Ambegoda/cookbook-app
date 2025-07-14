import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      title: "Explore Recipes",
      items: ["All Recipes", "Popular Recipes", "Basic Courses", "Snacks", "Desserts"],
    },
    {
      title: "Seasonal & Tips",
      items: ["Seasonal Picks", "Seafood Dishes", "Easy Cooking Tips", "Meal Planning", "Healthy Eating"],
    },
    {
      title: "Community",
      items: ["Submit a Recipe", "Join Our Newsletter", "Blog & Stories", "FAQs"],
    },
    {
      title: "About Cookbook",
      about: "Your kitchen companion — discover, share, and enjoy delightful recipes every day.",
      socialIcons: true,
    },
  ];

  return (
    <footer className="bg-yellow-200 text-black py-6 mt-12 max-w mx-auto px-4">
      {sections.map(({ title, items, about, socialIcons }, idx) => (
        <div key={idx} className="border-b border-yellow-300 py-2 md:border-none md:py-0 md:inline-block md:w-1/4 align-top">
          <button
            className="w-full flex justify-between items-center md:block md:cursor-default font-semibold mb-2"
            onClick={() => toggleSection(title)}
            type="button"
            aria-expanded={openSection === title}
          >
            {title}
            <span className="md:hidden">{openSection === title ? "-" : "+"}</span>
          </button>
          <div className={`${openSection === title ? "block" : "hidden"} md:block`}>
            {items && (
              <ul className="space-y-1 text-sm">
                {items.map((item, i) => (
                  <li key={i}>
                    <a href="#" className="hover:underline">{item}</a>
                  </li>
                ))}
              </ul>
            )}
            {about && <p className="text-xs mb-3">{about}</p>}
            {socialIcons && (
              <div className="flex space-x-2 mb-2 mt-4">
                <a href="#"><img src="/image/fb.jpg" alt="Facebook" className="w-5 h-5 rounded-full" /></a>
                <a href="#"><img src="/image/insta.jpg" alt="Instagram" className="w-5 h-5 rounded-full" /></a>
                <a href="#"><img src="/image/yt.jpg" alt="YouTube" className="w-5 h-5 rounded-full" /></a>
              </div>
            )}
            {title === "About Cookbook" && (
              <button className="bg-white text-[#4d7c5a] px-3 mt-4 py-1.5 rounded font-medium text-sm hover:bg-gray-200 transition">
                Contact Us
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="mt-6 text-center text-xs text-black-900">
        © 2025 Cookbook App. Crafted with ❤️ for food lovers.
      </div>
    </footer>
  );
};

export default Footer;

// app/challenge/join/[id]/JoinForm.tsx
"use client";

import React from "react";

type JoinFormProps = {
  challenge: {
   
    name: string;
    email: string;
  };
};


const JoinForm: React.FC<JoinFormProps> = ({ challenge }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted", {
      ...challenge,
      category: selectedCategory
    });
    // You would typically send this data to your backend
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Sandali Sathsarani"
          
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="username@gmail.com"
          defaultValue={challenge.email}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Challenge Type Category
        </label>
        <select
          id="category"
          name="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Select a category</option>
          <option value="dessert">Dessert</option>
          <option value="main-dish">Main Dish</option>
        </select>
      </div>

      <div className="space-y-6">
  {/* Existing Commitment Statement */}
  

  {/* New: Why You Chose This Challenge */}
  <div>
    <label htmlFor="motivation" className="block text-sm font-medium text-gray-700">
      Why did you choose this challenge?
    </label>
    <textarea
      id="motivation"
      name="motivation"
      rows={3}
      required
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
      placeholder="I chose this challenge because..."
    />
    <p className="mt-1 text-sm text-gray-500">
      Share what excites you about this challenge or your personal goals
    </p>
  </div>
</div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the challenge terms and conditions
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Join Challenge
        </button>
      </div>
    </form>
  );
};

export default JoinForm;
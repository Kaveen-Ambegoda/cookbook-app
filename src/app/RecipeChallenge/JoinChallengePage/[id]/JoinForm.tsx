
"use client";

import axios from "axios";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";


// Create or import axiosInstance
const axiosInstance = axios.create({
  baseURL: "https://localhost:7205", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});
import React, { useState } from "react";

 // Adjust the import path as necessary

interface FormData {
  fullName: string;
  email: string;
  challengeCategory: string;
  reasonForChoosing: string;
  termsAccepted: boolean;
  
}

interface JoinFormProps {
  challengeId: string;
  
}

const JoinForm: React.FC<JoinFormProps> = ({ challengeId }) => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    challengeCategory: "", // Default to Beginner
    reasonForChoosing: "",
    termsAccepted: false,
 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/Challenges', {
          FullName: formData.fullName,
          Email: formData.email,
          ChallengeCategory: formData.challengeCategory,
          ReasonForChoosing: formData.reasonForChoosing,
          TermsAccepted: formData.termsAccepted,
          ChallengeName: challengeId,
      });

      if (response.status === 200) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred while submitting the form.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecipeSubmit = () => {
    router.push(`/RecipeChallenge/JoinChallengePage/${challengeId}/resultPage`);
  };
  // After choose category go to the submit recipe page
  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-green-600 text-2xl mb-4">✓</div>
        <h2 className="text-xl font-semibold mb-2">Thank you for joining the challenge!</h2>
        <p className="text-gray-600">
          We've received your application for the "{challengeId}" at {formData.challengeCategory} Category.
        </p>

        <div className="mt-6 mb-8 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Christmas Cookies Challenge</h3>
          <p className="text-gray-600 mb-4">
            "Celebrate the joy of Christmas with your favorite recipes! Whether it is a savory feast or a sweet cake, 
            we want to see your most creative and festive dishes."
          </p>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Registration:</span>
              <span>Dec 1-20, 2024</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Judging:</span>
              <span>Dec 21-23, 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Winners Announced:</span>
              <span>Dec 24, 2024</span>
            </div>
          </div>
          
          <div className="text-left">
            <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Use at least 3 Christmas-themed ingredients</li>
              <li>Submit a high-quality photo of your dish along with a brief recipe description</li>
              <li>Optional: Add a festive story about why this dish is special to you</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 max-w-xl mx-auto bg-orange-50 p-6 rounded-lg shadow-lg border-2 border-orange-200">
          <h3 className="text-lg font-semibold mb-4 text-orange-700">Recipe Submission Form</h3>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Display Name</label>
              <input
                type="text"
                placeholder="Sandali Sathsarani"
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
              <input
                type="text"
                placeholder="GingerMan GingerMan"
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ingredients</label>
              <input
                type="text"
                placeholder="Ingredient 1"
                className="mt-1 w-full mb-2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Ingredient 2"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Recipe Description</label>
              <textarea
                placeholder="Type your recipe description here..."
                className="mt-1 w-full border border-dotted border-2 border-blue-500 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                rows={4}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload a Picture</label>
              <input
                type="file"
                className="mt-1 w-full text-sm border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 5MB</p>
            </div>
          </form>
        </div>


         <button
          onClick={handleRecipeSubmit}
          className="text-white bg-orange-500 hover:bg-orange-600 px-6 py-2 mt-10 rounded-lg transition font-medium shadow-md hover:shadow-lg inline-block"
        >
          Submit Your Recipe Now
        </button>


      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          maxLength={50}
          value={formData.fullName}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="challengeCategory" className="block text-sm font-medium text-gray-700">
          Select Challenge Category
        </label>
        <select
          id="challengeCategory"
          name="challengeCategory"
          required
          value={formData.challengeCategory}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="Category" >Category</option>
          <option value="Dessert">Dessert</option>
          <option value="Main Dish">Main Dish</option>
        </select>
      </div>

      <div>
        <label htmlFor="reasonForChoosing" className="block text-sm font-medium text-gray-700">
          Why do you want to join this challenge?
        </label>
        <textarea
          id="reasonForChoosing"
          name="reasonForChoosing"
          required
          maxLength={50}
          value={formData.reasonForChoosing}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            required
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="termsAccepted" className="font-medium text-gray-700">
            I accept the terms and conditions
          </label>
          <p className="text-gray-500">You agree to participate in this challenge according to the rules.</p>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Join Challenge"}
        </button>
      </div>
    </form>
  );
};

export default JoinForm;

"use client";

import axios from "axios";
import { Link, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getChallengeById } from "../../../../utils/challengeUtils";
import { ChallengeType } from "../../ChallengeCard";

// Create or import axiosInstance
const axiosInstance = axios.create({
  baseURL: "https://localhost:7205", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

interface FormData {
  fullName: string;
  email: string;
  challengeCategory: string;
  reasonForChoosing: string;
  termsAccepted: boolean;
}

interface RecipeData {
  displayName: string;
  recipeName: string;
  ingredients: string[];
  recipeDescription: string;
  recipeImage: File | null;
}

interface JoinFormProps {
  challengeId: string;
}

const JoinForm: React.FC<JoinFormProps> = ({ challengeId }) => {
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeType | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    challengeCategory: "",
    reasonForChoosing: "",
    termsAccepted: false,
  });

  const [recipeData, setRecipeData] = useState<RecipeData>({
    displayName: "",
    recipeName: "",
    ingredients: [""],
    recipeDescription: "",
    recipeImage: null,
  });

  // Add image preview state
  const [recipeImagePreview, setRecipeImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get ingredient limits from challenge requirements
  const getIngredientLimits = (challenge: ChallengeType) => {
    const requirement = challenge.requirements.find(req => 
      req.toLowerCase().includes('ingredient')
    );
    
    if (!requirement) return { min: 1, max: 10 }; // Default limits
    
    const text = requirement.toLowerCase();
    
    // Extract numbers from requirement text
    const numbers = text.match(/\d+/g)?.map(Number) || [];
    
    if (text.includes('exactly')) {
      const exact = numbers[0] || 5;
      return { min: exact, max: exact };
    } else if (text.includes('at least') && text.includes('maximum')) {
      return { min: numbers[0] || 1, max: numbers[1] || 10 };
    } else if (text.includes('at least')) {
      return { min: numbers[0] || 1, max: 10 };
    } else if (text.includes('maximum') || text.includes('max')) {
      return { min: 1, max: numbers[0] || 10 };
    } else if (text.includes('only')) {
      return { min: numbers[0] || 3, max: numbers[0] || 3 };
    }
    
    return { min: 1, max: 10 };
  };

  useEffect(() => {
    const challengeData = getChallengeById(challengeId);
    setChallenge(challengeData);
    
    if (challengeData) {
      const limits = getIngredientLimits(challengeData);
      setRecipeData(prev => ({
        ...prev,
        ingredients: Array(limits.min).fill("")
      }));
    }
  }, [challengeId]);

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

  const handleRecipeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setRecipeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle recipe image upload with preview
  const handleRecipeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.match(/^image\/(png|jpg|jpeg|gif)$/)) {
        alert("Only PNG, JPG,JPEG, GIF files are supported");
        return;
      }
      
      setRecipeData(prev => ({
        ...prev,
        recipeImage: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setRecipeImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients[index] = value;
    setRecipeData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    if (!challenge) return;
    
    const limits = getIngredientLimits(challenge);
    if (recipeData.ingredients.length < limits.max) {
      setRecipeData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ""]
      }));
    }
  };

  const removeIngredient = (index: number) => {
    if (!challenge) return;
    
    const limits = getIngredientLimits(challenge);
    if (recipeData.ingredients.length > limits.min) {
      const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
      setRecipeData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
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
          ChallengeName: challenge?.title || challengeId,
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

  if (!challenge) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Challenge not found.</p>
      </div>
    );
  }

  const ingredientLimits = getIngredientLimits(challenge);

  // After choose category go to the submit recipe page
  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-green-600 text-2xl mb-4">✓</div>
        <h2 className="text-xl font-semibold mb-2">Thank you for joining the challenge!</h2>
        <p className="text-gray-600">
          We've received your application for the "{challenge.title}" at {formData.challengeCategory} Category.
        </p>

        <div className="mt-6 mb-8 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{challenge.title}</h3>
          <p className="text-gray-600 mb-4">
            {challenge.description}
          </p>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Registration:</span>
              <span>{challenge.timeline.registration}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Judging:</span>
              <span>{challenge.timeline.judging}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Winners Announced:</span>
              <span>{challenge.timeline.winnersAnnounced}</span>
            </div>
          </div>
          
          <div className="text-left">
            <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {challenge.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
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
                name="displayName"
                value={recipeData.displayName}
                onChange={handleRecipeChange}
                placeholder="Enter your display name"
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
              <input
                type="text"
                name="recipeName"
                value={recipeData.recipeName}
                onChange={handleRecipeChange}
                placeholder="Enter your recipe name"
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ingredients ({recipeData.ingredients.length}/{ingredientLimits.max})
                </label>
                <div className="text-xs text-gray-500">
                  {ingredientLimits.min === ingredientLimits.max 
                    ? `Exactly ${ingredientLimits.min} ingredients required`
                    : `${ingredientLimits.min}-${ingredientLimits.max} ingredients allowed`
                  }
                </div>
              </div>
              
              {recipeData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                  {recipeData.ingredients.length > ingredientLimits.min && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="ml-2 text-red-500 hover:text-red-700 px-2 py-1 rounded"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              
              {recipeData.ingredients.length < ingredientLimits.max && (
                <button
                  type="button"
                  onClick={addIngredient}
                  className="mt-2 text-orange-500 hover:text-orange-700 text-sm font-medium"
                >
                  + Add Ingredient
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Recipe Description</label>
              <textarea
                name="recipeDescription"
                value={recipeData.recipeDescription}
                onChange={handleRecipeChange}
                placeholder="Type your recipe description here..."
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                rows={4}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload a Picture</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/png,image/jpg,image/jpeg,image/gif"
                  onChange={handleRecipeImageChange}
                  className="hidden"
                  id="recipe-image-upload"
                />
                
                {recipeImagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={recipeImagePreview}
                      alt="Recipe preview"
                      className="max-h-32 mx-auto rounded-lg object-cover"
                    />
                    <p className="text-sm text-gray-600">{recipeData.recipeImage?.name}</p>
                    <label
                      htmlFor="recipe-image-upload"
                      className="inline-flex items-center px-3 py-1 text-sm text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      Change Image
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600 font-medium">Choose an image</p>
                    </div>
                    <label
                      htmlFor="recipe-image-upload"
                      className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer transition-colors"
                    >
                      Browse Files
                    </label>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Maximum file size: 5MB</span>
                <span>PNG, JPG, GIF supported</span>
              </div>
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
          <option value="">Select Category</option>
          <option value="Dessert">Dessert</option>
          <option value="Main Dish">Main Dish</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Beverage">Beverage</option>
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
          maxLength={200}
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

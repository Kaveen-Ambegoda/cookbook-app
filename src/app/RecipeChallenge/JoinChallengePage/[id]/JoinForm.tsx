"use client";

import axios from "axios";
import { Link, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getChallengeById } from "../../../../utils/challengeUtils";
import { useAuth } from "../../../context/authContext"; // adjust path if needed
import { MdToken } from "react-icons/md";
import { toast } from 'react-hot-toast';
import { ChallengeType, ChallengeDetail } from "../../../../utils/challengeUtils";

// Create or import axiosInstance
const axiosInstance = axios.create({
  baseURL: "https://localhost:7205", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

interface FormData {
  fullName: string;
  challengeCategory: string;
  reasonForChoosing: string;
  termsAccepted: boolean;
}

interface RecipeData {
  
  recipeName: string;
  ingredients: string[];
  recipeDescription: string;
  recipeImage: File | null;
}

interface JoinFormProps {
  challenge: ChallengeDetail | null;
}

const JoinForm: React.FC<JoinFormProps> = ({ challenge }) => {
  const router = useRouter();
  const { user } = useAuth();
const username = user?.username ?? "";

  // Mock function: Replace with your actual user fetching logic
  

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    challengeCategory: "",
    reasonForChoosing: "",
    termsAccepted: false,
  });

  const [recipeData, setRecipeData] = useState<RecipeData>({
    
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
  const [challengeDetail, setChallengeDetail] = useState<ChallengeDetail | null>(null);

  // Function to get ingredient limits from challenge requirements
  const getIngredientLimits = (challenge: ChallengeType) => {
    const requirements = challenge.requirements ?? [];
    console.log("All requirements:", requirements); // <-- Add this line
    const keywords = [
      "ingredient", "ingredients", "minimum", "maximum", "at least", "no more than", "exactly", "only", "between"
    ];
    const requirement = requirements.find((req: string) =>
      keywords.some(keyword => req.toLowerCase().includes(keyword))
    );
    console.log("Ingredient limit requirement found:", requirement);

    if (!requirement) return { min: 1, max: 10 }; // Default limits

    const text = requirement.toLowerCase();

    // "exactly 3 ingredients"
    const exactlyMatch = text.match(/exactly\s+(\d+)/);
    if (exactlyMatch) {
      const exact = Number(exactlyMatch[1]);
      return { min: exact, max: exact };
    }

    // "between 2 and 5 ingredients"
    const betweenMatch = text.match(/between\s+(\d+)\s+and\s+(\d+)/);
    if (betweenMatch) {
      return { min: Number(betweenMatch[1]), max: Number(betweenMatch[2]) };
    }

    // "at least 2 ingredients"
    const atLeastMatch = text.match(/at\s+least\s+(\d+)/);
    if (atLeastMatch) {
      return { min: Number(atLeastMatch[1]), max: 10 };
    }

    // "no more than 5 ingredients"
    const noMoreThanMatch = text.match(/no more than\s+(\d+)/);
    if (noMoreThanMatch) {
      return { min: 1, max: Number(noMoreThanMatch[1]) };
    }

    // "maximum 5 ingredients" or "max 5 ingredients"
    const maxMatch = text.match(/max(?:imum)?\s+(\d+)/);
    if (maxMatch) {
      return { min: 1, max: Number(maxMatch[1]) };
    }

    // "only 3 ingredients"
    const onlyMatch = text.match(/only\s+(\d+)/);
    if (onlyMatch) {
      const only = Number(onlyMatch[1]);
      return { min: only, max: only };
    }

    // fallback: first number is min, second is max (if present)
    const numbers = text.match(/\d+/g)?.map(Number) || [];
    if (numbers.length === 2) {
      return { min: numbers[0], max: numbers[1] };
    } else if (numbers.length === 1) {
      return { min: numbers[0], max: numbers[0] };
    }

    return { min: 1, max: 10 };
  };

  useEffect(() => {
    if (challenge) {
      const limits = getIngredientLimits(challenge);
      setRecipeData(prev => ({
        ...prev,
        ingredients: Array(limits.min).fill("")
      }));
    }
  }, [challenge]);

  useEffect(() => {
    if (username) {
      setFormData(prev => ({
        ...prev,
        fullName: username
      }));
    }
  }, [username]);

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

    const payload = {
      FullName: formData.fullName,
      ChallengeCategory: formData.challengeCategory,
      ReasonForChoosing: formData.reasonForChoosing,
      TermsAccepted: formData.termsAccepted,
      ChallengeName: challenge?.title || challenge?.id,
    };

    console.log("Submitting payload:", payload); // 👈 This will show the payload in your browser console

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post('/api/Challenges', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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

  const handleRecipeSubmit = async () => {
    

    // Filter out empty ingredients
    const validIngredients = recipeData.ingredients.filter(ingredient => ingredient.trim() !== '');
    
    if (validIngredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    // Check ingredient limits
    const limits = getIngredientLimits(challenge!);
    if (validIngredients.length < limits.min || validIngredients.length > limits.max) {
      alert(`Please provide between ${limits.min} and ${limits.max} ingredients`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();
      submitFormData.append('RecipeName', recipeData.recipeName);
      submitFormData.append('RecipeDescription', recipeData.recipeDescription);
      submitFormData.append('ChallengeId', challenge?.id || '');
      submitFormData.append('ChallengeName', challenge?.title || '');
      submitFormData.append('ChallengeCategory', formData.challengeCategory || '');
      submitFormData.append('UserFullName', formData.fullName);
      
      // Add ingredients
      validIngredients.forEach((ingredient, index) => {
        submitFormData.append(`Ingredients[${index}]`, ingredient);
      });

      // Add image if present
      if (recipeData.recipeImage) {
        submitFormData.append('RecipeImage', recipeData.recipeImage);
      }

      // Submit to backend
      const token = localStorage.getItem('token'); // Or use your actual storage key

      const response = await axios.post('https://localhost:7205/api/Submission', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Navigate to result page with success message
      if (response.status === 200) {

        //Toast Notifications with success message
        toast.success('Recipe submitted successfully! 🎉', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
          },
          icon: '✅',
        });

        // Small delay to show toast before navigation
        setTimeout(() => {
          router.push(`/RecipeChallenge/JoinChallengePage/${challenge?.id}/VoteAndRateChallenge`);
        }, 1000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'An error occurred while submitting the recipe');
        toast.error(err.response?.data?.message || 'Failed to submit recipe. Please try again.', {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: '#fff',
          },
          icon: '❌',
        });
      } else {
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitSuccess && challenge?.id) {
      axiosInstance
        .get(`/api/Challenges/details/${challenge.id}`)
        .then(res => setChallengeDetail(res.data))
        .catch(() => setChallengeDetail(null));
    }
  }, [submitSuccess, challenge?.id]);

  if (!challenge) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Challenge not found.</p>
      </div>
    );
  }

  const ingredientLimits = getIngredientLimits(submitSuccess && challengeDetail ? challengeDetail : challenge);

  // After choose category go to the submit recipe page
  if (submitSuccess) {
    if (!challengeDetail) {
      return <div>Loading challenge details...</div>;
    }
    return (
      <div className="text-center py-8">
        <div className="text-green-600 text-2xl mb-4">✓</div>
        <h2 className="text-xl font-semibold mb-2">Thank you for joining the challenge!</h2>
        <p className="text-gray-600">
          We've received your application for the "{challengeDetail.title}" at {formData.challengeCategory} Category.
        </p>
        <div className="mt-6 mb-8 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{challengeDetail.title}</h3>
          <p className="text-gray-600 mb-4">{challengeDetail.description}</p>
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Registration:</span>
              <span>{challengeDetail.timeline?.registration || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Judging:</span>
              <span>{challengeDetail.timeline?.judging || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Winners Announced:</span>
              <span>{challengeDetail.timeline?.winnersAnnounced || "N/A"}</span>
            </div>
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {challengeDetail.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 max-w-xl mx-auto bg-orange-50 p-6 rounded-lg shadow-lg border-2 border-orange-200">
          <h3 className="text-lg font-semibold mb-4 text-orange-700">Recipe Submission Form</h3>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                maxLength={50}
                value={formData.fullName}
                onChange={handleChange}
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
          disabled={isSubmitting}
          className="text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 px-6 py-2 mt-10 rounded-lg transition font-medium shadow-md hover:shadow-lg inline-block disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting Recipe..." : "Submit Your Recipe Now"}
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

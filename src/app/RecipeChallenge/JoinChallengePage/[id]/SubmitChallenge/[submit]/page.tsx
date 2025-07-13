// Implementing

import React from "react";
import { challengeInfos } from "./challengeData";

interface SubmitRecipePageProps {
  params: {
   submit: string;
  };
  challengeID?: string; 
}

function SubmitRecipeForm({ params }: SubmitRecipePageProps) {
  const challengeTitle = decodeURIComponent(params.submit);
  const challengeInfo = challengeInfos.find(c => c.title === challengeTitle);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-600">
              Submit Your Recipe for "{challengeTitle}"
            </h1>
            <p className="mt-2 text-gray-600">
              Share your culinary creation for this challenge
            </p>
          </div>

          {challengeInfo && (
            <div className="mb-8 bg-orange-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-orange-700 mb-2">
                Challenge Information
              </h2>
              <p className="text-gray-700 mb-2">{challengeInfo.information}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded shadow">
                  <h3 className="font-medium text-orange-600">Registration</h3>
                  <p>{challengeInfo.registration}</p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <h3 className="font-medium text-orange-600">Judging</h3>
                  <p>{challengeInfo.judging}</p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <h3 className="font-medium text-orange-600">Winner Announced</h3>
                  <p>{challengeInfo.winner}</p>
                </div>
              </div>
            </div>
          )}
          <SubmitRecipeForm params={{ submit: challengeTitle }} />
          
        </div>
      </div>
    </div>
  );
}

export default SubmitRecipeForm;
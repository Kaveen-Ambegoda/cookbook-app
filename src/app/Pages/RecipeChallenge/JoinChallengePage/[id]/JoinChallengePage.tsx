import React from "react";


import { SiPocket } from "react-icons/si";

import { title } from "process";
import JoinForm from "./JoinForm";
// Adjusted the path to match the correct directory structure

function JoinChallengePage({params}: { params: { id: string } }){
  return(
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-orange-600">
            Join the "{params.id}"!
          </h1>
          <p className="mt-2 text-gray-600">
            Fill out the form below to participate in this challenge.
          </p>
        </div>
        
        <JoinForm challenge={{ name: "Sample Challenge", description: "This is a sample challenge." }} />
      </div>
    </div>
  </div>
  )
} 

                           

export default JoinChallengePage;
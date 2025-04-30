// pages/RecipeManagement/ViewRecipe.tsx
import React from 'react';
import Image from 'next/image';
import SimpleFooter from '@/app/Components/SimpleFooter';

const ViewRecipe = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 font-sans bg-yellow-50">
      
      {/* Header Section */}
      <div className="bg-green-200 p-6 rounded-xl mt-10">
  {/* Title Centered on Top */}
  <h1 className="text-3xl font-bold text-center text-green-900 mb-8">Spicy Chicken Noodles</h1>

  {/* Content Layout */}
  <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
    {/* Left: Image */}
    <div className="w-full md:w-1/2 flex flex-col items-center">
      <Image
        src="/image/Noodles.jpg"
        alt="Spicy Chicken Noodles"
        width={300}
        height={300}
        className="rounded-lg shadow-md"
      />
      <div className="mt-6 flex gap-4">
        <button className="bg-red-400 text-white p-2 px-4 rounded-full w-20 hover:bg-red-500 transition">❤️</button>
        <button className="bg-orange-400 text-white p-2 px-4 rounded-full w-20 hover:bg-orange-500 transition">🔗</button>
      </div>
    </div>

    {/* Right: Info Boxes */}
    <div className="w-full md:w-1/3 flex flex-col justify-center self-center gap-4">
      {/* General Info */}
      <div className="bg-white rounded-lg p-4 border-l-4 border-orange-400 shadow">
        <h3 className="text-orange-600 font-bold mb-2">General Info</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li><strong>Total Time:</strong> 20 minutes</li>
          <li><strong>Portion Size:</strong> 2 servings</li>
          <li><strong>Category:</strong> Main course</li>
        </ul>
      </div>

      {/* Nutrition Info */}
      <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow">
        <h3 className="text-green-600 font-bold mb-2">Nutrition</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li><strong>Calories:</strong> 450</li>
          <li><strong>Protein:</strong> 13g</li>
          <li><strong>Carbohydrates:</strong> 60g</li>
          <li><strong>Fat:</strong> 20g</li>
          <li><strong>Fiber:</strong> 3g</li>
          <li><strong>Sugar:</strong> 2g</li>
        </ul>
      </div>
    </div>
  </div>
</div>


      {/* Ingredients Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Ingredients:</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-800">
          <li>200g spaghetti</li>
          <li>4 cloves garlic, thinly sliced</li>
          <li>1/4 cup extra-virgin olive oil</li>
          <li>1/4 teaspoon red pepper flakes (optional)</li>
          <li>Salt, to taste</li>
          <li>Freshly ground black pepper, to taste</li>
          <li>1/4 cup fresh parsley, chopped</li>
          <li>Grated Parmesan cheese, for serving (optional)</li>
        </ul>
      </div>

      {/* Instructions Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-800">
          <li><strong>Cook the Spaghetti:</strong> Bring a large pot of salted water to a boil. Add the spaghetti and cook until al dente. Reserve 1/2 cup of pasta water and drain.</li>
          <li><strong>Prepare the Garlic and Olive Oil:</strong> While the spaghetti is cooking, heat olive oil in a large skillet. Add garlic, red pepper flakes, and cook until fragrant (2–3 mins).</li>
          <li><strong>Combine and Serve:</strong> Add the cooked spaghetti to the skillet. Toss with garlic oil, salt, pepper, and reserved pasta water. Add parsley, Parmesan if desired.</li>
          <li><strong>Plate and Garnish:</strong> Divide between two plates and serve immediately.</li>
        </ol>
      </div>

      {/* Footer / Feedback */}
      <div className="mt-12 text-sm text-gray-600 text-center border-t pt-6">
        <p>20K positive Comments</p>
        <p>“This recipe was so easy and delicious. Happy Cooking!”</p>
        <button className="mt-2 underline text-red-500 hover:text-red-600">SEE FEEDBACK</button>
      </div>
      <SimpleFooter/>
    </div>
  );
};

export default ViewRecipe;

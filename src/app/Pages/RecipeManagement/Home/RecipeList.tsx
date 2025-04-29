import React from "react";
import Recipe from "./Recipe/page";

const recipes = [
  { 
    id: 1, 
    title: "Spicy Noodles", 
    time: "15 min", 
    servings: "2", 
    img: "/image/noodles.jpg",
    favorites: 120, 
    reviews: 45 
  },
  { 
    id: 2, 
    title: "Pizza", 
    time: "25 min", 
    servings: "3", 
    img: "/image/pizza.jpg",
    favorites: 98, 
    reviews: 30 
  },
  { 
    id: 3, 
    title: "Fried Rice", 
    time: "25 min", 
    servings: "3", 
    img: "/image/rice.jpg",
    favorites: 110, 
    reviews: 40 
  },
  { 
    id: 4, 
    title: "Cobb Salad", 
    time: "15 min", 
    servings: "2", 
    img: "/image/egg.jpg",
    favorites: 85, 
    reviews: 25 
  },
  { 
    id: 5, 
    title: "Vegi Salad", 
    time: "25 min", 
    servings: "3", 
    img: "/image/salad.jpg",
    favorites: 90, 
    reviews: 32 
  },
  { 
    id: 6, 
    title: "Cake", 
    time: "25 min", 
    servings: "3", 
    img: "/image/cake.jpg",
    favorites: 150, 
    reviews: 50 
  }
];

const RecipeList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4">
      {recipes.map((recipe) => (
        <Recipe key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;


import RecipeList from "./Pages/Recipe Management/Home/RecipeList";


export default function Home() {
  return (
    <div className="pl-25 pr-10 pt-20 bg-gray-100" > 
      <h1 className="text-green-700 text-xl font-medium pl-4 pb-2"> Basic Courses</h1>
      <RecipeList />
      
    </div>
  );
}

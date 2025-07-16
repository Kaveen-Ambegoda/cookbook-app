import RecipeList from './RecipeList';

export default function RecipesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Recipes</h1>
      <RecipeList />
    </div>
  );
}

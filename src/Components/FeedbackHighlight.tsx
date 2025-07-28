import Image from 'next/image';
import Link from 'next/link';
import { useReviewCount } from './useReviewCount';

interface FeedbackHighlightProps {
  recipe: {
    id: number;
  };
}

const FeedbackHighlight = ({ recipe }: FeedbackHighlightProps) => {
  const reviewCount = useReviewCount(recipe?.id);

  return (
    <div className="border border-red-300 rounded-md p-6 flex justify-between items-center bg-orange-50">
      <div>
        <h2 className="text-xl font-bold text-black underline underline-offset-4">
          {reviewCount !== null ? `${reviewCount} Comments` : "Loading..."}
        </h2>
        <p className="text-gray-600 mt-2">
          See what they have to say about the recipes we made. Happy Cooking
        </p>
      </div>
      <div>
        {recipe?.id ? (
          <Link href={`/RecipeManagement/review-page/${recipe.id}`}>
            <button className="text-orange-800 underline">See Feedback</button>
          </Link>
        ) : (
          <p className="text-red-500">Recipe ID not available</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackHighlight;

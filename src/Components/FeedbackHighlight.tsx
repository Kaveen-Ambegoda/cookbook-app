import Image from 'next/image';
import Link from 'next/link';

interface FeedbackHighlightProps {
  recipe: {
    id: number;
    // You can add other recipe fields here if needed
  };
}

const FeedbackHighlight = ({ recipe }: FeedbackHighlightProps) => {
  return (
    <div className="border border-red-200 rounded-md p-6 flex justify-between items-center bg-[#fef9f8]">
      <div>
        <h2 className="text-xl font-bold text-black underline underline-offset-4">
          20K positive Comments
        </h2>
        <p className="text-gray-600 mt-2">
          See what they have to say about the recipes we made. Happy Cooking
        </p>
        <div className="flex mt-4 items-center space-x-2">
          <Image src="/avatar1.png" alt="avatar1" width={32} height={32} className="rounded-full" />
          <Image src="/avatar2.png" alt="avatar2" width={32} height={32} className="rounded-full -ml-2" />
          <div className="bg-green-300 px-2 py-1 text-sm rounded-full font-bold">20K+</div>
        </div>
      </div>
      <div>
        {/* Only render Link if recipe.id is valid */}
        {recipe?.id ? (
          <Link href={`/RecipeManagement/Review/${recipe.id}`}>
            <button className="text-blue-600 underline">See Feedback</button>
          </Link>
        ) : (
          <p className="text-red-500">Recipe ID not available</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackHighlight;

"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface ReviewSummaryData {
  average: number;
  total: number;
  breakdown: number[]; // Index 0 = 1 star, Index 4 = 5 stars
}

interface ReviewSummaryProps {
  recipeId: number;
  refreshTrigger?: boolean;
}

export default function ReviewSummary({
  recipeId,
  refreshTrigger,
}: ReviewSummaryProps) {
  const [summary, setSummary] = useState<ReviewSummaryData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!recipeId) return;

    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Review/summary/${recipeId}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch summary. Status: ${res.status}`);
        }
        const data = await res.json();
        setSummary(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchSummary();
  }, [recipeId, refreshTrigger]);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!summary) {
    return <p className="text-gray-500">Loading...</p>;
  }

  const { average, total, breakdown } = summary;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl font-bold">{average.toFixed(1)}</span>
        <div className="flex text-yellow-400">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              fill={i < Math.round(average) ? "yellow" : "none"}
              className={i < Math.round(average) ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
        <span className="text-gray-500 text-sm">({total} reviews)</span>
      </div>

      <div className="space-y-2">
        {breakdown
          .map((count, i) => ({ stars: i + 1, count }))
          .reverse()
          .map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="w-12 text-sm text-gray-600">{stars} star</span>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="h-3 rounded-full bg-yellow-400"
                  style={{ width: total ? `${(count / total) * 100}%` : "0%" }}
                ></div>
              </div>
              <span className="text-sm text-gray-500">{count}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

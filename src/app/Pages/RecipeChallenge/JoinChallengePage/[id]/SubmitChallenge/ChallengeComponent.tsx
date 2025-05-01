// import React from "react";
// import Link from "next/link";
// import { challengeInfos } from "./ChallengeInfo"; // Import the challenge data

// const ChallengeComponent = () => {
//   return (
//     <div className="grid grid-cols-1 gap-8 p-4">
//       {challengeInfos.map((challenge) => (
//         <div key={challenge.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
//           <h2 className="text-xl font-bold text-orange-600">{challenge.title}</h2>
//           <h3 className="text-md text-gray-600">{challenge.subtitle}</h3>
//           <p className="text-gray-500">{challenge.information}</p>
//           <Link
//             href={`/Pages/RecipeSubmission/${encodeURIComponent(challenge.title)}`}
//             className="mt-4 inline-block text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition"
//           >
//             Submit
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ChallengeComponent;
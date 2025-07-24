// import React, { useEffect, useState } from "react";
// import Challenge from "./Challenge";
// import axios from "axios";

// interface ChallengeType {
//   id: string;
//   title: string;
//   subtitle: string;
//   img: string;
//   date: string;
//   sponsor: string;
// }

// const ChallengeCard = () => {
//   const [challenges, setChallenges] = useState<ChallengeType[]>([]);

//   useEffect(() => {
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//     axios.get(`${apiUrl}/api/Challenges/details`)
//       .then(res => setChallenges(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div>
//       {challenges.map((challenge) => (
//         <Challenge key={challenge.id} challenge={challenge} />
//       ))}
//     </div>
//   );
// };

// export default ChallengeCard;






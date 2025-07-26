import ChallengeList from "./ChallengeList";

export default function Home() { 
  return (
    <div className="pl-25 pr-10 pt-20 bg-gray-100" > 
     <h1 className="text-gray-700 text-[60px] font-medium text-center pb-2"> Unleash Your Culinary Creativity!</h1>
   
        <ChallengeList />
    
      
    </div>
  );
}


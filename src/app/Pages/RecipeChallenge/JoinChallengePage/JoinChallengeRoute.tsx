// app/challenge/join/[id]/page.tsx
import JoinForm from './JoinForm';

type JoinChallengeProps = {
  joinchallenge: {
    id: number;
    title: string;
    name: string;
    email: string;
  };
};

const JoinChallengeRoute: React.FC<JoinChallengeProps> = ({ joinchallenge }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-orange-600">
              Join the "{joinchallenge.title}"!
            </h1>
            <p className="mt-2 text-gray-600">
              Fill out the form below to participate in this challenge.
            </p>
          </div>
          
          <JoinForm challenge={joinchallenge} />
        </div>
      </div>
    </div>
  );
};

export default JoinChallengeRoute;
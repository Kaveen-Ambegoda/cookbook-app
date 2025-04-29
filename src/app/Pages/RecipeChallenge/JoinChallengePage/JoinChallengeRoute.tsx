import JoinForm from './[id]/JoinForm';

interface Params {
  params: {
    title: string;
  };
}

export default function JoinChallengePage({ params }: Params) {
  // Find the challenge based on the ID
  const challenge = challenges.find(c => c.id === Number(params.title));

  if (!challenge) {
    return <div>Challenge not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-orange-600">
              Join the "{challenge.title}"!
            </h1>
            <p className="mt-2 text-gray-600">
              Fill out the form below to participate in this challenge.
            </p>
          </div>
          
          <JoinForm challenge={challenge} />
        </div>
      </div>
    </div>
  );
}
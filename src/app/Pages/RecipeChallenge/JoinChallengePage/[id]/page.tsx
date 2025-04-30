import JoinChallengePage from './JoinChallengePage';

export default function Page({ params }: { params: { id: string } }) {
  return <JoinChallengePage params={params} />;
}
import JoinChallengePage from './JoinChallengePage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <JoinChallengePage params={resolvedParams} />;
}
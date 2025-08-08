import { GamePlay } from '@/components/game-play'

interface GamePlayPageProps {
  params: Promise<{ id: string }>
}

export default async function GamePlayPage({ params }: GamePlayPageProps) {
  const { id } = await params
  return <GamePlay gameId={id} />
}

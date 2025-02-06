import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Boss, bossList } from '@/constants/bosses';
import BossCalculator from '@/components/BossCalculator';
import { redirect } from 'next/navigation';
import { Character } from '@/interfaces/index';

const characters: Character[] = [
  { id: '1', name: 'Boss', world: 'Maple World', level: 50, class: 'Warrior' },
  // Add more characters as needed
];

export default async function CalculatorPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const dbCharacters = await prisma.character.findMany({
    where: {
      userId: session.user.id
    },
    select: {
      id: true,
      name: true
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">보스 계산기</h1>
      <BossCalculator characters={characters} bossList={bossList} />
    </div>
  );
  
}

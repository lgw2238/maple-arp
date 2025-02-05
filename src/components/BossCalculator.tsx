'use client';

import { useState } from 'react';
import { Boss } from '@/constants/bosses';

interface Character {
  id: string;
  name: string;
}

interface CharacterBosses {
  [characterId: string]: {
    [bossId: string]: boolean;
  };
}

interface BossCalculatorProps {
  characters: Character[];
  bossList: Boss[];
}

export default function BossCalculator({ characters, bossList }: BossCalculatorProps) {
  const [selectedBosses, setSelectedBosses] = useState<CharacterBosses>({});

  const handleBossToggle = (characterId: string, bossId: string) => {
    setSelectedBosses(prev => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        [bossId]: !prev[characterId]?.[bossId]
      }
    }));
  };

  const calculateTotalForCharacter = (characterId: string): number => {
    return bossList.reduce((total, boss) => {
      if (selectedBosses[characterId]?.[boss.id]) {
        return total + boss.crystalValue;
      }
      return total;
    }, 0);
  };

  const calculateGrandTotal = (): number => {
    return characters.reduce((total, character) => {
      return total + calculateTotalForCharacter(character.id);
    }, 0);
  };

  const formatMesos = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <div className="space-y-8">
      {characters.map(character => (
        <div key={character.id} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{character.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bossList.map(boss => (
              <div key={boss.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${character.id}-${boss.id}`}
                  checked={selectedBosses[character.id]?.[boss.id] || false}
                  onChange={() => handleBossToggle(character.id, boss.id)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor={`${character.id}-${boss.id}`} className="flex-1">
                  {boss.name}
                </label>
                <span className="text-gray-600 text-sm">
                  {formatMesos(boss.crystalValue)}메소
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold">
              캐릭터 총합: {formatMesos(calculateTotalForCharacter(character.id))}메소
            </p>
          </div>
        </div>
      ))}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <p className="text-2xl font-bold text-center">
          주간 총 수익: {formatMesos(calculateGrandTotal())}메소
        </p>
      </div>
    </div>
  );
}

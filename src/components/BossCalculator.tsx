'use client';

import { useState, useEffect } from 'react';
import { Boss, Character, CharacterBosses, BossCalculatorProps } from '@/interfaces';
import { getCharacterBosses } from '@/lib/maple-api';

export default function BossCalculator({ characters, bossList }: BossCalculatorProps) {
  const [selectedBosses, setSelectedBosses] = useState<CharacterBosses>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBossData = async () => {
      try {
        // Initialize boss data for each character
        const initialBossData: CharacterBosses = {};
        
        for (const character of characters) {
          const characterBosses = await getCharacterBosses(character.id);
          initialBossData[character.id] = {};
          
          // Set initial state based on API data
          characterBosses.forEach(boss => {
            initialBossData[character.id][boss.id] = false;
          });
        }
        
        setSelectedBosses(initialBossData);
        setLoading(false);
      } catch (error) {
        console.error('보스 데이터 로딩 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchBossData();
  }, [characters]);

  const handleBossToggle = (characterId: string, bossId: string) => {
    const currentSelection = selectedBosses[characterId] || {};
    const isSelected = currentSelection[bossId] || false;

    // Count currently selected bosses for the character
    const selectedCount = Object.values(currentSelection).filter(Boolean).length;

    if (!isSelected && selectedCount >= 12) {
        // Optionally, show an alert or message to the user
        alert('각 캐릭터당 선택할 수 있는 결정석의 수는 12개로 제한됩니다.');
        return; // Exit if the limit is reached
    }

    // Proceed with toggling the selection
    setSelectedBosses(prev => ({
        ...prev,
        [characterId]: {
            ...currentSelection,
            [bossId]: !isSelected,
        },
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

  if (loading) {
    return <div className="text-center p-8">데이터를 불러오는 중...</div>;
  }

  return (
    <div className="space-y-8">
      {characters.map(character => (
        <div key={character.id} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex justify-between">
            {character.name}
            <span className="text-sm text-gray-600">
              선택한 결정석: {Object.values(selectedBosses[character.id] || {}).filter(Boolean).length}
            </span>
          </h2>
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

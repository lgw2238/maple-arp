'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { searchCharacter } from '@/lib/maple-api';
import { ExtendedCharacterData } from '@/interfaces/index';

export default function CharacterPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const name = resolvedParams.name;
  const { data: session } = useSession();
  const [character, setCharacter] = useState<ExtendedCharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const result = await searchCharacter(resolvedParams.name);
        if (!result) {
          throw new Error('캐릭터를 찾을 수 없습니다.');
        }
        setCharacter(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '캐릭터 검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();

    // 캐릭터 등록 여부 확인
    if (session?.user?.id) {
      checkIfCharacterIsRegistered();
    }
  }, [resolvedParams.name, session?.user?.id]);

  const checkIfCharacterIsRegistered = async () => {
    try {
      const res = await fetch('/api/characters');
      const data = await res.json();
      
      if (data.characters) {
        setIsRegistered(data.characters.some((char: any) => char.name === resolvedParams.name));
      }
    } catch (error) {
      console.error('캐릭터 등록 확인 중 오류:', error);
    }
  };

  const handleRegisterCharacter = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterName: resolvedParams.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '캐릭터 등록 중 오류가 발생했습니다.');
      }

      setIsRegistered(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              돌아가기
            </button>
            <p className="text-red-500 text-center">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              돌아가기
            </button>
            <p className="text-gray-500 text-center">캐릭터 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Character Header */}
      <div className="relative bg-blue-600 h-48">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
        <div className="container mx-auto px-4">
          <button 
            onClick={() => router.back()} 
            className="absolute top-4 left-4 text-white hover:text-gray-200 flex items-center space-x-1"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>돌아가기</span>
          </button>
        </div>
      </div>

      {/* Character Info Card */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-8">
              {/* Left Column - Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={character.character_image}
                    alt={`${character.character_name} 캐릭터 이미지`}
                    className="w-36 h-36 object-cover rounded-lg border-4 border-white shadow-md"
                  />
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg min-w-[80px] text-center">
                    Lv.{character.character_level}
                  </div>
                </div>
              </div>

              {/* Right Column - Info */}
              <div className="flex-grow">
                {/* Character Name and Basic Info */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">{character.character_name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span>{character.world_name}</span>
                    <span className="text-gray-300">•</span>
                    <span>{character.character_class}</span>
                    {character.character_guild_name && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>{character.character_guild_name}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">전투력</div>
                    <div className="text-lg font-bold text-gray-900">
                      {character.character_level * 1000} {/* 임시 데이터 */}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">경험치</div>
                    <div className="text-lg font-bold text-gray-900">
                      {character.character_exp_rate}%
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">인기도</div>
                    <div className="text-lg font-bold text-gray-900">
                      {character.character_level * 2} {/* 임시 데이터 */}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">직업랭킹</div>
                    <div className="text-lg font-bold text-gray-900">
                      상위 {Math.floor(Math.random() * 100)}% {/* 임시 데이터 */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-t">
            <div className="flex space-x-8 px-6">
              <button className="py-4 text-blue-600 font-medium border-b-2 border-blue-600">
                캐릭터 정보
              </button>
              <button className="py-4 text-gray-500 hover:text-gray-700">
                장비
              </button>
              <button className="py-4 text-gray-500 hover:text-gray-700">
                스킬
              </button>
              <button className="py-4 text-gray-500 hover:text-gray-700">
                V매트릭스
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">스탯 정보</h3>
            {loading ? (
              <div>Loading...</div>
            ) : character?.stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">STR</dt>
                  <dd className="text-lg font-semibold">{character.stats.stats?.str || '0'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">DEX</dt>
                  <dd className="text-lg font-semibold">{character.stats.stats?.dex || '0'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">INT</dt>
                  <dd className="text-lg font-semibold">{character.stats.stats?.int || '0'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">LUK</dt>
                  <dd className="text-lg font-semibold">{character.stats.stats?.luk || '0'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">데미지</dt>
                  <dd className="text-lg font-semibold">{character.stats.stats?.damage || '0'}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">보스 데미지</dt>
                  <dd className="text-lg font-semibold">{character.stats.stats?.boss_damage || '0'}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">방어율 무시</dt>
                  <dd className="text-lg font-semibold">{character.stats.stats?.ignore_defense || '0'}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">크리티컬 데미지</dt>
                  <dd className="text-lg font-semibold">{character.stats.stats?.critical_damage || '0'}%</dd>
                </div>
              </div>
            ) : (
              <div>스탯 정보를 불러올 수 없습니다.</div>
            )}
          </div>

          {/* Symbols Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">심볼 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              {character.symbols?.symbol_equipment && character.symbols.symbol_equipment.length > 0 ? (
                character.symbols.symbol_equipment.map((symbol, index) => (
                  <div key={index}>
                    <dt className="text-sm text-gray-500">{symbol.symbol_name}</dt>
                    <dd className="text-lg font-semibold">
                      Lv.{symbol.symbol_level} ({symbol.symbol_exp_rate}%)
                    </dd>
                  </div>
                ))
              ) : (
                <div>심볼 정보가 없습니다.</div>
              )}
            </div>
          </div>

          {/* Equipment Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">장비 미리보기</h3>
            <div className="grid grid-cols-3 gap-2">
              {character.items?.item_equipment.slice(0, 9).map((item, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={item.item_icon} 
                    alt={item.item_name}
                    className="w-full h-auto rounded border border-gray-200"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.item_name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Union Level */}
          {character.union && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">유니온</h3>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">유니온 레벨</dt>
                  <dd className="text-lg font-semibold">{character.union.union_level}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">유니온 등급</dt>
                  <dd className="text-lg font-semibold">{character.union.union_grade}</dd>
                </div>
              </div>
            </div>
          )}

          {/* Dojang Info */}
          {character.dojang && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">무릉도장</h3>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">최고 기록</dt>
                  <dd className="text-lg font-semibold">{character.dojang.dojang_best_floor}층</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">기록 달성일</dt>
                  <dd className="text-lg font-semibold">
                    {new Date(character.dojang.date_dojang_record).toLocaleDateString()}
                  </dd>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

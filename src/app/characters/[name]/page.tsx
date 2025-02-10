'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { searchCharacter } from '@/lib/maple-api';
import { ExtendedCharacterData } from '@/interfaces/index';
import './styles.css';

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
  const [activeTab, setActiveTab] = useState('character-info');

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

  const [showAllStats, setShowAllStats] = useState(false);

  const toggleStats = () => {
    setShowAllStats(!showAllStats);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
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
                      {character.stats?.final_stat.find(stat => stat.stat_name === '전투력')?.stat_value || '0'}
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
                     {character.popularity.popularity}
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
            <div className="nav-tabs">
              <button className={`nav-link ${activeTab === 'character-info' ? 'active' : ''}`} onClick={() => handleTabClick('character-info')}>캐릭터 정보</button>
              <button className={`nav-link ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => handleTabClick('equipment')}>장비</button>
              <button className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => handleTabClick('skills')}>스킬</button>
              <button className={`nav-link ${activeTab === 'v-matrix' ? 'active' : ''}`} onClick={() => handleTabClick('v-matrix')}>V매트릭스</button>
            </div>

            {activeTab === 'character-info' && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">스탯 정보</h3>
                <button onClick={toggleStats} className="text-blue-500 hover:underline">
                  {showAllStats ? '숨기기' : '모두 보기'}
                </button>
                <div className="grid grid-cols-2 gap-4">
                  {character.stats?.final_stat
                    .filter(stat => showAllStats || ['보스 몬스터 데미지', '데미지', '방어율 무시', '버프 지속시간', '크리티컬 확률', '크리티컬 데미지', '아케인포스', '어센틱포스'].includes(stat.stat_name))
                    .map((stat, index: number) => (
                      <div key={index}>
                        <dt className="text-sm text-gray-500">{stat.stat_name}</dt>
                        <dd className="text-lg font-semibold">{stat.stat_value}</dd>
                      </div>
                    ))}
                </div>
              </div>
            )}
         {activeTab === 'equipment' && (
  <div className="p-6">
    <h3 className="text-lg font-bold mb-4">장비 목록</h3>
    <div className="grid grid-cols-2 gap-4">
      {character.items?.item_equipment.map((item, index) => (
        <div key={index} className="relative flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
          <img 
        src={item.item_icon} 
        alt={item.item_name} 
        className={`w-16 h-16 object-cover mb-2 ${item.potential_option_grade === '에픽' ? 'border-4 border-purple-500' : item.potential_option_grade === '유니크' ? 'border-4 border-yellow-500' : item.potential_option_grade === '레전드리' ? 'border-4 border-green-500' : ''}`} 
          />
          <span className="text-sm font-medium text-gray-700">{item.item_name}</span>
          <div className="absolute bottom-0 left-0 w-full p-2 bg-white rounded-lg shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="text-xs text-gray-500 space-y-2">
          <div className="border-b pb-2">
            <p className="font-bold">잠재옵션</p>
            <p><strong>등급:</strong> {item.potential_option_grade}</p>
            <p><strong>옵션 1:</strong> {item.potential_option_1}</p>
            <p><strong>옵션 2:</strong> {item.potential_option_2}</p>
            <p><strong>옵션 3:</strong> {item.potential_option_3}</p>
          </div>
          <div className="pt-2">
            <p className="font-bold">에디셔널 잠재옵션</p>
            <p><strong>등급:</strong> {item.additional_potential_option_grade}</p>
            <p><strong>옵션 1:</strong> {item.additional_potential_option_1}</p>
            <p><strong>옵션 2:</strong> {item.additional_potential_option_2}</p>
            <p><strong>옵션 3:</strong> {item.additional_potential_option_3}</p>
          </div>
        </div>
          </div>
        </div>
      ))}
    </div>
    <br/>
    <div>
      <h3 className="text-lg font-bold mb-4">심볼 목록</h3>
      <div className="grid grid-cols-2 gap-4">
        { character.symbols?.symbol.map((symbol, index: number) => (
          <div key={index} className="relative flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
            <img 
              src={symbol.symbol_icon} 
              alt={symbol.symbol_name} 
              className="w-16 h-16 object-cover mb-2" 
            />
            <span className="text-sm font-medium text-gray-700">{symbol.symbol_name}</span>
            <div className="absolute bottom-0 left-0 w-full p-2 bg-white rounded-lg shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="text-xs text-gray-500 space-y-2">
                <div className="border-b pb-2">
                  <p className="font-bold">심볼 옵션</p>
                  <p><strong>레벨:</strong> {symbol.symbol_level}</p>
                  <p><strong>경험치:</strong> {symbol.symbol_exp_rate}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
</div>
  
)}
            {activeTab === 'skills' && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">스킬 목록</h3>
                <div className="grid grid-cols-2 gap-4">
                  {character.skills?.character_skill.map((skill, index: number) => (
                    <div key={index}>
                      <img src={skill.skill_icon} alt={skill.skill_icon} className="skill-image" />
                      <dt className="text-sm text-gray-500">{skill.skill_name}</dt>
                      <dd className="text-lg font-semibold">{skill.skill_level}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'v-matrix' && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">V매트릭스 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  {character.vMatrix?.character_v_core_equipment.map((v_matrix, index: number) => (
                    <div key={index}>
                      <dt className="text-sm text-gray-500">{v_matrix.v_core_type}</dt>
                      <dt className="text-sm text-gray-500">{v_matrix.v_core_name}</dt>
                      <dd className="text-lg font-semibold">{v_matrix.v_core_level}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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

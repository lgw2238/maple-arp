'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface Character {
  name: string;
  level: number;
  job: string;
  server: string;
  guild?: string;
  stats: {
    str: number;
    dex: number;
    int: number;
    luk: number;
    hp: number;
    mp: number;
  };
  lastUpdated: string;
}

// 임시 데이터
const mockCharacter: Character = {
  name: "도우해",
  level: 282,
  job: "패스파인더",
  server: "루나",
  guild: "고윤정",
  stats: {
    str: 4,
    dex: 4,
    int: 1244,
    luk: 4,
    hp: 12440,
    mp: 33440,
  },
  lastUpdated: new Date().toISOString()
};

export default function CharacterPage({ params }: { params: { name: string } }) {
  const { data: session } = useSession();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 실제 API 연동 시 이 부분을 수정하면 됩니다
    setTimeout(() => {
      if (params.name.toLowerCase() === mockCharacter.name.toLowerCase()) {
        setCharacter(mockCharacter);
      } else {
        setError('캐릭터를 찾을 수 없습니다.');
      }
      setLoading(false);
    }, 1000);

    // 캐릭터 등록 여부 확인
    if (session?.user?.id) {
      checkIfCharacterIsRegistered();
    }
  }, [params.name, session?.user?.id]);

  const checkIfCharacterIsRegistered = async () => {
    try {
      const res = await fetch('/api/characters');
      const data = await res.json();
      
      if (data.characters) {
        setIsRegistered(data.characters.some((char: any) => char.name === params.name));
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
          characterName: params.name,
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
    <div className="min-h-screen bg-gray-100">
      {/* Character Header */}
      <div className="bg-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white hover:text-gray-200 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            돌아가기
          </button>
          <div className="flex items-end space-x-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
              <div className="flex items-center space-x-2 text-blue-100">
                <span>{character.server}</span>
                <span>•</span>
                <span>{character.job}</span>
                {character.guild && (
                  <>
                    <span>•</span>
                    <span>{character.guild}</span>
                  </>
                )}
              </div>
            </div>
            {session && !isRegistered && (
              <button
                onClick={handleRegisterCharacter}
                disabled={registering}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  registering
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {registering ? '등록 중...' : '내 캐릭터로 등록'}
              </button>
            )}
            {isRegistered && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                등록된 캐릭터
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Character Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">기본 정보</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">레벨</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  Lv.{character.level}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">직업</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {character.job}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">서버</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {character.server}
                </dd>
              </div>
            </dl>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">스탯 정보</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">STR</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {character.stats.str}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">DEX</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {character.stats.dex}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">INT</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {character.stats.int}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">LUK</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {character.stats.luk}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">HP</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {character.stats.hp.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">MP</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {character.stats.mp.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Equipment Preview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">장비 미리보기</h2>
            <div className="text-center text-gray-500">
              준비 중입니다...
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">
            마지막 업데이트: {new Date(character.lastUpdated).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

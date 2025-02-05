'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Character {
  id: string;
  name: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchCharacters();
    }
  }, [status, router]);

  const fetchCharacters = async () => {
    try {
      const res = await fetch('/api/characters');
      const data = await res.json();
      
      if (data.characters) {
        setCharacters(data.characters);
      }
    } catch (error) {
      console.error('캐릭터 목록 조회 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (characterId: string) => {
    try {
      const res = await fetch(`/api/characters/${characterId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // 캐릭터 목록 새로고침
        fetchCharacters();
      } else {
        throw new Error('캐릭터 등록 해제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('캐릭터 등록 해제 중 오류:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 프로필 정보 */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">내 프로필</h2>
            <div className="mt-4">
              <p className="text-sm text-gray-500">이메일</p>
              <p className="mt-1 text-lg text-gray-900">{session?.user?.email}</p>
            </div>
            {session?.user?.name && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">이름</p>
                <p className="mt-1 text-lg text-gray-900">{session.user.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* 등록된 캐릭터 목록 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">등록된 캐릭터</h2>
            {characters.length === 0 ? (
              <div className="mt-4 text-center py-12">
                <p className="text-gray-500">등록된 캐릭터가 없습니다.</p>
                <Link
                  href="/"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  캐릭터 검색하기
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          캐릭터명
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          등록일
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {characters.map((character) => (
                        <tr key={character.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            <Link
                              href={`/characters/${character.name}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {character.name}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(character.createdAt).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleUnregister(character.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              등록 해제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

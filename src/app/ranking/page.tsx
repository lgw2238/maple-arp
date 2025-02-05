'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface RankingCharacter {
  rank: number;
  previousRank: number;
  name: string;
  level: number;
  job: string;
  server: string;
  guild?: string;
}

// 임시 데이터
const mockRankings: RankingCharacter[] = Array.from({ length: 20 }, (_, i) => ({
  rank: i + 1,
  previousRank: i + 1 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3),
  name: `플레이어${i + 1}`,
  level: 280 - Math.floor(Math.random() * 10),
  job: ['히어로', '아크메이지(불,독)', '나이트로드', '비숍'][Math.floor(Math.random() * 4)],
  server: ['스카니아', '베라', '루나', '크로아'][Math.floor(Math.random() * 4)],
  guild: Math.random() > 0.3 ? `길드${Math.floor(Math.random() * 10)}` : undefined,
}));

export default function RankingPage() {
  const [rankings, setRankings] = useState<RankingCharacter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 API 연동 시 이 부분을 수정하면 됩니다
    setTimeout(() => {
      setRankings(mockRankings);
      setLoading(false);
    }, 1000);
  }, []);

  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current;
    if (diff > 0) {
      return { icon: <ChevronUpIcon className="h-4 w-4 text-green-500" />, value: diff };
    } else if (diff < 0) {
      return { icon: <ChevronDownIcon className="h-4 w-4 text-red-500" />, value: Math.abs(diff) };
    }
    return { icon: <span className="text-gray-400">-</span>, value: 0 };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">전체 랭킹</h1>
          <p className="mt-2 text-sm text-gray-600">
            메이플스토리 전체 서버의 레벨 랭킹입니다.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">전체 직업</option>
              <option value="warrior">전사</option>
              <option value="magician">마법사</option>
              <option value="archer">궁수</option>
              <option value="thief">도적</option>
              <option value="pirate">해적</option>
            </select>
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">전체 서버</option>
              <option value="scania">스카니아</option>
              <option value="bera">베라</option>
              <option value="luna">루나</option>
              <option value="croa">크로아</option>
            </select>
            <input
              type="text"
              placeholder="캐릭터 검색"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">랭킹 정보를 불러오는 중...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    순위
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    캐릭터
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    레벨
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    직업
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    서버
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    길드
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankings.map((character) => {
                  const rankChange = getRankChange(character.rank, character.previousRank);
                  return (
                    <tr key={character.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {character.rank}
                          </span>
                          <div className="ml-2 flex items-center">
                            {rankChange.icon}
                            {rankChange.value > 0 && (
                              <span className="ml-1 text-xs text-gray-500">
                                {rankChange.value}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          href={`/characters/${encodeURIComponent(character.name)}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {character.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {character.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {character.job}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {character.server}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {character.guild || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              이전
            </a>
            {[1, 2, 3, 4, 5].map((page) => (
              <a
                key={page}
                href="#"
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  page === 1
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </a>
            ))}
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              다음
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}

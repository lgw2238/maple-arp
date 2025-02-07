'use client';

import { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Guild } from '@/interfaces/index';
import { fetchGuildData } from '@/lib/maple-api';

export default function GuildPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchGuildData(currentPage);
        console.log('Fetched guild data:', result); // API 응답 확인
        setGuilds(result.data || []); // 응답이 없을 경우 빈 배열로 설정
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Error loading guild data:', error);
        setGuilds([]); // 오류 발생 시 빈 배열로 설정
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">길드 랭킹</h1>
          <p className="mt-2 text-sm text-gray-600">
            메이플스토리 전체 서버의 길드 랭킹입니다.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">전체 서버</option>
              <option value="scania">스카니아</option>
              <option value="bera">베라</option>
              <option value="luna">루나</option>
              <option value="croa">크로아</option>
            </select>
            <input
              type="text"
              placeholder="길드명 검색"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Guild Rankings */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">길드 정보를 불러오는 중...</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 gap-4">
                {guilds.slice((currentPage - 1) * 20, currentPage * 20).map(guild => (
                  <div key={guild.ranking} className="border p-4 rounded shadow">
                    <h2 className="text-lg font-bold">{guild.guild_name}</h2>
                    <p>서버: {guild.world_name}</p>
                    <p>레벨: {guild.guild_level}</p>
                    <p>길드 포인트: {guild.guild_point}</p>
                    <p>길드 마스터: {guild.guild_master_name}</p>
                    <p>순위: {guild.ranking}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="bg-gray-300 p-2 rounded">이전</button>
                <span>Page {currentPage}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-gray-300 p-2 rounded">다음</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

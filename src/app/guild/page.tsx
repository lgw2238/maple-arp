'use client';

import { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Guild } from '@/interfaces/index';
import { fetchGuildData } from '@/lib/maple-api';
import { Card, CardContent, Typography, Button, Grid, CircularProgress } from '@mui/material';

export default function GuildPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [server, setServer] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchGuildData(currentPage, server);
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
  }, [currentPage, server]);

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

  const serverNames = [
    '루나', '스카니아', '엘리시움', '크로아', '오로라',
    '베라', '레드', '유니온', '제니스', '이노시스',
    '아케인', '노바', '챌린저스', '챌린저스2',
    '챌린저스3', '챌린저스4', '에오스', '핼리오스'
  ];

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

        <div className="flex space-x-2 mb-4">
          {serverNames.map(server => (
            <Button
              key={server}
              variant="contained"
              color="primary"
              onClick={() => {
                setServer(server);
                setCurrentPage(1); // 페이지를 1로 리셋
              }}
            >
              {server}
            </Button>
          ))}
        </div>

        {/* Guild Rankings */}
        <Grid container spacing={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            guilds.slice((currentPage - 1) * 20, currentPage * 20).map(guild => (
              <Grid item xs={12} key={guild.ranking}> 
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {guild.guild_name}
                    </Typography>
                    <Typography color="text.secondary">서버: {guild.world_name}</Typography>
                    <Typography color="text.secondary">레벨: {guild.guild_level}</Typography>
                    <Typography color="text.secondary">길드 포인트: {guild.guild_point}</Typography>
                    <Typography color="text.secondary">길드 마스터: {guild.guild_master_name}</Typography>
                    <Typography color="text.secondary">순위: {guild.ranking}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <div className="mt-4 flex justify-between">
          <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outlined">이전</Button>
          <span>Page {currentPage}</span>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outlined">다음</Button>
        </div>
      </div>
    </div>
  );
}

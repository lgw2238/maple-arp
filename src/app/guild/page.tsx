'use client';

import { useState, useEffect } from 'react';
import { Guild } from '@/interfaces/index';
import { fetchGuildData } from '@/lib/maple-api';
import { Card, CardContent, Typography, Button, Grid, CircularProgress, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function GuildPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchType, setSearchType] = useState('');
  const [searchParameter, setSearchParameter] = useState('');
  const [searchGuildName, setSearchGuildName] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchGuildData(currentPage, searchType, searchParameter, searchGuildName);
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
  }, [currentPage, searchType, searchParameter, searchGuildName]);

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

        <div className="flex space-x-2 mb-4">
          <TextField
            label="길드명 검색"
            variant="outlined"
            value={searchGuildName}
            onChange={(e) => setSearchGuildName(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSearchType('guild');
              setSearchGuildName(searchGuildName);
               // fetchGuildData(currentPage, searchType, searchParameter, searchGuildName)
            }}
          >
            <SearchIcon />
          </Button>
        </div>

        <div className="flex space-x-2 mb-4">
          {serverNames.map(serverName => (
            <Button
              key={serverName}
              variant="outlined"
              color="primary"
              onClick={() => {
                setSearchType('server');
                setSearchParameter(serverName);
                setCurrentPage(1); // 페이지를 1로 리셋
              }}
              sx={{
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#1976d2', // Hover 색상
                  color: 'white',
                },
                transition: '0.3s',
              }}
            >
              {serverName}
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

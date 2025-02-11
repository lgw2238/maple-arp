'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/characters/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-600 to-blue-500">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Maple ARP
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              메이플스토리 캐릭터 정보, 랭킹, 길드를 한눈에
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mt-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="캐릭터명을 입력하세요"
                  className="w-full rounded-lg py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white" />
      </div>
{/*
      // Features Section
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            메이플스토리 만능주머니 
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            캐릭터 정보부터 랭킹, 길드까지 한눈에 확인하세요
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="text-lg font-semibold leading-7 text-gray-900">
                실시간 랭킹
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p>레벨, 인기도, 유니온 등 다양한 랭킹 정보를 실시간으로 확인할 수 있습니다.</p>
              </dd>
            </div>

            <div className="flex flex-col">
              <dt className="text-lg font-semibold leading-7 text-gray-900">
                상세 캐릭터 정보
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p>장비, 스탯, 스킬 등 캐릭터의 모든 정보를 한눈에 확인하세요.</p>
              </dd>
            </div>

            <div className="flex flex-col">
              <dt className="text-lg font-semibold leading-7 text-gray-900">
                길드 랭킹
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p>길드원 목록, 길드 스킬, 길드 랭킹 등 길드의 모든 정보를 확인할 수 있습니다.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
*/}
      {/* Quick Links */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              빠른 링크
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
            {[
              { title: '전체 랭킹', href: '/ranking' },
              { title: '직업 랭킹', href: '/ranking/job' },
              { title: '길드 랭킹', href: '/guild' },
              { title: '유니온 랭킹', href: '/ranking/union' },
            ].map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="flex items-center justify-center rounded-lg bg-gray-50 px-4 py-8 text-center text-sm font-semibold text-gray-900 hover:bg-gray-100"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

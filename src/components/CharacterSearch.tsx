'use client';

import { useState } from 'react';
import { searchCharacter } from '@/lib/maple-api';
import { CharacterBasic } from '@/interfaces';
import Image from 'next/image';

export default function CharacterSearch() {
    const [characterName, setCharacterName] = useState('');
    const [character, setCharacter] = useState<CharacterBasic | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!characterName.trim()) return;

        setLoading(true);
        setError('');
        try {
            const result = await searchCharacter(characterName.trim());
            setCharacter(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : '캐릭터 검색 중 오류가 발생했습니다.');
            setCharacter(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        placeholder="캐릭터 이름을 입력하세요"
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? '검색 중...' : '검색'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {character && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-start gap-6">
                        <div className="relative w-32 h-32">
                            <Image
                                src={character.character_image}
                                alt={character.character_name}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">{character.character_name}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">월드: {character.world_name}</p>
                                    <p className="text-gray-600">직업: {character.character_class}</p>
                                    <p className="text-gray-600">레벨: {character.character_level}</p>
                                    <p className="text-gray-600">성별: {character.character_gender}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">길드: {character.character_guild_name || '없음'}</p>
                                    <p className="text-gray-600">전직 레벨: {character.character_class_level}</p>
                                    <p className="text-gray-600">경험치: {character.character_exp_rate}%</p>
                                    <p className="text-gray-600">캐릭터 생성일: {new Date(character.character_date_create).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

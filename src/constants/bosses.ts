export interface Boss {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Chaos' | 'Extreme';
  mesos: number;
  crystalValue: number;
}

export const bossList: Boss[] = [
  { id: 'zakum_chaos', name: '카오스 자쿰', difficulty: 'Chaos', mesos: 0, crystalValue: 9620000 },
  { id: 'magnus_hard', name: '하드 매그너스', difficulty: 'Hard', mesos: 0, crystalValue: 16740000 },
  { id: 'hilla_hard', name: '하드 힐라', difficulty: 'Hard', mesos: 0, crystalValue: 5520000 },
  { id: 'papulatus_chaos', name: '카오스 파풀라투스', difficulty: 'Chaos', mesos: 0, crystalValue: 16740000 },
  { id: 'pierre_chaos', name: '카오스 피에르', difficulty: 'Chaos', mesos: 0, crystalValue: 9620000 },
  { id: 'vonbon_chaos', name: '카오스 반반', difficulty: 'Chaos', mesos: 0, crystalValue: 9620000 },
  { id: 'queen_chaos', name: '카오스 퀸', difficulty: 'Chaos', mesos: 0, crystalValue: 9620000 },
  { id: 'vellum_chaos', name: '카오스 벨룸', difficulty: 'Chaos', mesos: 0, crystalValue: 9620000 },
  { id: 'lotus_hard', name: '하드 스우', difficulty: 'Hard', mesos: 0, crystalValue: 108150000 },
  { id: 'damien_hard', name: '하드 데미안', difficulty: 'Hard', mesos: 0, crystalValue: 108150000 },
  { id: 'lucid_hard', name: '하드 루시드', difficulty: 'Hard', mesos: 0, crystalValue: 168750000 },
  { id: 'will_hard', name: '하드 윌', difficulty: 'Hard', mesos: 0, crystalValue: 168750000 },
  { id: 'gloom_hard', name: '하드 글룸', difficulty: 'Hard', mesos: 0, crystalValue: 187500000 },
  { id: 'verus_hilla_hard', name: '하드 진힐라', difficulty: 'Hard', mesos: 0, crystalValue: 201600000 },
  { id: 'darknell_hard', name: '하드 듄켈', difficulty: 'Hard', mesos: 0, crystalValue: 201600000 },
  { id: 'black_mage', name: '검은 마법사', difficulty: 'Chaos', mesos: 0, crystalValue: 500000000 },
  { id: 'seren_hard', name: '하드 세렌', difficulty: 'Hard', mesos: 0, crystalValue: 252000000 },
  { id: 'kalos_hard', name: '하드 칼로스', difficulty: 'Hard', mesos: 0, crystalValue: 252000000 },
];

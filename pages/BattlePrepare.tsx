
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';
import type { Gijimon } from '../types';
import { EASY_CPU, NORMAL_CPU, HARD_CPU } from '../constants/cpuGijimons';

const BattlePrepare: React.FC = () => {
  const { gijimons } = useGameState();
  const [selectedGijimonId, setSelectedGijimonId] = useState<string | null>(gijimons[0]?.id || null);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('easy');
  const navigate = useNavigate();

  const handleStartBattle = () => {
    if (!selectedGijimonId) {
      alert('バトルに出す擬似モンを選択してください。');
      return;
    }
    const playerGijimon = gijimons.find(g => g.id === selectedGijimonId);
    let enemyPool: Gijimon[];
    if (difficulty === 'easy') enemyPool = EASY_CPU;
    else if (difficulty === 'normal') enemyPool = NORMAL_CPU;
    else enemyPool = HARD_CPU;

    const enemyGijimon = { ...enemyPool[Math.floor(Math.random() * enemyPool.length)] };
    enemyGijimon.currentHp = enemyGijimon.stats.hp; // Reset HP

    if (playerGijimon) {
      const playerGijimonForBattle = { ...playerGijimon, currentHp: playerGijimon.stats.hp };
      navigate('/battle/fight', { state: { playerGijimon: playerGijimonForBattle, enemyGijimon } });
    }
  };

  return (
    <div className="w-full h-full bg-gray-800 flex flex-col p-6">
      <div className="flex-shrink-0 flex items-center mb-4">
        <button onClick={() => navigate('/menu')} className="text-xl font-bold text-white hover:text-yellow-400">
          {'<'} 戻る
        </button>
        <h1 className="text-3xl font-bold text-center text-white flex-grow font-dotgothic">バトル準備</h1>
      </div>

      <div className="flex-grow flex flex-col justify-around">
        {/* Gijimon Selection */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">擬似モン選択</h2>
          {gijimons.length === 0 ? (
            <p className="text-center text-gray-400">バトルに出せる擬似モンがいません。</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {gijimons.map(g => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGijimonId(g.id)}
                  className={`cursor-pointer p-2 rounded-lg ${selectedGijimonId === g.id ? 'bg-blue-600 ring-2 ring-yellow-400' : 'bg-gray-700'}`}
                >
                  <img src={g.gijimonImage} alt={g.name} className="w-full h-auto object-contain aspect-square" />
                  <p className="text-center text-xs font-bold mt-1 truncate">{g.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty Selection */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">難易度選択</h2>
          <div className="flex justify-around">
            {(['easy', 'normal', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg font-bold ${difficulty === d ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
              >
                {d === 'easy' ? 'イージー' : d === 'normal' ? 'ノーマル' : 'ハード'}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 mt-6">
        <button
          onClick={handleStartBattle}
          disabled={!selectedGijimonId}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white font-bold text-2xl py-4 rounded-lg border-b-4 border-red-800 disabled:border-gray-600 active:border-b-0 transition-all"
        >
          バトル開始！
        </button>
      </div>
    </div>
  );
};

export default BattlePrepare;

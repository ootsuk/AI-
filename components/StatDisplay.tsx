
import React from 'react';
import type { Stats } from '../types';

interface StatDisplayProps {
  stats: Stats;
}

const StatRow: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => {
  const width = Math.min((value / 150) * 100, 100); // Max stat assumed around 150 for display
  return (
    <div className="flex items-center text-sm mb-1">
      <span className="w-24 font-bold text-right pr-2">{label}</span>
      <span className="w-8 text-left">{value}</span>
      <div className="flex-1 bg-gray-600 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
};

const StatDisplay: React.FC<StatDisplayProps> = ({ stats }) => {
  return (
    <div className="p-3 bg-gray-800 rounded-lg">
      <StatRow label="HP" value={stats.hp} color="bg-green-500" />
      <StatRow label="こうげき" value={stats.attack} color="bg-red-500" />
      <StatRow label="ぼうぎょ" value={stats.defense} color="bg-blue-500" />
      <StatRow label="とくこう" value={stats.specialAttack} color="bg-purple-500" />
      <StatRow label="とくぼう" value={stats.specialDefense} color="bg-indigo-500" />
      <StatRow label="すばやさ" value={stats.speed} color="bg-yellow-500" />
    </div>
  );
};

export default StatDisplay;

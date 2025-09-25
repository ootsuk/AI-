import React from 'react';
import type { GijimonType, Move } from '../types';
import { getTypeEffectiveness } from '../constants/typeChart';
import TypeBadge from './TypeBadge';

interface MoveTooltipProps {
  move: Move;
  targetType: GijimonType;
}

const MoveTooltip: React.FC<MoveTooltipProps> = ({ move, targetType }) => {
  const effectiveness = getTypeEffectiveness(move.type, targetType);
  
  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white text-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">{move.name}</span>
        <TypeBadge type={move.type} className="text-xs" />
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>威力:</span>
          <span className="font-bold">{move.power || '--'}</span>
        </div>
        <div className="flex justify-between">
          <span>命中率:</span>
          <span className="font-bold">{move.accuracy}%</span>
        </div>
        <div className="flex justify-between">
          <span>タイプ相性:</span>
          <span className={`font-bold ${
            effectiveness > 1 ? 'text-green-400' : 
            effectiveness < 1 ? 'text-red-400' : 
            'text-white'
          }`}>
            {effectiveness > 1 ? '効果抜群' : 
             effectiveness < 1 ? '効果今ひとつ' : 
             '普通'}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {move.effect}
        </div>
      </div>
    </div>
  );
};

export default MoveTooltip;

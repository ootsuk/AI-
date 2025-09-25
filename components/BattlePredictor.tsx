import React from 'react';
import type { Gijimon, Move } from '../types';
import { calculateDamage } from '../utils/battleUtils';
import { getTypeEffectiveness } from '../constants/typeChart';

interface BattlePredictorProps {
  playerMove: Move;
  playerGijimon: Gijimon;
  enemyGijimon: Gijimon;
}

const BattlePredictor: React.FC<BattlePredictorProps> = ({ 
  playerMove, 
  playerGijimon, 
  enemyGijimon 
}) => {
  // Note: This shows a deterministic prediction, actual damage will vary slightly.
  const predictedDamage = calculateDamage(playerGijimon, enemyGijimon, playerMove);
  const effectiveness = getTypeEffectiveness(playerMove.type, enemyGijimon.type);
  
  return (
    <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 text-white text-sm">
      <h4 className="font-bold mb-2">予測</h4>
      <div className="space-y-1">
        {effectiveness !== 1 && (
          <div className="flex justify-between">
            <span className={`font-bold ${
              effectiveness > 1 ? 'text-green-400' : 'text-red-400'
            }`}>
              {effectiveness > 1 ? '効果は抜群だ！' : '効果は今ひとつ...'}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span>予想ダメージ:</span>
          <span className="font-bold">{predictedDamage.damage}</span>
        </div>
        <div className="flex justify-between">
          <span>残りHP:</span>
          <span className="font-bold">
            {Math.max(0, enemyGijimon.currentHp - predictedDamage.damage)} / {enemyGijimon.stats.hp}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BattlePredictor;

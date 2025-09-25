import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Gijimon, Move } from '../types';
import HPBar from '../components/HPBar';
import ExpBar from '../components/ExpBar';
import MessageBox from '../components/MessageBox';
import TypeBadge from '../components/TypeBadge';
import { useBattleLogic } from '../hooks/useBattleLogic';
import MoveTooltip from '../components/MoveTooltip';
import BattlePredictor from '../components/BattlePredictor';

const EnemyStatus: React.FC<{ gijimon: Gijimon }> = ({ gijimon }) => (
  <div className="absolute top-4 left-4 w-2/5 max-w-xs bg-gray-200 rounded-lg p-2 border-4 border-gray-700 shadow-lg rounded-tr-[30px]">
    <div className="flex justify-between items-center text-black">
      <h3 className="font-bold text-base sm:text-lg">{gijimon.name}</h3>
      <div className="flex items-center gap-2">
        <TypeBadge type={gijimon.type} />
        <p className="font-bold text-sm">Lv.{gijimon.level}</p>
      </div>
    </div>
    <div className="flex items-center mt-1">
      <span className="text-xs font-bold text-black mr-1">HP</span>
      <HPBar currentHp={gijimon.currentHp} maxHp={gijimon.stats.hp} />
    </div>
  </div>
);

const PlayerStatus: React.FC<{ gijimon: Gijimon }> = ({ gijimon }) => (
  <div className="absolute bottom-40 right-4 w-2/5 max-w-xs bg-gray-200 rounded-lg p-2 border-4 border-gray-700 shadow-lg rounded-tl-[30px]">
    <div className="flex justify-between items-center text-black">
      <h3 className="font-bold text-base sm:text-lg">{gijimon.name}</h3>
      <div className="flex items-center gap-2">
        <TypeBadge type={gijimon.type} />
        <p className="font-bold text-sm">Lv.{gijimon.level}</p>
      </div>
    </div>
    <div className="flex items-center mt-1">
      <span className="text-xs font-bold text-black mr-1">HP</span>
      <HPBar currentHp={gijimon.currentHp} maxHp={gijimon.stats.hp} />
    </div>
    <p className="text-right font-bold text-black text-sm mt-1">{gijimon.currentHp} / {gijimon.stats.hp}</p>
    <div className="mt-1">
      <ExpBar currentExp={gijimon.exp} expToNextLevel={gijimon.expToNextLevel} />
    </div>
  </div>
);

const BattleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { battleState, isProcessing, processTurn } = useBattleLogic();
  const { playerGijimon, enemyGijimon, message, isPlayerTurn, isBattleOver, playerIsHit, enemyIsHit, isPlayerAttacking, isEnemyAttacking } = battleState;
  const [uiState, setUiState] = useState<'main' | 'moves'>('main');
  const [hoveredMove, setHoveredMove] = useState<Move | null>(null);

  useEffect(() => {
    if (isPlayerTurn && !isProcessing) {
      setUiState('main');
    }
  }, [isPlayerTurn, isProcessing]);

  if (!playerGijimon || !enemyGijimon) {
    return <div className="w-full h-full flex items-center justify-center">バトル情報を読み込み中...</div>;
  }

  const renderCommandUI = () => {
    if (isBattleOver || !isPlayerTurn || isProcessing) {
      return <MessageBox message={message} />;
    }

    const commandMessage = uiState === 'main' ? `${playerGijimon.name} は どうする？` : 'どの技を使う？';

    return (
      <div className="w-full h-full flex bg-white border-4 border-blue-800 rounded-lg text-black font-bold shadow-inner">
        <div className="w-1/2 p-2 text-lg flex flex-col justify-center">
        {uiState === 'moves' && hoveredMove ? (
          <div className="space-y-1">
            <MoveTooltip move={hoveredMove} targetType={enemyGijimon.type} />
            <BattlePredictor 
              playerMove={hoveredMove} 
              playerGijimon={playerGijimon} 
              enemyGijimon={enemyGijimon} 
            />
          </div>
        ) : (
          <p className="p-1">{commandMessage}</p>
        )}
        </div>
        <div className="w-1/2 border-l-4 border-blue-800 p-2">
          {uiState === 'main' && (
            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
              <button onClick={() => setUiState('moves')} className="bg-gray-100 border-2 border-gray-400 rounded-md hover:bg-yellow-200">たたかう</button>
              <button className="bg-gray-400 border-2 border-gray-500 rounded-md text-gray-600" disabled>どうぐ</button>
              <button className="bg-gray-400 border-2 border-gray-500 rounded-md text-gray-600" disabled>いれかえ</button>
              <button onClick={() => navigate('/menu')} className="bg-gray-100 border-2 border-gray-400 rounded-md hover:bg-yellow-200">にげる</button>
            </div>
          )}
          {uiState === 'moves' && (
            <div className="grid grid-cols-2 gap-2 h-full">
              {playerGijimon.moves.map(move => (
                <div
                  key={move.name}
                  onMouseEnter={() => setHoveredMove(move)}
                  onMouseLeave={() => setHoveredMove(null)}
                  className="w-full h-full"
                >
                  <button
                    onClick={() => processTurn(move)}
                    className="w-full h-full bg-gray-100 border-2 border-gray-400 rounded-md text-black font-bold flex flex-col items-center justify-center hover:bg-yellow-200 text-sm p-1"
                  >
                    <span>{move.name}</span>
                    <TypeBadge type={move.type} className="text-xs mt-1" />
                  </button>
                </div>
              ))}
               {playerGijimon.moves.length < 4 && Array(4 - playerGijimon.moves.length).fill(0).map((_, i) => <div key={i} className="bg-gray-800 border-2 border-gray-600 rounded-md"></div>)}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full h-full bg-no-repeat bg-cover bg-center flex flex-col relative" style={{ backgroundImage: "url('https://i.imgur.com/8z8n2fF.png')" }}>
      <div className="flex-grow relative">
        <EnemyStatus gijimon={enemyGijimon} />
        <img src={enemyGijimon.gijimonImage} alt={enemyGijimon.name} className={`absolute top-[15%] right-[10%] w-2/5 max-w-[200px] h-auto transition-opacity duration-200 ${enemyIsHit ? 'animate-hit' : ''} ${isEnemyAttacking ? 'animate-enemy-attack' : ''}`} />

        <PlayerStatus gijimon={playerGijimon} />
        <img src={playerGijimon.gijimonImage} alt={playerGijimon.name} className={`absolute bottom-36 left-[10%] w-[45%] max-w-[280px] h-auto transition-opacity duration-200 ${playerIsHit ? 'animate-hit' : ''} ${isPlayerAttacking ? 'animate-player-attack' : ''}`} style={{ transform: 'scaleX(-1)' }}/>
      </div>

      <div className="flex-shrink-0 h-36 bg-gray-800 p-2">
        {renderCommandUI()}
      </div>
    </div>
  );
};

export default BattleScreen;

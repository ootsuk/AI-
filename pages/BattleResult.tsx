import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Gijimon, Stats } from '../types';
import { useGameState } from '../context/GameStateContext';
import { evolveGijimonImage } from '../services/geminiService';
import LoadingOverlay from '../components/LoadingOverlay';

type Phase = 'start' | 'exp' | 'levelup' | 'stats' | 'evolution_check' | 'evolving' | 'evolved' | 'done';

const StatIncreaseRow: React.FC<{ label: string, increase: number }> = ({ label, increase }) => (
  <div className="flex justify-between w-full text-xl">
    <span>{label}</span>
    <span className="font-bold text-green-400">+{increase}</span>
  </div>
);


const BattleResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateGijimon } = useGameState();
  const { playerWon, playerGijimon, enemyGijimon } = location.state as { playerWon: boolean; playerGijimon: Gijimon; enemyGijimon: Gijimon };

  const [phase, setPhase] = useState<Phase>('start');
  const [message, setMessage] = useState('');
  const [expGained, setExpGained] = useState(0);
  const [levelUps, setLevelUps] = useState(0);
  const [statIncreases, setStatIncreases] = useState<Partial<Stats>>({});
  const [finalGijimon, setFinalGijimon] = useState<Gijimon>(playerGijimon);
  const [isProcessing, setIsProcessing] = useState(false);

  const EVOLUTION_LEVEL = 15;

  const originalGijimon = useMemo(() => playerGijimon, [playerGijimon]);

  useEffect(() => {
    if (phase !== 'start' || !playerWon) return;

    const processResults = async () => {
      // For testing, give enough EXP to evolve
      const calculatedExp = playerGijimon.level < EVOLUTION_LEVEL ? 9999 : 100;
      setExpGained(calculatedExp);
      setMessage(`${playerGijimon.name} は ${calculatedExp} の経験値を獲得した！`);
      setPhase('exp');
      await new Promise(res => setTimeout(res, 2000));

      let gijimonCopy = { ...playerGijimon, stats: { ...playerGijimon.stats } };
      let currentExp = gijimonCopy.exp + calculatedExp;
      let levelsGained = 0;
      let totalStatIncreases: Stats = { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 };
      
      while (currentExp >= gijimonCopy.expToNextLevel && gijimonCopy.level < 100) {
        levelsGained++;
        currentExp -= gijimonCopy.expToNextLevel;
        gijimonCopy.level++;
        gijimonCopy.expToNextLevel = Math.floor(gijimonCopy.expToNextLevel * 1.2);

        const hpUp = Math.floor(originalGijimon.stats.hp / 20) + 1;
        const otherUp = Math.floor(originalGijimon.stats.attack / 25) + 1;
        
        gijimonCopy.stats.hp += hpUp;
        totalStatIncreases.hp += hpUp;
        
        gijimonCopy.stats.attack += otherUp;
        totalStatIncreases.attack += otherUp;
        
        gijimonCopy.stats.defense += otherUp;
        totalStatIncreases.defense += otherUp;

        gijimonCopy.stats.specialAttack += otherUp;
        totalStatIncreases.specialAttack += otherUp;

        gijimonCopy.stats.specialDefense += otherUp;
        totalStatIncreases.specialDefense += otherUp;

        gijimonCopy.stats.speed += otherUp;
        totalStatIncreases.speed += otherUp;
      }
      gijimonCopy.exp = currentExp;

      if (levelsGained > 0) {
        setLevelUps(levelsGained);
        setStatIncreases(totalStatIncreases);
        setMessage(`${playerGijimon.name} は レベルが ${levelsGained} あがった！`);
        setPhase('levelup');
        await new Promise(res => setTimeout(res, 2000));
        
        setPhase('stats');
        await new Promise(res => setTimeout(res, 3000));
      }
      
      setFinalGijimon(gijimonCopy);
      setPhase('evolution_check');
    };

    processResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, playerWon]);

  useEffect(() => {
    if (phase !== 'evolution_check') return;

    const evolutionCheck = async () => {
        const canEvolve = originalGijimon.level < EVOLUTION_LEVEL && finalGijimon.level >= EVOLUTION_LEVEL;
        
        if (canEvolve) {
            setMessage(`おや・・・？ ${finalGijimon.name} の様子が・・・！`);
            setPhase('evolving');
            setIsProcessing(true);
            try {
                const { newImage, newName } = await evolveGijimonImage(finalGijimon);
                
                const evolvedGijimon = {
                    ...finalGijimon,
                    name: newName,
                    gijimonImage: newImage,
                    // Boost stats on evolution
                    stats: {
                        hp: finalGijimon.stats.hp + 20,
                        attack: finalGijimon.stats.attack + 10,
                        defense: finalGijimon.stats.defense + 10,
                        specialAttack: finalGijimon.stats.specialAttack + 10,
                        specialDefense: finalGijimon.stats.specialDefense + 10,
                        speed: finalGijimon.stats.speed + 10,
                    }
                };
                
                setFinalGijimon(evolvedGijimon);
                setMessage(`おめでとう！ ${originalGijimon.name} は ${newName} に進化した！`);
                setPhase('evolved');
                
            } catch(error) {
                console.error("Evolution failed:", error);
                setMessage("進化に失敗しました...");
                setPhase('done');
            } finally {
                setIsProcessing(false);
            }
        } else {
            setPhase('done');
        }
    };
    evolutionCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, finalGijimon, originalGijimon]);


  useEffect(() => {
    if (phase === 'done' || phase === 'evolved') {
        updateGijimon(finalGijimon);
    }
  }, [phase, finalGijimon, updateGijimon]);

  const renderContent = () => {
    if (!playerWon) {
      return (
        <>
          <h1 className="text-6xl font-extrabold font-dotgothic mb-8">敗北...</h1>
          <button onClick={() => navigate('/menu')} className="mt-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl py-4 px-8 rounded-lg border-b-4 border-blue-800 active:border-b-0 transition-all">
            メインメニューへ
          </button>
        </>
      );
    }

    switch(phase) {
      case 'start':
      case 'exp':
      case 'levelup':
        return <h1 className="text-4xl font-bold font-dotgothic animate-pulse">{message}</h1>;
      
      case 'stats':
        return (
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md text-left">
            <h2 className="text-3xl font-bold mb-4 text-center">ステータスアップ！</h2>
            {/* FIX: Add type guard to ensure `value` is a number before comparison. */}
            {Object.entries(statIncreases).map(([key, value]) => 
              typeof value === 'number' && value > 0 && <StatIncreaseRow key={key} label={key.toUpperCase()} increase={value} />
            )}
          </div>
        );
      
      case 'evolving':
        return <LoadingOverlay message={message} />;

      case 'evolved':
          return (
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold font-dotgothic mb-4">{message}</h1>
                <img src={finalGijimon.gijimonImage} alt={finalGijimon.name} className="w-64 h-64 object-contain mb-4 animate-pulse" />
                <button onClick={() => setPhase('done')} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl py-4 px-8 rounded-lg border-b-4 border-blue-800 active:border-b-0 transition-all">
                    OK
                </button>
            </div>
          );

      case 'done':
        return (
          <div className="flex flex-col items-center">
             <h1 className="text-6xl font-extrabold font-dotgothic mb-8">勝利！</h1>
             <p className="text-2xl mb-4">{finalGijimon.name} は強くなった！</p>
             <button onClick={() => navigate('/menu')} className="mt-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl py-4 px-8 rounded-lg border-b-4 border-blue-800 active:border-b-0 transition-all">
                メインメニューへ
             </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center p-8 text-center text-white relative">
      {isProcessing && phase !== 'evolving' && <LoadingOverlay message="けいさんちゅう..." />}
      {renderContent()}
    </div>
  );
};

export default BattleResult;

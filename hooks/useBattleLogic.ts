import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Gijimon, Move, BattleState } from '../types';
import { MoveCategory } from '../types';
import { getTypeEffectiveness } from '../constants/typeChart';

const calculateDamage = (attacker: Gijimon, defender: Gijimon, move: Move): { damage: number; effectiveness: number; isCritical: boolean } => {
  if (move.power === 0) return { damage: 0, effectiveness: 1, isCritical: false };

  const isSpecial = move.category === MoveCategory.Special;
  const attackStat = isSpecial ? attacker.stats.specialAttack : attacker.stats.attack;
  const defenseStat = isSpecial ? defender.stats.specialDefense : defender.stats.defense;

  const effectiveness = getTypeEffectiveness(move.type, defender.type);
  
  const highCritRate = move.effect.includes('急所に当たりやすい');
  const critChance = highCritRate ? 1 / 4 : 1 / 16;
  const isCritical = Math.random() < critChance;
  const critMultiplier = isCritical ? 1.5 : 1;

  const baseDamage = (((2 * attacker.level) / 5 + 2) * move.power * (attackStat / defenseStat)) / 50 + 2;
  const randomFactor = Math.random() * (1 - 0.85) + 0.85;
  const finalDamage = Math.floor(baseDamage * effectiveness * randomFactor * critMultiplier);
  
  return { damage: finalDamage, effectiveness, isCritical };
};

export const useBattleLogic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = location.state as { playerGijimon: Gijimon; enemyGijimon: Gijimon };

  const [battleState, setBattleState] = useState<BattleState>({
    playerGijimon: initialState.playerGijimon,
    enemyGijimon: initialState.enemyGijimon,
    isPlayerTurn: initialState.playerGijimon.stats.speed >= initialState.enemyGijimon.stats.speed,
    message: `野生の ${initialState.enemyGijimon.name} が現れた！`,
    isBattleOver: false,
    playerWon: null,
    playerIsHit: false,
    enemyIsHit: false,
    isPlayerAttacking: false,
    isEnemyAttacking: false,
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const processTurn = useCallback(async (playerMove?: Move) => {
    if (isProcessing || battleState.isBattleOver) return;
    setIsProcessing(true);

    const isPlayerTurn = battleState.isPlayerTurn;
    const attacker = isPlayerTurn ? battleState.playerGijimon : battleState.enemyGijimon;
    const defender = isPlayerTurn ? battleState.enemyGijimon : battleState.playerGijimon;
    const move = isPlayerTurn ? playerMove : attacker.moves[Math.floor(Math.random() * attacker.moves.length)];

    if (!move) {
      setIsProcessing(false);
      return;
    }
    
    // 1. Attack message & animation
    setBattleState(prev => ({ 
      ...prev, 
      message: `${attacker.name} の ${move.name}！`,
      isPlayerAttacking: isPlayerTurn,
      isEnemyAttacking: !isPlayerTurn,
    }));
    await new Promise(res => setTimeout(res, 500)); // Animation duration

    setBattleState(prev => ({ ...prev, isPlayerAttacking: false, isEnemyAttacking: false }));
    
    // 2. Calculate damage and apply it
    const { damage, effectiveness, isCritical } = calculateDamage(attacker, defender, move);
    const newDefenderHp = Math.max(0, defender.currentHp - damage);

    if (isPlayerTurn) {
        setBattleState(prev => ({ ...prev, enemyGijimon: { ...prev.enemyGijimon, currentHp: newDefenderHp }, enemyIsHit: damage > 0 }));
    } else {
        setBattleState(prev => ({ ...prev, playerGijimon: { ...prev.playerGijimon, currentHp: newDefenderHp }, playerIsHit: damage > 0 }));
    }
    
    await new Promise(res => setTimeout(res, 400)); // Hit animation duration
    setBattleState(prev => ({ ...prev, playerIsHit: false, enemyIsHit: false }));
    
    // 3. Display messages (critical, effectiveness)
    if (isCritical) {
      setBattleState(prev => ({ ...prev, message: `急所に 当たった！` }));
      await new Promise(res => setTimeout(res, 1000));
    }

    if (effectiveness > 1) {
        setBattleState(prev => ({ ...prev, message: `効果は抜群だ！` }));
        await new Promise(res => setTimeout(res, 1000));
    } else if (effectiveness < 1) {
        setBattleState(prev => ({ ...prev, message: `効果は今ひとつのようだ...` }));
        await new Promise(res => setTimeout(res, 1000));
    }

    // 4. Check for faint
    if (newDefenderHp === 0) {
      setBattleState(prev => ({
        ...prev,
        message: `${defender.name} は倒れた！`,
        isBattleOver: true,
        playerWon: isPlayerTurn,
      }));
      setIsProcessing(false);
      setTimeout(() => navigate('/battle/result', { state: { playerWon: isPlayerTurn, playerGijimon: battleState.playerGijimon, enemyGijimon: battleState.enemyGijimon } }), 2000);
      return;
    }

    // 5. Switch turn
    setBattleState(prev => ({ ...prev, isPlayerTurn: !prev.isPlayerTurn }));
    setIsProcessing(false);

  }, [battleState, isProcessing, navigate]);

  useEffect(() => {
    if (!battleState.isPlayerTurn && !battleState.isBattleOver && !isProcessing) {
      const timer = setTimeout(() => processTurn(), 1500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleState.isPlayerTurn, battleState.isBattleOver, isProcessing]);
  
  return { battleState, isProcessing, processTurn };
};
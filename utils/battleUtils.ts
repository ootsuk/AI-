import type { Gijimon, Move } from '../types';
import { MoveCategory } from '../types';
import { getTypeEffectiveness } from '../constants/typeChart';

export const calculateDamage = (attacker: Gijimon, defender: Gijimon, move: Move): { damage: number; effectiveness: number; isCritical: boolean } => {
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

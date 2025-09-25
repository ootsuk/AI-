
import { GijimonType } from '../types';

type TypeChart = {
  [key in GijimonType]?: { [key in GijimonType]?: number };
};

export const TYPE_CHART: TypeChart = {
  [GijimonType.Fire]: { [GijimonType.Water]: 0.5, [GijimonType.Grass]: 2, [GijimonType.Fire]: 0.5 },
  [GijimonType.Water]: { [GijimonType.Fire]: 2, [GijimonType.Grass]: 0.5, [GijimonType.Water]: 0.5 },
  [GijimonType.Grass]: { [GijimonType.Fire]: 0.5, [GijimonType.Water]: 2, [GijimonType.Flying]: 0.5 },
  [GijimonType.Electric]: { [GijimonType.Water]: 2, [GijimonType.Flying]: 2, [GijimonType.Grass]: 0.5 },
  [GijimonType.Fighting]: { [GijimonType.Normal]: 2, [GijimonType.Flying]: 0.5, [GijimonType.Psychic]: 0.5 },
  [GijimonType.Flying]: { [GijimonType.Grass]: 2, [GijimonType.Fighting]: 2, [GijimonType.Electric]: 0.5 },
  [GijimonType.Psychic]: { [GijimonType.Fighting]: 2 },
  [GijimonType.Normal]: {},
};

export const getTypeEffectiveness = (moveType: GijimonType, defenderType: GijimonType): number => {
  return TYPE_CHART[moveType]?.[defenderType] ?? 1;
};

export const TYPE_COLORS: { [key in GijimonType]: string } = {
  [GijimonType.Normal]: 'bg-gray-400 text-black',
  [GijimonType.Fire]: 'bg-red-500 text-white',
  [GijimonType.Water]: 'bg-blue-500 text-white',
  [GijimonType.Grass]: 'bg-green-500 text-white',
  [GijimonType.Electric]: 'bg-yellow-400 text-black',
  [GijimonType.Fighting]: 'bg-orange-700 text-white',
  [GijimonType.Flying]: 'bg-indigo-400 text-white',
  [GijimonType.Psychic]: 'bg-pink-500 text-white',
  [GijimonType.Poison]: 'bg-purple-600 text-white',
  [GijimonType.Ground]: 'bg-yellow-600 text-white',
  [GijimonType.Rock]: 'bg-yellow-700 text-white',
  [GijimonType.Bug]: 'bg-lime-500 text-black',
  [GijimonType.Ghost]: 'bg-indigo-800 text-white',
  [GijimonType.Ice]: 'bg-cyan-300 text-black',
  [GijimonType.Dragon]: 'bg-indigo-600 text-white',
  [GijimonType.Steel]: 'bg-gray-500 text-white',
  [GijimonType.Dark]: 'bg-gray-800 text-white',
  [GijimonType.Fairy]: 'bg-pink-300 text-black',
};

export enum GijimonType {
  Normal = 'ノーマル',
  Fire = 'ほのお',
  Water = 'みず',
  Grass = 'くさ',
  Electric = 'でんき',
  Fighting = 'かくとう',
  Flying = 'ひこう',
  Psychic = 'エスパー',
  Poison = 'どく',
  Ground = 'じめん',
  Rock = 'いわ',
  Bug = 'むし',
  Ghost = 'ゴースト',
  Ice = 'こおり',
  Dragon = 'ドラゴン',
  Steel = 'はがね',
  Dark = 'あく',
  Fairy = 'フェアリー',
}

export enum MoveCategory {
  Physical = '物理',
  Special = '特殊',
  Status = '変化',
}

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface Move {
  name: string;
  type: GijimonType;
  category: MoveCategory;
  power: number;
  accuracy: number;
  effect: string;
  isRare: boolean;
}

export interface Gijimon {
  id: string;
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  baseImage: string; // base64
  gijimonImage: string; // base64
  type: GijimonType;
  stats: Stats;
  currentHp: number;
  moves: Move[];
  description: string;
}

export interface BattleState {
  playerGijimon: Gijimon;
  enemyGijimon: Gijimon;
  isPlayerTurn: boolean;
  message: string;
  isBattleOver: boolean;
  playerWon: boolean | null;
  playerIsHit: boolean;
  enemyIsHit: boolean;
  isPlayerAttacking: boolean;
  isEnemyAttacking: boolean;
}
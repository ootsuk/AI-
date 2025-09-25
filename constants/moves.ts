
import { GijimonType, MoveCategory, type Move } from '../types';

export const ALL_MOVES: Move[] = [
  { name: 'たいあたり', type: GijimonType.Normal, category: MoveCategory.Physical, power: 40, accuracy: 100, effect: '追加効果なし', isRare: false },
  { name: 'でんこうせっか', type: GijimonType.Normal, category: MoveCategory.Physical, power: 40, accuracy: 100, effect: '必ず先制攻撃できる', isRare: false },
  { name: 'はかいこうせん', type: GijimonType.Normal, category: MoveCategory.Special, power: 150, accuracy: 90, effect: '使用後、次のターンは動けない', isRare: true },
  { name: 'ひのこ', type: GijimonType.Fire, category: MoveCategory.Special, power: 40, accuracy: 100, effect: '10%の確率で相手をやけど状態にする', isRare: false },
  { name: 'かえんほうしゃ', type: GijimonType.Fire, category: MoveCategory.Special, power: 90, accuracy: 100, effect: '10%の確率で相手をやけど状態にする', isRare: false },
  { name: 'だいもんじ', type: GijimonType.Fire, category: MoveCategory.Special, power: 110, accuracy: 85, effect: '10%の確率で相手をやけど状態にする', isRare: true },
  { name: 'みずでっぽう', type: GijimonType.Water, category: MoveCategory.Special, power: 40, accuracy: 100, effect: '追加効果なし', isRare: false },
  { name: 'なみのり', type: GijimonType.Water, category: MoveCategory.Special, power: 90, accuracy: 100, effect: '追加効果なし', isRare: false },
  { name: 'ハイドロポンプ', type: GijimonType.Water, category: MoveCategory.Special, power: 110, accuracy: 80, effect: '追加効果なし', isRare: true },
  { name: 'つるのムチ', type: GijimonType.Grass, category: MoveCategory.Physical, power: 45, accuracy: 100, effect: '追加効果なし', isRare: false },
  { name: 'はっぱカッター', type: GijimonType.Grass, category: MoveCategory.Physical, power: 55, accuracy: 95, effect: '急所に当たりやすい', isRare: false },
  { name: 'ソーラービーム', type: GijimonType.Grass, category: MoveCategory.Special, power: 120, accuracy: 100, effect: '1ターン目に溜め、2ターン目に攻撃', isRare: true },
  { name: 'でんきショック', type: GijimonType.Electric, category: MoveCategory.Special, power: 40, accuracy: 100, effect: '10%の確率で相手をまひ状態にする', isRare: false },
  { name: '10まんボルト', type: GijimonType.Electric, category: MoveCategory.Special, power: 90, accuracy: 100, effect: '10%の確率で相手をまひ状態にする', isRare: false },
  { name: 'かみなり', type: GijimonType.Electric, category: MoveCategory.Special, power: 110, accuracy: 70, effect: '30%の確率で相手をまひ状態にする', isRare: true },
  { name: 'からてチョップ', type: GijimonType.Fighting, category: MoveCategory.Physical, power: 50, accuracy: 100, effect: '急所に当たりやすい', isRare: false },
  { name: 'マッハパンチ', type: GijimonType.Fighting, category: MoveCategory.Physical, power: 40, accuracy: 100, effect: '必ず先制攻撃できる', isRare: false },
  { name: 'インファイト', type: GijimonType.Fighting, category: MoveCategory.Physical, power: 120, accuracy: 100, effect: '使用後、自分のぼうぎょ・とくぼうが下がる', isRare: true },
  { name: 'つばさでうつ', type: GijimonType.Flying, category: MoveCategory.Physical, power: 60, accuracy: 100, effect: '追加効果なし', isRare: false },
  { name: 'エアカッター', type: GijimonType.Flying, category: MoveCategory.Special, power: 60, accuracy: 95, effect: '急所に当たりやすい', isRare: false },
  { name: 'ブレイブバード', type: GijimonType.Flying, category: MoveCategory.Physical, power: 120, accuracy: 100, effect: '与えたダメージの1/3自分も受ける', isRare: true },
  { name: 'ねんりき', type: GijimonType.Psychic, category: MoveCategory.Special, power: 50, accuracy: 100, effect: '10%の確率で相手をこんらん状態にする', isRare: false },
  { name: 'サイコキネシス', type: GijimonType.Psychic, category: MoveCategory.Special, power: 90, accuracy: 100, effect: '10%の確率で相手のとくぼうを下げる', isRare: false },
  { name: 'じこさいせい', type: GijimonType.Normal, category: MoveCategory.Status, power: 0, accuracy: 100, effect: '自分のHPを最大HPの半分回復する', isRare: true },
];

export const getMoveByName = (name: string): Move | undefined => {
  return ALL_MOVES.find(move => move.name === name);
};

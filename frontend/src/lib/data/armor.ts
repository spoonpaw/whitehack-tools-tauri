/**
 * armor.ts - Preset armor data from Whitehack rules
 */

export interface PresetArmor {
  name: string;
  df: number;
  weight: number;
  special: string;
  isShield: boolean;
}

export const PRESET_ARMOR: PresetArmor[] = [
  { name: 'Shield', df: 1, weight: 1, special: '', isShield: true },
  { name: 'Cloth', df: 1, weight: 1, special: '', isShield: false },
  { name: 'Leather', df: 2, weight: 2, special: '', isShield: false },
  { name: 'Hard leather', df: 3, weight: 3, special: '', isShield: false },
  { name: 'Chainmail', df: 4, weight: 4, special: '', isShield: false },
  { name: 'Splint mail', df: 5, weight: 5, special: '', isShield: false },
  { name: 'Full plate', df: 6, weight: 6, special: '', isShield: false }
];

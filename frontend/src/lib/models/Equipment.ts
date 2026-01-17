/**
 * Equipment.ts - Equipment type definitions (Weapons, Armor, Gear)
 */

import type { WeightCategory } from './Enums';

// ============================================
// WEAPONS
// ============================================

export interface Weapon {
  id: string;
  name: string;
  damage: string; // e.g., "1d6", "1d8+1"
  weight: WeightCategory;
  range: string;
  rateOfFire: string;
  special: string;
  isEquipped: boolean;
  isStashed: boolean;
  isMagical: boolean;
  isCursed: boolean;
  bonus: number;
  quantity: number;
}

export function createDefaultWeapon(): Weapon {
  return {
    id: crypto.randomUUID(),
    name: '',
    damage: '',
    weight: 'Regular',
    range: 'N/A',
    rateOfFire: 'N/A',
    special: '',
    isEquipped: false,
    isStashed: false,
    isMagical: false,
    isCursed: false,
    bonus: 0,
    quantity: 1
  };
}

// ============================================
// ARMOR
// ============================================

export interface Armor {
  id: string;
  name: string;
  df: number; // Defense Factor
  weight: number; // Slots
  special: string;
  quantity: number;
  isEquipped: boolean;
  isStashed: boolean;
  isMagical: boolean;
  isCursed: boolean;
  bonus: number;
  isShield: boolean; // Shield vs body armor
}

export function createDefaultArmor(): Armor {
  return {
    id: crypto.randomUUID(),
    name: '',
    df: 0,
    weight: 1,
    special: '',
    quantity: 1,
    isEquipped: false,
    isStashed: false,
    isMagical: false,
    isCursed: false,
    bonus: 0,
    isShield: false
  };
}

// ============================================
// GEAR
// ============================================

export interface Gear {
  id: string;
  name: string;
  weight: WeightCategory;
  special: string;
  quantity: number;
  isEquipped: boolean;
  isStashed: boolean;
  isMagical: boolean;
  isCursed: boolean;
  isContainer: boolean;
}

export function createDefaultGear(): Gear {
  return {
    id: crypto.randomUUID(),
    name: '',
    weight: 'Minor',
    special: '',
    quantity: 1,
    isEquipped: false,
    isStashed: false,
    isMagical: false,
    isCursed: false,
    isContainer: false
  };
}

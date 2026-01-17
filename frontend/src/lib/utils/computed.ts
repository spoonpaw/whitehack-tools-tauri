/**
 * computed.ts - Computed value utilities
 */

import type { CharacterClass, PlayerCharacter, WeightCategory } from '$lib/models';
import type { Armor, Gear } from '$lib/models';
import { WEIGHT_VALUES } from '$lib/models';
import { getAttackValue, getSaveValue, xpRequirement, getStats } from './AdvancementTables';

/**
 * Compute the attack value for a character
 * Strong class gets +1 AV if STR >= 13
 */
export function computeAttackValue(
  characterClass: CharacterClass,
  level: number,
  strength: number
): number {
  const baseAV = getAttackValue(characterClass, level);
  if (characterClass === 'Strong' && strength >= 13) {
    return baseAV + 1;
  }
  return baseAV;
}

/**
 * Compute the save value for a character
 */
export function computeSaveValue(characterClass: CharacterClass, level: number): number {
  return getSaveValue(characterClass, level);
}

/**
 * Compute total defense value from equipped armor
 */
export function computeDefenseValue(armor: Armor[]): number {
  return armor
    .filter((a) => a.isEquipped)
    .reduce((sum, a) => sum + a.df + a.bonus, 0);
}

/**
 * Compute initiative bonus based on agility
 * Returns 0 if using custom attributes
 */
export function computeInitiativeBonus(agility: number, useCustomAttributes: boolean): number {
  if (useCustomAttributes) return 0;
  if (agility >= 16) return 2;
  if (agility >= 13) return 1;
  return 0;
}

/**
 * Compute current encumbrance from gear
 */
export function computeEncumbrance(gear: Gear[]): number {
  return gear
    .filter((g) => !g.isStashed)
    .reduce((sum, g) => {
      const weightValue = WEIGHT_VALUES[g.weight] ?? 0;
      return sum + weightValue * g.quantity;
    }, 0);
}

/**
 * Get attribute modifier description
 */
export function getAttributeDescription(value: number): string {
  if (value >= 16) return 'Exceptional (+2)';
  if (value >= 13) return 'Above Average (+1)';
  if (value >= 8) return 'Average';
  if (value >= 6) return 'Below Average (-1)';
  return 'Poor (-2)';
}

/**
 * Get attribute modifier value
 */
export function getAttributeModifier(value: number): number {
  if (value >= 16) return 2;
  if (value >= 13) return 1;
  if (value >= 8) return 0;
  if (value >= 6) return -1;
  return -2;
}

/**
 * Get XP progress information for a character
 */
export interface XPProgress {
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
}

export function getXPProgress(character: PlayerCharacter): XPProgress {
  const currentXP = character.experience;
  const level = character.level;
  
  // Max level is 10
  if (level >= 10) {
    return {
      currentXP,
      xpForCurrentLevel: xpRequirement(character.characterClass, 10),
      xpForNextLevel: xpRequirement(character.characterClass, 10),
      xpToNextLevel: 0,
      progressPercent: 100
    };
  }

  const xpForCurrentLevel = xpRequirement(character.characterClass, level);
  const xpForNextLevel = xpRequirement(character.characterClass, level + 1);
  const xpToNextLevel = Math.max(0, xpForNextLevel - currentXP);
  
  const xpInLevel = currentXP - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = xpNeededForLevel > 0 
    ? Math.min(100, Math.max(0, (xpInLevel / xpNeededForLevel) * 100))
    : 0;

  return {
    currentXP,
    xpForCurrentLevel,
    xpForNextLevel,
    xpToNextLevel,
    progressPercent
  };
}

/**
 * Get advancement stats for a character class and level
 */
export function getAdvancementStats(characterClass: CharacterClass, level: number) {
  return getStats(characterClass, level);
}

/**
 * Burden levels for encumbrance
 */
export type BurdenLevel = 'Normal' | 'Heavy' | 'Severe' | 'Massive';

export interface BurdenInfo {
  level: BurdenLevel;
  title: string;
  description: string;
  color: string;
  index: number;
}

export const BURDEN_LEVELS: Record<BurdenLevel, BurdenInfo> = {
  Normal: { level: 'Normal', title: 'Normal', description: 'Moving freely', color: '#22c55e', index: 0 },
  Heavy: { level: 'Heavy', title: 'Heavy', description: 'Slightly encumbered', color: '#eab308', index: 1 },
  Severe: { level: 'Severe', title: 'Severe', description: 'Heavily encumbered', color: '#f97316', index: 2 },
  Massive: { level: 'Massive', title: 'Massive', description: 'Severely encumbered', color: '#ef4444', index: 3 },
};

/**
 * Calculate encumbrance breakdown for a character
 */
export interface EncumbranceBreakdown {
  regular: number;
  heavy: number;
  total: number;
  usedSlots: number;
  maxSlots: number;
  availableSlots: number;
  excessSlots: number;
  hasContainer: boolean;
  burdenLevel: BurdenLevel;
  burdenInfo: BurdenInfo;
  movementRates: { burden: BurdenLevel; move: string; crawl: string; isCurrent: boolean }[];
  movementOptions: { type: string; speed: string; isCurrent: boolean }[];
  baseMovement: number;
  currentMoveRate: number;
}

/**
 * Convert weight string to slot value
 */
function getWeightSlots(weight: WeightCategory | string | number): number {
  if (typeof weight === 'number') return weight;
  switch (weight?.toLowerCase()) {
    case 'no size': return 0.01; // Will be counted in groups of 100
    case 'minor': return 0.5;
    case 'regular': return 1.0;
    case 'heavy': return 2.0;
    default: return 1.0;
  }
}

export function calculateEncumbrance(character: PlayerCharacter): EncumbranceBreakdown {
  let regular = 0;
  let heavy = 0;
  let usedSlots = 0;

  // Helper to check weight category
  const isHeavy = (weight: WeightCategory | number): boolean => {
    if (typeof weight === 'string') return weight === 'Heavy';
    return weight >= 20;
  };
  
  const isRegular = (weight: WeightCategory | number): boolean => {
    if (typeof weight === 'string') return weight === 'Regular';
    return weight >= 10 && weight < 20;
  };

  // Count weapons
  for (const weapon of character.weapons) {
    if (!weapon.isStashed) {
      const slots = getWeightSlots(weapon.weight) * weapon.quantity;
      usedSlots += slots;
      if (isHeavy(weapon.weight)) heavy++;
      else if (isRegular(weapon.weight)) regular++;
    }
  }

  // Count armor (armor.weight is a number representing slots)
  for (const armor of character.armor) {
    if (!armor.isStashed) {
      const slots = armor.weight * armor.quantity;
      usedSlots += slots;
      if (armor.weight > 2) heavy++;
      else if (armor.weight >= 1) regular++;
    }
  }

  // Count gear
  for (const gear of character.gear) {
    if (!gear.isStashed) {
      const slots = getWeightSlots(gear.weight) * gear.quantity;
      usedSlots += slots;
      const count = gear.quantity;
      if (isHeavy(gear.weight)) heavy += count;
      else if (isRegular(gear.weight)) regular += count;
    }
  }

  // Add coins (100 coins = 1 slot)
  usedSlots += character.coinsOnHand / 100.0;

  // Check if character has an equipped container
  const hasContainer = character.gear.some(g => g.isContainer && g.isEquipped);
  const maxSlots = hasContainer ? 15 : 10;
  const availableSlots = Math.max(0, maxSlots - usedSlots);
  const excessSlots = Math.max(0, usedSlots - maxSlots);

  // Calculate burden level based on excess slots
  const drops = Math.min(3, Math.floor((excessSlots + 1) / 2));
  let burdenLevel: BurdenLevel;
  switch (drops) {
    case 0: burdenLevel = 'Normal'; break;
    case 1: burdenLevel = 'Heavy'; break;
    case 2: burdenLevel = 'Severe'; break;
    default: burdenLevel = 'Massive'; break;
  }

  // Get base movement from character (default 25)
  const baseMovement = character.movement ?? 25;

  // Calculate movement rates for all burden levels
  const allBurdens: BurdenLevel[] = ['Normal', 'Heavy', 'Severe', 'Massive'];
  const movementRates = allBurdens.map((burden, idx) => ({
    burden,
    move: `${baseMovement - (idx * 5)} ft/r`,
    crawl: `${120 - (idx * 20)} ft`,
    isCurrent: burden === burdenLevel
  }));

  // Get current movement rate
  const currentMoveRate = baseMovement - (BURDEN_LEVELS[burdenLevel].index * 5);

  // Movement options for combat
  const movementOptions = [
    { type: 'Careful', speed: `${currentMoveRate - 10} ft/r`, isCurrent: false },
    { type: 'Normal', speed: `${currentMoveRate} ft/r`, isCurrent: true },
    { type: 'Running', speed: `${currentMoveRate * 2} ft/r`, isCurrent: false },
  ];

  return {
    regular,
    heavy,
    total: regular + heavy * 2,
    usedSlots,
    maxSlots,
    availableSlots,
    excessSlots,
    hasContainer,
    burdenLevel,
    burdenInfo: BURDEN_LEVELS[burdenLevel],
    movementRates,
    movementOptions,
    baseMovement,
    currentMoveRate
  };
}

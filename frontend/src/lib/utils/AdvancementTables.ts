/**
 * AdvancementTables.ts - Level progression data for all character classes
 */

import type { CharacterClass } from '$lib/models';

// ============================================
// CHARACTER STATS STRUCTURE
// ============================================

export interface CharacterStats {
  hitDice: string;
  attackValue: number;
  savingValue: number;
  slots: number;
  groups: number;
  raises: string; // "-" for level 1, numbers for higher levels
}

// ============================================
// STAT PROGRESSIONS BY CLASS
// ============================================

const STAT_PROGRESSIONS: Record<CharacterClass, Record<number, CharacterStats>> = {
  Deft: {
    1: { hitDice: '1', attackValue: 10, savingValue: 7, slots: 1, groups: 2, raises: '-' },
    2: { hitDice: '2', attackValue: 11, savingValue: 8, slots: 1, groups: 2, raises: '1' },
    3: { hitDice: '2+1', attackValue: 11, savingValue: 9, slots: 1, groups: 3, raises: '1' },
    4: { hitDice: '3', attackValue: 12, savingValue: 10, slots: 2, groups: 3, raises: '2' },
    5: { hitDice: '3+1', attackValue: 12, savingValue: 11, slots: 2, groups: 4, raises: '2' },
    6: { hitDice: '4', attackValue: 13, savingValue: 12, slots: 2, groups: 4, raises: '3' },
    7: { hitDice: '4+1', attackValue: 13, savingValue: 13, slots: 3, groups: 5, raises: '3' },
    8: { hitDice: '5', attackValue: 14, savingValue: 14, slots: 3, groups: 5, raises: '4' },
    9: { hitDice: '5+1', attackValue: 14, savingValue: 15, slots: 3, groups: 6, raises: '4' },
    10: { hitDice: '6', attackValue: 15, savingValue: 16, slots: 4, groups: 6, raises: '5' }
  },
  Strong: {
    1: { hitDice: '1+2', attackValue: 11, savingValue: 5, slots: 1, groups: 2, raises: '-' },
    2: { hitDice: '2', attackValue: 11, savingValue: 6, slots: 1, groups: 2, raises: '1' },
    3: { hitDice: '3', attackValue: 12, savingValue: 7, slots: 1, groups: 2, raises: '1' },
    4: { hitDice: '4', attackValue: 13, savingValue: 8, slots: 2, groups: 3, raises: '2' },
    5: { hitDice: '5', attackValue: 13, savingValue: 9, slots: 2, groups: 3, raises: '2' },
    6: { hitDice: '6', attackValue: 14, savingValue: 10, slots: 2, groups: 3, raises: '3' },
    7: { hitDice: '7', attackValue: 14, savingValue: 11, slots: 3, groups: 4, raises: '3' },
    8: { hitDice: '8', attackValue: 15, savingValue: 12, slots: 3, groups: 4, raises: '4' },
    9: { hitDice: '9', attackValue: 15, savingValue: 13, slots: 3, groups: 4, raises: '4' },
    10: { hitDice: '10', attackValue: 16, savingValue: 14, slots: 4, groups: 5, raises: '5' }
  },
  Wise: {
    1: { hitDice: '1', attackValue: 10, savingValue: 6, slots: 1, groups: 2, raises: '-' },
    2: { hitDice: '1+1', attackValue: 10, savingValue: 7, slots: 1, groups: 2, raises: '1' },
    3: { hitDice: '2', attackValue: 11, savingValue: 8, slots: 2, groups: 2, raises: '1' },
    4: { hitDice: '2+1', attackValue: 11, savingValue: 9, slots: 2, groups: 3, raises: '2' },
    5: { hitDice: '3', attackValue: 12, savingValue: 10, slots: 2, groups: 3, raises: '2' },
    6: { hitDice: '3+1', attackValue: 12, savingValue: 11, slots: 3, groups: 3, raises: '3' },
    7: { hitDice: '4', attackValue: 13, savingValue: 12, slots: 3, groups: 4, raises: '3' },
    8: { hitDice: '4+1', attackValue: 13, savingValue: 13, slots: 3, groups: 4, raises: '4' },
    9: { hitDice: '5', attackValue: 14, savingValue: 14, slots: 4, groups: 4, raises: '4' },
    10: { hitDice: '5+1', attackValue: 14, savingValue: 15, slots: 4, groups: 5, raises: '5' }
  },
  Brave: {
    1: { hitDice: '1*', attackValue: 10, savingValue: 9, slots: 1, groups: 2, raises: '-' },
    2: { hitDice: '2*', attackValue: 10, savingValue: 10, slots: 1, groups: 2, raises: '1' },
    3: { hitDice: '3*', attackValue: 10, savingValue: 11, slots: 1, groups: 2, raises: '1' },
    4: { hitDice: '4', attackValue: 11, savingValue: 12, slots: 2, groups: 2, raises: '2' },
    5: { hitDice: '5', attackValue: 11, savingValue: 13, slots: 2, groups: 3, raises: '2' },
    6: { hitDice: '6', attackValue: 11, savingValue: 14, slots: 2, groups: 3, raises: '3' },
    7: { hitDice: '7', attackValue: 12, savingValue: 15, slots: 3, groups: 3, raises: '3' },
    8: { hitDice: '8', attackValue: 12, savingValue: 16, slots: 3, groups: 3, raises: '4' },
    9: { hitDice: '9', attackValue: 12, savingValue: 17, slots: 3, groups: 4, raises: '4' },
    10: { hitDice: '10', attackValue: 13, savingValue: 18, slots: 4, groups: 4, raises: '5' }
  },
  Clever: {
    1: { hitDice: '1', attackValue: 10, savingValue: 8, slots: 1, groups: 2, raises: '-' },
    2: { hitDice: '2', attackValue: 11, savingValue: 9, slots: 1, groups: 2, raises: '1' },
    3: { hitDice: '2+1', attackValue: 11, savingValue: 10, slots: 1, groups: 2, raises: '1' },
    4: { hitDice: '3', attackValue: 11, savingValue: 11, slots: 2, groups: 3, raises: '2' },
    5: { hitDice: '3+1', attackValue: 12, savingValue: 12, slots: 2, groups: 3, raises: '2' },
    6: { hitDice: '4', attackValue: 12, savingValue: 13, slots: 2, groups: 3, raises: '3' },
    7: { hitDice: '4+1', attackValue: 13, savingValue: 14, slots: 3, groups: 4, raises: '3' },
    8: { hitDice: '5', attackValue: 13, savingValue: 15, slots: 3, groups: 4, raises: '4' },
    9: { hitDice: '5+1', attackValue: 13, savingValue: 16, slots: 3, groups: 4, raises: '4' },
    10: { hitDice: '6', attackValue: 14, savingValue: 17, slots: 4, groups: 5, raises: '5' }
  },
  Fortunate: {
    1: { hitDice: '1', attackValue: 10, savingValue: 6, slots: 1, groups: 2, raises: '-' },
    2: { hitDice: '2', attackValue: 10, savingValue: 7, slots: 1, groups: 2, raises: '1' },
    3: { hitDice: '2+1', attackValue: 11, savingValue: 8, slots: 1, groups: 3, raises: '1' },
    4: { hitDice: '3', attackValue: 11, savingValue: 9, slots: 2, groups: 3, raises: '2' },
    5: { hitDice: '3+1', attackValue: 12, savingValue: 10, slots: 2, groups: 4, raises: '2' },
    6: { hitDice: '4', attackValue: 12, savingValue: 11, slots: 2, groups: 4, raises: '3' },
    7: { hitDice: '4+1', attackValue: 13, savingValue: 12, slots: 3, groups: 5, raises: '3' },
    8: { hitDice: '5', attackValue: 13, savingValue: 13, slots: 3, groups: 5, raises: '4' },
    9: { hitDice: '5+1', attackValue: 14, savingValue: 14, slots: 3, groups: 6, raises: '4' },
    10: { hitDice: '6', attackValue: 14, savingValue: 15, slots: 4, groups: 6, raises: '5' }
  }
};

// ============================================
// XP REQUIREMENTS BY CLASS
// ============================================

const XP_REQUIREMENTS: Record<CharacterClass, Record<number, number>> = {
  Deft: {
    2: 1450, 3: 2900, 4: 5800, 5: 11600,
    6: 23200, 7: 46400, 8: 92800, 9: 185600, 10: 371200
  },
  Strong: {
    2: 1900, 3: 3800, 4: 7600, 5: 15200,
    6: 30400, 7: 60800, 8: 121600, 9: 243200, 10: 486400
  },
  Wise: {
    2: 2350, 3: 4700, 4: 9400, 5: 18800,
    6: 37600, 7: 75200, 8: 150400, 9: 300800, 10: 601600
  },
  Brave: {
    2: 1225, 3: 2450, 4: 4900, 5: 9800,
    6: 19600, 7: 39200, 8: 78400, 9: 156800, 10: 313600
  },
  Clever: {
    2: 1350, 3: 2700, 4: 5400, 5: 10800,
    6: 21600, 7: 43200, 8: 86400, 9: 172800, 10: 345600
  },
  Fortunate: {
    2: 1450, 3: 2900, 4: 5800, 5: 11600,
    6: 23200, 7: 46400, 8: 92800, 9: 185600, 10: 371200
  }
};

// ============================================
// PUBLIC FUNCTIONS
// ============================================

/**
 * Get all stats for a character class at a specific level
 */
export function getStats(characterClass: CharacterClass, level: number): CharacterStats {
  const validLevel = Math.max(1, Math.min(10, level));
  return (
    STAT_PROGRESSIONS[characterClass]?.[validLevel] ??
    STAT_PROGRESSIONS[characterClass]?.[1] ??
    { hitDice: '1', attackValue: 10, savingValue: 7, slots: 1, groups: 2, raises: '-' }
  );
}

/**
 * Get attack value for a class at a level
 */
export function getAttackValue(characterClass: CharacterClass, level: number): number {
  return getStats(characterClass, level).attackValue;
}

/**
 * Get save value for a class at a level
 */
export function getSaveValue(characterClass: CharacterClass, level: number): number {
  return getStats(characterClass, level).savingValue;
}

/**
 * Get number of slots for a class at a level
 */
export function getSlots(characterClass: CharacterClass, level: number): number {
  return getStats(characterClass, level).slots;
}

/**
 * Get number of groups for a class at a level
 */
export function getGroups(characterClass: CharacterClass, level: number): number {
  return getStats(characterClass, level).groups;
}

/**
 * Get hit dice string for a class at a level
 */
export function getHitDice(characterClass: CharacterClass, level: number): string {
  return getStats(characterClass, level).hitDice;
}

/**
 * Get XP required for a specific level
 */
export function xpRequirement(characterClass: CharacterClass, targetLevel: number): number {
  if (targetLevel <= 1) return 0;
  const clampedLevel = Math.min(Math.max(targetLevel, 2), 10);
  return XP_REQUIREMENTS[characterClass]?.[clampedLevel] ?? 0;
}

/**
 * Calculate current level based on XP
 */
export function computeLevel(characterClass: CharacterClass, xp: number): number {
  if (xp <= 0) return 1;

  const requirements = XP_REQUIREMENTS[characterClass];
  if (!requirements) return 1;

  for (let level = 10; level >= 2; level--) {
    if (requirements[level] !== undefined && xp >= requirements[level]) {
      return level;
    }
  }

  return 1;
}

/**
 * Check if character can level up
 */
export function canLevelUp(characterClass: CharacterClass, level: number, xp: number): boolean {
  if (level >= 10) return false;
  const required = xpRequirement(characterClass, level + 1);
  return xp >= required;
}

/**
 * Get XP progress as a percentage (0-1)
 */
export function getXPProgressPercent(characterClass: CharacterClass, level: number, xp: number): number {
  if (level >= 10) return 1.0;

  const currentLevelXP = level > 1 ? xpRequirement(characterClass, level) : 0;
  const nextLevelXP = xpRequirement(characterClass, level + 1);

  if (nextLevelXP <= currentLevelXP) return 1.0;

  const progress = (xp - currentLevelXP) / (nextLevelXP - currentLevelXP);
  return Math.min(Math.max(progress, 0), 1);
}

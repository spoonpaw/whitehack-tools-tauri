/**
 * ClassFeatures.ts - Class-specific type definitions
 */

import type {
  AttunementType,
  StrongCombatOptionId,
  ConflictLootType,
  BraveQuirkId,
  CleverKnackId
} from './Enums';

// ============================================
// DEFT CLASS
// ============================================

export interface Attunement {
  id: string;
  name: string;
  isActive: boolean;
  type: AttunementType;
  isLost: boolean; // If true, becomes keyword giving +1 to related tasks
}

export interface AttunementSlot {
  id: string;
  primaryAttunement: Attunement;
  secondaryAttunement: Attunement;
  tertiaryAttunement: Attunement;
  quaternaryAttunement: Attunement;
  hasTertiaryAttunement: boolean;
  hasQuaternaryAttunement: boolean;
  hasUsedDailyPower: boolean;
}

export function createDefaultAttunement(): Attunement {
  return {
    id: crypto.randomUUID(),
    name: '',
    isActive: false,
    type: 'item',
    isLost: false
  };
}

export function createDefaultAttunementSlot(): AttunementSlot {
  return {
    id: crypto.randomUUID(),
    primaryAttunement: createDefaultAttunement(),
    secondaryAttunement: createDefaultAttunement(),
    tertiaryAttunement: createDefaultAttunement(),
    quaternaryAttunement: createDefaultAttunement(),
    hasTertiaryAttunement: false,
    hasQuaternaryAttunement: false,
    hasUsedDailyPower: false
  };
}

// ============================================
// STRONG CLASS
// ============================================

export interface StrongCombatOptions {
  selectedOptions: StrongCombatOptionId[];
}

export interface ConflictLoot {
  keyword: string;
  type: ConflictLootType;
  usesRemaining: number;
}

export function createDefaultStrongCombatOptions(): StrongCombatOptions {
  return {
    selectedOptions: []
  };
}

export function createDefaultConflictLoot(): ConflictLoot {
  return {
    keyword: '',
    type: 'special',
    usesRemaining: 1
  };
}

// ============================================
// WISE CLASS
// ============================================

export interface WiseMiracle {
  id: string;
  name: string;
  magnitude: number;
  isActive: boolean;
  isAdditional: boolean;
}

export interface WiseMiracleSlot {
  id: string;
  baseMiracles: WiseMiracle[];
  additionalMiracles: WiseMiracle[];
  isMagicItem: boolean;
  magicItemName: string;
  additionalMiracleCount: number;
}

export function createDefaultWiseMiracle(isAdditional: boolean = false): WiseMiracle {
  return {
    id: crypto.randomUUID(),
    name: '',
    magnitude: 1,
    isActive: false,
    isAdditional
  };
}

export function createDefaultWiseMiracleSlot(): WiseMiracleSlot {
  return {
    id: crypto.randomUUID(),
    baseMiracles: [],
    additionalMiracles: [],
    isMagicItem: false,
    magicItemName: '',
    additionalMiracleCount: 0
  };
}

// ============================================
// BRAVE CLASS
// ============================================

export interface BraveQuirkSlot {
  id: string;
  selectedQuirk: BraveQuirkId | null;
  protectedAllyName: string; // Only used when quirk = 2 (Protect Ally)
}

export interface BraveQuirkOptions {
  slots: BraveQuirkSlot[];
}

export function createDefaultBraveQuirkSlot(): BraveQuirkSlot {
  return {
    id: crypto.randomUUID(),
    selectedQuirk: null,
    protectedAllyName: ''
  };
}

export function createDefaultBraveQuirkOptions(): BraveQuirkOptions {
  return {
    slots: []
  };
}

// ============================================
// CLEVER CLASS
// ============================================

export interface CleverKnackSlot {
  id: string;
  selectedKnack: CleverKnackId | null;
  hasUsedCombatDie: boolean; // Only for Combat Exploiter (0)
}

export interface CleverKnackOptions {
  slots: CleverKnackSlot[];
  hasUsedUnorthodoxBonus: boolean;
}

export function createDefaultCleverKnackSlot(): CleverKnackSlot {
  return {
    id: crypto.randomUUID(),
    selectedKnack: null,
    hasUsedCombatDie: false
  };
}

export function createDefaultCleverKnackOptions(): CleverKnackOptions {
  return {
    slots: [],
    hasUsedUnorthodoxBonus: false
  };
}

// ============================================
// FORTUNATE CLASS
// ============================================

export interface SignatureObject {
  name: string;
}

export interface Retainer {
  id: string;
  name: string;
  type: string; // Swift field: retainer type/role
  level: number;
  currentHP: number;
  maxHP: number;
  attackValue: number;
  defenseFactor: number; // Swift field: DF
  movement: number; // Swift field: MV
  hitDice: number; // Swift field
  keywords: string[]; // Swift field: special abilities/traits
  wage: number;
  share: number; // Percentage of treasure
  equipment: string;
  attitude: string; // Swift field
  notes: string;
}

export interface FortunateOptions {
  currentLuck: number;
  hasUsedFortune: boolean;
  retainers: Retainer[];
  signatureObject: SignatureObject;
  standing: string;
}

export function createDefaultRetainer(): Retainer {
  return {
    id: crypto.randomUUID(),
    name: '',
    type: '',
    level: 1,
    currentHP: 1,
    maxHP: 1,
    attackValue: 10,
    defenseFactor: 0,
    movement: 30,
    hitDice: 1,
    keywords: [],
    wage: 0,
    share: 0,
    equipment: '',
    attitude: '',
    notes: ''
  };
}

export function createDefaultFortunateOptions(): FortunateOptions {
  return {
    currentLuck: 0,
    hasUsedFortune: false,
    retainers: [],
    signatureObject: { name: '' },
    standing: ''
  };
}

/**
 * PlayerCharacter.ts - Main character type definition
 */

import type { CharacterClass, CustomAttributeIcon } from './Enums';
import type {
  AttunementSlot,
  StrongCombatOptions,
  ConflictLoot,
  WiseMiracleSlot,
  BraveQuirkOptions,
  CleverKnackOptions,
  FortunateOptions
} from './ClassFeatures';
import {
  createDefaultStrongCombatOptions,
  createDefaultBraveQuirkOptions,
  createDefaultCleverKnackOptions,
  createDefaultFortunateOptions
} from './ClassFeatures';
import type { Weapon, Armor, Gear } from './Equipment';

// ============================================
// SUPPORTING TYPES
// ============================================

export interface AttributeGroupPair {
  id: string;
  attribute: string; // e.g., "Strength", "Agility"
  group: string; // Group name this attribute is linked to
}

export interface CustomAttribute {
  id: string;
  name: string;
  value: number; // 1-20
  icon: CustomAttributeIcon;
}

export function createDefaultAttributeGroupPair(): AttributeGroupPair {
  return {
    id: crypto.randomUUID(),
    attribute: '',
    group: ''
  };
}

export function createDefaultCustomAttribute(): CustomAttribute {
  return {
    id: crypto.randomUUID(),
    name: '',
    value: 10,
    icon: 'sword'
  };
}

// ============================================
// MAIN PLAYER CHARACTER TYPE
// ============================================

export interface PlayerCharacter {
  // Identity
  id: string;
  name: string;
  playerName: string;
  characterClass: CharacterClass;
  level: number; // 1-10

  // Attributes Configuration
  useCustomAttributes: boolean;
  customAttributes: CustomAttribute[];

  // Standard Attributes (when useCustomAttributes = false)
  strength: number; // 1-20
  agility: number;
  toughness: number;
  intelligence: number;
  willpower: number;
  charisma: number;

  // Combat Stats
  currentHP: number;
  maxHP: number;
  movement: number; // 0-999
  saveColor: string;

  // Stored computed values (for backward compatibility / export)
  _attackValue: number;
  _saveValue: number;

  // Groups
  speciesGroup: string | null;
  vocationGroup: string | null;
  affiliationGroups: string[];
  attributeGroupPairs: AttributeGroupPair[];

  // Class-Specific Properties
  attunementSlots: AttunementSlot[]; // Deft
  strongCombatOptions: StrongCombatOptions; // Strong
  currentConflictLoot: ConflictLoot | null; // Strong
  wiseMiracleSlots: WiseMiracleSlot[]; // Wise
  braveQuirkOptions: BraveQuirkOptions; // Brave
  comebackDice: number; // Brave
  hasUsedSayNo: boolean; // Brave
  cleverKnackOptions: CleverKnackOptions; // Clever
  fortunateOptions: FortunateOptions; // Fortunate

  // Equipment
  weapons: Weapon[];
  armor: Armor[];
  gear: Gear[];

  // Economy
  coinsOnHand: number;
  stashedCoins: number;

  // Other
  languages: string[];
  notes: string;
  experience: number;
  corruption: number;
  maxEncumbrance: number;
  inventory: unknown[]; // Legacy, always empty
}

// ============================================
// FACTORY FUNCTION
// ============================================

export function createDefaultCharacter(): PlayerCharacter {
  return {
    // Identity
    id: crypto.randomUUID(),
    name: '',
    playerName: '',
    characterClass: 'Deft',
    level: 1,

    // Attributes Configuration
    useCustomAttributes: false,
    customAttributes: [],

    // Standard Attributes
    strength: 10,
    agility: 10,
    toughness: 10,
    intelligence: 10,
    willpower: 10,
    charisma: 10,

    // Combat Stats
    currentHP: 1,
    maxHP: 1,
    movement: 30,
    saveColor: '',

    // Stored computed values
    _attackValue: 10,
    _saveValue: 7,

    // Groups
    speciesGroup: null,
    vocationGroup: null,
    affiliationGroups: [],
    attributeGroupPairs: [],

    // Class-Specific (all empty/default)
    attunementSlots: [],
    strongCombatOptions: createDefaultStrongCombatOptions(),
    currentConflictLoot: null,
    wiseMiracleSlots: [],
    braveQuirkOptions: createDefaultBraveQuirkOptions(),
    comebackDice: 0,
    hasUsedSayNo: false,
    cleverKnackOptions: createDefaultCleverKnackOptions(),
    fortunateOptions: createDefaultFortunateOptions(),

    // Equipment
    weapons: [],
    armor: [],
    gear: [],

    // Economy
    coinsOnHand: 0,
    stashedCoins: 0,

    // Other
    languages: ['Common'],
    notes: '',
    experience: 0,
    corruption: 0,
    maxEncumbrance: 15,
    inventory: []
  };
}

/**
 * Create a deep copy of a character with new UUIDs
 */
export function cloneCharacterWithNewIds(character: PlayerCharacter): PlayerCharacter {
  const clone = JSON.parse(JSON.stringify(character)) as PlayerCharacter;
  
  // Regenerate main ID
  clone.id = crypto.randomUUID();
  
  // Regenerate IDs for nested objects
  clone.customAttributes = clone.customAttributes.map(attr => ({
    ...attr,
    id: crypto.randomUUID()
  }));
  
  clone.attributeGroupPairs = clone.attributeGroupPairs.map(pair => ({
    ...pair,
    id: crypto.randomUUID()
  }));
  
  clone.attunementSlots = clone.attunementSlots.map(slot => ({
    ...slot,
    id: crypto.randomUUID(),
    primaryAttunement: { ...slot.primaryAttunement, id: crypto.randomUUID() },
    secondaryAttunement: { ...slot.secondaryAttunement, id: crypto.randomUUID() },
    tertiaryAttunement: { ...slot.tertiaryAttunement, id: crypto.randomUUID() },
    quaternaryAttunement: { ...slot.quaternaryAttunement, id: crypto.randomUUID() }
  }));
  
  clone.wiseMiracleSlots = clone.wiseMiracleSlots.map(slot => ({
    ...slot,
    id: crypto.randomUUID(),
    baseMiracles: slot.baseMiracles.map(m => ({ ...m, id: crypto.randomUUID() })),
    additionalMiracles: slot.additionalMiracles.map(m => ({ ...m, id: crypto.randomUUID() }))
  }));
  
  clone.braveQuirkOptions.slots = clone.braveQuirkOptions.slots.map(slot => ({
    ...slot,
    id: crypto.randomUUID()
  }));
  
  clone.cleverKnackOptions.slots = clone.cleverKnackOptions.slots.map(slot => ({
    ...slot,
    id: crypto.randomUUID()
  }));
  
  clone.fortunateOptions.retainers = clone.fortunateOptions.retainers.map(r => ({
    ...r,
    id: crypto.randomUUID()
  }));
  
  clone.weapons = clone.weapons.map(w => ({ ...w, id: crypto.randomUUID() }));
  clone.armor = clone.armor.map(a => ({ ...a, id: crypto.randomUUID() }));
  clone.gear = clone.gear.map(g => ({ ...g, id: crypto.randomUUID() }));
  
  return clone;
}

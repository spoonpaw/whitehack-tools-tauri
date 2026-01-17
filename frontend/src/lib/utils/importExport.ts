/**
 * importExport.ts - Character import/export utilities
 * 
 * Handles JSON import/export with cross-platform compatibility
 * between Swift, Kotlin, and Tauri versions.
 */

import type { PlayerCharacter } from '$lib/models';
import { createDefaultCharacter } from '$lib/models';

// ============================================
// EXPORT
// ============================================

/**
 * Convert Tauri internal format to Swift export format
 */
function convertToSwiftFormat(character: PlayerCharacter): any {
  // Create a copy to modify
  const exported: any = { ...character };
  
  // Convert strongCombatOptions.selectedOptions to slots array
  // Swift expects: slots: [null, null, 6, null, null, null, null, null, null, null]
  // Tauri has: selectedOptions: [6]
  if (exported.strongCombatOptions) {
    const selectedOptions = exported.strongCombatOptions.selectedOptions || [];
    const slots: (number | null)[] = new Array(10).fill(null);
    
    // Place each selected option at its index in the slots array
    selectedOptions.forEach((optionId: number, index: number) => {
      if (index < 10) {
        slots[index] = optionId;
      }
    });
    
    exported.strongCombatOptions = { slots };
  }
  
  // Add missing fortunateOptions.newKeyword field
  if (exported.fortunateOptions) {
    exported.fortunateOptions = {
      ...exported.fortunateOptions,
      newKeyword: exported.fortunateOptions.newKeyword || ''
    };
    // Remove currentLuck if present (not in Swift schema)
    delete exported.fortunateOptions.currentLuck;
  }
  
  return exported;
}

/**
 * Export a character to JSON string (Swift-compatible format)
 */
export function exportCharacterToJSON(character: PlayerCharacter): string {
  const swiftFormat = convertToSwiftFormat(character);
  return JSON.stringify(swiftFormat, null, 2);
}

/**
 * Export multiple characters to JSON string
 * Uses raw array format for Swift compatibility
 */
export function exportCharactersToJSON(characters: PlayerCharacter[]): string {
  // Convert each character to Swift format and export as raw array
  const swiftFormat = characters.map(convertToSwiftFormat);
  return JSON.stringify(swiftFormat, null, 2);
}

/**
 * Create a downloadable file from character data
 */
export function downloadCharacterAsFile(character: PlayerCharacter): void {
  const json = exportCharacterToJSON(character);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(character.name || 'character')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Create a downloadable file from multiple characters
 */
export function downloadCharactersAsFile(characters: PlayerCharacter[]): void {
  const json = exportCharactersToJSON(characters);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  const filename = characters.length === 1 
    ? sanitizeFilename(characters[0].name || 'character')
    : 'characters';
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Sanitize filename for safe download
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50) || 'character';
}

// ============================================
// IMPORT
// ============================================

export interface ImportResult {
  success: boolean;
  character?: PlayerCharacter;
  characters?: PlayerCharacter[];
  error?: string;
}

/**
 * Import a character from JSON string
 */
export function importCharacterFromJSON(json: string): ImportResult {
  try {
    console.log('[Import] Parsing JSON, length:', json.length);
    const data = JSON.parse(json);
    console.log('[Import] Parsed data type:', Array.isArray(data) ? 'array' : typeof data);
    
    // Handle raw array of characters (Swift export format)
    if (Array.isArray(data)) {
      console.log('[Import] Detected raw array with', data.length, 'items');
      if (data.length > 0 && data[0].id) {
        const characters = data.map(normalizeCharacter);
        console.log('[Import] Successfully normalized', characters.length, 'characters');
        return { success: true, characters };
      }
    }
    
    // Handle wrapped array: { characters: [...] }
    if (Array.isArray(data.characters)) {
      console.log('[Import] Detected wrapped array with', data.characters.length, 'characters');
      const characters = data.characters.map(normalizeCharacter);
      return { success: true, characters };
    }
    
    // Handle single character object
    if (data.id) {
      console.log('[Import] Detected single character:', data.name || data.id);
      const character = normalizeCharacter(data);
      return { success: true, character };
    }
    
    console.log('[Import] Unrecognized format. Keys:', Object.keys(data));
    return { success: false, error: 'Invalid character data format' };
  } catch (err) {
    console.error('[Import] Parse error:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Failed to parse JSON' 
    };
  }
}

/**
 * Normalize character data to handle cross-platform differences
 * 
 * Swift uses: useCustomAttributes, currentXP (as 'experience')
 * Kotlin uses: useDefaultAttributes (INVERTED), currentXP
 */
function normalizeCharacter(data: any): PlayerCharacter {
  const defaults = createDefaultCharacter();
  
  // Handle Kotlin's inverted useDefaultAttributes
  let useCustomAttributes = data.useCustomAttributes;
  if (typeof data.useDefaultAttributes === 'boolean') {
    useCustomAttributes = !data.useDefaultAttributes;
  }
  
  // Normalize attribute names (Swift uses different casing sometimes)
  const character: PlayerCharacter = {
    ...defaults,
    
    // Identity
    id: data.id || crypto.randomUUID(),
    name: data.name || '',
    playerName: data.playerName || '',
    characterClass: normalizeClass(data.characterClass || data.class),
    level: clamp(data.level || 1, 1, 10),
    
    // Attributes
    useCustomAttributes: useCustomAttributes ?? false,
    customAttributes: Array.isArray(data.customAttributes) 
      ? data.customAttributes.map(normalizeCustomAttribute)
      : [],
    
    // Standard attributes
    strength: clamp(data.strength ?? data.str ?? 10, 1, 20),
    agility: clamp(data.agility ?? data.dexterity ?? data.dex ?? 10, 1, 20),
    toughness: clamp(data.toughness ?? data.constitution ?? data.con ?? 10, 1, 20),
    intelligence: clamp(data.intelligence ?? data.int ?? 10, 1, 20),
    willpower: clamp(data.willpower ?? data.wisdom ?? data.wis ?? 10, 1, 20),
    charisma: clamp(data.charisma ?? data.cha ?? 10, 1, 20),
    
    // Combat
    currentHP: data.currentHP ?? data.hp ?? 1,
    maxHP: data.maxHP ?? data.currentHP ?? 1,
    movement: data.movement ?? 30,
    saveColor: data.saveColor ?? '',
    _attackValue: data._attackValue ?? data.attackValue ?? 10,
    _saveValue: data._saveValue ?? data.saveValue ?? 7,
    
    // Groups (Swift uses *Group, Kotlin uses plain names)
    speciesGroup: data.speciesGroup ?? data.species ?? '',
    vocationGroup: data.vocationGroup ?? data.vocation ?? '',
    affiliationGroups: Array.isArray(data.affiliationGroups) ? data.affiliationGroups 
                     : Array.isArray(data.affiliations) ? data.affiliations 
                     : [],
    attributeGroupPairs: Array.isArray(data.attributeGroupPairs) 
      ? data.attributeGroupPairs.map(normalizeAttributeGroupPair)
      : [],
    
    // Class-specific
    attunementSlots: Array.isArray(data.attunementSlots) 
      ? data.attunementSlots.map(normalizeAttunementSlot) 
      : [],
    strongCombatOptions: normalizeStrongCombatOptions(data.strongCombatOptions),
    currentConflictLoot: data.currentConflictLoot ?? null,
    wiseMiracleSlots: Array.isArray(data.wiseMiracleSlots) ? data.wiseMiracleSlots : [],
    braveQuirkOptions: normalizeBraveQuirkOptions(data.braveQuirkOptions),
    comebackDice: data.comebackDice ?? 0,
    hasUsedSayNo: data.hasUsedSayNo ?? false,
    cleverKnackOptions: normalizeCleverKnackOptions(data.cleverKnackOptions),
    fortunateOptions: normalizeFortunateOptions(data.fortunateOptions),
    
    // Equipment
    weapons: Array.isArray(data.weapons) ? data.weapons.map(normalizeWeapon) : [],
    armor: Array.isArray(data.armor) ? data.armor.map(normalizeArmor) : [],
    gear: Array.isArray(data.gear) ? data.gear.map(normalizeGear) : [],
    
    // Economy
    coinsOnHand: data.coinsOnHand ?? data.coins ?? data.gold ?? 0,
    stashedCoins: data.stashedCoins ?? 0,
    
    // Other
    languages: Array.isArray(data.languages) ? data.languages : ['Common'],
    notes: data.notes ?? '',
    experience: data.experience ?? data.currentXP ?? data.xp ?? 0,
    corruption: data.corruption ?? 0,
    maxEncumbrance: data.maxEncumbrance ?? 15,
    inventory: []
  };
  
  return character;
}

function normalizeClass(cls: string): PlayerCharacter['characterClass'] {
  const normalized = (cls || 'Deft').toLowerCase();
  const classMap: Record<string, PlayerCharacter['characterClass']> = {
    deft: 'Deft',
    strong: 'Strong',
    wise: 'Wise',
    brave: 'Brave',
    clever: 'Clever',
    fortunate: 'Fortunate'
  };
  return classMap[normalized] || 'Deft';
}

function normalizeCustomAttribute(attr: any): { id: string; name: string; value: number; icon: string } {
  return {
    id: attr.id || crypto.randomUUID(),
    name: attr.name || '',
    value: clamp(attr.value ?? 10, 1, 20),
    icon: attr.icon || 'sword'
  };
}

function normalizeAttributeGroupPair(pair: any): { id: string; attribute: string; group: string } {
  return {
    id: pair.id || crypto.randomUUID(),
    attribute: pair.attribute || '',
    group: pair.group || ''
  };
}

function normalizeAttunementType(type: any): string {
  // Kotlin uses UPPERCASE (ITEM, TEACHER), Swift uses lowercase (item, teacher)
  if (typeof type !== 'string') return 'item';
  return type.toLowerCase();
}

function normalizeAttunement(attunement: any) {
  if (!attunement) return {
    id: crypto.randomUUID(),
    name: '',
    isActive: false,
    type: 'item',
    isLost: false
  };
  
  return {
    id: attunement.id || crypto.randomUUID(),
    name: attunement.name || '',
    isActive: attunement.isActive ?? false,
    type: normalizeAttunementType(attunement.type),
    isLost: attunement.isLost ?? false
  };
}

function normalizeAttunementSlot(slot: any) {
  if (!slot) return null;
  
  return {
    id: slot.id || crypto.randomUUID(),
    primaryAttunement: normalizeAttunement(slot.primaryAttunement),
    secondaryAttunement: normalizeAttunement(slot.secondaryAttunement),
    tertiaryAttunement: normalizeAttunement(slot.tertiaryAttunement),
    quaternaryAttunement: normalizeAttunement(slot.quaternaryAttunement),
    hasTertiaryAttunement: slot.hasTertiaryAttunement ?? false,
    hasQuaternaryAttunement: slot.hasQuaternaryAttunement ?? false,
    hasUsedDailyPower: slot.hasUsedDailyPower ?? false
  };
}

function normalizeStrongCombatOptions(data: any) {
  if (!data) return { selectedOptions: [] };
  
  // Swift uses: { slots: [4, null, null, ...] } where values are numbers
  // Kotlin uses: { slots: ["0", null, "1", ...] } where values are strings
  // We use: { selectedOptions: [4, 6, ...] }
  if (Array.isArray(data.slots)) {
    const selectedOptions = data.slots
      .filter((slot: any) => slot !== null && slot !== undefined)
      .map((slot: any) => typeof slot === 'string' ? parseInt(slot, 10) : slot)
      .filter((slot: any) => typeof slot === 'number' && !isNaN(slot));
    return { selectedOptions };
  }
  
  return {
    selectedOptions: Array.isArray(data.selectedOptions) ? data.selectedOptions : []
  };
}

function normalizeBraveQuirkOptions(data: any) {
  if (!data) return { slots: [] };
  return {
    slots: Array.isArray(data.slots) ? data.slots : []
  };
}

function normalizeCleverKnackOptions(data: any) {
  if (!data) return { slots: [], hasUsedUnorthodoxBonus: false };
  return {
    slots: Array.isArray(data.slots) ? data.slots : [],
    hasUsedUnorthodoxBonus: data.hasUsedUnorthodoxBonus ?? false
  };
}

function normalizeFortunateOptions(data: any) {
  if (!data) return { currentLuck: 0, hasUsedFortune: false, retainers: [], signatureObject: { name: '' }, standing: '' };
  return {
    currentLuck: data.currentLuck ?? 0,
    hasUsedFortune: data.hasUsedFortune ?? false,
    retainers: Array.isArray(data.retainers) ? data.retainers.map(normalizeRetainer) : [],
    signatureObject: data.signatureObject ?? { name: '' },
    standing: data.standing ?? ''
  };
}

function normalizeRetainer(retainer: any) {
  // Swift uses: attitude, defenseFactor, hitDice, keywords, movement, type, name, notes, currentHP, maxHP
  return {
    id: retainer.id || crypto.randomUUID(),
    name: retainer.name || '',
    type: retainer.type || '',
    level: retainer.level ?? retainer.hitDice ?? 1,
    currentHP: retainer.currentHP ?? 1,
    maxHP: retainer.maxHP ?? 1,
    attackValue: retainer.attackValue ?? 10,
    defenseFactor: retainer.defenseFactor ?? 0,
    movement: retainer.movement ?? 30,
    hitDice: retainer.hitDice ?? 1,
    keywords: Array.isArray(retainer.keywords) ? retainer.keywords : [],
    wage: retainer.wage ?? 0,
    share: retainer.share ?? 0,
    equipment: retainer.equipment || '',
    attitude: retainer.attitude || '',
    notes: retainer.notes || ''
  };
}

function normalizeWeapon(weapon: any) {
  return {
    id: weapon.id || crypto.randomUUID(),
    name: weapon.name || '',
    damage: weapon.damage || '',
    weight: weapon.weight || 'Regular',
    range: weapon.range || 'N/A',
    rateOfFire: weapon.rateOfFire || 'N/A',
    special: weapon.special || '',
    isEquipped: weapon.isEquipped ?? false,
    isStashed: weapon.isStashed ?? false,
    isMagical: weapon.isMagical ?? false,
    isCursed: weapon.isCursed ?? false,
    bonus: weapon.bonus ?? 0,
    quantity: weapon.quantity ?? 1
  };
}

function normalizeArmor(armor: any) {
  return {
    id: armor.id || crypto.randomUUID(),
    name: armor.name || '',
    df: armor.df ?? 0,
    weight: armor.weight ?? 1,
    special: armor.special || '',
    quantity: armor.quantity ?? 1,
    isEquipped: armor.isEquipped ?? false,
    isStashed: armor.isStashed ?? false,
    isMagical: armor.isMagical ?? false,
    isCursed: armor.isCursed ?? false,
    bonus: armor.bonus ?? 0,
    isShield: armor.isShield ?? false
  };
}

function normalizeGear(gear: any) {
  return {
    id: gear.id || crypto.randomUUID(),
    name: gear.name || '',
    weight: gear.weight || 'Minor',
    special: gear.special || '',
    quantity: gear.quantity ?? 1,
    isEquipped: gear.isEquipped ?? false,
    isStashed: gear.isStashed ?? false,
    isMagical: gear.isMagical ?? false,
    isCursed: gear.isCursed ?? false,
    isContainer: gear.isContainer ?? false
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ============================================
// FILE OPERATIONS WITH TAURI
// ============================================

/**
 * Open file dialog and import character(s)
 * Uses Tauri's dialog and fs plugins when available
 */
export async function importFromFile(): Promise<ImportResult> {
  try {
    // Dynamic import to handle SSR
    const { open } = await import('@tauri-apps/plugin-dialog');
    const { readTextFile } = await import('@tauri-apps/plugin-fs');
    
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Character',
        extensions: ['json']
      }]
    });
    
    if (!selected) {
      return { success: false, error: 'No file selected' };
    }
    
    const contents = await readTextFile(selected as string);
    return importCharacterFromJSON(contents);
  } catch (err) {
    console.error('Import error:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Failed to import file' 
    };
  }
}

/**
 * Save character(s) to file using Tauri's dialog
 */
export async function exportToFile(characters: PlayerCharacter | PlayerCharacter[]): Promise<boolean> {
  try {
    const { save } = await import('@tauri-apps/plugin-dialog');
    const { writeTextFile } = await import('@tauri-apps/plugin-fs');
    
    const charArray = Array.isArray(characters) ? characters : [characters];
    const isSingle = charArray.length === 1;
    
    const defaultFilename = isSingle
      ? sanitizeFilename(charArray[0].name || 'character')
      : 'characters';
    
    const path = await save({
      defaultPath: `${defaultFilename}.json`,
      filters: [{
        name: 'Character',
        extensions: ['json']
      }]
    });
    
    if (!path) {
      return false;
    }
    
    const json = isSingle 
      ? exportCharacterToJSON(charArray[0])
      : exportCharactersToJSON(charArray);
    await writeTextFile(path, json);
    return true;
  } catch (err) {
    console.error('Export error:', err);
    return false;
  }
}

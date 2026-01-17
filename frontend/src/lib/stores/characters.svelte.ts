/**
 * characters.ts - Character store with SQLite persistence
 */

import type { PlayerCharacter } from '$lib/models';
import { createDefaultCharacter } from '$lib/models';
import {
  getAllCharacters,
  getCharacterById,
  insertCharacter,
  updateCharacter as dbUpdateCharacter,
  deleteCharacterById
} from './database';

// ============================================
// STORE STATE
// ============================================

let characters = $state<PlayerCharacter[]>([]);
let isLoading = $state(false);
let error = $state<string | null>(null);

// ============================================
// GETTERS
// ============================================

export function getCharacters(): PlayerCharacter[] {
  return characters;
}

export function getIsLoading(): boolean {
  return isLoading;
}

export function getError(): string | null {
  return error;
}

export function getCharacterByIdFromStore(id: string): PlayerCharacter | undefined {
  return characters.find((c) => c.id === id);
}

// ============================================
// ACTIONS
// ============================================

/**
 * Load all characters from the database
 */
export async function loadCharacters(): Promise<void> {
  isLoading = true;
  error = null;

  try {
    console.log('[CharacterStore] Loading characters...');
    const rows = await getAllCharacters();
    console.log(`[CharacterStore] Got ${rows.length} rows from database`);
    
    characters = rows.map((row) => {
      try {
        return JSON.parse(row.data) as PlayerCharacter;
      } catch (e) {
        console.error(`[CharacterStore] Failed to parse character ${row.id}:`, e);
        return null;
      }
    }).filter((c): c is PlayerCharacter => c !== null);
    
    console.log(`[CharacterStore] Loaded ${characters.length} characters successfully`);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load characters';
    console.error('[CharacterStore] Load error:', e);
    // Initialize with empty array on error so UI still renders
    characters = [];
  } finally {
    isLoading = false;
  }
}

/**
 * Create a new character
 */
export async function createCharacter(data?: Partial<PlayerCharacter>): Promise<PlayerCharacter> {
  const newCharacter = {
    ...createDefaultCharacter(),
    ...data,
    id: crypto.randomUUID()
  };

  try {
    await insertCharacter(
      newCharacter.id,
      JSON.stringify(newCharacter),
      newCharacter.name || 'Unnamed Character',
      newCharacter.characterClass,
      newCharacter.level
    );

    characters = [newCharacter, ...characters];
    console.log(`[CharacterStore] Created character ${newCharacter.id}`);
    return newCharacter;
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to create character';
    console.error('[CharacterStore] Create error:', e);
    throw e;
  }
}

/**
 * Update an existing character
 */
export async function updateCharacter(character: PlayerCharacter): Promise<void> {
  try {
    await dbUpdateCharacter(
      character.id,
      JSON.stringify(character),
      character.name || 'Unnamed Character',
      character.characterClass,
      character.level
    );

    characters = characters.map((c) => (c.id === character.id ? character : c));
    console.log(`[CharacterStore] Updated character ${character.id}`);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to update character';
    console.error('[CharacterStore] Update error:', e);
    throw e;
  }
}

/**
 * Save a character (create or update)
 */
export async function saveCharacter(character: PlayerCharacter): Promise<void> {
  const existing = await getCharacterById(character.id);
  if (existing) {
    await updateCharacter(character);
  } else {
    await insertCharacter(
      character.id,
      JSON.stringify(character),
      character.name || 'Unnamed Character',
      character.characterClass,
      character.level
    );
    characters = [character, ...characters.filter((c) => c.id !== character.id)];
  }
}

/**
 * Delete a character
 */
export async function deleteCharacter(id: string): Promise<void> {
  try {
    await deleteCharacterById(id);
    characters = characters.filter((c) => c.id !== id);
    console.log(`[CharacterStore] Deleted character ${id}`);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to delete character';
    console.error('[CharacterStore] Delete error:', e);
    throw e;
  }
}

/**
 * Import characters from JSON
 */
export async function importCharacters(importedCharacters: PlayerCharacter[]): Promise<number> {
  let imported = 0;

  for (const character of importedCharacters) {
    try {
      // Generate new ID to avoid conflicts
      const newId = crypto.randomUUID();
      const newCharacter = { ...character, id: newId };

      await insertCharacter(
        newCharacter.id,
        JSON.stringify(newCharacter),
        newCharacter.name || 'Unnamed Character',
        newCharacter.characterClass,
        newCharacter.level
      );

      characters = [newCharacter, ...characters];
      imported++;
    } catch (e) {
      console.error(`[CharacterStore] Failed to import character:`, e);
    }
  }

  console.log(`[CharacterStore] Imported ${imported}/${importedCharacters.length} characters`);
  return imported;
}

/**
 * Export characters to JSON string
 */
export function exportCharacters(ids?: string[]): string {
  const toExport = ids 
    ? characters.filter((c) => ids.includes(c.id))
    : characters;
  
  return JSON.stringify(toExport, null, 2);
}

/**
 * Clear any error
 */
export function clearError(): void {
  error = null;
}

// ============================================
// CHARACTER STORE OBJECT
// ============================================

/**
 * Character store object for easier imports
 * Provides a unified API for character management
 */
export const characterStore = {
  // Getters (as computed-like properties)
  get characters() {
    return characters;
  },
  get isLoading() {
    return isLoading;
  },
  get error() {
    return error;
  },
  
  // Methods
  getCharacter(id: string) {
    return characters.find((c) => c.id === id);
  },
  loadCharacters,
  addCharacter: async (character: PlayerCharacter) => {
    try {
      await insertCharacter(
        character.id,
        JSON.stringify(character),
        character.name || 'Unnamed Character',
        character.characterClass,
        character.level
      );
      characters = [character, ...characters];
      console.log(`[CharacterStore] Added character ${character.id}`);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to add character';
      console.error('[CharacterStore] Add error:', e);
      throw e;
    }
  },
  updateCharacter,
  deleteCharacter,
  importCharacters,
  exportCharacters,
  clearError
};

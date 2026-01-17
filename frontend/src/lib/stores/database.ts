/**
 * database.ts - SQLite database setup and initialization
 */

import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;
let isInitialized = false;

/**
 * Get the database instance, initializing if needed
 */
export async function getDatabase(): Promise<Database> {
  if (db && isInitialized) return db;
  
  try {
    db = await Database.load('sqlite:whitehack-tools.db');
    
    // Initialize schema on first connection
    if (!isInitialized) {
      await initDatabaseSchema(db);
      isInitialized = true;
    }
    
    return db;
  } catch (error) {
    console.error('[DB] Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Initialize the database schema (internal)
 */
async function initDatabaseSchema(database: Database): Promise<void> {
  // Create characters table - stores JSON blob for flexibility
  await database.execute(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      name TEXT NOT NULL,
      character_class TEXT NOT NULL,
      level INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Create indexes for common queries
  await database.execute(`
    CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name)
  `);
  await database.execute(`
    CREATE INDEX IF NOT EXISTS idx_characters_class ON characters(character_class)
  `);
  await database.execute(`
    CREATE INDEX IF NOT EXISTS idx_characters_updated ON characters(updated_at)
  `);

  // Create settings table
  await database.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  console.log('[DB] Database schema initialized');
}

/**
 * Initialize the database (public API - ensures schema is created)
 */
export async function initDatabase(): Promise<void> {
  await getDatabase(); // This now handles initialization
}

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}

// ============================================
// CHARACTER CRUD OPERATIONS
// ============================================

export interface CharacterRow {
  id: string;
  data: string;
  name: string;
  character_class: string;
  level: number;
  created_at: string;
  updated_at: string;
}

/**
 * Get all characters from the database
 */
export async function getAllCharacters(): Promise<CharacterRow[]> {
  const database = await getDatabase();
  const result = await database.select<CharacterRow[]>(
    'SELECT * FROM characters ORDER BY updated_at DESC'
  );
  return result;
}

/**
 * Get a single character by ID
 */
export async function getCharacterById(id: string): Promise<CharacterRow | null> {
  const database = await getDatabase();
  const result = await database.select<CharacterRow[]>(
    'SELECT * FROM characters WHERE id = ?',
    [id]
  );
  return result[0] ?? null;
}

/**
 * Insert a new character
 */
export async function insertCharacter(
  id: string,
  data: string,
  name: string,
  characterClass: string,
  level: number
): Promise<void> {
  const database = await getDatabase();
  const now = new Date().toISOString();
  
  await database.execute(
    `INSERT INTO characters (id, data, name, character_class, level, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, data, name, characterClass, level, now, now]
  );
}

/**
 * Update an existing character
 */
export async function updateCharacter(
  id: string,
  data: string,
  name: string,
  characterClass: string,
  level: number
): Promise<void> {
  const database = await getDatabase();
  const now = new Date().toISOString();
  
  await database.execute(
    `UPDATE characters 
     SET data = ?, name = ?, character_class = ?, level = ?, updated_at = ?
     WHERE id = ?`,
    [data, name, characterClass, level, now, id]
  );
}

/**
 * Delete a character by ID
 */
export async function deleteCharacterById(id: string): Promise<void> {
  const database = await getDatabase();
  await database.execute('DELETE FROM characters WHERE id = ?', [id]);
}

/**
 * Delete all characters
 */
export async function deleteAllCharacters(): Promise<void> {
  const database = await getDatabase();
  await database.execute('DELETE FROM characters');
}

// ============================================
// SETTINGS OPERATIONS
// ============================================

/**
 * Get a setting value
 */
export async function getSetting(key: string): Promise<string | null> {
  const database = await getDatabase();
  const result = await database.select<{ value: string }[]>(
    'SELECT value FROM settings WHERE key = ?',
    [key]
  );
  return result[0]?.value ?? null;
}

/**
 * Set a setting value
 */
export async function setSetting(key: string, value: string): Promise<void> {
  const database = await getDatabase();
  await database.execute(
    `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
    [key, value]
  );
}

/**
 * Delete a setting
 */
export async function deleteSetting(key: string): Promise<void> {
  const database = await getDatabase();
  await database.execute('DELETE FROM settings WHERE key = ?', [key]);
}

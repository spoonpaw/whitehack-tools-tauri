/**
 * Enums.ts - All enum and constant types for Whitehack Tools
 */

// ============================================
// CHARACTER CLASS
// ============================================
export type CharacterClass = 'Deft' | 'Strong' | 'Wise' | 'Brave' | 'Clever' | 'Fortunate';

export const CHARACTER_CLASSES: CharacterClass[] = [
  'Deft',
  'Strong', 
  'Wise',
  'Brave',
  'Clever',
  'Fortunate'
];

// ============================================
// DEFT CLASS - ATTUNEMENT TYPES
// ============================================
export type AttunementType = 'item' | 'teacher' | 'vehicle' | 'pet' | 'place';

export const ATTUNEMENT_TYPES: { value: AttunementType; label: string }[] = [
  { value: 'item', label: 'Item' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'pet', label: 'Pet' },
  { value: 'place', label: 'Place' }
];

// ============================================
// STRONG CLASS - COMBAT OPTIONS
// ============================================
export type StrongCombatOptionId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// ============================================
// STRONG CLASS - CONFLICT LOOT TYPES
// ============================================
export type ConflictLootType = 'special' | 'substance' | 'supernatural';

export const CONFLICT_LOOT_TYPES: { value: ConflictLootType; label: string }[] = [
  { value: 'special', label: 'Special' },
  { value: 'substance', label: 'Substance' },
  { value: 'supernatural', label: 'Supernatural' }
];

// ============================================
// BRAVE CLASS - QUIRK IDS
// ============================================
export type BraveQuirkId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// ============================================
// CLEVER CLASS - KNACK IDS
// ============================================
export type CleverKnackId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// ============================================
// EQUIPMENT - WEIGHT CATEGORIES
// ============================================
export type WeightCategory = 'No Size' | 'Minor' | 'Regular' | 'Heavy';

export const WEIGHT_CATEGORIES: WeightCategory[] = [
  'No Size',
  'Minor',
  'Regular',
  'Heavy'
];

// Encumbrance values for each weight category
export const WEIGHT_VALUES: Record<WeightCategory, number> = {
  'No Size': 1,
  'Minor': 2,
  'Regular': 10,
  'Heavy': 20
};

// ============================================
// CUSTOM ATTRIBUTE ICONS
// ============================================
export type CustomAttributeIcon =
  | 'barbell'
  | 'personSimpleRun'
  | 'heart'
  | 'brain'
  | 'eye'
  | 'crown'
  | 'sword'
  | 'shield'
  | 'lightning'
  | 'flame'
  | 'moon'
  | 'scroll'
  | 'magicWand'
  | 'target'
  | 'arrowsOutCardinal'
  | 'sparkle'
  | 'shieldStar'
  | 'skull'
  | 'crosshair'
  | 'scales'
  | 'spiral'
  | 'infinity'
  | 'waves'
  | 'hourglass'
  | 'drop'
  | 'wind'
  | 'handFist'
  | 'bandage'
  | 'star'
  | 'atom'
  | 'compass'
  | 'clover';

export const CUSTOM_ATTRIBUTE_ICONS: CustomAttributeIcon[] = [
  'barbell',
  'personSimpleRun',
  'heart',
  'brain',
  'eye',
  'crown',
  'sword',
  'shield',
  'lightning',
  'flame',
  'moon',
  'scroll',
  'magicWand',
  'target',
  'arrowsOutCardinal',
  'sparkle',
  'shieldStar',
  'skull',
  'crosshair',
  'scales',
  'spiral',
  'infinity',
  'waves',
  'hourglass',
  'drop',
  'wind',
  'handFist',
  'bandage',
  'star',
  'atom',
  'compass',
  'clover'
];

# Whitehack Tools - Tauri (Windows) Development Plan

> **Goal:** Fully clone the functionality of the Swift/macOS and Kotlin/Android apps for Windows using Tauri v2 + SvelteKit + Tailwind CSS.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Data Model](#data-model)
4. [Feature Inventory](#feature-inventory)
5. [UI Architecture](#ui-architecture)
6. [Implementation Phases](#implementation-phases)
7. [**Detailed Step-by-Step Checklist**](#detailed-step-by-step-implementation-checklist) ⭐
8. [Cross-Platform Compatibility](#cross-platform-compatibility)
9. [File Structure](#file-structure)
10. [Component Breakdown](#component-breakdown)
11. [Advancement Tables](#advancement-tables)
12. [Class Ability Reference](#class-ability-reference)
13. [SQLite Schema](#sqlite-schema)
14. [Preset Equipment Data](#preset-equipment-data)
15. [Testing Strategy](#testing-strategy)
16. [Computed Values & Formulas](#computed-values--formulas)
17. [Default Character Values](#default-character-values)
18. [Navigation State](#navigation-state)
19. [Form Validation Rules](#form-validation-rules)
20. [Theming Details](#theming-details)
21. [Notes](#notes)

---

## 🎯 Overview

Whitehack Tools is a character management application for the Whitehack tabletop RPG system. The app allows players to:

- Create and manage multiple player characters
- Track all character stats, equipment, and abilities
- Handle class-specific features (6 character classes)
- Import/export characters for sharing (cross-platform JSON)
- Calculate derived stats automatically (attack value, save value, XP progress)

### Existing Platforms
| Platform | Tech | Status |
|----------|------|--------|
| macOS/iOS | Swift/SwiftUI | ✅ Complete |
| Android | Kotlin/Compose | ✅ Complete |
| Windows | Tauri/SvelteKit | 🚧 This project |

---

## 🛠 Tech Stack

### Frontend
- **Framework:** SvelteKit 2.x (SSG mode)
- **Styling:** Tailwind CSS 3.x
- **Icons:** Phosphor Icons (to match Swift/Kotlin versions)
- **State Management:** Svelte 5 runes (`$state`, `$derived`)
- **Forms:** Native Svelte with validation

### Backend (Tauri)
- **Runtime:** Tauri v2
- **Language:** Rust
- **Database:** SQLite (via `@tauri-apps/plugin-sql`)
- **Filesystem:** `@tauri-apps/plugin-fs`

### Already Configured (from boilerplate)
- ✅ Tauri v2 with Rust backend
- ✅ SvelteKit with SSG
- ✅ Tailwind CSS with dark mode
- ✅ SQLite plugin
- ✅ Filesystem plugin
- ✅ TypeScript
- ✅ Rust ↔ Frontend IPC

---

## 📊 Data Model

### Core: PlayerCharacter

Based on the canonical schema in `whitehack-tools-schema/`:

```typescript
interface PlayerCharacter {
  // Identity
  id: UUID
  name: string
  playerName: string
  characterClass: CharacterClass  // 'Deft' | 'Strong' | 'Wise' | 'Brave' | 'Clever' | 'Fortunate'
  level: number                   // 1-10

  // Attributes Configuration
  useCustomAttributes: boolean
  customAttributes: CustomAttribute[]

  // Standard Attributes (when useCustomAttributes = false)
  strength: number      // 1-20
  agility: number       // 1-20
  toughness: number     // 1-20
  intelligence: number  // 1-20
  willpower: number     // 1-20
  charisma: number      // 1-20

  // Combat Stats
  currentHP: number
  maxHP: number
  movement: number      // 0-999
  saveColor: string

  // Computed (from AdvancementTables)
  attackValue: number   // Based on class + level
  saveValue: number     // Based on class + level

  // Groups
  speciesGroup: string | null
  vocationGroup: string | null
  affiliationGroups: string[]
  attributeGroupPairs: AttributeGroupPair[]

  // Class-Specific Properties
  attunementSlots: AttunementSlot[]       // Deft
  strongCombatOptions: StrongCombatOptions // Strong
  currentConflictLoot: ConflictLoot | null // Strong
  wiseMiracleSlots: WiseMiracleSlot[]     // Wise
  braveQuirkOptions: BraveQuirkOptions    // Brave
  comebackDice: number                     // Brave
  hasUsedSayNo: boolean                    // Brave
  cleverKnackOptions: CleverKnackOptions  // Clever
  fortunateOptions: FortunateOptions      // Fortunate

  // Equipment
  weapons: Weapon[]
  armor: Armor[]
  gear: Gear[]

  // Economy
  coinsOnHand: number
  stashedCoins: number

  // Other
  languages: string[]
  notes: string
  experience: number
  corruption: number
  maxEncumbrance: number
  inventory: unknown[]  // Legacy, always empty
}
```

### Character Classes & Special Features

| Class | Special Features |
|-------|------------------|
| **Deft** | Attunement slots (item/teacher/vehicle/pet/place), up to 4 attunements per slot |
| **Strong** | Combat options (8 types), conflict loot, +1 AV if STR ≥ 13 |
| **Wise** | Miracle slots, base/additional miracles, magic items |
| **Brave** | Quirks (8 types), comeback dice, "say no" power |
| **Clever** | Knacks (9 types), unorthodox bonus, combat exploiter die |
| **Fortunate** | Standing, retainers, signature object, fortune usage |

### Supporting Types

```typescript
// Attribute-Group linking
interface AttributeGroupPair {
  id: UUID
  attribute: string    // e.g., "Strength", "Agility"
  group: string        // Group name this attribute is linked to
}

// Custom attributes (when useCustomAttributes = true)
interface CustomAttribute {
  id: UUID
  name: string
  value: number        // 1-20
  icon: CustomAttributeIcon
}

type CustomAttributeIcon = 
  | 'barbell' | 'personSimpleRun' | 'heart' | 'brain' | 'eye' | 'crown'
  | 'sword' | 'shield' | 'lightning' | 'flame' | 'moon' | 'scroll'
  | 'magicWand' | 'target' | 'arrowsOutCardinal' | 'sparkle' | 'shieldStar'
  | 'skull' | 'crosshair' | 'scales' | 'spiral' | 'infinity' | 'waves'
  | 'hourglass' | 'drop' | 'wind' | 'handFist' | 'bandage' | 'star'
  | 'atom' | 'compass' | 'clover'
```

### Class-Specific Types

```typescript
// ═══════════════════════════════════════════════════════════════
// DEFT CLASS
// ═══════════════════════════════════════════════════════════════
type AttunementType = 'item' | 'teacher' | 'vehicle' | 'pet' | 'place'

interface Attunement {
  id: UUID
  name: string
  isActive: boolean
  type: AttunementType
  isLost: boolean      // If true, becomes keyword giving +1 to related tasks
}

interface AttunementSlot {
  id: UUID
  primaryAttunement: Attunement
  secondaryAttunement: Attunement
  tertiaryAttunement: Attunement
  quaternaryAttunement: Attunement
  hasTertiaryAttunement: boolean
  hasQuaternaryAttunement: boolean
  hasUsedDailyPower: boolean
}

// ═══════════════════════════════════════════════════════════════
// STRONG CLASS
// ═══════════════════════════════════════════════════════════════
// Combat options stored as numeric IDs (0-7)
type StrongCombatOptionId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

interface StrongCombatOptions {
  slots: (StrongCombatOptionId | null)[]  // Array of 10 slots
}

type ConflictLootType = 'special' | 'substance' | 'supernatural'

interface ConflictLoot {
  keyword: string
  type: ConflictLootType
  usesRemaining: number
}

// ═══════════════════════════════════════════════════════════════
// WISE CLASS
// ═══════════════════════════════════════════════════════════════
interface WiseMiracle {
  id: UUID
  name: string
  isActive: boolean
  isAdditional: boolean
}

interface WiseMiracleSlot {
  id: UUID
  baseMiracles: WiseMiracle[]
  additionalMiracles: WiseMiracle[]
  isMagicItem: boolean
  magicItemName: string
  additionalMiracleCount: number
}

// ═══════════════════════════════════════════════════════════════
// BRAVE CLASS
// ═══════════════════════════════════════════════════════════════
// Quirks stored as numeric IDs (0-7)
type BraveQuirkId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

interface BraveQuirkSlot {
  id: UUID
  quirk?: BraveQuirkId
  protectedAllyName: string  // Only used when quirk = 2 (Protect Ally)
}

interface BraveQuirkOptions {
  slots: BraveQuirkSlot[]    // Array of 10 slots
}

// ═══════════════════════════════════════════════════════════════
// CLEVER CLASS
// ═══════════════════════════════════════════════════════════════
// Knacks stored as numeric IDs (0-8)
type CleverKnackId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

interface CleverKnackSlot {
  id: UUID
  knack?: CleverKnackId
  hasUsedCombatDie: boolean  // Only for Combat Exploiter (0)
}

interface CleverKnackOptions {
  slots: CleverKnackSlot[]
  hasUsedUnorthodoxBonus: boolean
}

// ═══════════════════════════════════════════════════════════════
// FORTUNATE CLASS
// ═══════════════════════════════════════════════════════════════
interface SignatureObject {
  name: string
}

interface Retainer {
  id: UUID
  name: string
  type: string           // Butler, Knight, Spy, Horse, etc.
  hitDice: number
  defenseFactor: number
  movement: number
  keywords: string[]
  attitude: string       // Devoted, Professional, Mercenary, Bonded
  notes: string
  currentHP: number
  maxHP: number
}

interface FortunateOptions {
  standing: string
  hasUsedFortune: boolean
  newKeyword: string
  retainers: Retainer[]
  signatureObject: SignatureObject
}
```

### Equipment Types

```typescript
interface Weapon {
  id: UUID
  name: string
  damage: string        // e.g., "1d6", "1d8+1"
  weight: string        // 'No Size' | 'Minor' | 'Regular' | 'Heavy'
  range: string
  rateOfFire: string
  special: string
  isEquipped: boolean
  isStashed: boolean
  isMagical: boolean
  isCursed: boolean
  bonus: number
  quantity: number
}

interface Armor {
  id: UUID
  name: string
  df: number           // Defense Factor
  weight: number       // Slots
  special: string
  quantity: number
  isEquipped: boolean
  isStashed: boolean
  isMagical: boolean
  isCursed: boolean
  bonus: number
  isShield: boolean    // Shield vs body armor
}

interface Gear {
  id: UUID
  name: string
  weight: string       // 'No Size' | 'Minor' | 'Regular' | 'Heavy'
  special: string
  quantity: number
  isEquipped: boolean
  isStashed: boolean
  isMagical: boolean
  isCursed: boolean
  isContainer: boolean
}
```

### Enums Reference

```typescript
type CharacterClass = 'Deft' | 'Strong' | 'Wise' | 'Brave' | 'Clever' | 'Fortunate'
type WeightCategory = 'No Size' | 'Minor' | 'Regular' | 'Heavy'
```

---

## ✅ Feature Inventory

### Core Features
- [ ] Character list view (grid/list of characters)
- [ ] Character detail view (read-only display)
- [ ] Character form view (create/edit)
- [ ] Delete character with confirmation
- [ ] Local persistence (SQLite)
- [ ] Auto-save on changes

### Character Data Features
- [ ] Basic info (name, player name, class, level)
- [ ] Standard attributes (STR, AGI, TOU, INT, WIL, CHA)
- [ ] Custom attributes (name, value, icon selection)
- [ ] Combat stats (HP current/max, movement, save color)
- [ ] Computed stats (attack value, save value, defense value)
- [ ] Groups (species, vocation, affiliations)
- [ ] Attribute-group pairs

### Class-Specific Features
- [ ] **Deft:** Attunement slots management
- [ ] **Strong:** Combat options selection, conflict loot
- [ ] **Wise:** Miracle slots, magic items
- [ ] **Brave:** Quirk selection, comeback dice, "say no"
- [ ] **Clever:** Knack selection, daily powers
- [ ] **Fortunate:** Standing, retainers, signature object

### Equipment Features
- [ ] Weapons (add/edit/delete, equip/stash)
- [ ] Armor (add/edit/delete, equip/stash, shields)
- [ ] Gear (add/edit/delete, containers)
- [ ] Gold management (on-hand, stashed)
- [ ] Encumbrance calculation

### Progression Features
- [ ] Experience points tracking
- [ ] XP progress bar to next level
- [ ] Level-up indicator
- [ ] Advancement tables (class-specific)

### Import/Export Features
- [ ] Export single character to JSON
- [ ] Export all characters to JSON
- [ ] Import character(s) from JSON
- [ ] Cross-platform format compatibility
- [ ] Copy to clipboard functionality

### Additional Features
- [ ] Languages list
- [ ] Notes (free-form text)
- [ ] Corruption counter

---

## 🏗 UI Architecture

### Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Whitehack Tools                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  [Import]  [Export]                        [+ New]      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    CHARACTER LIST                        │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  [Icon] Character Name                             │ │ │
│  │  │         Class Badge  Level Badge                    │ │ │
│  │  │         Species • Vocation                    [🗑]  │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  ... more characters ...                           │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Detail View Tabs

```
┌─────────────────────────────────────────────────────────────┐
│  [← Back]              Character Name            [Edit]     │
├─────────────────────────────────────────────────────────────┤
│      [ℹ Info]         [⚔ Combat]         [🎒 Equipment]      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  INFO TAB:                                                   │
│  ├── Basic Info (Header)                                    │
│  ├── Stats (Attributes)                                     │
│  ├── Progress (XP Bar)                                      │
│  ├── Groups (Species/Vocation/Affiliations)                 │
│  ├── Languages                                              │
│  ├── [Class-Specific Section]                               │
│  ├── Additional Info                                        │
│  └── Notes                                                  │
│                                                              │
│  COMBAT TAB:                                                │
│  ├── Combat Stats (HP, AV, DF, Save, Movement)             │
│  └── Combat Details                                         │
│                                                              │
│  EQUIPMENT TAB:                                             │
│  ├── Weapons                                                │
│  ├── Armor                                                  │
│  ├── Gear                                                   │
│  ├── Gold                                                   │
│  └── Encumbrance                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Form View Tabs

Same tab structure as detail view, but with editable inputs.

---

## 📅 Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up data models in TypeScript
- [ ] Port AdvancementTables to TypeScript
- [ ] Create SQLite schema for characters
- [ ] Implement CharacterStore (Svelte store + SQLite)
- [ ] Basic CRUD operations via Tauri commands

### Phase 2: Character List (Week 1-2)
- [ ] CharacterListView component
- [ ] CharacterListRow component
- [ ] Class icons and colors
- [ ] Empty state
- [ ] Delete functionality

### Phase 3: Character Detail View (Week 2-3)
- [ ] TabPicker component
- [ ] DetailHeaderSection
- [ ] DetailStatsSection
- [ ] DetailProgressSection
- [ ] DetailCombatSection
- [ ] DetailGroupsSection
- [ ] DetailLanguagesSection
- [ ] DetailNotesSection
- [ ] DetailAdditionalInfoSection

### Phase 4: Class-Specific Detail Sections (Week 3-4)
- [ ] DetailDeftAttunementSection
- [ ] DetailStrongCombatSection
- [ ] DetailWiseMiracleSection
- [ ] DetailBraveQuirksSection
- [ ] DetailCleverKnacksSection
- [ ] DetailFortunateSection

### Phase 5: Equipment Sections (Week 4)
- [ ] DetailWeaponsSection
- [ ] DetailArmorSection
- [ ] DetailEquipmentSection (Gear)
- [ ] DetailGoldSection
- [ ] DetailEncumbranceSection

### Phase 6: Character Form (Week 5-6)
- [ ] FormBasicInfoSection
- [ ] FormAttributesSection
- [ ] FormCombatSection
- [ ] FormGroupsSection
- [ ] FormLanguagesSection
- [ ] Form validation
- [ ] Auto-save functionality

### Phase 7: Class-Specific Form Sections (Week 6-7)
- [ ] FormDeftSection
- [ ] FormStrongSection
- [ ] FormWiseSection
- [ ] FormBraveSection
- [ ] FormCleverSection
- [ ] FormFortunateSection

### Phase 8: Equipment Forms (Week 7)
- [ ] FormWeaponsSection
- [ ] FormArmorSection
- [ ] FormGearSection
- [ ] FormGoldSection

### Phase 9: Import/Export (Week 8)
- [ ] JSON export (single/all characters)
- [ ] JSON import with validation
- [ ] Cross-platform format support
- [ ] Copy to clipboard
- [ ] File save dialog

### Phase 10: Polish & Testing (Week 8-9)
- [ ] Responsive design refinement
- [ ] Dark/light mode theming
- [ ] Animations and transitions
- [ ] Error handling
- [ ] Edge case testing
- [ ] Cross-platform import testing

---

## 📝 Detailed Step-by-Step Implementation Checklist

This is the granular todo list for building the app from scratch. Each task is atomic and ordered by dependency.

---

### 🔧 PHASE 1: Project Setup & Foundation

#### 1.1 Verify Boilerplate Setup
- [ ] Run `./setup.sh` to install dependencies
- [ ] Run `./dev.sh` to verify boilerplate works
- [ ] Verify SQLite plugin is functional (test in `/test` route)
- [ ] Verify filesystem plugin is functional
- [ ] Test build with `./build.sh`

#### 1.2 Install Additional Dependencies
```bash
cd frontend
npm install phosphor-svelte uuid
npm install -D @types/uuid
```
- [ ] Install `phosphor-svelte` for icons
- [ ] Install `uuid` for generating UUIDs
- [ ] Verify icons work by adding test icon to page

#### 1.3 Create Directory Structure
- [ ] Create `src/lib/models/` directory
- [ ] Create `src/lib/stores/` directory
- [ ] Create `src/lib/utils/` directory
- [ ] Create `src/lib/data/` directory
- [ ] Create `src/lib/components/ui/` directory
- [ ] Create `src/lib/components/character/` directory
- [ ] Create `src/lib/components/character/detail/` directory
- [ ] Create `src/lib/components/character/detail/class-specific/` directory
- [ ] Create `src/lib/components/character/form/` directory
- [ ] Create `src/lib/components/character/form/class-specific/` directory
- [ ] Create `src/lib/components/import-export/` directory

#### 1.4 Create Enum Types
File: `src/lib/models/Enums.ts`
- [ ] Define `CharacterClass` type
- [ ] Define `AttunementType` type
- [ ] Define `ConflictLootType` type
- [ ] Define `WeightCategory` type
- [ ] Define `CustomAttributeIcon` type
- [ ] Define `StrongCombatOptionId` type (0-7)
- [ ] Define `BraveQuirkId` type (0-7)
- [ ] Define `CleverKnackId` type (0-8)
- [ ] Export all types

#### 1.5 Create Class Feature Types
File: `src/lib/models/ClassFeatures.ts`
- [ ] Define `Attunement` interface
- [ ] Define `AttunementSlot` interface
- [ ] Define `StrongCombatOptions` interface
- [ ] Define `ConflictLoot` interface
- [ ] Define `WiseMiracle` interface
- [ ] Define `WiseMiracleSlot` interface
- [ ] Define `BraveQuirkSlot` interface
- [ ] Define `BraveQuirkOptions` interface
- [ ] Define `CleverKnackSlot` interface
- [ ] Define `CleverKnackOptions` interface
- [ ] Define `SignatureObject` interface
- [ ] Define `Retainer` interface
- [ ] Define `FortunateOptions` interface
- [ ] Export all interfaces

#### 1.6 Create Equipment Types
File: `src/lib/models/Equipment.ts`
- [ ] Define `Weapon` interface
- [ ] Define `Armor` interface
- [ ] Define `Gear` interface
- [ ] Export all interfaces

#### 1.7 Create Main PlayerCharacter Type
File: `src/lib/models/PlayerCharacter.ts`
- [ ] Import all sub-types
- [ ] Define `AttributeGroupPair` interface
- [ ] Define `CustomAttribute` interface
- [ ] Define `PlayerCharacter` interface (all fields)
- [ ] Define `createDefaultCharacter()` factory function
- [ ] Export all

#### 1.8 Create Barrel Export
File: `src/lib/models/index.ts`
- [ ] Re-export all from `Enums.ts`
- [ ] Re-export all from `ClassFeatures.ts`
- [ ] Re-export all from `Equipment.ts`
- [ ] Re-export all from `PlayerCharacter.ts`

#### 1.9 Create Advancement Tables Utility
File: `src/lib/utils/AdvancementTables.ts`
- [ ] Define `CharacterStats` interface
- [ ] Create stat progressions object for all 6 classes (10 levels each)
- [ ] Create XP requirements object for all 6 classes
- [ ] Implement `getStats(class, level)` function
- [ ] Implement `getAttackValue(class, level)` function
- [ ] Implement `getSaveValue(class, level)` function
- [ ] Implement `getSlots(class, level)` function
- [ ] Implement `getGroups(class, level)` function
- [ ] Implement `xpRequirement(class, level)` function
- [ ] Implement `computeLevel(class, xp)` function
- [ ] Add unit tests for all functions

#### 1.10 Create Computed Value Utilities
File: `src/lib/utils/computed.ts`
- [ ] Implement `computeAttackValue(class, level, strength)` 
- [ ] Implement `computeSaveValue(class, level)`
- [ ] Implement `computeDefenseValue(armor[])`
- [ ] Implement `computeInitiativeBonus(agility, useCustom)`
- [ ] Implement `computeXPProgress(class, level, xp)`
- [ ] Implement `computeEncumbrance(gear[])`
- [ ] Export all functions

#### 1.11 Create Class Colors Utility
File: `src/lib/utils/classColors.ts`
- [ ] Define `CLASS_COLORS` object with RGB values for all 6 classes
- [ ] Implement `getClassColor(class)` → returns hex color
- [ ] Implement `getClassColorRGB(class)` → returns `rgb(r,g,b)` string
- [ ] Implement `getClassColorWithOpacity(class, opacity)` → returns `rgba()`
- [ ] Export all

#### 1.12 Create Class Descriptions Utility
File: `src/lib/utils/classDescriptions.ts`
- [ ] Define `STRONG_COMBAT_OPTIONS` array with {id, name, description}
- [ ] Define `BRAVE_QUIRKS` array with {id, name, description}
- [ ] Define `CLEVER_KNACKS` array with {id, name, description}
- [ ] Define `ATTUNEMENT_TYPES` array with {value, label}
- [ ] Define `CONFLICT_LOOT_TYPES` array with {value, label}
- [ ] Export all

#### 1.13 Create Preset Data Files
File: `src/lib/data/weapons.ts`
- [ ] Define `PRESET_WEAPONS` array (26 weapons from WeaponData.swift)
- [ ] Export array

File: `src/lib/data/armor.ts`
- [ ] Define `PRESET_ARMOR` array (7 armor types from ArmorData.swift)
- [ ] Export array

File: `src/lib/data/gear.ts`
- [ ] Define `PRESET_GEAR` array (70+ items from GearData.swift)
- [ ] Export array

---

### 💾 PHASE 2: Database & State Management

#### 2.1 Create SQLite Database Setup
File: `src/lib/stores/database.ts`
- [ ] Import Tauri SQL plugin
- [ ] Create `initDatabase()` function that creates tables
- [ ] Define SQL for `characters` table
- [ ] Define SQL for `settings` table
- [ ] Add indexes for name, class, updated_at
- [ ] Export database instance

#### 2.2 Create Character Store
File: `src/lib/stores/characters.ts`
- [ ] Import database functions
- [ ] Create `characters` Svelte store (using `$state` rune)
- [ ] Implement `loadCharacters()` - fetch all from DB
- [ ] Implement `getCharacter(id)` - fetch single by ID
- [ ] Implement `createCharacter(data)` - insert new
- [ ] Implement `updateCharacter(id, data)` - update existing
- [ ] Implement `deleteCharacter(id)` - delete by ID
- [ ] Implement `importCharacters(json)` - bulk import
- [ ] Implement `exportCharacters(ids?)` - export to JSON
- [ ] Handle DB errors gracefully
- [ ] Export store and functions

#### 2.3 Create UI Store
File: `src/lib/stores/ui.ts`
- [ ] Create `currentView` state (list | detail | form)
- [ ] Create `selectedCharacterId` state
- [ ] Create `selectedTab` state (info | combat | equipment)
- [ ] Create `showImportModal` state
- [ ] Create `showExportModal` state
- [ ] Create `deleteConfirmId` state
- [ ] Create `theme` state (light | dark | system)
- [ ] Implement `navigateToList()` function
- [ ] Implement `navigateToDetail(id, tab?)` function
- [ ] Implement `navigateToForm(id?, tab?)` function
- [ ] Export all

#### 2.4 Create Settings Store
File: `src/lib/stores/settings.ts`
- [ ] Implement `loadSettings()` from DB
- [ ] Implement `saveSetting(key, value)` to DB
- [ ] Implement `getSetting(key)` from DB
- [ ] Handle theme persistence
- [ ] Export functions

#### 2.5 Initialize App State
File: `src/routes/+layout.svelte`
- [ ] Import database init function
- [ ] Import character store
- [ ] Call `initDatabase()` on mount
- [ ] Call `loadCharacters()` on mount
- [ ] Load saved theme setting
- [ ] Apply theme class to document

---

### 🎨 PHASE 3: Base UI Components

#### 3.1 Create Button Component
File: `src/lib/components/ui/Button.svelte`
- [ ] Accept `variant` prop (primary | secondary | danger | ghost)
- [ ] Accept `size` prop (sm | md | lg)
- [ ] Accept `disabled` prop
- [ ] Accept `loading` prop with spinner
- [ ] Style with Tailwind for all variants
- [ ] Handle click events
- [ ] Add hover/focus states

#### 3.2 Create Card Component
File: `src/lib/components/ui/Card.svelte`
- [ ] Accept `title` prop (optional)
- [ ] Accept `icon` prop (optional)
- [ ] Accept slot for content
- [ ] Style with rounded corners, border, padding
- [ ] Support dark mode

#### 3.3 Create Input Component
File: `src/lib/components/ui/Input.svelte`
- [ ] Accept `label` prop
- [ ] Accept `type` prop (text | number | email)
- [ ] Accept `placeholder` prop
- [ ] Accept `error` prop for validation message
- [ ] Accept `disabled` prop
- [ ] Bind to `value`
- [ ] Style label, input, error states
- [ ] Support dark mode

#### 3.4 Create NumericInput Component
File: `src/lib/components/ui/NumericInput.svelte`
- [ ] Accept `label` prop
- [ ] Accept `min` and `max` props
- [ ] Accept `step` prop (default 1)
- [ ] Accept `error` prop
- [ ] Add -/+ buttons on sides
- [ ] Bind to `value`
- [ ] Prevent invalid input
- [ ] Style with Tailwind

#### 3.5 Create TextArea Component
File: `src/lib/components/ui/TextArea.svelte`
- [ ] Accept `label` prop
- [ ] Accept `placeholder` prop
- [ ] Accept `rows` prop
- [ ] Accept `maxLength` prop
- [ ] Bind to `value`
- [ ] Show character count (optional)
- [ ] Style with Tailwind

#### 3.6 Create Select Component
File: `src/lib/components/ui/Select.svelte`
- [ ] Accept `label` prop
- [ ] Accept `options` array prop ({value, label})
- [ ] Accept `placeholder` prop
- [ ] Accept `error` prop
- [ ] Bind to `value`
- [ ] Style with Tailwind
- [ ] Support dark mode

#### 3.7 Create Checkbox Component
File: `src/lib/components/ui/Checkbox.svelte`
- [ ] Accept `label` prop
- [ ] Bind to `checked`
- [ ] Style custom checkbox
- [ ] Support dark mode

#### 3.8 Create Toggle Component
File: `src/lib/components/ui/Toggle.svelte`
- [ ] Accept `label` prop
- [ ] Bind to `checked`
- [ ] Animate toggle slide
- [ ] Style with Tailwind

#### 3.9 Create Badge Component
File: `src/lib/components/ui/Badge.svelte`
- [ ] Accept `variant` prop (default | class colors)
- [ ] Accept `size` prop (sm | md)
- [ ] Accept slot for text
- [ ] Style as pill/capsule shape
- [ ] Support all 6 class colors

#### 3.10 Create IconCircle Component
File: `src/lib/components/ui/IconCircle.svelte`
- [ ] Accept `icon` prop (Phosphor icon component)
- [ ] Accept `color` prop (hex or class name)
- [ ] Accept `size` prop (sm | md | lg)
- [ ] Render icon in colored circle
- [ ] Background uses color with opacity

#### 3.11 Create TabPicker Component
File: `src/lib/components/ui/TabPicker.svelte`
- [ ] Accept `tabs` array prop ({id, label, icon})
- [ ] Bind to `selected` (tab id)
- [ ] Style tabs horizontally
- [ ] Highlight selected tab
- [ ] Add transition on selection change
- [ ] Support icons in tabs

#### 3.12 Create ProgressBar Component
File: `src/lib/components/ui/ProgressBar.svelte`
- [ ] Accept `value` prop (0-1)
- [ ] Accept `color` prop
- [ ] Accept `showLabel` prop
- [ ] Accept `label` text prop
- [ ] Animate bar fill
- [ ] Style with Tailwind

#### 3.13 Create Modal Component
File: `src/lib/components/ui/Modal.svelte`
- [ ] Accept `open` prop
- [ ] Accept `title` prop
- [ ] Accept slot for content
- [ ] Accept slot for footer/actions
- [ ] Add backdrop click to close
- [ ] Add Escape key to close
- [ ] Trap focus inside modal
- [ ] Animate open/close
- [ ] Style with Tailwind

#### 3.14 Create ConfirmDialog Component
File: `src/lib/components/ui/ConfirmDialog.svelte`
- [ ] Accept `open` prop
- [ ] Accept `title` prop
- [ ] Accept `message` prop
- [ ] Accept `confirmText` prop (default "Delete")
- [ ] Accept `cancelText` prop (default "Cancel")
- [ ] Accept `variant` prop (danger | warning)
- [ ] Dispatch `confirm` event
- [ ] Dispatch `cancel` event
- [ ] Use Modal internally

#### 3.15 Create SectionHeader Component
File: `src/lib/components/ui/SectionHeader.svelte`
- [ ] Accept `title` prop
- [ ] Accept `icon` prop (optional)
- [ ] Style as section divider
- [ ] Support dark mode

#### 3.16 Create EmptyState Component
File: `src/lib/components/ui/EmptyState.svelte`
- [ ] Accept `icon` prop
- [ ] Accept `title` prop
- [ ] Accept `message` prop
- [ ] Accept slot for action button
- [ ] Style centered with muted colors

---

### 📋 PHASE 4: Character List View

#### 4.1 Create Main App Shell
File: `src/routes/+page.svelte`
- [ ] Import UI store
- [ ] Import CharacterList, CharacterDetail, CharacterForm
- [ ] Conditionally render based on `currentView`
- [ ] Add CSS transitions between views

#### 4.2 Create CharacterList Component
File: `src/lib/components/character/CharacterList.svelte`
- [ ] Import character store
- [ ] Import UI store
- [ ] Create header with Import/Export/New buttons
- [ ] Render list of CharacterListRow components
- [ ] Show EmptyState when no characters
- [ ] Handle delete confirmation modal

#### 4.3 Create CharacterListRow Component
File: `src/lib/components/character/CharacterListRow.svelte`
- [ ] Accept `character` prop
- [ ] Import class colors utility
- [ ] Render class icon in IconCircle
- [ ] Render character name (or "Unnamed Character")
- [ ] Render class badge with class color
- [ ] Render level badge
- [ ] Render species (if set)
- [ ] Render vocation (if set)
- [ ] Add delete button
- [ ] Make entire row clickable to view detail
- [ ] Add hover state
- [ ] Add shadow/card styling

#### 4.4 Wire Up List Interactions
- [ ] Click row → `navigateToDetail(id)`
- [ ] Click "+" button → `navigateToForm(null)`
- [ ] Click delete → show confirm dialog
- [ ] Confirm delete → `deleteCharacter(id)`
- [ ] Click Import → open import modal
- [ ] Click Export → open export modal

#### 4.5 Test Character List
- [ ] Verify empty state shows correctly
- [ ] Create test character manually in DB
- [ ] Verify character displays in list
- [ ] Verify class colors are correct
- [ ] Verify delete works
- [ ] Verify navigation to detail works

---

### 👁️ PHASE 5: Character Detail View (Info Tab)

#### 5.1 Create CharacterDetail Container
File: `src/lib/components/character/CharacterDetail.svelte`
- [ ] Accept `characterId` prop
- [ ] Fetch character from store on mount
- [ ] Create header with Back button and Edit button
- [ ] Display character name in header
- [ ] Add TabPicker (Info | Combat | Equipment)
- [ ] Conditionally render tab content
- [ ] Handle character not found

#### 5.2 Create DetailHeader Section
File: `src/lib/components/character/detail/DetailHeader.svelte`
- [ ] Accept `character` prop
- [ ] Display name (large, bold)
- [ ] Display player name (if set)
- [ ] Display class badge with icon and color
- [ ] Display level badge
- [ ] Display species group (if set)
- [ ] Display vocation group (if set)

#### 5.3 Create DetailStats Section
File: `src/lib/components/character/detail/DetailStats.svelte`
- [ ] Accept `character` prop
- [ ] If custom attributes: render custom attribute list with icons
- [ ] If standard attributes: render 6 attribute grid
- [ ] Show attribute value prominently
- [ ] Show attribute modifier description (e.g., "Exceptional (+2)")
- [ ] Style as 2-column or 3-column grid

#### 5.4 Create DetailProgress Section
File: `src/lib/components/character/detail/DetailProgress.svelte`
- [ ] Accept `character` prop
- [ ] Show current XP
- [ ] Show XP needed for next level
- [ ] Render ProgressBar with XP progress
- [ ] Show "Level Up!" indicator if `canLevelUp`
- [ ] Show "Max Level" if level 10

#### 5.5 Create DetailGroups Section
File: `src/lib/components/character/detail/DetailGroups.svelte`
- [ ] Accept `character` prop
- [ ] Show species group with icon
- [ ] Show vocation group with icon
- [ ] Show affiliation groups as list/badges
- [ ] Show attribute-group pairs (attribute → group)
- [ ] Handle empty states gracefully

#### 5.6 Create DetailLanguages Section
File: `src/lib/components/character/detail/DetailLanguages.svelte`
- [ ] Accept `character` prop
- [ ] Render languages as badges/pills
- [ ] Show empty state if no languages

#### 5.7 Create DetailAdditionalInfo Section
File: `src/lib/components/character/detail/DetailAdditionalInfo.svelte`
- [ ] Accept `character` prop
- [ ] Show corruption counter (if > 0)
- [ ] Show comeback dice (if Brave class and > 0)
- [ ] Show "Say No" power usage status (if Brave)
- [ ] Show save color (if set)

#### 5.8 Create DetailNotes Section
File: `src/lib/components/character/detail/DetailNotes.svelte`
- [ ] Accept `character` prop
- [ ] Render notes in readable format
- [ ] Preserve line breaks
- [ ] Show empty state if no notes

#### 5.9 Assemble Info Tab
File: `src/lib/components/character/detail/InfoTab.svelte`
- [ ] Import all detail sections
- [ ] Accept `character` prop
- [ ] Render sections in order:
  - [ ] DetailHeader
  - [ ] DetailProgress
  - [ ] DetailStats
  - [ ] DetailGroups
  - [ ] DetailLanguages
  - [ ] [Class-specific section - placeholder]
  - [ ] DetailAdditionalInfo
  - [ ] DetailNotes
- [ ] Add spacing between sections

#### 5.10 Test Info Tab
- [ ] Create test character with all fields populated
- [ ] Verify all sections render correctly
- [ ] Verify custom attributes work
- [ ] Verify standard attributes work
- [ ] Verify XP progress bar is accurate
- [ ] Verify groups display correctly
- [ ] Test with empty optional fields

---

### ⚔️ PHASE 6: Character Detail View (Combat Tab)

#### 6.1 Create DetailCombat Section
File: `src/lib/components/character/detail/DetailCombat.svelte`
- [ ] Accept `character` prop
- [ ] Show HP: current / max (with color coding if low)
- [ ] Show Attack Value (computed)
- [ ] Show Defense Value (computed from armor)
- [ ] Show Save Value (computed)
- [ ] Show Movement
- [ ] Show Initiative Bonus (if applicable)
- [ ] Style as stat grid

#### 6.2 Assemble Combat Tab
File: `src/lib/components/character/detail/CombatTab.svelte`
- [ ] Import DetailCombat
- [ ] Accept `character` prop
- [ ] Render DetailCombat section
- [ ] (Future: add combat actions/trackers)

#### 6.3 Test Combat Tab
- [ ] Verify computed values are correct
- [ ] Test Strong class +1 AV bonus
- [ ] Verify HP display works with various values
- [ ] Test negative HP display

---

### 🎒 PHASE 7: Character Detail View (Equipment Tab)

#### 7.1 Create DetailWeapons Section
File: `src/lib/components/character/detail/DetailWeapons.svelte`
- [ ] Accept `weapons` array prop
- [ ] Render each weapon as row/card
- [ ] Show: name, damage, weight, range, special
- [ ] Show equipped/stashed status
- [ ] Show magical/cursed indicators
- [ ] Show bonus (if any)
- [ ] Show quantity (if > 1)
- [ ] Show empty state if no weapons

#### 7.2 Create DetailArmor Section
File: `src/lib/components/character/detail/DetailArmor.svelte`
- [ ] Accept `armor` array prop
- [ ] Accept `totalDefenseValue` prop
- [ ] Show total DF prominently
- [ ] Render each armor piece as row
- [ ] Show: name, DF, weight, special
- [ ] Indicate if shield vs body armor
- [ ] Show equipped/stashed status
- [ ] Show magical/cursed indicators
- [ ] Show empty state if no armor

#### 7.3 Create DetailEquipment Section (Gear)
File: `src/lib/components/character/detail/DetailEquipment.svelte`
- [ ] Accept `gear` array prop
- [ ] Render each gear item as row
- [ ] Show: name, weight, quantity, special
- [ ] Show equipped/stashed status
- [ ] Indicate containers
- [ ] Show magical/cursed indicators
- [ ] Show empty state if no gear

#### 7.4 Create DetailGold Section
File: `src/lib/components/character/detail/DetailGold.svelte`
- [ ] Accept `character` prop
- [ ] Show coins on hand
- [ ] Show stashed coins
- [ ] Show total coins
- [ ] Style with gold-colored accents

#### 7.5 Create DetailEncumbrance Section
File: `src/lib/components/character/detail/DetailEncumbrance.svelte`
- [ ] Accept `character` prop
- [ ] Compute current encumbrance
- [ ] Show current / max encumbrance
- [ ] Render ProgressBar
- [ ] Color code: green (ok), yellow (near max), red (over)
- [ ] Show encumbrance breakdown by category (optional)

#### 7.6 Assemble Equipment Tab
File: `src/lib/components/character/detail/EquipmentTab.svelte`
- [ ] Import all equipment sections
- [ ] Accept `character` prop
- [ ] Render sections in order:
  - [ ] DetailWeapons
  - [ ] DetailArmor
  - [ ] DetailEquipment
  - [ ] DetailGold
  - [ ] DetailEncumbrance
- [ ] Add spacing between sections

#### 7.7 Test Equipment Tab
- [ ] Create character with weapons, armor, gear
- [ ] Verify all items display correctly
- [ ] Verify encumbrance calculation
- [ ] Verify gold totals
- [ ] Test empty states

---

### 🎭 PHASE 8: Class-Specific Detail Sections

#### 8.1 Create DeftAttunements Section
File: `src/lib/components/character/detail/class-specific/DeftAttunements.svelte`
- [ ] Accept `character` prop
- [ ] Get available slots from AdvancementTables
- [ ] For each attunement slot:
  - [ ] Show slot number
  - [ ] Show primary attunement (name, type, active/lost status)
  - [ ] Show secondary attunement
  - [ ] Show tertiary/quaternary if enabled
  - [ ] Show daily power usage status
- [ ] Handle empty slots gracefully

#### 8.2 Create StrongCombat Section
File: `src/lib/components/character/detail/class-specific/StrongCombat.svelte`
- [ ] Accept `character` prop
- [ ] Show selected combat options with descriptions
- [ ] Show current conflict loot (if any)
  - [ ] Keyword, type, uses remaining
- [ ] Import descriptions from classDescriptions utility

#### 8.3 Create WiseMiracles Section
File: `src/lib/components/character/detail/class-specific/WiseMiracles.svelte`
- [ ] Accept `character` prop
- [ ] Get available slots from AdvancementTables
- [ ] For each miracle slot:
  - [ ] If magic item: show magic item name
  - [ ] Else: show base miracles list
  - [ ] Show additional miracles (if any)
  - [ ] Show active status for each miracle

#### 8.4 Create BraveQuirks Section
File: `src/lib/components/character/detail/class-specific/BraveQuirks.svelte`
- [ ] Accept `character` prop
- [ ] Show selected quirks with descriptions
- [ ] For Protect Ally quirk: show protected ally name
- [ ] Show comeback dice count
- [ ] Show "Say No" power status
- [ ] Import descriptions from classDescriptions utility

#### 8.5 Create CleverKnacks Section
File: `src/lib/components/character/detail/class-specific/CleverKnacks.svelte`
- [ ] Accept `character` prop
- [ ] Show selected knacks with descriptions
- [ ] For Combat Exploiter: show combat die usage status
- [ ] Show unorthodox bonus usage status
- [ ] Import descriptions from classDescriptions utility

#### 8.6 Create FortunateOptions Section
File: `src/lib/components/character/detail/class-specific/FortunateOptions.svelte`
- [ ] Accept `character` prop
- [ ] Show standing
- [ ] Show fortune usage status
- [ ] Show signature object
- [ ] For each retainer:
  - [ ] Name, type, attitude
  - [ ] HP, HD, DF, Movement
  - [ ] Keywords as badges
  - [ ] Notes

#### 8.7 Integrate Class Sections into Info Tab
- [ ] Update InfoTab.svelte
- [ ] Import all class-specific sections
- [ ] Conditionally render based on `character.characterClass`:
  - [ ] Deft → DeftAttunements
  - [ ] Strong → StrongCombat
  - [ ] Wise → WiseMiracles
  - [ ] Brave → BraveQuirks
  - [ ] Clever → CleverKnacks
  - [ ] Fortunate → FortunateOptions

#### 8.8 Test Class-Specific Sections
- [ ] Create test character for each class
- [ ] Populate class-specific fields
- [ ] Verify each section renders correctly
- [ ] Verify descriptions are accurate

---

### ✏️ PHASE 9: Character Form (Basic)

#### 9.1 Create CharacterForm Container
File: `src/lib/components/character/CharacterForm.svelte`
- [ ] Accept `characterId` prop (null for new)
- [ ] Load character if editing, else use defaults
- [ ] Create local form state (copy of character)
- [ ] Create header with Back button and Save button
- [ ] Add TabPicker (Info | Combat | Equipment)
- [ ] Conditionally render tab content
- [ ] Track form dirty state
- [ ] Implement save functionality
- [ ] Implement auto-save (debounced)

#### 9.2 Create FormBasicInfo Section
File: `src/lib/components/character/form/FormBasicInfo.svelte`
- [ ] Accept character binding
- [ ] Input: name
- [ ] Input: player name
- [ ] Select: character class
- [ ] NumericInput: level (1-10)
- [ ] Validate inputs
- [ ] Dispatch change events

#### 9.3 Create FormAttributes Section
File: `src/lib/components/character/form/FormAttributes.svelte`
- [ ] Accept character binding
- [ ] Toggle: use custom attributes
- [ ] If standard:
  - [ ] 6 NumericInputs for STR/AGI/TOU/INT/WIL/CHA
  - [ ] Range 1-20
- [ ] If custom:
  - [ ] List of custom attributes
  - [ ] Add attribute button
  - [ ] For each: name input, value input, icon select
  - [ ] Delete attribute button
- [ ] Validate all values

#### 9.4 Create FormCombat Section
File: `src/lib/components/character/form/FormCombat.svelte`
- [ ] Accept character binding
- [ ] NumericInput: current HP (allow negative)
- [ ] NumericInput: max HP (min 1)
- [ ] NumericInput: movement (0-999)
- [ ] Input: save color
- [ ] Show computed AV and SV (read-only)

#### 9.5 Create FormGroups Section
File: `src/lib/components/character/form/FormGroups.svelte`
- [ ] Accept character binding
- [ ] Input: species group
- [ ] Input: vocation group
- [ ] Affiliation groups:
  - [ ] List of inputs
  - [ ] Add button
  - [ ] Delete button for each
- [ ] Attribute-group pairs:
  - [ ] List of pair rows
  - [ ] Select attribute dropdown
  - [ ] Input for group name
  - [ ] Add/delete buttons

#### 9.6 Create FormLanguages Section
File: `src/lib/components/character/form/FormLanguages.svelte`
- [ ] Accept character binding
- [ ] List of language inputs
- [ ] Add language button
- [ ] Delete button for each
- [ ] Default starts with "Common"

#### 9.7 Create FormNotes Section
File: `src/lib/components/character/form/FormNotes.svelte`
- [ ] Accept character binding
- [ ] TextArea for notes
- [ ] Show character count
- [ ] Max length validation

#### 9.8 Create FormAdditionalInfo Section
File: `src/lib/components/character/form/FormAdditionalInfo.svelte`
- [ ] Accept character binding
- [ ] NumericInput: experience (0+)
- [ ] NumericInput: corruption (0+)
- [ ] NumericInput: max encumbrance (0+)
- [ ] NumericInput: comeback dice (if Brave)
- [ ] Checkbox: has used "Say No" (if Brave)

#### 9.9 Assemble Form Info Tab
File: `src/lib/components/character/form/FormInfoTab.svelte`
- [ ] Import all form sections
- [ ] Accept character binding
- [ ] Render sections in order:
  - [ ] FormBasicInfo
  - [ ] FormAttributes
  - [ ] FormGroups
  - [ ] FormLanguages
  - [ ] [Class-specific form - placeholder]
  - [ ] FormAdditionalInfo
  - [ ] FormNotes

#### 9.10 Test Form Info Tab
- [ ] Create new character form works
- [ ] Edit existing character works
- [ ] All fields save correctly
- [ ] Validation prevents invalid input
- [ ] Class change resets class-specific fields (optional)

---

### ⚔️ PHASE 10: Character Form (Combat Tab)

#### 10.1 Assemble Form Combat Tab
File: `src/lib/components/character/form/FormCombatTab.svelte`
- [ ] Import FormCombat
- [ ] Accept character binding
- [ ] Render FormCombat section
- [ ] Show computed values

#### 10.2 Test Form Combat Tab
- [ ] HP editing works
- [ ] Movement editing works
- [ ] Computed values update correctly

---

### 🎒 PHASE 11: Character Form (Equipment Tab)

#### 11.1 Create FormWeapons Section
File: `src/lib/components/character/form/FormWeapons.svelte`
- [ ] Accept character binding
- [ ] Show list of weapons
- [ ] Add weapon button (opens modal/inline form)
- [ ] For each weapon:
  - [ ] Name input (with preset dropdown)
  - [ ] Damage input
  - [ ] Weight select
  - [ ] Range input
  - [ ] Rate of fire input
  - [ ] Special input
  - [ ] Checkboxes: equipped, stashed, magical, cursed
  - [ ] NumericInput: bonus
  - [ ] NumericInput: quantity
  - [ ] Delete button
- [ ] Auto-populate from preset when selected

#### 11.2 Create FormArmor Section
File: `src/lib/components/character/form/FormArmor.svelte`
- [ ] Accept character binding
- [ ] Show list of armor
- [ ] Add armor button
- [ ] For each armor:
  - [ ] Name input (with preset dropdown)
  - [ ] NumericInput: DF
  - [ ] NumericInput: weight (slots)
  - [ ] Special input
  - [ ] Checkbox: is shield
  - [ ] Checkboxes: equipped, stashed, magical, cursed
  - [ ] NumericInput: bonus
  - [ ] Delete button
- [ ] Auto-populate from preset when selected

#### 11.3 Create FormGear Section
File: `src/lib/components/character/form/FormGear.svelte`
- [ ] Accept character binding
- [ ] Show list of gear
- [ ] Add gear button
- [ ] For each gear:
  - [ ] Name input (with preset dropdown)
  - [ ] Weight select
  - [ ] Special input
  - [ ] NumericInput: quantity
  - [ ] Checkbox: is container
  - [ ] Checkboxes: equipped, stashed, magical, cursed
  - [ ] Delete button
- [ ] Auto-populate from preset when selected

#### 11.4 Create FormGold Section
File: `src/lib/components/character/form/FormGold.svelte`
- [ ] Accept character binding
- [ ] NumericInput: coins on hand
- [ ] NumericInput: stashed coins
- [ ] Show total (computed)

#### 11.5 Assemble Form Equipment Tab
File: `src/lib/components/character/form/FormEquipmentTab.svelte`
- [ ] Import all equipment form sections
- [ ] Accept character binding
- [ ] Render sections in order:
  - [ ] FormWeapons
  - [ ] FormArmor
  - [ ] FormGear
  - [ ] FormGold
- [ ] Show live encumbrance calculation

#### 11.6 Test Form Equipment Tab
- [ ] Add/edit/delete weapons works
- [ ] Add/edit/delete armor works
- [ ] Add/edit/delete gear works
- [ ] Preset selection works
- [ ] Gold editing works
- [ ] Encumbrance updates live

---

### 🎭 PHASE 12: Class-Specific Form Sections

#### 12.1 Create FormDeft Section
File: `src/lib/components/character/form/class-specific/FormDeft.svelte`
- [ ] Accept character binding
- [ ] Get available slots from level
- [ ] For each slot:
  - [ ] Primary attunement: name, type select, active toggle, lost toggle
  - [ ] Secondary attunement: same
  - [ ] Checkbox: has tertiary
  - [ ] Tertiary attunement (if enabled): same
  - [ ] Checkbox: has quaternary
  - [ ] Quaternary attunement (if enabled): same
  - [ ] Checkbox: has used daily power

#### 12.2 Create FormStrong Section
File: `src/lib/components/character/form/class-specific/FormStrong.svelte`
- [ ] Accept character binding
- [ ] Get available slots from level
- [ ] For each slot: select combat option (or none)
- [ ] Show option descriptions
- [ ] Prevent duplicate selections
- [ ] Conflict loot section:
  - [ ] Input: keyword
  - [ ] Select: type
  - [ ] NumericInput: uses remaining
  - [ ] Clear loot button

#### 12.3 Create FormWise Section
File: `src/lib/components/character/form/class-specific/FormWise.svelte`
- [ ] Accept character binding
- [ ] Get available slots from level
- [ ] For each slot:
  - [ ] Toggle: is magic item
  - [ ] If magic item: name input
  - [ ] Else: 
    - [ ] Base miracles list (add/remove)
    - [ ] For each: name, active toggle
  - [ ] NumericInput: additional miracle count (0-2 for first slot)
  - [ ] Additional miracles list
  - [ ] For each: name, active toggle

#### 12.4 Create FormBrave Section
File: `src/lib/components/character/form/class-specific/FormBrave.svelte`
- [ ] Accept character binding
- [ ] Get available slots from level
- [ ] For each slot: select quirk (or none)
- [ ] Show quirk descriptions
- [ ] Prevent duplicate selections
- [ ] For Protect Ally: show protected ally name input
- [ ] NumericInput: comeback dice
- [ ] Checkbox: has used "Say No"

#### 12.5 Create FormClever Section
File: `src/lib/components/character/form/class-specific/FormClever.svelte`
- [ ] Accept character binding
- [ ] Dynamic slots (add/remove based on needs)
- [ ] For each slot: select knack (or none)
- [ ] Show knack descriptions
- [ ] For Combat Exploiter: checkbox for combat die used
- [ ] Checkbox: has used unorthodox bonus

#### 12.6 Create FormFortunate Section
File: `src/lib/components/character/form/class-specific/FormFortunate.svelte`
- [ ] Accept character binding
- [ ] Input: standing
- [ ] Checkbox: has used fortune
- [ ] Input: signature object name
- [ ] Retainers list:
  - [ ] Add retainer button
  - [ ] For each retainer:
    - [ ] Name, type, attitude inputs
    - [ ] NumericInputs: HD, DF, movement, current HP, max HP
    - [ ] Keywords: add/remove list
    - [ ] TextArea: notes
    - [ ] Delete button

#### 12.7 Integrate Class Forms into Form Info Tab
- [ ] Update FormInfoTab.svelte
- [ ] Import all class-specific form sections
- [ ] Conditionally render based on character class

#### 12.8 Test Class-Specific Forms
- [ ] Test each class's form section
- [ ] Verify all fields save correctly
- [ ] Test slot limits based on level
- [ ] Verify validation works

---

### 📥 PHASE 13: Import/Export

#### 13.1 Create Converters Utility
File: `src/lib/utils/converters.ts`
- [ ] Implement `detectFormat(json)` - Swift vs Kotlin
- [ ] Implement `fromSwift(json)` - convert Swift format to canonical
- [ ] Implement `fromKotlin(json)` - convert Kotlin format to canonical
- [ ] Implement `toCanonical(json)` - normalize any format
- [ ] Implement `toExport(character)` - convert to exportable JSON
- [ ] Handle field name differences
- [ ] Handle boolean inversions
- [ ] Handle enum case differences
- [ ] Regenerate UUIDs on import

#### 13.2 Create Import Modal
File: `src/lib/components/import-export/ImportModal.svelte`
- [ ] Use Modal component
- [ ] TextArea for pasting JSON
- [ ] "Choose File" button for file upload
- [ ] Parse and validate JSON
- [ ] Show preview of character(s) to import
- [ ] Show validation errors if any
- [ ] Import single / Import all buttons
- [ ] Show success message
- [ ] Close modal and refresh list

#### 13.3 Create Export Modal
File: `src/lib/components/import-export/ExportModal.svelte`
- [ ] Use Modal component
- [ ] Checkbox list of characters
- [ ] Select all / Deselect all
- [ ] Export selected button
- [ ] Generate JSON
- [ ] Display JSON in TextArea (read-only)
- [ ] Copy to clipboard button
- [ ] Save to file button (use filesystem plugin)
- [ ] Show success message

#### 13.4 Wire Up Import/Export
- [ ] Add modal triggers in CharacterList
- [ ] Connect import to character store
- [ ] Connect export to character store
- [ ] Test import of Swift-exported character
- [ ] Test import of Kotlin-exported character
- [ ] Test export and re-import

---

### 🎨 PHASE 14: Polish & Theming

#### 14.1 Implement Theme Switching
- [ ] Create theme toggle in header/settings
- [ ] Persist theme choice to DB
- [ ] Apply theme class to document root
- [ ] Verify all components respect theme

#### 14.2 Add Animations
- [ ] Fade transitions between views
- [ ] Slide transitions for modals
- [ ] Progress bar animations
- [ ] Button hover/click animations
- [ ] List item enter/exit animations

#### 14.3 Responsive Design
- [ ] Test at various window sizes
- [ ] Adjust grid layouts for narrow windows
- [ ] Ensure forms are usable at small sizes
- [ ] Test equipment tables on small screens

#### 14.4 Error Handling
- [ ] Add error boundaries
- [ ] Show toast notifications for errors
- [ ] Handle database errors gracefully
- [ ] Handle invalid JSON import
- [ ] Prevent data loss on errors

#### 14.5 Loading States
- [ ] Show loading spinner on initial load
- [ ] Show loading state during save
- [ ] Show loading state during import

#### 14.6 Keyboard Navigation
- [ ] Tab through all form fields
- [ ] Enter to submit forms
- [ ] Escape to close modals
- [ ] Arrow keys in select dropdowns

---

### 🧪 PHASE 15: Testing

#### 15.1 Unit Tests
- [ ] Test AdvancementTables functions
- [ ] Test computed value utilities
- [ ] Test encumbrance calculation
- [ ] Test converters (Swift/Kotlin formats)
- [ ] Test validation functions

#### 15.2 Integration Tests
- [ ] Test database CRUD operations
- [ ] Test character store
- [ ] Test auto-save functionality

#### 15.3 End-to-End Tests
- [ ] Test create new character flow
- [ ] Test edit character flow
- [ ] Test delete character flow
- [ ] Test import character flow
- [ ] Test export character flow

#### 15.4 Cross-Platform Tests
- [ ] Import character exported from Swift app
- [ ] Import character exported from Kotlin app
- [ ] Export character and import in Swift app
- [ ] Export character and import in Kotlin app
- [ ] Verify all fields survive round-trip

---

### 🚀 PHASE 16: Build & Release

#### 16.1 Production Build
- [ ] Run `./build.sh`
- [ ] Test Windows installer
- [ ] Verify app runs on clean Windows machine
- [ ] Test all functionality in production build

#### 16.2 App Metadata
- [ ] Update app name in tauri.conf.json
- [ ] Update app identifier
- [ ] Create app icons (all sizes)
- [ ] Update version number
- [ ] Add description

#### 16.3 Documentation
- [ ] Update README with usage instructions
- [ ] Document keyboard shortcuts
- [ ] Document import/export format
- [ ] Add troubleshooting section

---

## ✅ Completion Checklist

When all phases are complete, verify:

- [ ] All 6 character classes work correctly
- [ ] All class-specific features are implemented
- [ ] Equipment system works (weapons, armor, gear)
- [ ] Encumbrance calculates correctly
- [ ] XP and progression work correctly
- [ ] Import/export works with Swift and Kotlin apps
- [ ] Dark/light themes work
- [ ] App builds and runs on Windows
- [ ] No console errors in production
- [ ] Data persists after app restart

---

## 🔄 Cross-Platform Compatibility

### Import/Export Format

The JSON format is defined in `whitehack-tools-schema/`. Key considerations:

1. **Field naming conventions:**
   - Use Swift naming: `speciesGroup`, `vocationGroup`, `affiliationGroups`
   - Kotlin uses: `species`, `vocation`, `affiliations`

2. **Boolean inversions:**
   - Swift: `useCustomAttributes`
   - Kotlin: `useDefaultAttributes` (inverted!)

3. **Enum formats:**
   - AttunementType: lowercase (`'item'`, `'teacher'`)
   - CharacterClass: TitleCase (`'Deft'`, `'Strong'`)
   - ConflictLootType: lowercase (`'special'`, `'substance'`)

4. **Computed fields:**
   - `_attackValue` and `_saveValue` are computed but stored for portability
   - Re-compute on import for accuracy

### Converter Functions

Port the converters from `whitehack-tools-schema/src/converters/`:
- `fromSwift.ts` → Parse Swift export format
- `fromKotlin.ts` → Parse Kotlin export format
- `toCanonical.ts` → Convert to canonical format
- `toSwift.ts` / `toKotlin.ts` → For export compatibility

---

## 📁 File Structure

```
whitehack-tools-tauri/
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── ui/                    # Reusable UI components
│   │   │   │   │   ├── Button.svelte
│   │   │   │   │   ├── Card.svelte
│   │   │   │   │   ├── Input.svelte
│   │   │   │   │   ├── Select.svelte
│   │   │   │   │   ├── TabPicker.svelte
│   │   │   │   │   ├── ProgressBar.svelte
│   │   │   │   │   └── Modal.svelte
│   │   │   │   │
│   │   │   │   ├── character/
│   │   │   │   │   ├── CharacterList.svelte
│   │   │   │   │   ├── CharacterListRow.svelte
│   │   │   │   │   ├── CharacterDetail.svelte
│   │   │   │   │   ├── CharacterForm.svelte
│   │   │   │   │   │
│   │   │   │   │   ├── detail/
│   │   │   │   │   │   ├── DetailHeader.svelte
│   │   │   │   │   │   ├── DetailStats.svelte
│   │   │   │   │   │   ├── DetailProgress.svelte
│   │   │   │   │   │   ├── DetailCombat.svelte
│   │   │   │   │   │   ├── DetailGroups.svelte
│   │   │   │   │   │   ├── DetailLanguages.svelte
│   │   │   │   │   │   ├── DetailNotes.svelte
│   │   │   │   │   │   ├── DetailAdditionalInfo.svelte
│   │   │   │   │   │   ├── DetailWeapons.svelte
│   │   │   │   │   │   ├── DetailArmor.svelte
│   │   │   │   │   │   ├── DetailEquipment.svelte
│   │   │   │   │   │   ├── DetailGold.svelte
│   │   │   │   │   │   ├── DetailEncumbrance.svelte
│   │   │   │   │   │   │
│   │   │   │   │   │   └── class-specific/
│   │   │   │   │   │       ├── DeftAttunements.svelte
│   │   │   │   │   │       ├── StrongCombat.svelte
│   │   │   │   │   │       ├── WiseMiracles.svelte
│   │   │   │   │   │       ├── BraveQuirks.svelte
│   │   │   │   │   │       ├── CleverKnacks.svelte
│   │   │   │   │   │       └── FortunateOptions.svelte
│   │   │   │   │   │
│   │   │   │   │   └── form/
│   │   │   │   │       ├── FormBasicInfo.svelte
│   │   │   │   │       ├── FormAttributes.svelte
│   │   │   │   │       ├── FormCombat.svelte
│   │   │   │   │       ├── FormGroups.svelte
│   │   │   │   │       ├── FormLanguages.svelte
│   │   │   │   │       ├── FormWeapons.svelte
│   │   │   │   │       ├── FormArmor.svelte
│   │   │   │   │       ├── FormGear.svelte
│   │   │   │   │       ├── FormGold.svelte
│   │   │   │   │       │
│   │   │   │   │       └── class-specific/
│   │   │   │   │           ├── FormDeft.svelte
│   │   │   │   │           ├── FormStrong.svelte
│   │   │   │   │           ├── FormWise.svelte
│   │   │   │   │           ├── FormBrave.svelte
│   │   │   │   │           ├── FormClever.svelte
│   │   │   │   │           └── FormFortunate.svelte
│   │   │   │   │
│   │   │   │   └── import-export/
│   │   │   │       ├── ImportModal.svelte
│   │   │   │       └── ExportModal.svelte
│   │   │   │
│   │   │   ├── stores/
│   │   │   │   ├── characters.ts          # Character store with SQLite
│   │   │   │   └── ui.ts                  # UI state (theme, modals)
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── PlayerCharacter.ts     # Main character type
│   │   │   │   ├── Equipment.ts           # Weapon, Armor, Gear types
│   │   │   │   ├── ClassFeatures.ts       # Class-specific types
│   │   │   │   └── Enums.ts               # All enums
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── AdvancementTables.ts   # Level-up stats
│   │   │   │   ├── converters.ts          # Import/export converters
│   │   │   │   ├── validation.ts          # Form validation
│   │   │   │   ├── encumbrance.ts         # Encumbrance calculation
│   │   │   │   └── classColors.ts         # Class color definitions
│   │   │   │
│   │   │   ├── data/
│   │   │   │   ├── weapons.ts             # Preset weapon data
│   │   │   │   ├── armor.ts               # Preset armor data
│   │   │   │   └── gear.ts                # Preset gear data
│   │   │   │
│   │   │   └── tauri.ts                   # Tauri API wrapper
│   │   │
│   │   ├── routes/
│   │   │   ├── +layout.svelte
│   │   │   ├── +layout.ts
│   │   │   └── +page.svelte               # Main app page
│   │   │
│   │   ├── app.css                        # Global styles
│   │   └── app.html
│   │
│   ├── static/
│   │   └── favicon.png
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   └── svelte.config.js
│
├── backend/
│   ├── src/
│   │   ├── main.rs                        # Main entry, commands
│   │   ├── db.rs                          # Database operations
│   │   └── models.rs                      # Rust data structures
│   │
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── DEVELOPMENT_PLAN.md                    # This file
└── README.md
```

---

## 🧩 Component Breakdown

### Reusable UI Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, danger variants |
| `Card` | Section container with header |
| `Input` | Text input with label, validation |
| `Select` | Dropdown selection |
| `NumericInput` | Number input with +/- buttons |
| `TabPicker` | Tab navigation |
| `ProgressBar` | XP progress visualization |
| `Modal` | Dialog overlay |
| `Badge` | Class/level badges |
| `IconCircle` | Class icon with colored background |
| `ConfirmDialog` | Delete confirmation |

### Class Colors (match Swift/Kotlin)

```typescript
const CLASS_COLORS = {
  Strong: { r: 0.698, g: 0.132, b: 0.195 },    // Deep crimson
  Wise: { r: 0.408, g: 0.616, b: 0.851 },      // Ethereal azure
  Deft: { r: 0.475, g: 0.298, b: 0.635 },      // Twilight violet
  Brave: { r: 0.804, g: 0.498, b: 0.196 },     // Burnished bronze
  Clever: { r: 0.216, g: 0.545, b: 0.373 },    // Emerald sage
  Fortunate: { r: 0.557, g: 0.267, b: 0.678 }  // Royal amethyst
}
```

### Class Icons (Phosphor)

| Class | Icon |
|-------|------|
| Strong | `barbell` |
| Wise | `sparkle` |
| Deft | `arrows-out-cardinal` |
| Brave | `shield` |
| Clever | `lightbulb` |
| Fortunate | `crown` |

---

## 📊 Advancement Tables

### XP Requirements by Class

| Level | Deft | Strong | Wise | Brave | Clever | Fortunate |
|-------|------|--------|------|-------|--------|-----------|
| 2 | 1,450 | 1,900 | 2,350 | 1,225 | 1,350 | 1,450 |
| 3 | 2,900 | 3,800 | 4,700 | 2,450 | 2,700 | 2,900 |
| 4 | 5,800 | 7,600 | 9,400 | 4,900 | 5,400 | 5,800 |
| 5 | 11,600 | 15,200 | 18,800 | 9,800 | 10,800 | 11,600 |
| 6 | 23,200 | 30,400 | 37,600 | 19,600 | 21,600 | 23,200 |
| 7 | 46,400 | 60,800 | 75,200 | 39,200 | 43,200 | 46,400 |
| 8 | 92,800 | 121,600 | 150,400 | 78,400 | 86,400 | 92,800 |
| 9 | 185,600 | 243,200 | 300,800 | 156,800 | 172,800 | 185,600 |
| 10 | 371,200 | 486,400 | 601,600 | 313,600 | 345,600 | 371,200 |

### Stat Progressions

#### Deft
| Level | HD | AV | SV | Slots | Groups | Raises |
|-------|-----|-----|-----|-------|--------|--------|
| 1 | 1 | 10 | 7 | 1 | 2 | - |
| 2 | 2 | 11 | 8 | 1 | 2 | 1 |
| 3 | 2+1 | 11 | 9 | 1 | 3 | 1 |
| 4 | 3 | 12 | 10 | 2 | 3 | 2 |
| 5 | 3+1 | 12 | 11 | 2 | 4 | 2 |
| 6 | 4 | 13 | 12 | 2 | 4 | 3 |
| 7 | 4+1 | 13 | 13 | 3 | 5 | 3 |
| 8 | 5 | 14 | 14 | 3 | 5 | 4 |
| 9 | 5+1 | 14 | 15 | 3 | 6 | 4 |
| 10 | 6 | 15 | 16 | 4 | 6 | 5 |

#### Strong
| Level | HD | AV | SV | Slots | Groups | Raises |
|-------|-----|-----|-----|-------|--------|--------|
| 1 | 1+2 | 11 | 5 | 1 | 2 | - |
| 2 | 2 | 11 | 6 | 1 | 2 | 1 |
| 3 | 3 | 12 | 7 | 1 | 2 | 1 |
| 4 | 4 | 13 | 8 | 2 | 3 | 2 |
| 5 | 5 | 13 | 9 | 2 | 3 | 2 |
| 6 | 6 | 14 | 10 | 2 | 3 | 3 |
| 7 | 7 | 14 | 11 | 3 | 4 | 3 |
| 8 | 8 | 15 | 12 | 3 | 4 | 4 |
| 9 | 9 | 15 | 13 | 3 | 4 | 4 |
| 10 | 10 | 16 | 14 | 4 | 5 | 5 |

#### Wise
| Level | HD | AV | SV | Slots | Groups | Raises |
|-------|-----|-----|-----|-------|--------|--------|
| 1 | 1 | 10 | 6 | 1 | 2 | - |
| 2 | 1+1 | 10 | 7 | 1 | 2 | 1 |
| 3 | 2 | 11 | 8 | 2 | 2 | 1 |
| 4 | 2+1 | 11 | 9 | 2 | 3 | 2 |
| 5 | 3 | 12 | 10 | 2 | 3 | 2 |
| 6 | 3+1 | 12 | 11 | 3 | 3 | 3 |
| 7 | 4 | 13 | 12 | 3 | 4 | 3 |
| 8 | 4+1 | 13 | 13 | 3 | 4 | 4 |
| 9 | 5 | 14 | 14 | 4 | 4 | 4 |
| 10 | 5+1 | 14 | 15 | 4 | 5 | 5 |

#### Brave
| Level | HD | AV | SV | Slots | Groups | Raises |
|-------|-----|-----|-----|-------|--------|--------|
| 1 | 1* | 10 | 9 | 1 | 2 | - |
| 2 | 2* | 10 | 10 | 1 | 2 | 1 |
| 3 | 3* | 10 | 11 | 1 | 2 | 1 |
| 4 | 4 | 11 | 12 | 2 | 2 | 2 |
| 5 | 5 | 11 | 13 | 2 | 3 | 2 |
| 6 | 6 | 11 | 14 | 2 | 3 | 3 |
| 7 | 7 | 12 | 15 | 3 | 3 | 3 |
| 8 | 8 | 12 | 16 | 3 | 3 | 4 |
| 9 | 9 | 12 | 17 | 3 | 4 | 4 |
| 10 | 10 | 13 | 18 | 4 | 4 | 5 |

*\* = Comeback dice*

#### Clever
| Level | HD | AV | SV | Slots | Groups | Raises |
|-------|-----|-----|-----|-------|--------|--------|
| 1 | 1 | 10 | 8 | 1 | 2 | - |
| 2 | 2 | 11 | 9 | 1 | 2 | 1 |
| 3 | 2+1 | 11 | 10 | 1 | 2 | 1 |
| 4 | 3 | 11 | 11 | 2 | 3 | 2 |
| 5 | 3+1 | 12 | 12 | 2 | 3 | 2 |
| 6 | 4 | 12 | 13 | 2 | 3 | 3 |
| 7 | 4+1 | 13 | 14 | 3 | 4 | 3 |
| 8 | 5 | 13 | 15 | 3 | 4 | 4 |
| 9 | 5+1 | 13 | 16 | 3 | 4 | 4 |
| 10 | 6 | 14 | 17 | 4 | 5 | 5 |

#### Fortunate
| Level | HD | AV | SV | Slots | Groups | Raises |
|-------|-----|-----|-----|-------|--------|--------|
| 1 | 1 | 10 | 6 | 1 | 2 | - |
| 2 | 2 | 10 | 7 | 1 | 2 | 1 |
| 3 | 2+1 | 11 | 8 | 1 | 3 | 1 |
| 4 | 3 | 11 | 9 | 2 | 3 | 2 |
| 5 | 3+1 | 12 | 10 | 2 | 4 | 2 |
| 6 | 4 | 12 | 11 | 2 | 4 | 3 |
| 7 | 4+1 | 13 | 12 | 3 | 5 | 3 |
| 8 | 5 | 13 | 13 | 3 | 5 | 4 |
| 9 | 5+1 | 14 | 14 | 3 | 6 | 4 |
| 10 | 6 | 14 | 15 | 4 | 6 | 5 |

---

## 🎲 Class Ability Reference

### Strong Combat Options (ID 0-7)

| ID | Name | Description |
|----|------|-------------|
| 0 | Protect Adjacent Ally | Full round action: Protect an adjacent character by redirecting all attacks targeting them to yourself until your next turn. Each enemy gets a save. |
| 1 | Force Movement | After successful attack, forgo damage to force opponent to move up to 10 feet. May take their position as free move. Target saves to resist. |
| 2 | Climb Big Opponents | When fighting larger opponents, spend action to climb with agility roll. If successful, gain double combat advantage (+4 attack/damage). |
| 3 | Special Attack Effects | On successful attack, forgo damage to: reduce enemy initiative by 2, reduce movement by 10, or deal 2 ongoing damage/round. |
| 4 | Grant Double Advantage | Once per battle, grant ally double combat advantage (+4) on a single attack. Requires tactical command. |
| 5 | Encourage/Frighten | Verbal action: allies in 15ft gain +1 attack/saves OR enemies suffer -1 attack/saves. |
| 6 | Melee + Ranged Attack | Give up movement to make both melee and ranged attack. Both must use one-handed weapons. |
| 7 | Parry and Wait | Instead of attacking, gain +2 defense and double advantage vs parried enemy next round. Two rounds = triple advantage. |

### Brave Quirks (ID 0-7)

| ID | Name | Description |
|----|------|-------------|
| 0 | Double Strain Rolls | Always make double positive strain rolls to move faster when encumbered. |
| 1 | Improved Healing | No treatment needed to heal beyond 1 HP from negative. Can use comeback dice for shrugged damage. |
| 2 | Protect Ally | Choose party member at session start. When protecting, use one free comeback die. |
| 3 | Resist Curses | +4 save vs cursed objects. May use comeback dice to reduce cursed HP costs. |
| 4 | Draw Attention | Enemies attack others first (if possible). Can invert when desired. |
| 5 | Fulfill Requirements | Once/session: your courage fulfills user requirements for items/places/passages. |
| 6 | Divine Invocation | Once/session: use god's name to affect your level # of listeners. Each may save. |
| 7 | Improvised Weapons | Improvised weapons do at least 1d6 damage. Actual weapons ignore resistances. |

### Clever Knacks (ID 0-8)

| ID | Name | Description |
|----|------|-------------|
| 0 | Combat Exploiter | Combat advantage base is +3. Once/battle may switch d6 to d10 for damage. |
| 1 | Efficient Crafter | +4 to crafting/mending. Half time, can skip one non-essential part. |
| 2 | Weakened Saves | Targets of special attacks get -3 to saves. |
| 3 | Navigation Master | Always know approximate location. Never get lost. |
| 4 | Convincing Negotiator | +2 to task rolls and saves in conviction attempts, including trade. |
| 5 | Escape Artist | +4 to any roll related to escaping confinement or bypassing barriers. |
| 6 | Substance Expert | +4 to substance ID and saves. +1 to quantified effects in your favor. |
| 7 | Machine Master | +4 to task rolls with or concerning machines. |
| 8 | Tracking Expert | +4 to tracking and covering own tracks. |

---

## 🗃️ SQLite Schema

```sql
-- Main characters table (stores JSON blob for simplicity)
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,           -- JSON blob of full character
  name TEXT NOT NULL,           -- Indexed for search/sort
  character_class TEXT NOT NULL,
  level INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name);
CREATE INDEX IF NOT EXISTS idx_characters_class ON characters(character_class);
CREATE INDEX IF NOT EXISTS idx_characters_updated ON characters(updated_at);

-- App settings/preferences
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

**Why JSON blob?**
- Character data is complex and nested
- Simplifies CRUD operations
- Matches import/export format exactly
- No complex migrations needed

---

## 🎒 Preset Equipment Data

### Weapons (26 presets)

| Name | Damage | Weight | Range | Special |
|------|--------|--------|-------|---------|
| Axe | 1d6+1 | Regular | N/A | - |
| Sword | 1d6+1 | Regular | N/A | - |
| Club | 1d6-2 | Minor | N/A | Knock-out, improvised |
| Crossbow | 1d6+1 | Heavy | 70 | Two handed, ROF 1/2 |
| Dagger | 1d6-2 | Minor | 15 | ROF 1 |
| Darts | 1 | Minor | 20 | ROF 3, 1-3 = minor item |
| Flail | 1d6 | Regular | N/A | Ignore shield DF |
| Great Sword | 1d6+2 | Heavy | N/A | Two handed |
| Great Axe | 1d6+2 | Heavy | N/A | Two handed |
| Javelin | 1d6 | Minor | 40 | d6-2 in melee |
| Longbow | 1d6 | Regular | 70 | Two handed |
| Mace | 1d6 | Regular | N/A | +1 AV vs metal armor |
| Hammer | 1d6 | Regular | N/A | +1 AV vs metal armor |
| Morning Star | 1d6 | Heavy | N/A | +1 AV metal, x3 crit |
| Musket | 1d6+2 | Heavy | 30 | Two handed, ROF 1/4 |
| Pistol | 1d6+1 | Regular | 20 | ROF 1/3 |
| Pole Arms | 1d6 | Heavy | N/A | Two handed, reach |
| Quarterstaff | 1d6-1 | Regular | N/A | Two handed, reach |
| Scimitar | 1d6-1 | Regular | N/A | +1 AV while riding |
| Shortbow | 1d6-1 | Regular | 50 | Two handed, w. mount |
| Shortsword | 1d6-1 | Minor | N/A | - |
| Sling | 1d6-2 | No size | 30 | Use with stones |
| Spear | 1d6 | Regular | N/A | Reach |
| Throwing Knife | 1d6-2 | Minor | 25 | -1 AV in melee |
| Throwing Axe | 1d6-2 | Minor | 25 | -1 AV in melee |
| Unarmed | d6-3 | - | N/A | Knock-out, grapple |

### Armor (7 presets)

| Name | DF | Weight (slots) | Shield? |
|------|----|----------------|---------|
| Shield | 1 | 1 | Yes |
| Cloth | 1 | 1 | No |
| Leather | 2 | 2 | No |
| Hard leather | 3 | 3 | No |
| Chainmail | 4 | 4 | No |
| Splint mail | 5 | 5 | No |
| Full plate | 6 | 6 | No |

### Gear (70+ presets)

Including: Arrows, Bandages, Rope, Torches, Rations, Climbing gear, Lock picks, Maps, Holy symbols, Tents, Mounts (horses, mules), Containers (knapsack, sack, saddle bags), etc.

> Full list in `data/gear.ts`

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] AdvancementTables calculations
- [ ] Encumbrance calculations
- [ ] Import/export converters
- [ ] Defense value computation
- [ ] XP progress calculation

### Integration Tests
- [ ] SQLite CRUD operations
- [ ] Character store operations
- [ ] Form validation

### E2E Tests
- [ ] Create new character flow
- [ ] Edit character flow
- [ ] Import character flow
- [ ] Export character flow
- [ ] Delete character flow

### Cross-Platform Tests
- [ ] Import Swift-exported JSON
- [ ] Import Kotlin-exported JSON
- [ ] Export and reimport
- [ ] Verify data integrity

---

## 🧮 Computed Values & Formulas

### Attack Value (AV)
```typescript
function computeAttackValue(characterClass: CharacterClass, level: number, strength: number): number {
  const baseAV = AdvancementTables.getAttackValue(characterClass, level);
  // Strong class gets +1 AV if STR >= 13
  if (characterClass === 'Strong' && strength >= 13) {
    return baseAV + 1;
  }
  return baseAV;
}
```

### Save Value (SV)
```typescript
function computeSaveValue(characterClass: CharacterClass, level: number): number {
  return AdvancementTables.getSaveValue(characterClass, level);
}
```

### Defense Value (DF)
```typescript
function computeDefenseValue(armor: Armor[]): number {
  return armor
    .filter(a => a.isEquipped)
    .reduce((sum, a) => sum + a.df + a.bonus, 0);
}
```

### Initiative Bonus
```typescript
function computeInitiativeBonus(agility: number, useCustomAttributes: boolean): number {
  if (useCustomAttributes) return 0;
  if (agility >= 16) return 2;
  if (agility >= 13) return 1;
  return 0;
}
```

### XP Progress
```typescript
function computeXPProgress(characterClass: CharacterClass, level: number, experience: number): number {
  if (level >= 10) return 1.0;  // Max level
  const currentLevelXP = level > 1 ? AdvancementTables.xpRequirement(characterClass, level) : 0;
  const nextLevelXP = AdvancementTables.xpRequirement(characterClass, level + 1);
  return Math.min((experience - currentLevelXP) / (nextLevelXP - currentLevelXP), 1.0);
}
```

### Encumbrance
```typescript
const WEIGHT_VALUES = {
  'No Size': 1,
  'Minor': 2,
  'Regular': 10,
  'Heavy': 20
};

function computeEncumbrance(gear: Gear[]): number {
  return gear
    .filter(g => !g.isStashed)
    .reduce((sum, g) => sum + WEIGHT_VALUES[g.weight] * g.quantity, 0);
}

// Default max encumbrance is 15 (can be modified per character)
```

---

## 🆕 Default Character Values

When creating a new character:

```typescript
const DEFAULT_CHARACTER: Partial<PlayerCharacter> = {
  name: '',
  playerName: '',
  characterClass: 'Deft',
  level: 1,
  
  // Attributes
  useCustomAttributes: false,
  customAttributes: [],
  strength: 10,
  agility: 10,
  toughness: 10,
  intelligence: 10,
  willpower: 10,
  charisma: 10,
  
  // Combat
  currentHP: 1,
  maxHP: 1,
  movement: 30,
  saveColor: '',
  
  // Groups
  speciesGroup: null,
  vocationGroup: null,
  affiliationGroups: [],
  attributeGroupPairs: [],
  
  // Class-specific (all empty/default)
  attunementSlots: [],
  strongCombatOptions: { slots: Array(10).fill(null) },
  currentConflictLoot: null,
  wiseMiracleSlots: [],
  braveQuirkOptions: { slots: Array(10).fill({ quirk: undefined, protectedAllyName: '' }) },
  cleverKnackOptions: { slots: [], hasUsedUnorthodoxBonus: false },
  fortunateOptions: {
    standing: '',
    hasUsedFortune: false,
    newKeyword: '',
    retainers: [],
    signatureObject: { name: '' }
  },
  comebackDice: 0,
  hasUsedSayNo: false,
  
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
```

---

## 🔀 Navigation State

```typescript
type ViewState = 
  | { type: 'list' }
  | { type: 'detail'; characterId: string; tab: 'info' | 'combat' | 'equipment' }
  | { type: 'form'; characterId: string | null; tab: 'info' | 'combat' | 'equipment' }

interface UIState {
  currentView: ViewState
  showImportModal: boolean
  showExportModal: boolean
  showDeleteConfirm: { characterId: string } | null
  theme: 'light' | 'dark' | 'system'
}
```

---

## 📝 Notes

### Key Differences from Mobile Apps

1. **Window-based navigation** - No back gestures, use toolbar buttons
2. **Hover states** - Add hover effects for desktop
3. **Keyboard navigation** - Tab through forms, Enter to submit
4. **Right-click context menus** - Consider for future enhancement
5. **Resizable window** - Ensure responsive at various sizes

### Performance Considerations

1. **Lazy loading** - Don't render all characters at once if list grows large
2. **Debounced saves** - Auto-save with debouncing to prevent DB spam
3. **Optimistic updates** - Update UI immediately, sync DB in background

### Accessibility

1. **Semantic HTML** - Use proper heading hierarchy
2. **ARIA labels** - For icon-only buttons
3. **Focus management** - Trap focus in modals
4. **Color contrast** - Ensure readable in both themes

---

## ✅ Form Validation Rules

### Basic Info
| Field | Rules |
|-------|-------|
| `name` | Optional, max 100 chars |
| `playerName` | Optional, max 100 chars |
| `characterClass` | Required, one of 6 classes |
| `level` | Required, 1-10 |

### Attributes
| Field | Rules |
|-------|-------|
| Standard attrs | 1-20, integer |
| Custom attr name | Required if custom, max 50 chars |
| Custom attr value | 1-20, integer |
| Custom attr icon | Required if custom |

### Combat
| Field | Rules |
|-------|-------|
| `currentHP` | Integer, can be negative (up to -maxHP) |
| `maxHP` | 1+, integer |
| `movement` | 0-999, integer |
| `saveColor` | Optional string |

### Equipment
| Field | Rules |
|-------|-------|
| Weapon name | Required, max 100 chars |
| Weapon damage | Optional, e.g., "1d6+1" |
| Weapon bonus | -10 to +10, integer |
| Weapon quantity | 1+, integer |
| Armor DF | 0-20, integer |
| Armor weight | 0-20, integer |

### Groups
| Field | Rules |
|-------|-------|
| `speciesGroup` | Optional, max 100 chars |
| `vocationGroup` | Optional, max 100 chars |
| Affiliation | Max 100 chars each |

### Economy
| Field | Rules |
|-------|-------|
| `coinsOnHand` | 0+, integer |
| `stashedCoins` | 0+, integer |

### Other
| Field | Rules |
|-------|-------|
| `experience` | 0+, integer |
| `corruption` | 0+, integer |
| `comebackDice` | 0+, integer |
| `maxEncumbrance` | 0+, integer |
| Language | Max 50 chars each |
| Notes | Max 10,000 chars |

---

## 🎨 Theming Details

### CSS Variables

```css
:root {
  /* Background colors */
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --bg-card: #242424;
  
  /* Text colors */
  --text-primary: #f5f5f5;
  --text-secondary: #a3a3a3;
  --text-muted: #737373;
  
  /* Accent colors */
  --accent-cyan: #22d3ee;
  --accent-fuchsia: #d946ef;
  
  /* Class colors */
  --class-strong: rgb(178, 34, 50);
  --class-wise: rgb(104, 157, 217);
  --class-deft: rgb(121, 76, 162);
  --class-brave: rgb(205, 127, 50);
  --class-clever: rgb(55, 139, 95);
  --class-fortunate: rgb(142, 68, 173);
  
  /* Borders */
  --border-default: #404040;
  --border-focus: var(--accent-cyan);
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-card: #ffffff;
  --text-primary: #171717;
  --text-secondary: #525252;
  --border-default: #e5e5e5;
}
```

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   cd whitehack-tools-tauri
   ./setup.sh
   ```

2. **Start development:**
   ```bash
   ./dev.sh
   ```

3. **Build for production:**
   ```bash
   ./build.sh
   ```

---

*Last updated: January 2026*

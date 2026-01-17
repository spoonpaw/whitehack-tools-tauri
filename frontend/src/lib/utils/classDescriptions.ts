/**
 * classDescriptions.ts - Descriptions for class abilities
 */

import type { StrongCombatOptionId, BraveQuirkId, CleverKnackId } from '$lib/models';

// ============================================
// STRONG COMBAT OPTIONS
// ============================================

export interface StrongCombatOption {
  id: StrongCombatOptionId;
  name: string;
  description: string;
}

export const STRONG_COMBAT_OPTIONS: StrongCombatOption[] = [
  {
    id: 0,
    name: 'Protect Adjacent Ally',
    description:
      'Full round action: Protect an adjacent character by redirecting all attacks targeting them to yourself until your next turn. Each enemy gets a save against this effect.'
  },
  {
    id: 1,
    name: 'Force Movement',
    description:
      'After a successful attack, you may forgo damage to force the opponent to move up to 10 feet from their current position. In melee, you may take their previous position as a free move. Target gets a save to resist. Note: This movement may trigger free attacks from other characters.'
  },
  {
    id: 2,
    name: 'Climb Big Opponents',
    description:
      "When fighting opponents larger than your species (e.g., a human vs a halfling), spend one action to climb them with an agility roll. If successful, gain double combat advantage (+4 to attack and damage) next round and subsequent rounds while holding on. Additional agility rolls may be required but don't cost actions."
  },
  {
    id: 3,
    name: 'Special Attack Effects',
    description:
      'On a successful attack, you may forgo normal damage to instead cause one of these effects: reduce enemy initiative by 2, reduce their movement by 10, or deal 2 points of ongoing damage per round. Must describe how the effect is achieved. Target may save to end movement/damage effects after 1+ rounds.'
  },
  {
    id: 4,
    name: 'Grant Double Advantage',
    description:
      'Once per battle, grant an ally double combat advantage on a single attack (can be used immediately or saved for later in the fight). Requires a small verbal action like a tactical command or suggestion.'
  },
  {
    id: 5,
    name: 'Encourage/Frighten',
    description:
      'With a small verbal action, either encourage allies or frighten enemies in a 15-foot radius. Encouragement: allies gain +1 to attack and saving throws. Frighten: enemies suffer -1 to attack and saving throws.'
  },
  {
    id: 6,
    name: 'Melee + Ranged Attack',
    description:
      'By giving up your movement for the round, make both a melee and a ranged attack. Requires appropriate one-handed weapons (e.g., sword and throwing knife). Both attacks must use suitable one-handed weapons.'
  },
  {
    id: 7,
    name: 'Parry and Wait',
    description:
      'Instead of attacking, parry to gain +2 defense this round and double combat advantage against the parried enemy next round. Parrying two rounds in a row grants triple advantage. If you take damage while parrying, you must save or lose the effect.'
  }
];

export function getStrongCombatOption(id: StrongCombatOptionId): StrongCombatOption | undefined {
  return STRONG_COMBAT_OPTIONS.find((opt) => opt.id === id);
}

// ============================================
// BRAVE QUIRKS
// ============================================

export interface BraveQuirk {
  id: BraveQuirkId;
  name: string;
  description: string;
}

export const BRAVE_QUIRKS: BraveQuirk[] = [
  {
    id: 0,
    name: 'Double Strain Rolls',
    description: 'Always make double positive strain rolls to move faster when encumbered.'
  },
  {
    id: 1,
    name: 'Improved Healing',
    description:
      'Require no treatment to heal beyond 1 HP from negative value. Can use comeback dice for damage shrugged off on successful save.'
  },
  {
    id: 2,
    name: 'Protect Ally',
    description:
      'Choose a party member at session start. When protecting them, use one free comeback die for the roll.'
  },
  {
    id: 3,
    name: 'Resist Curses',
    description:
      '+4 saving throw vs. cursed objects and may use comeback dice to reduce cursed HP costs.'
  },
  {
    id: 4,
    name: 'Draw Attention',
    description:
      'Enemies choose to attack someone other than you first at the start of battle (if possible). Can be inverted when desired.'
  },
  {
    id: 5,
    name: 'Fulfill Requirements',
    description:
      'Once per session, your courage fulfills user requirements that an item, place, or passage may have in the form of class or groups.'
  },
  {
    id: 6,
    name: 'Divine Invocation',
    description:
      "Once per session, use a god's name to halt, scare, convince, bless, or curse your level number of listeners (none higher level than you, +1 for holy symbol/affiliation). Each target may save to avoid."
  },
  {
    id: 7,
    name: 'Improvised Weapons',
    description:
      'Improvised weapons do at least 1d6 damage, and actual weapons ignore target resistances (but not immunities).'
  }
];

export function getBraveQuirk(id: BraveQuirkId): BraveQuirk | undefined {
  return BRAVE_QUIRKS.find((q) => q.id === id);
}

// ============================================
// CLEVER KNACKS
// ============================================

export interface CleverKnack {
  id: CleverKnackId;
  name: string;
  description: string;
}

export const CLEVER_KNACKS: CleverKnack[] = [
  {
    id: 0,
    name: 'Combat Exploiter',
    description:
      'Base bonus for combat advantage is +3 instead of +2, and once per battle may switch d6 for d10 as damage die.'
  },
  {
    id: 1,
    name: 'Efficient Crafter',
    description:
      '+4 to crafting, mending, or assembly. Takes half the time and can skip one non-essential part.'
  },
  {
    id: 2,
    name: 'Weakened Saves',
    description: 'Targets of special attacks get -3 to their saves.'
  },
  {
    id: 3,
    name: 'Navigation Master',
    description: 'Can always figure out location roughly. Never gets lost.'
  },
  {
    id: 4,
    name: 'Convincing Negotiator',
    description: '+2 to task rolls and saves in conviction attempts, including trade.'
  },
  {
    id: 5,
    name: 'Escape Artist',
    description: '+4 to any task roll related to escaping confinement or bypassing barriers.'
  },
  {
    id: 6,
    name: 'Substance Expert',
    description:
      "+4 to substance identification and saves, +1 to quantified effects in character's favor."
  },
  {
    id: 7,
    name: 'Machine Master',
    description: '+4 to task rolls with or concerning machines.'
  },
  {
    id: 8,
    name: 'Tracking Expert',
    description: '+4 to tracking and covering own tracks.'
  }
];

export function getCleverKnack(id: CleverKnackId): CleverKnack | undefined {
  return CLEVER_KNACKS.find((k) => k.id === id);
}

// ============================================
// HELPER FUNCTIONS FOR DISPLAY
// ============================================

/**
 * Get description for a Strong combat option by ID
 */
export function getStrongCombatOptionDescription(id: StrongCombatOptionId): string {
  const option = getStrongCombatOption(id);
  return option?.description ?? '';
}

/**
 * Get description for a Brave quirk by ID
 */
export function getBraveQuirkDescription(id: BraveQuirkId): string {
  const quirk = getBraveQuirk(id);
  return quirk?.description ?? '';
}

/**
 * Get description for a Clever knack by ID
 */
export function getCleverKnackDescription(id: CleverKnackId): string {
  const knack = getCleverKnack(id);
  return knack?.description ?? '';
}

// ============================================
// CLASS DESCRIPTIONS
// ============================================

import type { CharacterClass } from '$lib/models';

export const CLASS_DESCRIPTIONS: Record<CharacterClass, string> = {
  Strong: `The Strong excels in combat, gaining bonus attack value from high Strength and access to special combat maneuvers.

Key Abilities:
• +1 AV if Strength is 13+
• Choose combat options at each level
• Can use any weapon and armor effectively
• Natural leader in battle situations`,

  Wise: `The Wise channels miraculous powers through devotion and willpower, performing supernatural feats.

Key Abilities:
• Cast miracles using HP as fuel
• Miracle slots increase with level
• Can activate/deactivate miracles
• Magnitude determines miracle power`,

  Deft: `The Deft forms mystical attunements with objects, creatures, and places, gaining special abilities.

Key Abilities:
• Attune to items, pets, vehicles, teachers, or places
• Multiple attunement slots per level
• Daily powers from attunements
• Versatile skill specialist`,

  Brave: `The Brave faces danger head-on with courage and determination, gaining unique quirks.

Key Abilities:
• Comeback dice for recovery
• Choose quirks at each level
• Resistant to fear and curses
• Inspires allies in battle`,

  Clever: `The Clever uses wit and cunning to overcome obstacles, gaining specialized knacks.

Key Abilities:
• Choose knacks at each level
• Enhanced combat advantage
• Skill specializations
• Problem-solving expertise`,

  Fortunate: `The Fortunate bends luck to their favor, spending fortune points to influence outcomes.

Key Abilities:
• Luck points to modify rolls
• Fortune favors the bold
• Escape deadly situations
• Influence probability`
};

/**
 * Get the description for a character class
 */
export function getClassDescription(characterClass: CharacterClass): string {
  return CLASS_DESCRIPTIONS[characterClass] ?? '';
}

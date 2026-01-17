/**
 * classColors.ts - Class color definitions matching Swift/Kotlin apps
 */

import type { CharacterClass } from '$lib/models';

// ============================================
// CLASS COLOR RGB VALUES
// ============================================

export interface ClassColorRGB {
  r: number;
  g: number;
  b: number;
}

export const CLASS_COLORS: Record<CharacterClass, ClassColorRGB> = {
  Strong: { r: 0.698, g: 0.132, b: 0.195 },    // Deep crimson
  Wise: { r: 0.408, g: 0.616, b: 0.851 },      // Ethereal azure
  Deft: { r: 0.475, g: 0.298, b: 0.635 },      // Twilight violet
  Brave: { r: 0.804, g: 0.498, b: 0.196 },     // Burnished bronze
  Clever: { r: 0.216, g: 0.545, b: 0.373 },    // Emerald sage
  Fortunate: { r: 0.557, g: 0.267, b: 0.678 }  // Royal amethyst
};

// ============================================
// COLOR UTILITY FUNCTIONS
// ============================================

/**
 * Get the color for a character class as a hex string
 */
export function getClassColor(characterClass: CharacterClass): string {
  const color = CLASS_COLORS[characterClass];
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Get the color for a character class as an rgb() string
 */
export function getClassColorRGB(characterClass: CharacterClass): string {
  const color = CLASS_COLORS[characterClass];
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Get the color for a character class as an rgba() string with opacity
 */
export function getClassColorWithOpacity(characterClass: CharacterClass, opacity: number): string {
  const color = CLASS_COLORS[characterClass];
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get CSS custom properties for a class color
 */
export function getClassColorStyles(characterClass: CharacterClass): Record<string, string> {
  return {
    '--class-color': getClassColor(characterClass),
    '--class-color-rgb': getClassColorRGB(characterClass),
    '--class-color-light': getClassColorWithOpacity(characterClass, 0.15),
    '--class-color-medium': getClassColorWithOpacity(characterClass, 0.3)
  };
}

// ============================================
// CLASS ICON MAPPING
// ============================================

export type ClassIconName = 'sword' | 'star' | 'shield' | 'brain' | 'heart' | 'lightbulb' | 'clover';

export const CLASS_ICONS: Record<CharacterClass, ClassIconName> = {
  Strong: 'sword',
  Wise: 'star',
  Deft: 'shield',
  Brave: 'heart',
  Clever: 'lightbulb',
  Fortunate: 'clover'
};

/**
 * Get the icon name for a character class
 */
export function getClassIcon(characterClass: CharacterClass): ClassIconName {
  return CLASS_ICONS[characterClass];
}

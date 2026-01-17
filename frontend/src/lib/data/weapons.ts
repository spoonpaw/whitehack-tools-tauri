/**
 * weapons.ts - Preset weapon data from Whitehack rules
 */

import type { WeightCategory } from '$lib/models';

export interface PresetWeapon {
  name: string;
  damage: string;
  weight: WeightCategory;
  range: string;
  rateOfFire: string;
  cost: string;
  special: string;
}

export const PRESET_WEAPONS: PresetWeapon[] = [
  { name: 'Axe', damage: '1d6+1', weight: 'Regular', range: 'N/A', rateOfFire: 'N/A', cost: '20', special: '' },
  { name: 'Sword', damage: '1d6+1', weight: 'Regular', range: 'N/A', rateOfFire: 'N/A', cost: '20', special: '' },
  { name: 'Club', damage: '1d6-2', weight: 'Minor', range: 'N/A', rateOfFire: 'N/A', cost: '-', special: 'Knock-out, improvised' },
  { name: 'Crossbow', damage: '1d6+1', weight: 'Heavy', range: '70', rateOfFire: '1/2', cost: '50', special: 'Two handed' },
  { name: 'Dagger', damage: '1d6-2', weight: 'Minor', range: '15', rateOfFire: '1', cost: '5', special: '' },
  { name: 'Darts', damage: '1', weight: 'Minor', range: '20', rateOfFire: '3', cost: '3', special: '1–3 equal a minor item' },
  { name: 'Flail', damage: '1d6', weight: 'Regular', range: 'N/A', rateOfFire: 'N/A', cost: '20', special: 'Ignore shield DF' },
  { name: 'Great Sword', damage: '1d6+2', weight: 'Heavy', range: 'N/A', rateOfFire: 'N/A', cost: '40', special: 'Two handed' },
  { name: 'Great Axe', damage: '1d6+2', weight: 'Heavy', range: 'N/A', rateOfFire: 'N/A', cost: '40', special: 'Two handed' },
  { name: 'Javelin', damage: '1d6', weight: 'Minor', range: '40', rateOfFire: '1', cost: '4', special: 'd6–2 damage in melee' },
  { name: 'Longbow', damage: '1d6', weight: 'Regular', range: '70', rateOfFire: '1', cost: '25', special: 'Two handed' },
  { name: 'Mace', damage: '1d6', weight: 'Regular', range: 'N/A', rateOfFire: 'N/A', cost: '20', special: '+1 AV vs. metal armor' },
  { name: 'Hammer', damage: '1d6', weight: 'Regular', range: 'N/A', rateOfFire: 'N/A', cost: '20', special: '+1 AV vs. metal armor' },
  { name: 'Morning Star', damage: '1d6', weight: 'Heavy', range: 'N/A', rateOfFire: 'N/A', cost: '25', special: 'As above, x3 crit dam.' },
  { name: 'Musket', damage: '1d6+2', weight: 'Heavy', range: '30', rateOfFire: '1/4', cost: '150', special: 'Two handed' },
  { name: 'Pistol', damage: '1d6+1', weight: 'Regular', range: '20', rateOfFire: '1/3', cost: '100', special: '' },
  { name: 'Pole Arms', damage: '1d6', weight: 'Heavy', range: 'N/A', rateOfFire: 'N/A', cost: '25', special: 'Two handed, reach' },
  { name: 'Quarterstaff', damage: '1d6-1', weight: 'Regular', range: 'N/A', rateOfFire: 'N/A', cost: '2', special: 'Two handed, reach' },
  { name: 'Scimitar', damage: '1d6-1', weight: 'Regular', range: 'N/A', rateOfFire: 'N/A', cost: '16', special: '+1 AV while riding' },
  { name: 'Shortbow', damage: '1d6-1', weight: 'Regular', range: '50', rateOfFire: '1', cost: '20', special: 'Two handed, w. mount' },
  { name: 'Shortsword', damage: '1d6-1', weight: 'Minor', range: 'N/A', rateOfFire: 'N/A', cost: '15', special: '' },
  { name: 'Sling', damage: '1d6-2', weight: 'No Size', range: '30', rateOfFire: '1', cost: '2', special: 'Use with stones' },
  { name: 'Spear', damage: '1d6', weight: 'Regular', range: 'N/A', rateOfFire: 'N/A', cost: '5', special: 'Reach' },
  { name: 'Throwing Knife', damage: '1d6-2', weight: 'Minor', range: '25', rateOfFire: '1', cost: '4', special: '−1 AV in melee' },
  { name: 'Throwing Axe', damage: '1d6-2', weight: 'Minor', range: '25', rateOfFire: '1', cost: '4', special: '−1 AV in melee' },
  { name: 'Unarmed', damage: 'd6-3', weight: 'No Size', range: 'N/A', rateOfFire: 'N/A', cost: '-', special: 'Knock-out, grapple' }
];

<script lang="ts">
  import type { PlayerCharacter, CustomAttributeIcon } from '$lib/models';
  import { CUSTOM_ATTRIBUTE_ICONS } from '$lib/models';
  import { Card, NumberInput, Toggle } from '$lib/components/ui';
  import { 
    Barbell, PersonSimpleRun, Heart, Brain, Eye, Star, Crown, Sword, Shield, 
    Lightning, Flame, Moon, Scroll, MagicWand, Target, ArrowsOutCardinal, 
    Sparkle, ShieldStar, Skull, Crosshair, Scales, Spiral, Infinity, 
    Waves, Hourglass, Drop, Wind, HandFist, Bandaids, Atom, Compass, Clover,
    Trash
  } from 'phosphor-svelte';
  import type { ComponentType } from 'svelte';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  // Standard attribute names for Whitehack
  const standardAttributes = [
    { key: 'strength', label: 'Strength' },
    { key: 'agility', label: 'Agility' },
    { key: 'toughness', label: 'Toughness' },
    { key: 'intelligence', label: 'Intelligence' },
    { key: 'willpower', label: 'Willpower' },
    { key: 'charisma', label: 'Charisma' }
  ] as const;

  // Icon mapping
  const iconComponents: Record<CustomAttributeIcon, ComponentType<any>> = {
    'barbell': Barbell,
    'personSimpleRun': PersonSimpleRun,
    'heart': Heart,
    'brain': Brain,
    'eye': Eye,
    'crown': Crown,
    'sword': Sword,
    'shield': Shield,
    'lightning': Lightning,
    'flame': Flame,
    'moon': Moon,
    'scroll': Scroll,
    'magicWand': MagicWand,
    'target': Target,
    'arrowsOutCardinal': ArrowsOutCardinal,
    'sparkle': Sparkle,
    'shieldStar': ShieldStar,
    'skull': Skull,
    'crosshair': Crosshair,
    'scales': Scales,
    'spiral': Spiral,
    'infinity': Infinity,
    'waves': Waves,
    'hourglass': Hourglass,
    'drop': Drop,
    'wind': Wind,
    'handFist': HandFist,
    'bandage': Bandaids,
    'star': Star,
    'atom': Atom,
    'compass': Compass,
    'clover': Clover
  };

  // Icon display names
  const iconNames: Record<CustomAttributeIcon, string> = {
    'barbell': 'Barbell',
    'personSimpleRun': 'Running',
    'heart': 'Heart',
    'brain': 'Brain',
    'eye': 'Eye',
    'crown': 'Crown',
    'sword': 'Sword',
    'shield': 'Shield',
    'lightning': 'Lightning',
    'flame': 'Flame',
    'moon': 'Moon',
    'scroll': 'Scroll',
    'magicWand': 'Magic Wand',
    'target': 'Target',
    'arrowsOutCardinal': 'Arrows',
    'sparkle': 'Sparkle',
    'shieldStar': 'Shield Star',
    'skull': 'Skull',
    'crosshair': 'Crosshair',
    'scales': 'Scales',
    'spiral': 'Spiral',
    'infinity': 'Infinity',
    'waves': 'Waves',
    'hourglass': 'Hourglass',
    'drop': 'Drop',
    'wind': 'Wind',
    'handFist': 'Fist',
    'bandage': 'Bandage',
    'star': 'Star',
    'atom': 'Atom',
    'compass': 'Compass',
    'clover': 'Clover'
  };

  // Track which icon picker is open
  let openPickerIndex = $state<number | null>(null);
</script>

<Card title="Attributes">
  <div class="space-y-4">
    <Toggle
      label="Use Custom Attributes"
      bind:checked={character.useCustomAttributes}
    />

    {#if !character.useCustomAttributes}
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {#each standardAttributes as attr}
          <NumberInput
            label={attr.label}
            bind:value={character[attr.key]}
            min={1}
            max={20}
          />
        {/each}
      </div>
    {:else}
      <div class="space-y-3">
        {#each character.customAttributes as attr, i}
          <div class="p-3 rounded-lg bg-neutral-800/50 space-y-3">
            <div class="flex items-end gap-3">
              <!-- Icon Picker -->
              <div class="relative">
                <label class="block text-xs text-neutral-500 mb-1">Icon</label>
                <button
                  type="button"
                  onclick={() => openPickerIndex = openPickerIndex === i ? null : i}
                  class="w-12 h-10 flex items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 hover:border-cyan-500 transition"
                >
                  <svelte:component 
                    this={iconComponents[attr.icon]} 
                    class="w-5 h-5 text-cyan-400" 
                    weight="bold" 
                  />
                </button>
                
                <!-- Icon Dropdown -->
                {#if openPickerIndex === i}
                  <div class="absolute z-50 top-full left-0 mt-1 p-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl max-h-64 overflow-y-auto w-64">
                    <div class="grid grid-cols-6 gap-1">
                      {#each CUSTOM_ATTRIBUTE_ICONS as iconKey}
                        <button
                          type="button"
                          onclick={() => {
                            attr.icon = iconKey;
                            openPickerIndex = null;
                          }}
                          class="p-2 rounded hover:bg-neutral-700 transition {attr.icon === iconKey ? 'bg-cyan-500/20 ring-1 ring-cyan-500' : ''}"
                          title={iconNames[iconKey]}
                        >
                          <svelte:component 
                            this={iconComponents[iconKey]} 
                            class="w-5 h-5 {attr.icon === iconKey ? 'text-cyan-400' : 'text-neutral-400'}" 
                            weight="bold" 
                          />
                        </button>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>

              <!-- Name -->
              <div class="flex-1">
                <label class="block text-xs text-neutral-500 mb-1">Name</label>
                <input
                  type="text"
                  bind:value={attr.name}
                  placeholder="Attribute name"
                  class="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <!-- Value -->
              <div class="w-20">
                <label class="block text-xs text-neutral-500 mb-1">Value</label>
                <input
                  type="number"
                  bind:value={attr.value}
                  min={1}
                  max={20}
                  class="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <!-- Delete Button -->
              <button
                type="button"
                onclick={() => {
                  character.customAttributes = character.customAttributes.filter((_, idx) => idx !== i);
                }}
                class="p-2 text-neutral-500 hover:text-red-400 transition"
              >
                <Trash class="w-5 h-5" weight="bold" />
              </button>
            </div>
          </div>
        {/each}
        
        <button
          type="button"
          onclick={() => {
            character.customAttributes = [
              ...character.customAttributes,
              { id: crypto.randomUUID(), name: '', value: 10, icon: 'sword' }
            ];
          }}
          class="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded-lg hover:border-cyan-500 transition"
        >
          + Add Custom Attribute
        </button>
      </div>
    {/if}
  </div>
</Card>

<!-- Click outside to close picker -->
{#if openPickerIndex !== null}
  <div 
    class="fixed inset-0 z-40" 
    onclick={() => openPickerIndex = null}
    onkeydown={(e) => e.key === 'Escape' && (openPickerIndex = null)}
    role="button"
    tabindex="-1"
  ></div>
{/if}

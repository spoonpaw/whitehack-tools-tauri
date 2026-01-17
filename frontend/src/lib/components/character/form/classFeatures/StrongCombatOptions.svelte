<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Card, Toggle } from '$lib/components/ui';
  import { STRONG_COMBAT_OPTIONS } from '$lib/utils/classDescriptions';
  import { getSlots } from '$lib/utils/AdvancementTables';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  const maxOptions = $derived(getSlots(character.characterClass, character.level));

  function isSelected(optionId: number): boolean {
    return character.strongCombatOptions.selectedOptions.includes(optionId as any);
  }

  function toggleOption(optionId: number) {
    const currentlySelected = character.strongCombatOptions.selectedOptions;
    
    if (isSelected(optionId)) {
      // Remove
      character.strongCombatOptions.selectedOptions = currentlySelected.filter(id => id !== optionId);
    } else if (currentlySelected.length < maxOptions) {
      // Add
      character.strongCombatOptions.selectedOptions = [...currentlySelected, optionId as any];
    }
  }
</script>

{#if character.characterClass === 'Strong'}
  <Card title="Combat Options">
    <p class="text-sm text-neutral-500 mb-4">
      Selected: {character.strongCombatOptions.selectedOptions.length} / {maxOptions}
    </p>

    <div class="space-y-3">
      {#each STRONG_COMBAT_OPTIONS as option}
        <button
          type="button"
          onclick={() => toggleOption(option.id)}
          class="w-full text-left p-3 rounded-lg border transition
            {isSelected(option.id) 
              ? 'border-cyan-600/50 bg-cyan-600/10' 
              : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'}"
          disabled={!isSelected(option.id) && character.strongCombatOptions.selectedOptions.length >= maxOptions}
        >
          <div class="flex items-start gap-3">
            <div class="pt-0.5">
              <div class="w-5 h-5 rounded border-2 flex items-center justify-center
                {isSelected(option.id) ? 'border-cyan-500 bg-cyan-500' : 'border-neutral-600'}">
                {#if isSelected(option.id)}
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                {/if}
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium text-neutral-100">{option.name}</div>
              <p class="text-xs text-neutral-500 mt-1">{option.description}</p>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </Card>
{/if}

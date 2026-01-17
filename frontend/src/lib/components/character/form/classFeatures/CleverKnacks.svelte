<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Card } from '$lib/components/ui';
  import { CLEVER_KNACKS } from '$lib/utils/classDescriptions';
  import { getSlots } from '$lib/utils/AdvancementTables';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  const maxKnacks = $derived(getSlots(character.characterClass, character.level));

  // Get all selected knack IDs from slots
  const selectedKnackIds = $derived(
    character.cleverKnackOptions.slots
      .filter(s => s.selectedKnack !== null)
      .map(s => s.selectedKnack!)
  );

  function isSelected(knackId: number): boolean {
    return selectedKnackIds.includes(knackId as any);
  }

  function toggleKnack(knackId: number) {
    if (isSelected(knackId)) {
      // Find and clear the slot with this knack
      const slotIndex = character.cleverKnackOptions.slots.findIndex(s => s.selectedKnack === knackId);
      if (slotIndex !== -1) {
        character.cleverKnackOptions.slots[slotIndex].selectedKnack = null;
      }
    } else if (selectedKnackIds.length < maxKnacks) {
      // Find an empty slot or create one
      const emptySlotIndex = character.cleverKnackOptions.slots.findIndex(s => s.selectedKnack === null);
      if (emptySlotIndex !== -1) {
        character.cleverKnackOptions.slots[emptySlotIndex].selectedKnack = knackId as any;
      } else if (character.cleverKnackOptions.slots.length < maxKnacks) {
        character.cleverKnackOptions.slots = [
          ...character.cleverKnackOptions.slots,
          { id: crypto.randomUUID(), selectedKnack: knackId as any }
        ];
      }
    }
  }
</script>

{#if character.characterClass === 'Clever'}
  <Card title="Knacks">
    <p class="text-sm text-neutral-500 mb-4">
      Selected: {selectedKnackIds.length} / {maxKnacks}
    </p>

    <div class="space-y-3">
      {#each CLEVER_KNACKS as knack}
        <button
          type="button"
          onclick={() => toggleKnack(knack.id)}
          class="w-full text-left p-3 rounded-lg border transition
            {isSelected(knack.id) 
              ? 'border-cyan-600/50 bg-cyan-600/10' 
              : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'}"
          disabled={!isSelected(knack.id) && selectedKnackIds.length >= maxKnacks}
        >
          <div class="flex items-start gap-3">
            <div class="pt-0.5">
              <div class="w-5 h-5 rounded border-2 flex items-center justify-center
                {isSelected(knack.id) ? 'border-cyan-500 bg-cyan-500' : 'border-neutral-600'}">
                {#if isSelected(knack.id)}
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                {/if}
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium text-neutral-100">{knack.name}</div>
              <p class="text-xs text-neutral-500 mt-1">{knack.description}</p>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </Card>
{/if}

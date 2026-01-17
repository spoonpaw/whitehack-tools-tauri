<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Card, Toggle, NumberInput } from '$lib/components/ui';
  import { BRAVE_QUIRKS } from '$lib/utils/classDescriptions';
  import { getSlots } from '$lib/utils/AdvancementTables';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  const maxQuirks = $derived(getSlots(character.characterClass, character.level));

  // Get all selected quirk IDs from slots
  const selectedQuirkIds = $derived(
    character.braveQuirkOptions.slots
      .filter(s => s.selectedQuirk !== null)
      .map(s => s.selectedQuirk!)
  );

  function isSelected(quirkId: number): boolean {
    return selectedQuirkIds.includes(quirkId as any);
  }

  function toggleQuirk(quirkId: number) {
    if (isSelected(quirkId)) {
      // Find and clear the slot with this quirk
      const slotIndex = character.braveQuirkOptions.slots.findIndex(s => s.selectedQuirk === quirkId);
      if (slotIndex !== -1) {
        character.braveQuirkOptions.slots[slotIndex].selectedQuirk = null;
      }
    } else if (selectedQuirkIds.length < maxQuirks) {
      // Find an empty slot or create one
      const emptySlotIndex = character.braveQuirkOptions.slots.findIndex(s => s.selectedQuirk === null);
      if (emptySlotIndex !== -1) {
        character.braveQuirkOptions.slots[emptySlotIndex].selectedQuirk = quirkId as any;
      } else if (character.braveQuirkOptions.slots.length < maxQuirks) {
        character.braveQuirkOptions.slots = [
          ...character.braveQuirkOptions.slots,
          { id: crypto.randomUUID(), selectedQuirk: quirkId as any }
        ];
      }
    }
  }
</script>

{#if character.characterClass === 'Brave'}
  <Card title="Quirks">
    <p class="text-sm text-neutral-500 mb-4">
      Selected: {selectedQuirkIds.length} / {maxQuirks}
    </p>

    <div class="space-y-3">
      {#each BRAVE_QUIRKS as quirk}
        <button
          type="button"
          onclick={() => toggleQuirk(quirk.id)}
          class="w-full text-left p-3 rounded-lg border transition
            {isSelected(quirk.id) 
              ? 'border-cyan-600/50 bg-cyan-600/10' 
              : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'}"
          disabled={!isSelected(quirk.id) && selectedQuirkIds.length >= maxQuirks}
        >
          <div class="flex items-start gap-3">
            <div class="pt-0.5">
              <div class="w-5 h-5 rounded border-2 flex items-center justify-center
                {isSelected(quirk.id) ? 'border-cyan-500 bg-cyan-500' : 'border-neutral-600'}">
                {#if isSelected(quirk.id)}
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                {/if}
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium text-neutral-100">{quirk.name}</div>
              <p class="text-xs text-neutral-500 mt-1">{quirk.description}</p>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </Card>

  <Card title="Comeback Dice" class="mt-6">
    <NumberInput
      label="Available Dice"
      bind:value={character.comebackDice}
      min={0}
      max={99}
    />
    <div class="mt-4">
      <Toggle
        label="Has Used 'Say No' This Session"
        bind:checked={character.hasUsedSayNo}
      />
    </div>
  </Card>
{/if}

<script lang="ts">
  import type { PlayerCharacter, WiseMiracleSlot, WiseMiracle } from '$lib/models';
  import { createDefaultWiseMiracleSlot, createDefaultWiseMiracle } from '$lib/models';
  import { Card, Input, Toggle, NumberInput } from '$lib/components/ui';
  import { getSlots } from '$lib/utils/AdvancementTables';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  const maxSlots = $derived(getSlots(character.characterClass, character.level));

  function addSlot() {
    if (character.wiseMiracleSlots.length < maxSlots) {
      character.wiseMiracleSlots = [
        ...character.wiseMiracleSlots,
        createDefaultWiseMiracleSlot()
      ];
    }
  }

  function removeSlot(index: number) {
    character.wiseMiracleSlots = character.wiseMiracleSlots.filter((_, i) => i !== index);
  }

  function addBaseMiracle(slotIndex: number) {
    const newMiracle = createDefaultWiseMiracle();
    character.wiseMiracleSlots[slotIndex].baseMiracles = [
      ...character.wiseMiracleSlots[slotIndex].baseMiracles,
      newMiracle
    ];
  }

  function removeBaseMiracle(slotIndex: number, miracleIndex: number) {
    character.wiseMiracleSlots[slotIndex].baseMiracles = 
      character.wiseMiracleSlots[slotIndex].baseMiracles.filter((_, i) => i !== miracleIndex);
  }

  function addAdditionalMiracle(slotIndex: number) {
    const newMiracle = createDefaultWiseMiracle();
    character.wiseMiracleSlots[slotIndex].additionalMiracles = [
      ...character.wiseMiracleSlots[slotIndex].additionalMiracles,
      newMiracle
    ];
  }

  function removeAdditionalMiracle(slotIndex: number, miracleIndex: number) {
    character.wiseMiracleSlots[slotIndex].additionalMiracles = 
      character.wiseMiracleSlots[slotIndex].additionalMiracles.filter((_, i) => i !== miracleIndex);
  }
</script>

{#if character.characterClass === 'Wise'}
  <Card title="Miracles">
    <p class="text-sm text-neutral-500 mb-4">
      Slots: {character.wiseMiracleSlots.length} / {maxSlots}
    </p>

    <div class="space-y-4">
      {#each character.wiseMiracleSlots as slot, slotIndex (slot.id)}
        <div class="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-medium text-neutral-100">Miracle Slot {slotIndex + 1}</h4>
            <button
              type="button"
              onclick={() => removeSlot(slotIndex)}
              class="text-neutral-500 hover:text-red-400 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <!-- Base Miracles -->
          <div class="space-y-2">
            <div class="text-xs text-neutral-500 uppercase tracking-wide">Base Miracles</div>
            {#each slot.baseMiracles as miracle, miracleIndex (miracle.id)}
              <div class="flex items-center gap-2 p-2 rounded bg-neutral-800/50">
                <Input
                  placeholder="Miracle name"
                  bind:value={miracle.name}
                />
                <NumberInput
                  bind:value={miracle.magnitude}
                  min={1}
                  max={10}
                  showControls={false}
                />
                <Toggle bind:checked={miracle.isActive} />
                <button
                  type="button"
                  onclick={() => removeBaseMiracle(slotIndex, miracleIndex)}
                  class="text-neutral-500 hover:text-red-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            {/each}
            <button
              type="button"
              onclick={() => addBaseMiracle(slotIndex)}
              class="w-full py-2 text-xs text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded hover:border-cyan-500 transition"
            >
              + Add Base Miracle
            </button>
          </div>

          <!-- Additional Miracles -->
          <div class="space-y-2">
            <div class="text-xs text-neutral-500 uppercase tracking-wide">Additional Miracles</div>
            {#each slot.additionalMiracles as miracle, miracleIndex (miracle.id)}
              <div class="flex items-center gap-2 p-2 rounded bg-neutral-800/50">
                <Input
                  placeholder="Miracle name"
                  bind:value={miracle.name}
                />
                <NumberInput
                  bind:value={miracle.magnitude}
                  min={1}
                  max={10}
                  showControls={false}
                />
                <Toggle bind:checked={miracle.isActive} />
                <button
                  type="button"
                  onclick={() => removeAdditionalMiracle(slotIndex, miracleIndex)}
                  class="text-neutral-500 hover:text-red-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            {/each}
            <button
              type="button"
              onclick={() => addAdditionalMiracle(slotIndex)}
              class="w-full py-2 text-xs text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded hover:border-cyan-500 transition"
            >
              + Add Additional Miracle
            </button>
          </div>
        </div>
      {/each}

      {#if character.wiseMiracleSlots.length < maxSlots}
        <button
          type="button"
          onclick={addSlot}
          class="w-full py-3 text-sm text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded-lg hover:border-cyan-500 transition"
        >
          + Add Miracle Slot
        </button>
      {/if}
    </div>
  </Card>
{/if}

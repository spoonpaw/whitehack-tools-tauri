<script lang="ts">
  import type { PlayerCharacter, AttunementSlot } from '$lib/models';
  import { ATTUNEMENT_TYPES } from '$lib/models';
  import { createDefaultAttunementSlot } from '$lib/models';
  import { Card, Input, Select, Toggle } from '$lib/components/ui';
  import { getSlots } from '$lib/utils/AdvancementTables';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  const maxSlots = $derived(getSlots(character.characterClass, character.level));
  const typeOptions = ATTUNEMENT_TYPES.map(t => ({ value: t.value, label: t.label }));

  function addSlot() {
    if (character.attunementSlots.length < maxSlots) {
      character.attunementSlots = [
        ...character.attunementSlots,
        createDefaultAttunementSlot()
      ];
    }
  }

  function removeSlot(index: number) {
    character.attunementSlots = character.attunementSlots.filter((_, i) => i !== index);
  }
</script>

{#if character.characterClass === 'Deft'}
  <Card title="Attunements">
    <p class="text-sm text-neutral-500 mb-4">
      Slots available: {character.attunementSlots.length} / {maxSlots}
    </p>

    <div class="space-y-4">
      {#each character.attunementSlots as slot, slotIndex (slot.id)}
        <div class="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-medium text-neutral-100">Slot {slotIndex + 1}</h4>
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

          <!-- Primary Attunement -->
          <div class="space-y-2">
            <div class="text-xs text-neutral-500 uppercase tracking-wide">Primary</div>
            <div class="grid grid-cols-2 gap-2">
              <Input
                placeholder="Name"
                bind:value={slot.primaryAttunement.name}
              />
              <Select
                options={typeOptions}
                bind:value={slot.primaryAttunement.type}
              />
            </div>
            <div class="flex gap-4">
              <Toggle label="Active" bind:checked={slot.primaryAttunement.isActive} />
              <Toggle label="Lost" bind:checked={slot.primaryAttunement.isLost} />
            </div>
          </div>

          <!-- Secondary Attunement -->
          <div class="space-y-2">
            <div class="text-xs text-neutral-500 uppercase tracking-wide">Secondary</div>
            <div class="grid grid-cols-2 gap-2">
              <Input
                placeholder="Name"
                bind:value={slot.secondaryAttunement.name}
              />
              <Select
                options={typeOptions}
                bind:value={slot.secondaryAttunement.type}
              />
            </div>
            <div class="flex gap-4">
              <Toggle label="Active" bind:checked={slot.secondaryAttunement.isActive} />
              <Toggle label="Lost" bind:checked={slot.secondaryAttunement.isLost} />
            </div>
          </div>

          <!-- Tertiary (optional) -->
          <Toggle
            label="Has Tertiary Attunement"
            bind:checked={slot.hasTertiaryAttunement}
          />
          {#if slot.hasTertiaryAttunement}
            <div class="space-y-2 pl-4 border-l-2 border-neutral-700">
              <div class="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Name"
                  bind:value={slot.tertiaryAttunement.name}
                />
                <Select
                  options={typeOptions}
                  bind:value={slot.tertiaryAttunement.type}
                />
              </div>
            </div>
          {/if}

          <!-- Daily Power -->
          <Toggle
            label="Has Used Daily Power"
            bind:checked={slot.hasUsedDailyPower}
          />
        </div>
      {/each}

      {#if character.attunementSlots.length < maxSlots}
        <button
          type="button"
          onclick={addSlot}
          class="w-full py-3 text-sm text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded-lg hover:border-cyan-500 transition"
        >
          + Add Attunement Slot
        </button>
      {/if}
    </div>
  </Card>
{/if}

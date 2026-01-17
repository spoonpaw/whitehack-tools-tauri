<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Card, Input } from '$lib/components/ui';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  // Helper to add/remove affiliations
  function addAffiliation() {
    character.affiliationGroups = [...character.affiliationGroups, ''];
  }

  function removeAffiliation(index: number) {
    character.affiliationGroups = character.affiliationGroups.filter((_, i) => i !== index);
  }

  // Helper to add/remove attribute group pairs
  function addAttributeGroupPair() {
    character.attributeGroupPairs = [
      ...character.attributeGroupPairs,
      { id: crypto.randomUUID(), attribute: '', group: '' }
    ];
  }

  function removeAttributeGroupPair(index: number) {
    character.attributeGroupPairs = character.attributeGroupPairs.filter((_, i) => i !== index);
  }
</script>

<Card title="Groups">
  <div class="space-y-6">
    <!-- Species -->
    <Input
      label="Species"
      placeholder="e.g., Human, Elf, Dwarf"
      bind:value={character.speciesGroup}
    />

    <!-- Vocation -->
    <Input
      label="Vocation"
      placeholder="e.g., Soldier, Scholar, Thief"
      bind:value={character.vocationGroup}
    />

    <!-- Affiliations -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-neutral-300">Affiliations</label>
      {#each character.affiliationGroups as _, i}
        <div class="flex items-center gap-2">
          <input
            type="text"
            bind:value={character.affiliationGroups[i]}
            placeholder="Affiliation name"
            class="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="button"
            onclick={() => removeAffiliation(i)}
            class="p-2 text-neutral-500 hover:text-red-400 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/each}
      <button
        type="button"
        onclick={addAffiliation}
        class="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded-lg hover:border-cyan-500 transition"
      >
        + Add Affiliation
      </button>
    </div>

    <!-- Attribute Group Pairs -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-neutral-300">Attribute-Group Links</label>
      {#each character.attributeGroupPairs as pair, i}
        <div class="flex items-center gap-2 p-3 rounded-lg bg-neutral-800/50">
          <input
            type="text"
            bind:value={pair.attribute}
            placeholder="Attribute"
            class="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <span class="text-neutral-500">→</span>
          <input
            type="text"
            bind:value={pair.group}
            placeholder="Group"
            class="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="button"
            onclick={() => removeAttributeGroupPair(i)}
            class="p-2 text-neutral-500 hover:text-red-400 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/each}
      <button
        type="button"
        onclick={addAttributeGroupPair}
        class="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded-lg hover:border-cyan-500 transition"
      >
        + Add Attribute-Group Link
      </button>
    </div>
  </div>
</Card>

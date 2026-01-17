<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Card, TextArea, Input } from '$lib/components/ui';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  // Helper for languages
  function addLanguage() {
    character.languages = [...character.languages, ''];
  }

  function removeLanguage(index: number) {
    character.languages = character.languages.filter((_, i) => i !== index);
  }
</script>

<Card title="Languages">
  <div class="space-y-2">
    {#each character.languages as _, i}
      <div class="flex items-center gap-2">
        <input
          type="text"
          bind:value={character.languages[i]}
          placeholder="Language"
          class="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="button"
          onclick={() => removeLanguage(i)}
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
      onclick={addLanguage}
      class="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded-lg hover:border-cyan-500 transition"
    >
      + Add Language
    </button>
  </div>
</Card>

<Card title="Notes" class="mt-6">
  <TextArea
    placeholder="Character notes, backstory, etc..."
    bind:value={character.notes}
    rows={6}
  />
</Card>

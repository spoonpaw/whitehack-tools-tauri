<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { PlayerCharacter } from '$lib/models';
  import { createDefaultCharacter } from '$lib/models';
  import { CharacterForm } from '$lib/components';
  import { characterStore } from '$lib/stores';

  let character = $state<PlayerCharacter | null>(null);
  let isLoading = $state(true);
  let error = $state('');
  let isNew = $state(false);

  const characterId = $derived($page.params.id);

  onMount(async () => {
    try {
      // Check if this is a brand new character (not yet in DB)
      if (characterId === 'new') {
        character = createDefaultCharacter();
        isNew = true;
        isLoading = false;
        return;
      }

      await characterStore.loadCharacters();
      
      // Load existing character
      const existingCharacter = characterStore.getCharacter(characterId);
      
      if (existingCharacter) {
        // Deep clone to avoid mutating store directly
        character = JSON.parse(JSON.stringify(existingCharacter));
        isNew = false;
      } else {
        error = 'Character not found';
      }
    } catch (err) {
      console.error('Failed to load character:', err);
      error = 'Failed to load character';
    } finally {
      isLoading = false;
    }
  });

  function handleCancel() {
    if (isNew) {
      // New character - just go back, nothing to delete
      goto('/');
    } else {
      // Go back to detail view
      goto(`/character/${characterId}`);
    }
  }

  async function handleSave(updatedCharacter: PlayerCharacter) {
    try {
      if (isNew) {
        // New character - add to database
        await characterStore.addCharacter(updatedCharacter);
        goto(`/character/${updatedCharacter.id}`);
      } else {
        // Existing character - update in database
        await characterStore.updateCharacter(updatedCharacter);
        goto(`/character/${characterId}`);
      }
    } catch (err) {
      console.error('Failed to save character:', err);
      // Could show error toast here
    }
  }
</script>

<svelte:head>
  <title>{isNew ? 'New Character' : `Edit ${character?.name || 'Character'}`} - Whitehack Tools</title>
</svelte:head>

{#if isLoading}
  <div class="min-h-screen flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <svg class="h-8 w-8 animate-spin text-cyan-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-neutral-500">Loading character...</p>
    </div>
  </div>
{:else if error}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-neutral-100 mb-2">Error</h1>
      <p class="text-neutral-500 mb-4">{error}</p>
      <button
        onclick={() => goto('/')}
        class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"
      >
        Back to Characters
      </button>
    </div>
  </div>
{:else if character}
  <CharacterForm
    bind:character
    {isNew}
    oncancel={handleCancel}
    onsave={handleSave}
  />
{/if}

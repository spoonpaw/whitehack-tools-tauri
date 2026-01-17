<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { PlayerCharacter } from '$lib/models';
  import { CharacterDetail } from '$lib/components';
  import { characterStore } from '$lib/stores';

  let character = $state<PlayerCharacter | null>(null);
  let isLoading = $state(true);
  let error = $state('');

  const characterId = $derived($page.params.id);

  onMount(async () => {
    try {
      await characterStore.loadCharacters();
      character = characterStore.getCharacter(characterId) ?? null;
      if (!character) {
        error = 'Character not found';
      }
    } catch (err) {
      console.error('Failed to load character:', err);
      error = 'Failed to load character';
    } finally {
      isLoading = false;
    }
  });

  // Update character when store changes
  $effect(() => {
    if (characterId) {
      character = characterStore.getCharacter(characterId) ?? null;
    }
  });

  function handleBack() {
    goto('/');
  }

  function handleEdit() {
    goto(`/character/${characterId}/edit`);
  }
</script>

<svelte:head>
  <title>{character?.name ?? 'Character'} - Whitehack Tools</title>
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
        onclick={handleBack}
        class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"
      >
        Back to Characters
      </button>
    </div>
  </div>
{:else if character}
  <CharacterDetail
    {character}
    onback={handleBack}
    onedit={handleEdit}
  />
{/if}

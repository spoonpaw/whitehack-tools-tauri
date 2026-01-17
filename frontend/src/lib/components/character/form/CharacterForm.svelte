<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import BasicInfoSection from './BasicInfoSection.svelte';
  import AttributesSection from './AttributesSection.svelte';
  import CombatStatsSection from './CombatStatsSection.svelte';
  import GroupsSection from './GroupsSection.svelte';
  import NotesSection from './NotesSection.svelte';
  import { EquipmentSection } from './equipment';
  import { ClassFeaturesSection } from './classFeatures';

  interface Props {
    character: PlayerCharacter;
    isNew?: boolean;
    oncancel: () => void;
    onsave: (character: PlayerCharacter) => void;
  }

  let { character = $bindable(), isNew = false, oncancel, onsave }: Props = $props();

  let isSaving = $state(false);

  async function handleSave() {
    if (!character.name.trim()) {
      // Could add validation UI here
      return;
    }

    isSaving = true;
    try {
      onsave(character);
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="min-h-screen">
  <!-- Full-width header -->
  <div class="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm">
    <div class="mx-auto max-w-4xl flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <button
          type="button"
          onclick={oncancel}
          class="flex items-center gap-2 text-neutral-400 hover:text-white transition"
          aria-label="Cancel"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-neutral-100">
          {isNew ? 'New Character' : `Edit ${character.name || 'Character'}`}
        </h1>
      </div>

      <button
        type="button"
        onclick={handleSave}
        disabled={isSaving}
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition disabled:opacity-50"
      >
        {#if isSaving}
          <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        {:else}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        {/if}
        {isNew ? 'Create' : 'Save'}
      </button>
    </div>
  </div>

  <!-- Constrained content -->
  <main class="mx-auto max-w-4xl px-4 py-6 space-y-6">
    <BasicInfoSection bind:character />
    <AttributesSection bind:character />
    <CombatStatsSection bind:character />
    <GroupsSection bind:character />
    <ClassFeaturesSection bind:character />
    <EquipmentSection bind:character />
    <NotesSection bind:character />
  </main>
</div>

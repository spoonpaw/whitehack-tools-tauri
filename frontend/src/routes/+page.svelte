<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { PlayerCharacter } from '$lib/models';
  import { createDefaultCharacter } from '$lib/models';
  import { CharacterList, CharacterListHeader, ExportModal, ImportModal, ConfirmDialog } from '$lib/components';
  import { characterStore } from '$lib/stores';

  let characters = $state<PlayerCharacter[]>([]);
  let isLoading = $state(true);
  let characterToDelete = $state<PlayerCharacter | null>(null);
  let showDeleteConfirm = $state(false);
  let showExportModal = $state(false);
  let showImportModal = $state(false);
  
  // Multi-select state
  let selectMode = $state(false);
  let selectedIds = $state<Set<string>>(new Set());
  let showBulkDeleteConfirm = $state(false);

  const selectedCount = $derived(selectedIds.size);

  onMount(async () => {
    try {
      await characterStore.loadCharacters();
      characters = characterStore.characters;
    } catch (err) {
      console.error('Failed to load characters:', err);
    } finally {
      isLoading = false;
    }
  });

  // Keep characters in sync with store
  $effect(() => {
    characters = characterStore.characters;
  });

  async function handleCreateCharacter() {
    // Navigate to new character form - don't save to DB yet
    goto('/character/new/edit');
  }

  function handleSelectCharacter(character: PlayerCharacter) {
    goto(`/character/${character.id}`);
  }

  function handleDeleteRequest(character: PlayerCharacter) {
    characterToDelete = character;
    showDeleteConfirm = true;
  }

  async function handleConfirmDelete() {
    if (characterToDelete) {
      await characterStore.deleteCharacter(characterToDelete.id);
      characterToDelete = null;
    }
    showDeleteConfirm = false;
  }

  function handleCancelDelete() {
    characterToDelete = null;
    showDeleteConfirm = false;
  }

  function handleOpenImport() {
    showImportModal = true;
  }

  async function handleImportCharacters(importedCharacters: PlayerCharacter[]) {
    for (const char of importedCharacters) {
      // Generate new ID to avoid conflicts
      const newChar = { ...char, id: crypto.randomUUID() };
      await characterStore.addCharacter(newChar);
    }
  }

  function handleOpenExport() {
    showExportModal = true;
  }

  async function handleExport(selectedCharacters: PlayerCharacter[]) {
    try {
      const { exportToFile, downloadCharactersAsFile } = await import('$lib/utils');
      
      // Try Tauri file dialog first, fall back to browser download
      const success = await exportToFile(selectedCharacters);
      if (!success) {
        // Fallback to browser download
        downloadCharactersAsFile(selectedCharacters);
      }
    } catch (err) {
      // If Tauri not available, use browser download
      const { downloadCharactersAsFile } = await import('$lib/utils');
      downloadCharactersAsFile(selectedCharacters);
    }
  }

  // Multi-select handlers
  function handleToggleSelectMode() {
    selectMode = !selectMode;
    if (!selectMode) {
      selectedIds = new Set();
    }
  }

  function handleSelectionChange(id: string, selected: boolean) {
    const newSet = new Set(selectedIds);
    if (selected) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    selectedIds = newSet;
  }

  function handleSelectAll() {
    selectedIds = new Set(characters.map(c => c.id));
  }

  function handleDeselectAll() {
    selectedIds = new Set();
  }

  function handleDeleteSelectedRequest() {
    if (selectedIds.size > 0) {
      showBulkDeleteConfirm = true;
    }
  }

  async function handleConfirmBulkDelete() {
    for (const id of selectedIds) {
      await characterStore.deleteCharacter(id);
    }
    selectedIds = new Set();
    selectMode = false;
    showBulkDeleteConfirm = false;
  }

  function handleCancelBulkDelete() {
    showBulkDeleteConfirm = false;
  }
</script>

<svelte:head>
  <title>Whitehack Tools</title>
</svelte:head>

<div class="min-h-screen">
  <CharacterListHeader
    characterCount={characters.length}
    oncreate={handleCreateCharacter}
    onimport={handleOpenImport}
    onexport={handleOpenExport}
    {selectMode}
    {selectedCount}
    ontoggleselect={handleToggleSelectMode}
    ondeleteselected={handleDeleteSelectedRequest}
    onselectall={handleSelectAll}
    ondeselectall={handleDeselectAll}
  />

  <main class="mx-auto max-w-4xl px-6 py-6">
    {#if isLoading}
      <div class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <svg class="h-8 w-8 animate-spin text-cyan-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-neutral-500">Loading characters...</p>
        </div>
      </div>
    {:else}
      <CharacterList
        {characters}
        onselect={handleSelectCharacter}
        ondelete={handleDeleteRequest}
        oncreate={handleCreateCharacter}
        selectable={selectMode}
        {selectedIds}
        onselectionchange={handleSelectionChange}
      />
    {/if}
  </main>

  <!-- Single character delete confirmation -->
  <ConfirmDialog
    open={showDeleteConfirm}
    title="Delete Character"
    message={characterToDelete ? `Are you sure you want to delete "${characterToDelete.name}"? This action cannot be undone.` : ''}
    confirmText="Delete"
    cancelText="Cancel"
    variant="danger"
    onconfirm={handleConfirmDelete}
    oncancel={handleCancelDelete}
  />

  <!-- Bulk delete confirmation -->
  <ConfirmDialog
    open={showBulkDeleteConfirm}
    title="Delete Characters"
    message={`Are you sure you want to delete ${selectedCount} character${selectedCount === 1 ? '' : 's'}? This action cannot be undone.`}
    confirmText={`Delete ${selectedCount} Character${selectedCount === 1 ? '' : 's'}`}
    cancelText="Cancel"
    variant="danger"
    onconfirm={handleConfirmBulkDelete}
    oncancel={handleCancelBulkDelete}
  />

  <ExportModal
    open={showExportModal}
    {characters}
    onclose={() => showExportModal = false}
    onexport={handleExport}
  />

  <ImportModal
    open={showImportModal}
    onclose={() => showImportModal = false}
    onimport={handleImportCharacters}
  />
</div>

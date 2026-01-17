<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Modal, Button } from '$lib/components/ui';
  import { getClassColor } from '$lib/utils';
  import { importCharacterFromJSON, importFromFile } from '$lib/utils/importExport';

  interface Props {
    open: boolean;
    onclose: () => void;
    onimport: (characters: PlayerCharacter[]) => void;
  }

  let { open, onclose, onimport }: Props = $props();

  let jsonText = $state('');
  let error = $state('');
  let previewCharacters = $state<PlayerCharacter[]>([]);
  let selectedIds = $state<Set<string>>(new Set());
  let showPreview = $state(false);

  // Reset state when modal opens
  $effect(() => {
    if (open) {
      jsonText = '';
      error = '';
      previewCharacters = [];
      selectedIds = new Set();
      showPreview = false;
    }
  });

  function parseAndPreview() {
    if (!jsonText.trim()) {
      error = 'Please enter or paste JSON data';
      return;
    }

    const result = importCharacterFromJSON(jsonText);
    
    if (result.success) {
      error = '';
      if (result.character) {
        previewCharacters = [result.character];
      } else if (result.characters) {
        previewCharacters = result.characters;
      }
      // Auto-select all
      selectedIds = new Set(previewCharacters.map(c => c.id));
      showPreview = true;
    } else {
      error = result.error || 'Invalid JSON format';
      previewCharacters = [];
      showPreview = false;
    }
  }

  async function handlePasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        jsonText = text;
        parseAndPreview();
      } else {
        error = 'Clipboard is empty';
      }
    } catch (err) {
      error = 'Failed to read clipboard. Please paste manually.';
    }
  }

  async function handleFileSelect() {
    const result = await importFromFile();
    
    if (result.success) {
      error = '';
      if (result.character) {
        previewCharacters = [result.character];
      } else if (result.characters) {
        previewCharacters = result.characters;
      }
      // Auto-select all
      selectedIds = new Set(previewCharacters.map(c => c.id));
      showPreview = true;
    } else {
      error = result.error || 'Failed to read file';
    }
  }

  function toggleCharacter(id: string) {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    selectedIds = newSet;
  }

  function selectAll() {
    selectedIds = new Set(previewCharacters.map(c => c.id));
  }

  function deselectAll() {
    selectedIds = new Set();
  }

  function handleImport() {
    const selected = previewCharacters.filter(c => selectedIds.has(c.id));
    onimport(selected);
    onclose();
  }

  function goBack() {
    showPreview = false;
    previewCharacters = [];
    selectedIds = new Set();
  }
</script>

<Modal {open} onclose={onclose} title="Import Characters">
  <div class="space-y-4">
    {#if !showPreview}
      <!-- Input mode -->
      <div class="space-y-3">
        <p class="text-sm text-neutral-400">
          Paste character JSON data or select a file to import.
        </p>

        <!-- Text area for pasting -->
        <textarea
          bind:value={jsonText}
          placeholder="Paste JSON here..."
          class="w-full h-40 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 resize-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-sm"
        ></textarea>

        {#if error}
          <p class="text-sm text-red-400">{error}</p>
        {/if}

        <!-- Action buttons -->
        <div class="flex flex-wrap gap-2">
          <Button variant="secondary" onclick={handlePasteFromClipboard}>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Paste from Clipboard
          </Button>
          <Button variant="secondary" onclick={handleFileSelect}>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Select File
          </Button>
        </div>
      </div>

      <!-- Parse button -->
      <div class="flex justify-end gap-3 pt-2 border-t border-neutral-800">
        <Button variant="ghost" onclick={onclose}>Cancel</Button>
        <Button onclick={parseAndPreview} disabled={!jsonText.trim()}>
          Preview
        </Button>
      </div>

    {:else}
      <!-- Preview mode -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <button
            type="button"
            onclick={goBack}
            class="flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span class="text-sm text-neutral-400">
            {selectedIds.size} of {previewCharacters.length} selected
          </span>
        </div>

        <!-- Selection controls -->
        <div class="flex gap-2 text-sm">
          <button
            type="button"
            onclick={selectAll}
            class="text-cyan-400 hover:text-cyan-300 transition"
          >
            Select All
          </button>
          <span class="text-neutral-600">|</span>
          <button
            type="button"
            onclick={deselectAll}
            class="text-cyan-400 hover:text-cyan-300 transition"
          >
            Deselect All
          </button>
        </div>

        <!-- Character list -->
        <div class="max-h-64 overflow-y-auto space-y-2">
          {#each previewCharacters as character (character.id)}
            {@const isSelected = selectedIds.has(character.id)}
            {@const classColor = getClassColor(character.characterClass)}
            <button
              type="button"
              onclick={() => toggleCharacter(character.id)}
              class="w-full flex items-center gap-3 p-3 rounded-lg border transition
                     {isSelected 
                       ? 'border-cyan-500 bg-cyan-500/10' 
                       : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800/50'}"
            >
              <!-- Checkbox -->
              <div class="w-5 h-5 rounded border-2 flex items-center justify-center transition
                          {isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-neutral-500'}">
                {#if isSelected}
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                {/if}
              </div>

              <!-- Character info -->
              <div class="flex-1 text-left">
                <div class="font-medium text-neutral-100">{character.name || 'Unnamed'}</div>
                <div class="text-xs text-neutral-500">
                  Level {character.level} 
                  <span style="color: {classColor}">{character.characterClass}</span>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Import button -->
      <div class="flex justify-end gap-3 pt-2 border-t border-neutral-800">
        <Button variant="ghost" onclick={onclose}>Cancel</Button>
        <Button 
          onclick={handleImport} 
          disabled={selectedIds.size === 0}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
        </Button>
      </div>
    {/if}
  </div>
</Modal>

<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Modal, Button } from '$lib/components/ui';
  import { getClassColor, exportCharactersToJSON } from '$lib/utils';
  import { DownloadSimple, Copy, Check } from 'phosphor-svelte';

  interface Props {
    open: boolean;
    characters: PlayerCharacter[];
    onclose: () => void;
    onexport: (characters: PlayerCharacter[]) => void;
  }

  let { open, characters, onclose, onexport }: Props = $props();

  let selectedIds = $state<Set<string>>(new Set());
  let copied = $state(false);

  // Reset selection when modal opens
  $effect(() => {
    if (open) {
      selectedIds = new Set();
      copied = false;
    }
  });

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
    selectedIds = new Set(characters.map(c => c.id));
  }

  function deselectAll() {
    selectedIds = new Set();
  }

  function handleExportToFile() {
    const selectedCharacters = characters.filter(c => selectedIds.has(c.id));
    onexport(selectedCharacters);
    onclose();
  }

  async function handleCopyToClipboard() {
    const selectedCharacters = characters.filter(c => selectedIds.has(c.id));
    const json = exportCharactersToJSON(selectedCharacters);
    
    try {
      await navigator.clipboard.writeText(json);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }
</script>

<Modal {open} onclose={onclose} title="Export Characters">
  <div class="space-y-4">
    {#if characters.length === 0}
      <p class="text-neutral-500 text-center py-4">No characters to export</p>
    {:else}
      <!-- Selection controls -->
      <div class="flex items-center justify-between">
        <span class="text-sm text-neutral-400">
          {selectedIds.size} of {characters.length} selected
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            onclick={selectAll}
            class="text-sm text-cyan-400 hover:text-cyan-300 transition"
          >
            Select All
          </button>
          <span class="text-neutral-600">|</span>
          <button
            type="button"
            onclick={deselectAll}
            class="text-sm text-cyan-400 hover:text-cyan-300 transition"
          >
            Deselect All
          </button>
        </div>
      </div>

      <!-- Character list -->
      <div class="max-h-64 overflow-y-auto space-y-2">
        {#each characters as character (character.id)}
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
    {/if}

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-2">
      <Button variant="ghost" onclick={onclose}>Cancel</Button>
      <Button 
        variant="secondary"
        onclick={handleCopyToClipboard} 
        disabled={selectedIds.size === 0}
      >
        {#if copied}
          <Check weight="bold" class="w-4 h-4 text-green-400" />
          Copied!
        {:else}
          <Copy weight="bold" class="w-4 h-4" />
          Copy JSON
        {/if}
      </Button>
      <Button 
        onclick={handleExportToFile} 
        disabled={selectedIds.size === 0}
      >
        <DownloadSimple weight="bold" class="w-4 h-4" />
        Save File
      </Button>
    </div>
  </div>
</Modal>

<script lang="ts">
  import { Button } from '$lib/components/ui';
  import { DownloadSimple, UploadSimple, Plus, Trash, CheckSquare, X } from 'phosphor-svelte';

  interface Props {
    characterCount: number;
    oncreate: () => void;
    onimport?: () => void;
    onexport?: () => void;
    selectMode?: boolean;
    selectedCount?: number;
    ontoggleselect?: () => void;
    ondeleteselected?: () => void;
    onselectall?: () => void;
    ondeselectall?: () => void;
  }

  let { 
    characterCount, 
    oncreate, 
    onimport, 
    onexport,
    selectMode = false,
    selectedCount = 0,
    ontoggleselect,
    ondeleteselected,
    onselectall,
    ondeselectall
  }: Props = $props();
</script>

<header class="border-b border-neutral-800">
  <div class="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
    <div>
      <h1 class="text-2xl font-bold text-neutral-100">Characters</h1>
      <p class="text-sm text-neutral-500">
        {#if selectMode && selectedCount > 0}
          {selectedCount} selected
        {:else}
          {characterCount} {characterCount === 1 ? 'character' : 'characters'}
        {/if}
      </p>
    </div>
    <div class="flex items-center gap-2">
      {#if selectMode}
        <!-- Selection mode buttons -->
        <Button variant="ghost" onclick={onselectall}>
          Select All
        </Button>
        {#if selectedCount > 0}
          <Button variant="ghost" onclick={ondeselectall}>
            Deselect All
          </Button>
          <Button variant="danger" onclick={ondeleteselected}>
            <Trash weight="bold" class="w-4 h-4" />
            Delete ({selectedCount})
          </Button>
        {/if}
        <Button variant="ghost" onclick={ontoggleselect}>
          <X weight="bold" class="w-4 h-4" />
          Cancel
        </Button>
      {:else}
        <!-- Normal mode buttons -->
        {#if characterCount > 0}
          <Button variant="ghost" onclick={ontoggleselect}>
            <CheckSquare weight="bold" class="w-4 h-4" />
            Select
          </Button>
        {/if}
        {#if onexport && characterCount > 0}
          <Button variant="ghost" onclick={onexport}>
            <UploadSimple weight="bold" class="w-4 h-4" />
            Export
          </Button>
        {/if}
        {#if onimport}
          <Button variant="ghost" onclick={onimport}>
            <DownloadSimple weight="bold" class="w-4 h-4" />
            Import
          </Button>
        {/if}
        <Button onclick={oncreate}>
          <Plus weight="bold" class="w-4 h-4" />
          New Character
        </Button>
      {/if}
    </div>
  </div>
</header>

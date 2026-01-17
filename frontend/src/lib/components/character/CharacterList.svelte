<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import CharacterListItem from './CharacterListItem.svelte';
  import { EmptyState, Button } from '$lib/components/ui';

  interface Props {
    characters: PlayerCharacter[];
    onselect: (character: PlayerCharacter) => void;
    ondelete: (character: PlayerCharacter) => void;
    oncreate: () => void;
    selectable?: boolean;
    selectedIds?: Set<string>;
    onselectionchange?: (id: string, selected: boolean) => void;
  }

  let { characters, onselect, ondelete, oncreate, selectable = false, selectedIds = new Set(), onselectionchange }: Props = $props();
</script>

{#if characters.length === 0}
  <EmptyState
    title="No Characters"
    message="Create your first character to get started"
  >
    {#snippet icon()}
      <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    {/snippet}
    {#snippet action()}
      <Button onclick={oncreate}>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Character
      </Button>
    {/snippet}
  </EmptyState>
{:else}
  <div class="space-y-3">
    {#each characters as character (character.id)}
      <CharacterListItem
        {character}
        {selectable}
        selected={selectedIds.has(character.id)}
        onclick={() => onselect(character)}
        ondelete={() => ondelete(character)}
        onselectionchange={(sel) => onselectionchange?.(character.id, sel)}
      />
    {/each}
  </div>
{/if}

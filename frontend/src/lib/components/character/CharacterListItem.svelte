<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Badge, IconCircle } from '$lib/components/ui';
  import { getClassColor } from '$lib/utils';
  import { Barbell, Sparkle, ArrowsOutCardinal, Shield, Lightbulb, Crown, Check } from 'phosphor-svelte';

  interface Props {
    character: PlayerCharacter;
    onclick: () => void;
    ondelete?: () => void;
    selectable?: boolean;
    selected?: boolean;
    onselectionchange?: (selected: boolean) => void;
  }

  let { character, onclick, ondelete, selectable = false, selected = false, onselectionchange }: Props = $props();

  const classColor = $derived(getClassColor(character.characterClass));

  function handleClick(e: MouseEvent) {
    if (selectable) {
      e.preventDefault();
      onselectionchange?.(!selected);
    } else {
      onclick();
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  role="button"
  tabindex="0"
  onclick={handleClick}
  onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(e as unknown as MouseEvent); }}
  class="group w-full rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 text-left transition hover:border-neutral-700 hover:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-neutral-950 cursor-pointer {selected ? 'ring-2 ring-cyan-500 border-cyan-500/50' : ''}"
>
  <div class="flex items-center gap-4">
    <!-- Selection Checkbox (when in select mode) -->
    {#if selectable}
      <div 
        class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition {selected ? 'bg-cyan-500 border-cyan-500' : 'border-neutral-600 hover:border-neutral-500'}"
      >
        {#if selected}
          <Check weight="bold" class="w-4 h-4 text-white" />
        {/if}
      </div>
    {/if}

    <!-- Class Icon (matching Swift) -->
    <IconCircle characterClass={character.characterClass} size="lg">
      {#if character.characterClass === 'Strong'}
        <Barbell weight="bold" class="w-full h-full" />
      {:else if character.characterClass === 'Wise'}
        <Sparkle weight="bold" class="w-full h-full" />
      {:else if character.characterClass === 'Deft'}
        <ArrowsOutCardinal weight="bold" class="w-full h-full" />
      {:else if character.characterClass === 'Brave'}
        <Shield weight="bold" class="w-full h-full" />
      {:else if character.characterClass === 'Clever'}
        <Lightbulb weight="bold" class="w-full h-full" />
      {:else if character.characterClass === 'Fortunate'}
        <Crown weight="bold" class="w-full h-full" />
      {:else}
        <Sparkle weight="bold" class="w-full h-full" />
      {/if}
    </IconCircle>

    <!-- Character Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-neutral-100 truncate">{character.name}</h3>
        <Badge variant="class" characterClass={character.characterClass} size="sm">
          {character.characterClass}
        </Badge>
      </div>
      <div class="flex items-center gap-3 mt-1 text-sm text-neutral-400">
        <span>Level {character.level}</span>
        {#if character.playerName}
          <span class="truncate">• {character.playerName}</span>
        {/if}
      </div>
    </div>

    <!-- HP Display -->
    <div class="flex flex-col items-end">
      <div class="text-xs text-neutral-500 uppercase tracking-wide">HP</div>
      <div class="flex items-baseline gap-1">
        <span class="text-lg font-bold" style="color: {classColor};">
          {character.currentHP}
        </span>
        <span class="text-sm text-neutral-500">/ {character.maxHP}</span>
      </div>
    </div>

    <!-- Delete Button (only in normal mode) -->
    {#if ondelete && !selectable}
      <button
        type="button"
        onclick={(e) => { e.stopPropagation(); ondelete?.(); }}
        class="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition"
        aria-label="Delete character"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    {/if}

    <!-- Chevron (only in normal mode) -->
    {#if !selectable}
      <svg class="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    {/if}
  </div>
</div>

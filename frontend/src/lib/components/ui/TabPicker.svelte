<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Tab {
    id: string;
    label: string;
    icon?: Snippet;
  }

  interface Props {
    tabs: Tab[];
    selected: string;
    onselect: (id: string) => void;
  }

  let { tabs, selected, onselect }: Props = $props();
</script>

<div class="flex items-center justify-center gap-2 px-4 py-3">
  {#each tabs as tab}
    <button
      type="button"
      onclick={() => onselect(tab.id)}
      class="flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition
        {selected === tab.id 
          ? 'bg-cyan-600/10 text-cyan-400' 
          : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'}"
    >
      {#if tab.icon}
        <span class="h-5 w-5">
          {@render tab.icon()}
        </span>
      {/if}
      <span class="text-xs font-medium">{tab.label}</span>
    </button>
  {/each}
</div>

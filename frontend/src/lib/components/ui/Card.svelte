<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    icon?: Snippet;
    children: Snippet;
    class?: string;
  }

  let { title, icon, children, class: className = '' }: Props = $props();
</script>

<div class="rounded-xl border border-neutral-800 bg-neutral-900/50 {className}">
  {#if title || icon}
    <div class="flex items-center gap-2 border-b border-neutral-800 px-4 py-3">
      {#if icon}
        <span class="text-neutral-400">
          {@render icon()}
        </span>
      {/if}
      {#if title}
        <h3 class="font-semibold text-neutral-100">{title}</h3>
      {/if}
    </div>
  {/if}
  <div class="p-4">
    {@render children()}
  </div>
</div>

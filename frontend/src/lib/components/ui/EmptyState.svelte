<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    message?: string;
    icon?: Snippet;
    action?: Snippet;
  }

  let { title, message, icon, action }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 text-center">
  {#if icon}
    <div class="mb-4 text-neutral-600">
      <span class="block h-16 w-16">
        {@render icon()}
      </span>
    </div>
  {/if}
  <h3 class="text-lg font-medium text-neutral-300">{title}</h3>
  {#if message}
    <p class="mt-1 text-sm text-neutral-500">{message}</p>
  {/if}
  {#if action}
    <div class="mt-4">
      {@render action()}
    </div>
  {/if}
</div>

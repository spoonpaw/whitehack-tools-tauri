<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    title?: string;
    onclose: () => void;
    children: Snippet;
    footer?: Snippet;
  }

  let { open, title, onclose, children, footer }: Props = $props();

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onclose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onclose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
  >
    <!-- Modal -->
    <div class="w-full max-w-lg rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl">
      <!-- Header -->
      {#if title}
        <div class="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <h2 class="text-lg font-semibold text-neutral-100">{title}</h2>
          <button
            type="button"
            onclick={onclose}
            class="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
            aria-label="Close"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/if}

      <!-- Content -->
      <div class="p-4">
        {@render children()}
      </div>

      <!-- Footer -->
      {#if footer}
        <div class="flex items-center justify-end gap-2 border-t border-neutral-800 px-4 py-3">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}

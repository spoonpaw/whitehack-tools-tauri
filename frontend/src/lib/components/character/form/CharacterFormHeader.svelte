<script lang="ts">
  import { Button } from '$lib/components/ui';

  interface Props {
    title: string;
    isNew: boolean;
    oncancel: () => void;
    onsave: () => void;
    isSaving?: boolean;
  }

  let { title, isNew, oncancel, onsave, isSaving = false }: Props = $props();
</script>

<header class="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10">
  <div class="flex items-center gap-3">
    <button
      type="button"
      onclick={oncancel}
      class="flex items-center gap-2 text-neutral-400 hover:text-white transition"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <h1 class="text-lg font-semibold text-neutral-100">{title}</h1>
  </div>

  <Button onclick={onsave} loading={isSaving}>
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    {isNew ? 'Create' : 'Save'}
  </Button>
</header>

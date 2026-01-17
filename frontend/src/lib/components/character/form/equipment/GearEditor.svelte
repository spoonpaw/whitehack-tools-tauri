<script lang="ts">
  import type { Gear } from '$lib/models';
  import { WEIGHT_CATEGORIES } from '$lib/models';
  import { Input, Select, Toggle, NumberInput } from '$lib/components/ui';

  interface Props {
    gear: Gear;
    ondelete: () => void;
  }

  let { gear = $bindable(), ondelete }: Props = $props();

  let expanded = $state(false);

  const weightOptions = WEIGHT_CATEGORIES.map(w => ({ value: w, label: w }));
</script>

<div class="rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden">
  <!-- Header (always visible) - Shows ALL info when collapsed -->
  <div class="w-full text-left p-3 hover:bg-neutral-800/50 transition cursor-pointer" onclick={() => expanded = !expanded}>
    <div class="flex items-start justify-between gap-2">
      <!-- Left: Name + Tags -->
      <div class="flex items-center gap-2 flex-wrap min-w-0">
        <button
          type="button"
          onclick={(e) => { e.stopPropagation(); gear.isEquipped = !gear.isEquipped; }}
          class="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition {gear.isEquipped ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-neutral-700/50 text-neutral-500 border border-neutral-600'}"
        >
          {#if gear.isEquipped}
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            Equipped
          {:else}
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/></svg>
            Not Equipped
          {/if}
        </button>
        <span class="font-semibold text-neutral-100">{gear.name || 'Unnamed Item'}</span>
        {#if gear.quantity > 1}
          <span class="text-xs px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-400">×{gear.quantity}</span>
        {/if}
        {#if gear.isContainer}
          <span class="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">📦 Container</span>
        {/if}
        {#if gear.isMagical}
          <span class="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">✨ Magical</span>
        {/if}
        {#if gear.isCursed}
          <span class="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">💀 Cursed</span>
        {/if}
        {#if gear.isStashed}
          <span class="text-xs px-1.5 py-0.5 rounded bg-neutral-600 text-neutral-400">🗄️ Stashed</span>
        {/if}
      </div>
      
      <!-- Right: Chevron -->
      <svg 
        class="w-5 h-5 text-neutral-500 transition-transform flex-shrink-0 {expanded ? 'rotate-180' : ''}" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Stats Row -->
    <div class="flex flex-wrap gap-3 mt-2 text-xs">
      <span class="px-2 py-1 rounded bg-neutral-800/50 text-neutral-400">{gear.weight}</span>
      {#if gear.quantity > 1}
        <span class="px-2 py-1 rounded bg-neutral-800/50 text-neutral-400">Qty: {gear.quantity}</span>
      {/if}
    </div>

    <!-- Special -->
    {#if gear.special}
      <div class="mt-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300">
        <span class="font-medium">Special:</span> {gear.special}
      </div>
    {/if}
  </div>

  <!-- Expanded Content (Edit Fields) -->
  {#if expanded}
    <div class="border-t border-neutral-800 p-4 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          placeholder="Item name"
          bind:value={gear.name}
        />
        <NumberInput
          label="Quantity"
          bind:value={gear.quantity}
          min={1}
          max={999}
        />
      </div>

      <Select
        label="Weight"
        options={weightOptions}
        bind:value={gear.weight}
      />

      <Input
        label="Special"
        placeholder="Special properties..."
        bind:value={gear.special}
      />

      <div class="flex flex-wrap gap-4">
        <Toggle label="Equipped" bind:checked={gear.isEquipped} />
        <Toggle label="Stashed" bind:checked={gear.isStashed} />
        <Toggle label="Container" bind:checked={gear.isContainer} />
        <Toggle label="Magical" bind:checked={gear.isMagical} />
        <Toggle label="Cursed" bind:checked={gear.isCursed} />
      </div>

      <button
        type="button"
        onclick={ondelete}
        class="w-full py-2 text-sm text-red-400 hover:text-red-300 border border-red-900/50 rounded-lg hover:border-red-700 hover:bg-red-900/20 transition"
      >
        Delete Item
      </button>
    </div>
  {/if}
</div>

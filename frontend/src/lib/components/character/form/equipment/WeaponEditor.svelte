<script lang="ts">
  import type { Weapon } from '$lib/models';
  import { WEIGHT_CATEGORIES } from '$lib/models';
  import { Input, Select, Toggle, NumberInput } from '$lib/components/ui';

  interface Props {
    weapon: Weapon;
    ondelete: () => void;
  }

  let { weapon = $bindable(), ondelete }: Props = $props();

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
          onclick={(e) => { e.stopPropagation(); weapon.isEquipped = !weapon.isEquipped; }}
          class="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition {weapon.isEquipped ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-neutral-700/50 text-neutral-500 border border-neutral-600'}"
        >
          {#if weapon.isEquipped}
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            Equipped
          {:else}
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/></svg>
            Not Equipped
          {/if}
        </button>
        <span class="font-semibold text-neutral-100">{weapon.name || 'Unnamed Weapon'}</span>
        {#if weapon.quantity > 1}
          <span class="text-xs px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-400">×{weapon.quantity}</span>
        {/if}
        {#if weapon.isMagical}
          <span class="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">✨ Magical</span>
        {/if}
        {#if weapon.isCursed}
          <span class="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">💀 Cursed</span>
        {/if}
        {#if weapon.isStashed}
          <span class="text-xs px-1.5 py-0.5 rounded bg-neutral-600 text-neutral-400">📦 Stashed</span>
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
      <span class="px-2 py-1 rounded bg-neutral-800 text-cyan-400 font-semibold">{weapon.damage || '—'}</span>
      <span class="px-2 py-1 rounded bg-neutral-800/50 text-neutral-400">{weapon.weight}</span>
      {#if weapon.range && weapon.range !== 'N/A'}
        <span class="px-2 py-1 rounded bg-neutral-800/50 text-neutral-400">Range: {weapon.range}</span>
      {/if}
      {#if weapon.rateOfFire && weapon.rateOfFire !== 'N/A'}
        <span class="px-2 py-1 rounded bg-neutral-800/50 text-neutral-400">RoF: {weapon.rateOfFire}</span>
      {/if}
      {#if weapon.bonus !== 0}
        <span class="px-2 py-1 rounded {weapon.bonus > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
          {weapon.bonus > 0 ? '+' : ''}{weapon.bonus} Bonus
        </span>
      {/if}
    </div>

    <!-- Special -->
    {#if weapon.special}
      <div class="mt-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300">
        <span class="font-medium">Special:</span> {weapon.special}
      </div>
    {/if}
  </div>

  <!-- Expanded Content (Edit Fields) -->
  {#if expanded}
    <div class="border-t border-neutral-800 p-4 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          placeholder="Weapon name"
          bind:value={weapon.name}
        />
        <Input
          label="Damage"
          placeholder="e.g., 1d6"
          bind:value={weapon.damage}
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <Select
          label="Weight"
          options={weightOptions}
          bind:value={weapon.weight}
        />
        <Input
          label="Range"
          placeholder="e.g., 60ft or N/A"
          bind:value={weapon.range}
        />
      </div>

      <div class="grid grid-cols-3 gap-4">
        <Input
          label="Rate of Fire"
          placeholder="e.g., 1/round"
          bind:value={weapon.rateOfFire}
        />
        <NumberInput
          label="Bonus"
          bind:value={weapon.bonus}
          min={-5}
          max={5}
        />
        <NumberInput
          label="Quantity"
          bind:value={weapon.quantity}
          min={1}
          max={99}
        />
      </div>

      <Input
        label="Special"
        placeholder="Special properties..."
        bind:value={weapon.special}
      />

      <div class="flex flex-wrap gap-4">
        <Toggle label="Equipped" bind:checked={weapon.isEquipped} />
        <Toggle label="Stashed" bind:checked={weapon.isStashed} />
        <Toggle label="Magical" bind:checked={weapon.isMagical} />
        <Toggle label="Cursed" bind:checked={weapon.isCursed} />
      </div>

      <button
        type="button"
        onclick={ondelete}
        class="w-full py-2 text-sm text-red-400 hover:text-red-300 border border-red-900/50 rounded-lg hover:border-red-700 hover:bg-red-900/20 transition"
      >
        Delete Weapon
      </button>
    </div>
  {/if}
</div>

<script lang="ts">
  interface Props {
    label?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    showControls?: boolean;
    onchange?: (value: number) => void;
  }

  let {
    label,
    value = $bindable(),
    min,
    max,
    step = 1,
    error,
    disabled = false,
    required = false,
    showControls = true,
    onchange
  }: Props = $props();

  // Default to 0 if undefined
  const safeValue = $derived(value ?? 0);

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const newValue = parseFloat(target.value) || 0;
    value = clampValue(newValue);
    onchange?.(value!);
  }

  function clampValue(val: number): number {
    if (min !== undefined && val < min) return min;
    if (max !== undefined && val > max) return max;
    return val;
  }

  function increment() {
    if (disabled) return;
    value = clampValue(safeValue + step);
    onchange?.(value!);
  }

  function decrement() {
    if (disabled) return;
    value = clampValue(safeValue - step);
    onchange?.(value!);
  }
</script>

<div class="space-y-1">
  {#if label}
    <label class="block text-sm font-medium text-neutral-300">
      {label}
      {#if required}
        <span class="text-red-400">*</span>
      {/if}
    </label>
  {/if}
  <div class="flex items-center gap-2">
    {#if showControls}
      <button
        type="button"
        onclick={decrement}
        {disabled}
        class="flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
    {/if}
    <input
      type="number"
      value={safeValue}
      {min}
      {max}
      {step}
      {disabled}
      {required}
      oninput={handleInput}
      class="flex-1 rounded-lg border bg-neutral-800 px-3 py-2 text-center text-neutral-100 transition focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        {error ? 'border-red-500' : 'border-neutral-700 focus:border-cyan-500'}"
    />
    {#if showControls}
      <button
        type="button"
        onclick={increment}
        {disabled}
        class="flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    {/if}
  </div>
  {#if error}
    <p class="text-sm text-red-400">{error}</p>
  {/if}
</div>

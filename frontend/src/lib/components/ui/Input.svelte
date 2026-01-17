<script lang="ts">
  interface Props {
    label?: string;
    type?: 'text' | 'number' | 'email' | 'password';
    placeholder?: string;
    value?: string | number;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    onchange?: (value: string) => void;
  }

  let {
    label,
    type = 'text',
    placeholder = '',
    value = $bindable(),
    error,
    disabled = false,
    required = false,
    min,
    max,
    step,
    onchange
  }: Props = $props();

  // Default to empty string if undefined
  const safeValue = $derived(value ?? '');

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    value = type === 'number' ? target.value : target.value;
    onchange?.(target.value);
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
  <input
    {type}
    {placeholder}
    value={safeValue}
    {disabled}
    {required}
    {min}
    {max}
    {step}
    oninput={handleInput}
    class="w-full rounded-lg border bg-neutral-800 px-3 py-2 text-neutral-100 placeholder-neutral-500 transition focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed
      {error ? 'border-red-500' : 'border-neutral-700 focus:border-cyan-500'}"
  />
  {#if error}
    <p class="text-sm text-red-400">{error}</p>
  {/if}
</div>

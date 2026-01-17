<script lang="ts">
  interface Props {
    label?: string;
    placeholder?: string;
    value?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    rows?: number;
    maxLength?: number;
    onchange?: (value: string) => void;
  }

  let {
    label,
    placeholder = '',
    value = $bindable(''),
    error,
    disabled = false,
    required = false,
    rows = 4,
    maxLength,
    onchange
  }: Props = $props();

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    value = target.value;
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
  <textarea
    {placeholder}
    {value}
    {disabled}
    {required}
    {rows}
    maxlength={maxLength}
    oninput={handleInput}
    class="w-full rounded-lg border bg-neutral-800 px-3 py-2 text-neutral-100 placeholder-neutral-500 transition focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed resize-y
      {error ? 'border-red-500' : 'border-neutral-700 focus:border-cyan-500'}"
  ></textarea>
  {#if error}
    <p class="text-sm text-red-400">{error}</p>
  {:else if maxLength}
    <p class="text-xs text-neutral-500 text-right">{value.length} / {maxLength}</p>
  {/if}
</div>

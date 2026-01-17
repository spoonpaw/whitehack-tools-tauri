<script lang="ts">
  interface Option {
    value: string;
    label: string;
  }

  interface Props {
    label?: string;
    options: Option[];
    value?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    onchange?: (value: string) => void;
  }

  let {
    label,
    options,
    value = $bindable(''),
    placeholder = 'Select...',
    error,
    disabled = false,
    required = false,
    onchange
  }: Props = $props();

  function handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
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
  <select
    {value}
    {disabled}
    {required}
    onchange={handleChange}
    class="w-full rounded-lg border bg-neutral-800 px-3 py-2 text-neutral-100 transition focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer
      {error ? 'border-red-500' : 'border-neutral-700 focus:border-cyan-500'}"
    style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23a3a3a3%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1rem;"
  >
    {#if placeholder}
      <option value="" disabled>{placeholder}</option>
    {/if}
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  {#if error}
    <p class="text-sm text-red-400">{error}</p>
  {/if}
</div>

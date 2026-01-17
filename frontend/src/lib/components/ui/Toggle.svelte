<script lang="ts">
  interface Props {
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    onchange?: (checked: boolean) => void;
  }

  let {
    label,
    checked = $bindable(false),
    disabled = false,
    onchange
  }: Props = $props();

  function handleChange() {
    if (disabled) return;
    checked = !checked;
    onchange?.(checked);
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  {disabled}
  onclick={handleChange}
  class="flex items-center gap-3 {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
>
  <div
    class="relative w-11 h-6 rounded-full transition-colors
      {checked ? 'bg-cyan-600' : 'bg-neutral-700'}"
  >
    <div
      class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform
        {checked ? 'translate-x-5' : 'translate-x-0'}"
    ></div>
  </div>
  {#if label}
    <span class="text-sm text-neutral-300">{label}</span>
  {/if}
</button>

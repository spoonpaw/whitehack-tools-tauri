<script lang="ts">
  interface Props {
    value: number; // 0-1
    color?: string;
    showLabel?: boolean;
    label?: string;
    size?: 'sm' | 'md';
  }

  let {
    value,
    color = '#22d3ee', // cyan-400
    showLabel = false,
    label,
    size = 'md'
  }: Props = $props();

  const percentage = $derived(Math.min(Math.max(value, 0), 1) * 100);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5'
  };
</script>

<div class="w-full">
  {#if showLabel || label}
    <div class="flex items-center justify-between mb-1">
      {#if label}
        <span class="text-sm text-neutral-400">{label}</span>
      {/if}
      {#if showLabel}
        <span class="text-sm font-medium text-neutral-300">{percentage.toFixed(0)}%</span>
      {/if}
    </div>
  {/if}
  <div class="w-full rounded-full bg-neutral-800 {heightClasses[size]}">
    <div
      class="rounded-full transition-all duration-300 {heightClasses[size]}"
      style="width: {percentage}%; background-color: {color};"
    ></div>
  </div>
</div>

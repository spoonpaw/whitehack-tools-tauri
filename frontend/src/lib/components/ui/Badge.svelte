<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { CharacterClass } from '$lib/models';
  import { getClassColor, getClassColorWithOpacity } from '$lib/utils';

  interface Props {
    variant?: 'default' | 'class';
    characterClass?: CharacterClass;
    size?: 'sm' | 'md';
    children: Snippet;
  }

  let {
    variant = 'default',
    characterClass,
    size = 'md',
    children
  }: Props = $props();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };

  const style = $derived(
    variant === 'class' && characterClass
      ? `background-color: ${getClassColorWithOpacity(characterClass, 0.15)}; color: ${getClassColor(characterClass)};`
      : ''
  );
</script>

<span
  class="inline-flex items-center font-medium rounded-full {sizeClasses[size]}
    {variant === 'default' ? 'bg-neutral-700 text-neutral-300' : ''}"
  {style}
>
  {@render children()}
</span>

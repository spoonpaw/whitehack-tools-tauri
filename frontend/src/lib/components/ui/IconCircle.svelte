<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { CharacterClass } from '$lib/models';
  import { getClassColor, getClassColorWithOpacity } from '$lib/utils';

  interface Props {
    characterClass?: CharacterClass;
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    children: Snippet;
  }

  let {
    characterClass,
    color,
    size = 'md',
    children
  }: Props = $props();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const bgColor = $derived(
    characterClass 
      ? getClassColorWithOpacity(characterClass, 0.15)
      : color 
        ? `${color}26` // ~15% opacity in hex
        : 'rgb(64, 64, 64)'
  );

  const iconColor = $derived(
    characterClass
      ? getClassColor(characterClass)
      : color || 'rgb(163, 163, 163)'
  );
</script>

<div
  class="flex items-center justify-center rounded-full {sizeClasses[size]}"
  style="background-color: {bgColor};"
>
  <span class="{iconSizeClasses[size]}" style="color: {iconColor};">
    {@render children()}
  </span>
</div>

<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Button } from '$lib/components/ui';
  import { getClassColor, getXPProgress } from '$lib/utils';
  import { Barbell, Sparkle, ArrowsOutCardinal, Shield, Lightbulb, Crown, CaretLeft, PencilSimple, Heart } from 'phosphor-svelte';

  interface Props {
    character: PlayerCharacter;
    onback: () => void;
    onedit: () => void;
  }

  let { character, onback, onedit }: Props = $props();

  const classColor = $derived(getClassColor(character.characterClass));
  const xpProgress = $derived(getXPProgress(character));
  const hpPercent = $derived(Math.round((character.currentHP / character.maxHP) * 100));
</script>

<header class="relative">
  <!-- Background Gradient -->
  <div 
    class="absolute inset-0 opacity-[0.04]"
    style="background: linear-gradient(180deg, {classColor} 0%, transparent 100%);"
  ></div>
  
  <div class="relative mx-auto max-w-4xl">
    <!-- Navigation Bar -->
    <div class="flex items-center justify-between px-4 py-3">
      <button
        type="button"
        onclick={onback}
        class="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
      >
        <CaretLeft weight="bold" class="w-4 h-4" />
        <span class="text-sm font-medium">Characters</span>
      </button>

      <Button size="sm" onclick={onedit}>
        <PencilSimple weight="bold" class="w-4 h-4" />
        Edit
      </Button>
    </div>

    <!-- Hero Section -->
    <div class="px-6 pt-4 pb-6">
      <!-- Top Row: Icon + Name + HP -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <!-- Class Icon -->
          <div 
            class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style="background: linear-gradient(135deg, {classColor} 0%, {classColor}cc 100%);"
          >
            <div class="w-8 h-8 text-white">
              {#if character.characterClass === 'Strong'}
                <Barbell weight="fill" class="w-full h-full" />
              {:else if character.characterClass === 'Wise'}
                <Sparkle weight="fill" class="w-full h-full" />
              {:else if character.characterClass === 'Deft'}
                <ArrowsOutCardinal weight="fill" class="w-full h-full" />
              {:else if character.characterClass === 'Brave'}
                <Shield weight="fill" class="w-full h-full" />
              {:else if character.characterClass === 'Clever'}
                <Lightbulb weight="fill" class="w-full h-full" />
              {:else if character.characterClass === 'Fortunate'}
                <Crown weight="fill" class="w-full h-full" />
              {:else}
                <Sparkle weight="fill" class="w-full h-full" />
              {/if}
            </div>
          </div>
          
          <!-- Name & Level -->
          <div>
            <h1 class="text-3xl font-bold text-white tracking-tight">{character.name}</h1>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-neutral-400">Level {character.level}</span>
              {#if character.playerName}
                <span class="text-neutral-600">•</span>
                <span class="text-neutral-500 text-sm">Played by {character.playerName}</span>
              {/if}
            </div>
          </div>
        </div>

        <!-- HP Ring -->
        <div class="flex flex-col items-center">
          <div class="relative w-20 h-20">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                stroke-width="6"
                class="text-neutral-800/50"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke={classColor}
                stroke-width="6"
                stroke-linecap="round"
                stroke-dasharray="{hpPercent * 2.136} 213.6"
                class="transition-all duration-700 ease-out"
                style="filter: drop-shadow(0 0 6px {classColor}60);"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <Heart weight="fill" class="w-4 h-4 mb-0.5" style="color: {classColor};" />
              <span class="text-lg font-bold tabular-nums text-white">{character.currentHP}</span>
              <span class="text-[10px] text-neutral-500">of {character.maxHP}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-3 gap-3">
        <!-- Class -->
        <div 
          class="rounded-xl p-3 text-center border transition-all hover:scale-[1.02]"
          style="background: linear-gradient(135deg, {classColor}08 0%, {classColor}03 100%); border-color: {classColor}20;"
        >
          <div class="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">Class</div>
          <div class="text-base font-semibold mt-0.5" style="color: {classColor};">{character.characterClass}</div>
        </div>

        <!-- Species -->
        <div class="rounded-xl p-3 text-center border transition-all hover:scale-[1.02] bg-gradient-to-br from-cyan-500/8 to-cyan-500/3 border-cyan-500/20">
          <div class="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">Species</div>
          <div class="text-base font-semibold mt-0.5 text-cyan-400">
            {character.speciesGroup || '—'}
          </div>
        </div>

        <!-- Vocation -->
        <div class="rounded-xl p-3 text-center border transition-all hover:scale-[1.02] bg-gradient-to-br from-fuchsia-500/8 to-fuchsia-500/3 border-fuchsia-500/20">
          <div class="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">Vocation</div>
          <div class="text-base font-semibold mt-0.5 text-fuchsia-400">
            {character.vocationGroup || '—'}
          </div>
        </div>
      </div>

      <!-- XP Progress -->
      {#if character.level < 10}
        <div class="mt-5">
          <div class="flex items-center justify-between text-xs mb-2">
            <div class="flex items-center gap-2">
              <span class="text-neutral-300 font-medium">{character.experience.toLocaleString()}</span>
              <span class="text-neutral-500">XP</span>
            </div>
            <span class="text-neutral-500">{xpProgress.xpToNextLevel.toLocaleString()} to level {character.level + 1}</span>
          </div>
          <div class="relative">
            <div 
              class="h-2 rounded-full overflow-hidden"
              style="background-color: {classColor}15;"
            >
              <div
                class="h-full rounded-full transition-all duration-700 ease-out"
                style="width: {xpProgress.progressPercent}%; background: linear-gradient(90deg, {classColor}cc 0%, {classColor} 100%);"
              ></div>
            </div>
            <!-- Progress Indicator -->
            <div 
              class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-neutral-900 transition-all duration-700"
              style="left: calc({xpProgress.progressPercent}% - 6px); background-color: {classColor};"
            ></div>
          </div>
        </div>
      {:else}
        <div class="mt-5 text-center">
          <span class="text-xs font-medium px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
            ✦ Maximum Level Achieved
          </span>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Bottom Border -->
  <div class="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
</header>

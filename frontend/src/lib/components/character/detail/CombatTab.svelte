<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Card } from '$lib/components/ui';
  import { getClassColor, getAdvancementStats, computeInitiativeBonus } from '$lib/utils';
  import { Sword, Shield, PersonSimpleRun, Lightning, ShieldStar } from 'phosphor-svelte';

  interface Props {
    character: PlayerCharacter;
  }

  let { character }: Props = $props();

  const stats = $derived(getAdvancementStats(character.characterClass, character.level));
  const classColor = $derived(getClassColor(character.characterClass));

  // Compute defense from equipped armor
  const equippedArmor = $derived(character.armor.filter(a => a.isEquipped));
  const computedDefense = $derived(
    equippedArmor.reduce((sum, a) => sum + a.df + a.bonus, 0)
  );

  // Compute initiative bonus
  const initiativeBonus = $derived(computeInitiativeBonus(character.dexterity, character.useCustomAttributes));
</script>

<div class="space-y-6 p-4">
  <Card title="Combat Stats">
    <div class="space-y-4">
      <!-- 2x2 Grid: Attack, Defense, Movement, Initiative -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Attack -->
        <div class="text-center p-6 rounded-lg bg-neutral-800/50">
          <Sword class="w-6 h-6 mx-auto mb-2" style="color: {classColor};" weight="bold" />
          <div class="text-xs text-neutral-500 mb-1">Attack</div>
          <div class="text-2xl font-bold text-neutral-100">{stats?.attackValue ?? character._attackValue}</div>
        </div>

        <!-- Defense -->
        <div class="text-center p-6 rounded-lg bg-neutral-800/50">
          <Shield class="w-6 h-6 mx-auto mb-2" style="color: {classColor};" weight="bold" />
          <div class="text-xs text-neutral-500 mb-1">Defense</div>
          <div class="text-2xl font-bold text-neutral-100">{computedDefense}</div>
        </div>

        <!-- Movement -->
        <div class="text-center p-6 rounded-lg bg-neutral-800/50">
          <PersonSimpleRun class="w-6 h-6 mx-auto mb-2" style="color: {classColor};" weight="bold" />
          <div class="text-xs text-neutral-500 mb-1">Movement</div>
          <div class="text-2xl font-bold text-neutral-100">{character.movement} ft</div>
        </div>

        <!-- Initiative -->
        <div class="text-center p-6 rounded-lg bg-neutral-800/50">
          <Lightning class="w-6 h-6 mx-auto mb-2" style="color: {classColor};" weight="bold" />
          <div class="text-xs text-neutral-500 mb-1">Initiative</div>
          <div class="text-2xl font-bold text-neutral-100">{initiativeBonus >= 0 ? '+' : ''}{initiativeBonus}</div>
        </div>
      </div>

      <!-- Save (full width) -->
      <div class="text-center p-6 rounded-lg bg-neutral-800/50">
        <ShieldStar class="w-6 h-6 mx-auto mb-2" style="color: {classColor};" weight="bold" />
        <div class="text-xs text-neutral-500 mb-1">Save</div>
        <div class="text-2xl font-bold text-neutral-100">{stats?.savingValue ?? character._saveValue}</div>
        {#if character.saveColor}
          <div class="text-sm text-neutral-400 mt-2">{character.saveColor}</div>
        {/if}
      </div>
    </div>
  </Card>
</div>

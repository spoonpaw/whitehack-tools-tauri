<script lang="ts">
  import type { PlayerCharacter, Weapon, Armor, Gear } from '$lib/models';
  import { Card } from '$lib/components/ui';
  import { getClassColor, calculateEncumbrance, BURDEN_LEVELS } from '$lib/utils';
  import { Stack, PersonSimpleRun, ArrowsOutCardinal, Warning } from 'phosphor-svelte';

  interface Props {
    character: PlayerCharacter;
  }

  let { character }: Props = $props();

  const classColor = $derived(getClassColor(character.characterClass));
  const encumbrance = $derived(calculateEncumbrance(character));

  // Separate equipped and stashed items
  const equippedWeapons = $derived(character.weapons.filter(w => w.isEquipped && !w.isStashed));
  const stashedWeapons = $derived(character.weapons.filter(w => w.isStashed));
  const carriedWeapons = $derived(character.weapons.filter(w => !w.isEquipped && !w.isStashed));

  const equippedArmor = $derived(character.armor.filter(a => a.isEquipped && !a.isStashed));
  const stashedArmor = $derived(character.armor.filter(a => a.isStashed));
  const carriedArmor = $derived(character.armor.filter(a => !a.isEquipped && !a.isStashed));

  const equippedGear = $derived(character.gear.filter(g => g.isEquipped && !g.isStashed));
  const carriedGear = $derived(character.gear.filter(g => !g.isEquipped && !g.isStashed));
  const stashedGear = $derived(character.gear.filter(g => g.isStashed));

  // Compute total defense value
  const totalDefenseValue = $derived(
    equippedArmor.reduce((sum, a) => sum + a.df + a.bonus, 0)
  );

  // Weight display helper
  function getWeightDisplay(weight: string | number): string {
    if (typeof weight === 'number') return `${weight} slots`;
    switch (weight?.toLowerCase()) {
      case 'no': case 'no size': return 'No size';
      case 'minor': return 'Minor';
      case 'regular': return 'Regular';
      case 'heavy': return 'Heavy';
      default: return weight || 'Unknown';
    }
  }
</script>

<div class="space-y-6 p-4">
  <!-- ======================= -->
  <!-- 1. WEAPONS SECTION -->
  <!-- ======================= -->
  {#if equippedWeapons.length > 0}
    <Card title="Equipped Weapons">
      <div class="space-y-3">
        {#each equippedWeapons as weapon}
          <div class="p-4 rounded-lg bg-neutral-800/50 space-y-3">
            <!-- Header: Name + Tags -->
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-neutral-100">{weapon.name}</span>
                {#if weapon.quantity > 1}
                  <span class="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-400">×{weapon.quantity}</span>
                {/if}
                {#if weapon.isMagical}
                  <span class="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">✨ Magical</span>
                {/if}
                {#if weapon.isCursed}
                  <span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">💀 Cursed</span>
                {/if}
              </div>
              <span class="font-bold text-lg" style="color: {classColor};">{weapon.damage}</span>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-4 gap-2 text-center text-xs">
              <div class="p-2 rounded bg-neutral-900/50">
                <div class="text-neutral-500">Weight</div>
                <div class="text-neutral-200 font-medium">{getWeightDisplay(weapon.weight)}</div>
              </div>
              <div class="p-2 rounded bg-neutral-900/50">
                <div class="text-neutral-500">Range</div>
                <div class="text-neutral-200 font-medium">{weapon.range || 'Melee'}</div>
              </div>
              <div class="p-2 rounded bg-neutral-900/50">
                <div class="text-neutral-500">RoF</div>
                <div class="text-neutral-200 font-medium">{weapon.rateOfFire || '—'}</div>
              </div>
              <div class="p-2 rounded bg-neutral-900/50">
                <div class="text-neutral-500">Bonus</div>
                <div class="text-neutral-200 font-medium">{weapon.bonus > 0 ? `+${weapon.bonus}` : weapon.bonus || '—'}</div>
              </div>
            </div>

            <!-- Special -->
            {#if weapon.special}
              <div class="p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                <div class="text-xs text-yellow-400 font-medium mb-1">Special</div>
                <div class="text-sm text-neutral-300">{weapon.special}</div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </Card>
  {/if}

  {#if carriedWeapons.length > 0}
    <Card title="Carried Weapons">
      <div class="space-y-3">
        {#each carriedWeapons as weapon}
          <div class="p-4 rounded-lg bg-neutral-800/30 space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-medium text-neutral-200">{weapon.name}</span>
                {#if weapon.quantity > 1}
                  <span class="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-500">×{weapon.quantity}</span>
                {/if}
                {#if weapon.isMagical}
                  <span class="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">✨ Magical</span>
                {/if}
                {#if weapon.isCursed}
                  <span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">💀 Cursed</span>
                {/if}
              </div>
              <span class="font-semibold text-neutral-400">{weapon.damage}</span>
            </div>

            <div class="grid grid-cols-4 gap-2 text-center text-xs">
              <div class="p-2 rounded bg-neutral-900/30">
                <div class="text-neutral-600">Weight</div>
                <div class="text-neutral-400">{getWeightDisplay(weapon.weight)}</div>
              </div>
              <div class="p-2 rounded bg-neutral-900/30">
                <div class="text-neutral-600">Range</div>
                <div class="text-neutral-400">{weapon.range || 'Melee'}</div>
              </div>
              <div class="p-2 rounded bg-neutral-900/30">
                <div class="text-neutral-600">RoF</div>
                <div class="text-neutral-400">{weapon.rateOfFire || '—'}</div>
              </div>
              <div class="p-2 rounded bg-neutral-900/30">
                <div class="text-neutral-600">Bonus</div>
                <div class="text-neutral-400">{weapon.bonus > 0 ? `+${weapon.bonus}` : weapon.bonus || '—'}</div>
              </div>
            </div>

            {#if weapon.special}
              <div class="p-2 rounded bg-neutral-900/30">
                <div class="text-xs text-neutral-500 font-medium mb-1">Special</div>
                <div class="text-sm text-neutral-400">{weapon.special}</div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </Card>
  {/if}

  <!-- ======================= -->
  <!-- 2. ARMOR SECTION -->
  <!-- ======================= -->
  {#if equippedArmor.length > 0}
    <Card title="Equipped Armor">
      <!-- Total Defense Value -->
      <div class="mb-4 p-3 rounded-lg bg-neutral-800/50 flex items-center justify-between">
        <span class="text-neutral-400">Total Defense Value</span>
        <span class="text-2xl font-bold" style="color: {classColor};">{totalDefenseValue}</span>
      </div>
      
      <div class="space-y-3">
        {#each equippedArmor as armor}
          <div class="p-4 rounded-lg bg-neutral-800/50 space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-neutral-100">{armor.name}</span>
                {#if armor.quantity > 1}
                  <span class="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-400">×{armor.quantity}</span>
                {/if}
                {#if armor.isShield}
                  <span class="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">🛡️ Shield</span>
                {/if}
                {#if armor.isMagical}
                  <span class="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">✨ Magical</span>
                {/if}
                {#if armor.isCursed}
                  <span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">💀 Cursed</span>
                {/if}
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center text-xs">
              <div class="p-2 rounded bg-neutral-900/50">
                <div class="text-neutral-500">Defense Factor</div>
                <div class="text-xl font-bold" style="color: {classColor};">{armor.df}{#if armor.bonus > 0}<span class="text-green-400 text-sm ml-1">+{armor.bonus}</span>{/if}</div>
              </div>
              <div class="p-2 rounded bg-neutral-900/50">
                <div class="text-neutral-500">Weight</div>
                <div class="text-neutral-200 font-medium">{armor.weight} slots</div>
              </div>
              <div class="p-2 rounded bg-neutral-900/50">
                <div class="text-neutral-500">Type</div>
                <div class="text-neutral-200 font-medium">{armor.isShield ? 'Shield' : 'Body Armor'}</div>
              </div>
            </div>

            {#if armor.special}
              <div class="p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                <div class="text-xs text-yellow-400 font-medium mb-1">Special</div>
                <div class="text-sm text-neutral-300">{armor.special}</div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </Card>
  {/if}

  {#if carriedArmor.length > 0}
    <Card title="Carried Armor">
      <div class="space-y-3">
        {#each carriedArmor as armor}
          <div class="p-4 rounded-lg bg-neutral-800/30 space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-medium text-neutral-200">{armor.name}</span>
                {#if armor.quantity > 1}
                  <span class="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-500">×{armor.quantity}</span>
                {/if}
                {#if armor.isShield}
                  <span class="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">🛡️ Shield</span>
                {/if}
                {#if armor.isMagical}
                  <span class="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">✨ Magical</span>
                {/if}
                {#if armor.isCursed}
                  <span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">💀 Cursed</span>
                {/if}
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center text-xs">
              <div class="p-2 rounded bg-neutral-900/30">
                <div class="text-neutral-600">Defense Factor</div>
                <div class="text-lg font-bold text-neutral-400">{armor.df}{#if armor.bonus > 0}<span class="text-green-400 text-sm ml-1">+{armor.bonus}</span>{/if}</div>
              </div>
              <div class="p-2 rounded bg-neutral-900/30">
                <div class="text-neutral-600">Weight</div>
                <div class="text-neutral-400">{armor.weight} slots</div>
              </div>
              <div class="p-2 rounded bg-neutral-900/30">
                <div class="text-neutral-600">Type</div>
                <div class="text-neutral-400">{armor.isShield ? 'Shield' : 'Body Armor'}</div>
              </div>
            </div>

            {#if armor.special}
              <div class="p-2 rounded bg-neutral-900/30">
                <div class="text-xs text-neutral-500 font-medium mb-1">Special</div>
                <div class="text-sm text-neutral-400">{armor.special}</div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </Card>
  {/if}

  <!-- ======================= -->
  <!-- 3. GEAR/EQUIPMENT SECTION -->
  <!-- ======================= -->
  {#if equippedGear.length > 0}
    <Card title="Equipped Gear">
      <div class="space-y-3">
        {#each equippedGear as item}
          <div class="p-4 rounded-lg bg-neutral-800/50 space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-neutral-100">{item.name}</span>
                {#if item.quantity > 1}
                  <span class="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-400">×{item.quantity}</span>
                {/if}
                {#if item.isContainer}
                  <span class="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">📦 Container</span>
                {/if}
                {#if item.isMagical}
                  <span class="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">✨ Magical</span>
                {/if}
                {#if item.isCursed}
                  <span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">💀 Cursed</span>
                {/if}
              </div>
              <span class="text-xs text-neutral-500">{getWeightDisplay(item.weight)}</span>
            </div>

            {#if item.special}
              <div class="p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                <div class="text-xs text-yellow-400 font-medium mb-1">Special</div>
                <div class="text-sm text-neutral-300">{item.special}</div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </Card>
  {/if}

  {#if carriedGear.length > 0}
    <Card title="Carried Gear">
      <div class="space-y-3">
        {#each carriedGear as item}
          <div class="p-4 rounded-lg bg-neutral-800/30 space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-medium text-neutral-200">{item.name}</span>
                {#if item.quantity > 1}
                  <span class="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-500">×{item.quantity}</span>
                {/if}
                {#if item.isContainer}
                  <span class="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">📦 Container</span>
                {/if}
                {#if item.isMagical}
                  <span class="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">✨ Magical</span>
                {/if}
                {#if item.isCursed}
                  <span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">💀 Cursed</span>
                {/if}
              </div>
              <span class="text-xs text-neutral-500">{getWeightDisplay(item.weight)}</span>
            </div>

            {#if item.special}
              <div class="p-2 rounded bg-neutral-900/30">
                <div class="text-xs text-neutral-500 font-medium mb-1">Special</div>
                <div class="text-sm text-neutral-400">{item.special}</div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </Card>
  {/if}

  <!-- ======================= -->
  <!-- 4. WEALTH/GOLD SECTION -->
  <!-- ======================= -->
  <Card title="Wealth">
    <div class="space-y-2">
      <div class="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50">
        <span class="text-neutral-400">On Hand</span>
        <span class="text-xl font-bold text-amber-400">{character.coinsOnHand}</span>
      </div>
      <div class="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50">
        <span class="text-neutral-400">Stashed</span>
        <span class="text-xl font-bold text-neutral-200">{character.stashedCoins}</span>
      </div>
      <div class="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border-t border-neutral-700">
        <span class="text-neutral-300 font-medium">Total Gold</span>
        <span class="text-2xl font-bold text-amber-400">{character.coinsOnHand + character.stashedCoins}</span>
      </div>
    </div>
  </Card>

  <!-- ======================= -->
  <!-- 5. ENCUMBRANCE SECTION -->
  <!-- ======================= -->
  <Card title="Encumbrance">
    <div class="space-y-6">
      
      <!-- Slots Overview -->
      <div class="p-4 rounded-lg bg-neutral-800/50 space-y-4">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-blue-500/20">
            <Stack class="w-4 h-4 text-blue-400" weight="bold" />
          </div>
          <span class="font-semibold text-neutral-100">Slots Overview</span>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-xs text-neutral-500">Used</div>
            <div class="text-2xl font-bold text-neutral-100">{encumbrance.usedSlots.toFixed(2)}</div>
          </div>
          <div>
            <div class="text-xs text-neutral-500">Available</div>
            <div class="text-2xl font-bold text-neutral-100">{encumbrance.availableSlots.toFixed(2)}</div>
          </div>
        </div>
        
        <div class="border-t border-neutral-700 pt-3">
          <div class="text-xs text-neutral-500">Max Slots</div>
          <div class="text-2xl font-bold text-neutral-100">{encumbrance.maxSlots}</div>
          <div class="text-xs text-neutral-500 mt-1">
            {encumbrance.hasContainer ? '15 slots with equipped container' : '10 slots without container'}
          </div>
        </div>
        
        {#if encumbrance.excessSlots > 0}
          <div class="border-t border-neutral-700 pt-3">
            <div class="text-xs text-neutral-500">Excess</div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-red-400">{encumbrance.excessSlots.toFixed(1)}</span>
              <span class="text-xs text-neutral-500">slots over limit</span>
            </div>
          </div>
        {/if}
      </div>
      
      <!-- Current Burden -->
      <div class="p-4 rounded-lg bg-neutral-800/50 space-y-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-lg" style="background-color: {encumbrance.burdenInfo.color}20;">
            <PersonSimpleRun class="w-4 h-4" style="color: {encumbrance.burdenInfo.color};" weight="bold" />
          </div>
          <span class="font-semibold text-neutral-100">Current Burden</span>
        </div>
        
        <div>
          <div class="text-2xl font-bold" style="color: {encumbrance.burdenInfo.color};">
            {encumbrance.burdenInfo.title}
          </div>
          <div class="text-sm text-neutral-400">{encumbrance.burdenInfo.description}</div>
        </div>
      </div>
      
      <!-- Movement Rates -->
      <div class="p-4 rounded-lg bg-neutral-800/50 space-y-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-green-500/20">
            <PersonSimpleRun class="w-4 h-4 text-green-400" weight="bold" />
          </div>
          <span class="font-semibold text-neutral-100">Movement Rates</span>
        </div>
        
        <div class="text-xs text-neutral-500">Base rates for different burden levels.</div>
        <div class="text-xs text-neutral-500">Crawl rate is ft per 10 minutes.</div>
        
        <div class="mt-3">
          <!-- Table Header -->
          <div class="grid grid-cols-[20px_1fr_80px_80px] gap-2 text-xs text-neutral-500 pb-2 border-b border-neutral-700">
            <div></div>
            <div>Burden</div>
            <div>Move</div>
            <div>Crawl</div>
          </div>
          
          <!-- Table Rows -->
          {#each encumbrance.movementRates as rate}
            <div class="grid grid-cols-[20px_1fr_80px_80px] gap-2 py-2 text-sm items-center" 
                 class:font-bold={rate.isCurrent}>
              <div class="flex justify-center">
                {#if rate.isCurrent}
                  <div class="w-2 h-2 rounded-full" style="background-color: {BURDEN_LEVELS[rate.burden].color};"></div>
                {/if}
              </div>
              <div class="text-neutral-300">{rate.burden}</div>
              <div style="color: {rate.isCurrent ? BURDEN_LEVELS[rate.burden].color : '#a3a3a3'};">{rate.move}</div>
              <div style="color: {rate.isCurrent ? BURDEN_LEVELS[rate.burden].color : '#a3a3a3'};">{rate.crawl}</div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Movement Options -->
      <div class="p-4 rounded-lg bg-neutral-800/50 space-y-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-lg" style="background-color: {encumbrance.burdenInfo.color}20;">
            <ArrowsOutCardinal class="w-4 h-4" style="color: {encumbrance.burdenInfo.color};" weight="bold" />
          </div>
          <span class="font-semibold text-neutral-100">Movement Options</span>
        </div>
        
        <div class="text-xs text-neutral-500">Movement rates per round (r)</div>
        <div class="text-xs text-neutral-500">For use in combat and tactical situations</div>
        
        <div class="mt-3">
          <!-- Table Header -->
          <div class="grid grid-cols-[1fr_80px] gap-2 text-xs text-neutral-500 pb-2 border-b border-neutral-700">
            <div>Movement Type</div>
            <div>Speed</div>
          </div>
          
          <!-- Table Rows -->
          {#each encumbrance.movementOptions as option}
            <div class="grid grid-cols-[1fr_80px] gap-2 py-2 text-sm"
                 class:font-bold={option.isCurrent}
                 style="color: {option.isCurrent ? encumbrance.burdenInfo.color : '#d4d4d4'};">
              <div>{option.type}</div>
              <div>{option.speed}</div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Burden Status (only when over limit) -->
      {#if encumbrance.excessSlots > 0}
        {@const drops = Math.min(3, Math.floor((encumbrance.excessSlots + 1) / 2))}
        <div class="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 space-y-3">
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-orange-500/20">
              <Warning class="w-4 h-4 text-orange-400" weight="bold" />
            </div>
            <span class="font-semibold text-neutral-100">Burden Status</span>
          </div>
          
          <p class="text-sm text-neutral-300">
            Your character is carrying {encumbrance.excessSlots.toFixed(1)} slots over their limit, 
            dropping {drops === 3 ? 'maximum of 3' : drops} burden categor{drops === 1 ? 'y' : 'ies'} from Normal.
          </p>
          
          <div class="mt-3">
            <div class="text-sm font-medium text-neutral-200">Straining & Boosted Movement</div>
            <div class="mt-2 space-y-2 text-xs">
              <p class="text-neutral-400">
                Make a Strength roll to move as if your burden was one category lighter for the current 
                time unit (round, 10 min, hour, or 6 hours).
              </p>
              <p class="text-green-400">
                Success: Move at the lighter burden rate for the time unit
              </p>
              <p class="text-red-400">
                Failure: Cannot move in the next time unit
              </p>
              <p class="text-neutral-500 italic">
                Note: If a boosted time unit covers a smaller unit (e.g., 6 hours → round), 
                a new roll is required to maintain the boost.
              </p>
            </div>
          </div>
        </div>
      {/if}
      
    </div>
  </Card>

  <!-- ======================= -->
  <!-- 6. STASHED ITEMS (at end) -->
  <!-- ======================= -->
  {#if stashedWeapons.length > 0 || stashedArmor.length > 0 || stashedGear.length > 0}
    <Card title="Stashed Items">
      <p class="text-xs text-neutral-500 mb-3">Items stored away, not counting toward encumbrance.</p>
      <div class="space-y-2">
        <!-- Stashed Weapons -->
        {#each stashedWeapons as weapon}
          <div class="p-3 rounded-lg bg-neutral-800/30 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-neutral-300">{weapon.name}</span>
                {#if weapon.quantity > 1}
                  <span class="text-xs text-neutral-600">×{weapon.quantity}</span>
                {/if}
                {#if weapon.isMagical}
                  <span class="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">✨</span>
                {/if}
                {#if weapon.isCursed}
                  <span class="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">💀</span>
                {/if}
              </div>
              <div class="flex items-center gap-2">
                <span class="text-neutral-500 text-sm">{weapon.damage}</span>
                <span class="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-500">Weapon</span>
              </div>
            </div>
            {#if weapon.special}
              <div class="text-xs text-neutral-500">{weapon.special}</div>
            {/if}
          </div>
        {/each}

        <!-- Stashed Armor -->
        {#each stashedArmor as armor}
          <div class="p-3 rounded-lg bg-neutral-800/30 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-neutral-300">{armor.name}</span>
                {#if armor.quantity > 1}
                  <span class="text-xs text-neutral-600">×{armor.quantity}</span>
                {/if}
                {#if armor.isShield}
                  <span class="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">🛡️</span>
                {/if}
                {#if armor.isMagical}
                  <span class="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">✨</span>
                {/if}
                {#if armor.isCursed}
                  <span class="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">💀</span>
                {/if}
              </div>
              <div class="flex items-center gap-2">
                <span class="text-neutral-500 text-sm">DF {armor.df}</span>
                <span class="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-500">Armor</span>
              </div>
            </div>
            {#if armor.special}
              <div class="text-xs text-neutral-500">{armor.special}</div>
            {/if}
          </div>
        {/each}

        <!-- Stashed Gear -->
        {#each stashedGear as item}
          <div class="p-3 rounded-lg bg-neutral-800/30 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-neutral-300">{item.name}</span>
                {#if item.quantity > 1}
                  <span class="text-xs text-neutral-600">×{item.quantity}</span>
                {/if}
                {#if item.isContainer}
                  <span class="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">📦</span>
                {/if}
                {#if item.isMagical}
                  <span class="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">✨</span>
                {/if}
                {#if item.isCursed}
                  <span class="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">💀</span>
                {/if}
              </div>
              <span class="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-500">Gear</span>
            </div>
            {#if item.special}
              <div class="text-xs text-neutral-500">{item.special}</div>
            {/if}
          </div>
        {/each}
      </div>
    </Card>
  {/if}
</div>

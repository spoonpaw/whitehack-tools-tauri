<script lang="ts">
  import type { Weapon, Armor, Gear } from '$lib/models';
  import { createDefaultWeapon, createDefaultArmor, createDefaultGear } from '$lib/models';
  import { PRESET_WEAPONS, PRESET_ARMOR, PRESET_GEAR } from '$lib/data';
  import { Modal, Button, Input } from '$lib/components/ui';

  type EquipmentType = 'weapon' | 'armor' | 'gear';

  interface Props {
    open: boolean;
    type: EquipmentType;
    onclose: () => void;
    onaddweapon?: (weapon: Weapon) => void;
    onaddarmor?: (armor: Armor) => void;
    onaddgear?: (gear: Gear) => void;
  }

  let { open, type, onclose, onaddweapon, onaddarmor, onaddgear }: Props = $props();

  let searchQuery = $state('');
  let activeTab = $state<'presets' | 'custom'>('presets');

  const filteredWeapons = $derived(
    PRESET_WEAPONS.filter(w => 
      w.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredArmor = $derived(
    PRESET_ARMOR.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredGear = $derived(
    PRESET_GEAR.filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function addPresetWeapon(preset: typeof PRESET_WEAPONS[0]) {
    const weapon: Weapon = {
      ...createDefaultWeapon(),
      name: preset.name,
      damage: preset.damage,
      weight: preset.weight,
      range: preset.range || 'N/A',
      rateOfFire: preset.rateOfFire || 'N/A',
      special: preset.special || ''
    };
    onaddweapon?.(weapon);
    onclose();
  }

  function addPresetArmor(preset: typeof PRESET_ARMOR[0]) {
    const armor: Armor = {
      ...createDefaultArmor(),
      name: preset.name,
      df: preset.df,
      weight: preset.weight,
      special: preset.special || '',
      isShield: preset.isShield || false
    };
    onaddarmor?.(armor);
    onclose();
  }

  function addPresetGear(preset: typeof PRESET_GEAR[0]) {
    const gear: Gear = {
      ...createDefaultGear(),
      name: preset.name,
      weight: preset.weight,
      special: preset.special || '',
      isContainer: preset.isContainer || false
    };
    onaddgear?.(gear);
    onclose();
  }

  function addCustom() {
    if (type === 'weapon') {
      onaddweapon?.(createDefaultWeapon());
    } else if (type === 'armor') {
      onaddarmor?.(createDefaultArmor());
    } else {
      onaddgear?.(createDefaultGear());
    }
    onclose();
  }

  const title = $derived(
    type === 'weapon' ? 'Add Weapon' :
    type === 'armor' ? 'Add Armor' : 'Add Gear'
  );
</script>

<Modal {open} {title} {onclose}>
  <!-- Tabs -->
  <div class="flex gap-2 mb-4">
    <button
      type="button"
      onclick={() => activeTab = 'presets'}
      class="flex-1 py-2 text-sm font-medium rounded-lg transition
        {activeTab === 'presets' 
          ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-600/50' 
          : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'}"
    >
      Presets
    </button>
    <button
      type="button"
      onclick={() => activeTab = 'custom'}
      class="flex-1 py-2 text-sm font-medium rounded-lg transition
        {activeTab === 'custom' 
          ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-600/50' 
          : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'}"
    >
      Custom
    </button>
  </div>

  {#if activeTab === 'presets'}
    <!-- Search -->
    <div class="mb-4">
      <Input
        placeholder="Search..."
        bind:value={searchQuery}
      />
    </div>

    <!-- Preset List -->
    <div class="max-h-64 overflow-y-auto space-y-2">
      {#if type === 'weapon'}
        {#each filteredWeapons as weapon}
          <button
            type="button"
            onclick={() => addPresetWeapon(weapon)}
            class="w-full p-3 text-left rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 hover:border-neutral-600 transition"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium text-neutral-100">{weapon.name}</span>
              <span class="text-sm text-cyan-400">{weapon.damage}</span>
            </div>
            <div class="text-xs text-neutral-500 mt-1">
              {weapon.weight}
              {#if weapon.range}
                • Range: {weapon.range}
              {/if}
              {#if weapon.special}
                • {weapon.special}
              {/if}
            </div>
          </button>
        {/each}
        {#if filteredWeapons.length === 0}
          <p class="text-center text-neutral-500 py-4">No weapons found</p>
        {/if}
      {:else if type === 'armor'}
        {#each filteredArmor as armor}
          <button
            type="button"
            onclick={() => addPresetArmor(armor)}
            class="w-full p-3 text-left rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 hover:border-neutral-600 transition"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium text-neutral-100">{armor.name}</span>
              <span class="text-sm text-cyan-400">DF: {armor.df}</span>
            </div>
            <div class="text-xs text-neutral-500 mt-1">
              Weight: {armor.weight} slots
              {#if armor.isShield}
                • Shield
              {/if}
              {#if armor.special}
                • {armor.special}
              {/if}
            </div>
          </button>
        {/each}
        {#if filteredArmor.length === 0}
          <p class="text-center text-neutral-500 py-4">No armor found</p>
        {/if}
      {:else}
        {#each filteredGear as gear}
          <button
            type="button"
            onclick={() => addPresetGear(gear)}
            class="w-full p-3 text-left rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 hover:border-neutral-600 transition"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium text-neutral-100">{gear.name}</span>
              <span class="text-xs text-neutral-500">{gear.weight}</span>
            </div>
            {#if gear.special}
              <div class="text-xs text-neutral-500 mt-1">{gear.special}</div>
            {/if}
          </button>
        {/each}
        {#if filteredGear.length === 0}
          <p class="text-center text-neutral-500 py-4">No gear found</p>
        {/if}
      {/if}
    </div>
  {:else}
    <!-- Custom -->
    <div class="text-center py-8">
      <p class="text-neutral-400 mb-4">Create a blank {type} and customize it yourself.</p>
      <Button onclick={addCustom}>
        Create Custom {type.charAt(0).toUpperCase() + type.slice(1)}
      </Button>
    </div>
  {/if}
</Modal>

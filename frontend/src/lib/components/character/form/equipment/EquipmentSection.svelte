<script lang="ts">
  import type { PlayerCharacter, Weapon, Armor, Gear } from '$lib/models';
  import { Card, NumberInput } from '$lib/components/ui';
  import { calculateEncumbrance } from '$lib/utils';
  import WeaponEditor from './WeaponEditor.svelte';
  import ArmorEditor from './ArmorEditor.svelte';
  import GearEditor from './GearEditor.svelte';
  import AddEquipmentModal from './AddEquipmentModal.svelte';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  // Modal state
  let showAddModal = $state(false);
  let addModalType = $state<'weapon' | 'armor' | 'gear'>('weapon');

  const encumbrance = $derived(calculateEncumbrance(character));

  function openAddModal(type: 'weapon' | 'armor' | 'gear') {
    addModalType = type;
    showAddModal = true;
  }

  function addWeapon(weapon: Weapon) {
    character.weapons = [...character.weapons, weapon];
  }

  function removeWeapon(index: number) {
    character.weapons = character.weapons.filter((_, i) => i !== index);
  }

  function addArmor(armor: Armor) {
    character.armor = [...character.armor, armor];
  }

  function removeArmor(index: number) {
    character.armor = character.armor.filter((_, i) => i !== index);
  }

  function addGear(gear: Gear) {
    character.gear = [...character.gear, gear];
  }

  function removeGear(index: number) {
    character.gear = character.gear.filter((_, i) => i !== index);
  }
</script>

<!-- Coins -->
<Card title="Wealth">
  <div class="grid grid-cols-2 gap-4">
    <NumberInput
      label="Coins on Hand"
      bind:value={character.coinsOnHand}
      min={0}
      showControls={false}
    />
    <NumberInput
      label="Stashed Coins"
      bind:value={character.stashedCoins}
      min={0}
      showControls={false}
    />
  </div>
</Card>

<!-- Encumbrance Overview -->
<Card title="Encumbrance" class="mt-6">
  <div class="grid grid-cols-3 gap-4 text-center">
    <div>
      <div class="text-xs text-neutral-500 uppercase tracking-wide">Regular</div>
      <div class="text-xl font-bold text-neutral-100">{encumbrance.regular}</div>
    </div>
    <div>
      <div class="text-xs text-neutral-500 uppercase tracking-wide">Heavy</div>
      <div class="text-xl font-bold text-neutral-100">{encumbrance.heavy}</div>
    </div>
    <div>
      <div class="text-xs text-neutral-500 uppercase tracking-wide">Total</div>
      <div class="text-xl font-bold text-cyan-400">{encumbrance.total}</div>
    </div>
  </div>
</Card>

<!-- Weapons -->
<Card title="Weapons" class="mt-6">
  <div class="space-y-3">
    {#each character.weapons as weapon, i (weapon.id)}
      <WeaponEditor
        bind:weapon={character.weapons[i]}
        ondelete={() => removeWeapon(i)}
      />
    {/each}
    
    <button
      type="button"
      onclick={() => openAddModal('weapon')}
      class="w-full py-3 text-sm text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded-lg hover:border-cyan-500 transition flex items-center justify-center gap-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Weapon
    </button>
  </div>
</Card>

<!-- Armor -->
<Card title="Armor" class="mt-6">
  <div class="space-y-3">
    {#each character.armor as armor, i (armor.id)}
      <ArmorEditor
        bind:armor={character.armor[i]}
        ondelete={() => removeArmor(i)}
      />
    {/each}
    
    <button
      type="button"
      onclick={() => openAddModal('armor')}
      class="w-full py-3 text-sm text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded-lg hover:border-cyan-500 transition flex items-center justify-center gap-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Armor
    </button>
  </div>
</Card>

<!-- Gear -->
<Card title="Gear" class="mt-6">
  <div class="space-y-3">
    {#each character.gear as gear, i (gear.id)}
      <GearEditor
        bind:gear={character.gear[i]}
        ondelete={() => removeGear(i)}
      />
    {/each}
    
    <button
      type="button"
      onclick={() => openAddModal('gear')}
      class="w-full py-3 text-sm text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded-lg hover:border-cyan-500 transition flex items-center justify-center gap-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Gear
    </button>
  </div>
</Card>

<!-- Add Equipment Modal -->
<AddEquipmentModal
  open={showAddModal}
  type={addModalType}
  onclose={() => showAddModal = false}
  onaddweapon={addWeapon}
  onaddarmor={addArmor}
  onaddgear={addGear}
/>

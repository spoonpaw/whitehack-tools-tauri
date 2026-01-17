<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { TabPicker } from '$lib/components/ui';
  import CharacterDetailHeader from './CharacterDetailHeader.svelte';
  import InfoTab from './InfoTab.svelte';
  import CombatTab from './CombatTab.svelte';
  import EquipmentTab from './EquipmentTab.svelte';

  interface Props {
    character: PlayerCharacter;
    onback: () => void;
    onedit: () => void;
  }

  let { character, onback, onedit }: Props = $props();

  type TabId = 'info' | 'combat' | 'equipment';
  let selectedTab = $state<TabId>('info');

  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'combat', label: 'Combat' },
    { id: 'equipment', label: 'Equipment' }
  ];
</script>

<div class="min-h-screen">
  <CharacterDetailHeader
    {character}
    {onback}
    {onedit}
  />

  <!-- Tab Picker -->
  <div class="border-b border-neutral-800">
    <TabPicker
      {tabs}
      selected={selectedTab}
      onselect={(id) => selectedTab = id as TabId}
    />
  </div>

  <!-- Tab Content -->
  <main class="mx-auto max-w-4xl">
    {#if selectedTab === 'info'}
      <InfoTab {character} />
    {:else if selectedTab === 'combat'}
      <CombatTab {character} />
    {:else if selectedTab === 'equipment'}
      <EquipmentTab {character} />
    {/if}
  </main>
</div>

<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import { Card, NumberInput, Input } from '$lib/components/ui';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();
</script>

<Card title="Combat Statistics">
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <NumberInput
        label="Current HP"
        bind:value={character.currentHP}
        min={-99}
        max={999}
      />
      <NumberInput
        label="Max HP"
        bind:value={character.maxHP}
        min={1}
        max={999}
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <NumberInput
        label="Movement"
        bind:value={character.movement}
        min={0}
        max={999}
        step={5}
      />
      <NumberInput
        label="Experience"
        bind:value={character.experience}
        min={0}
        showControls={false}
      />
    </div>

    <Input
      label="Save Color"
      placeholder="e.g., Blue, Red"
      bind:value={character.saveColor}
    />
  </div>
</Card>

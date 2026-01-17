<script lang="ts">
  import type { PlayerCharacter, CharacterClass } from '$lib/models';
  import { CHARACTER_CLASSES } from '$lib/models';
  import { Card, Input, Select, NumberInput } from '$lib/components/ui';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  const classOptions = CHARACTER_CLASSES.map(c => ({ value: c, label: c }));
</script>

<Card title="Basic Information">
  <div class="space-y-4">
    <Input
      label="Character Name"
      placeholder="Enter character name"
      bind:value={character.name}
      required
    />

    <Input
      label="Player Name"
      placeholder="Enter player name"
      bind:value={character.playerName}
    />

    <div class="grid grid-cols-2 gap-4">
      <Select
        label="Class"
        options={classOptions}
        bind:value={character.characterClass}
        required
      />

      <NumberInput
        label="Level"
        bind:value={character.level}
        min={1}
        max={10}
      />
    </div>
  </div>
</Card>

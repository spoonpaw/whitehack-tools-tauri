<script lang="ts">
  import type { PlayerCharacter } from '$lib/models';
  import DeftAttunements from './DeftAttunements.svelte';
  import StrongCombatOptions from './StrongCombatOptions.svelte';
  import WiseMiracles from './WiseMiracles.svelte';
  import BraveQuirks from './BraveQuirks.svelte';
  import CleverKnacks from './CleverKnacks.svelte';
  import FortunateLuck from './FortunateLuck.svelte';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();
</script>

<DeftAttunements bind:character />
<StrongCombatOptions bind:character />
<WiseMiracles bind:character />
<BraveQuirks bind:character />
<CleverKnacks bind:character />
<FortunateLuck bind:character />

<script lang="ts">
  import type { PlayerCharacter, Retainer } from '$lib/models';
  import { createDefaultRetainer } from '$lib/models';
  import { Card, Input, NumberInput, TextArea } from '$lib/components/ui';
  import { onMount } from 'svelte';

  interface Props {
    character: PlayerCharacter;
  }

  let { character = $bindable() }: Props = $props();

  // Ensure fortunateOptions has required structure on mount
  onMount(() => {
    if (!character.fortunateOptions) {
      character.fortunateOptions = {
        currentLuck: 0,
        hasUsedFortune: false,
        retainers: [],
        signatureObject: { name: '' },
        standing: ''
      };
    }
    if (character.fortunateOptions.currentLuck === undefined) {
      character.fortunateOptions.currentLuck = 0;
    }
    if (character.fortunateOptions.standing === undefined) {
      character.fortunateOptions.standing = '';
    }
    // Normalize retainers to ensure all fields exist (including new Swift fields)
    character.fortunateOptions.retainers = character.fortunateOptions.retainers.map(r => ({
      id: r.id || crypto.randomUUID(),
      name: r.name ?? '',
      type: r.type ?? '',
      level: r.level ?? r.hitDice ?? 1,
      currentHP: r.currentHP ?? 1,
      maxHP: r.maxHP ?? 1,
      attackValue: r.attackValue ?? 10,
      defenseFactor: r.defenseFactor ?? 0,
      movement: r.movement ?? 30,
      hitDice: r.hitDice ?? 1,
      keywords: Array.isArray(r.keywords) ? r.keywords : [],
      wage: r.wage ?? 0,
      share: r.share ?? 0,
      equipment: r.equipment ?? '',
      attitude: r.attitude ?? '',
      notes: r.notes ?? ''
    }));
  });

  function addRetainer() {
    character.fortunateOptions.retainers = [
      ...character.fortunateOptions.retainers,
      createDefaultRetainer()
    ];
  }

  function removeRetainer(index: number) {
    character.fortunateOptions.retainers = character.fortunateOptions.retainers.filter((_, i) => i !== index);
  }

  function addKeyword(retainerIndex: number, keyword: string) {
    if (keyword.trim()) {
      character.fortunateOptions.retainers[retainerIndex].keywords = [
        ...character.fortunateOptions.retainers[retainerIndex].keywords,
        keyword.trim()
      ];
    }
  }

  function removeKeyword(retainerIndex: number, keywordIndex: number) {
    character.fortunateOptions.retainers[retainerIndex].keywords = 
      character.fortunateOptions.retainers[retainerIndex].keywords.filter((_, i) => i !== keywordIndex);
  }

  let newKeywords: Record<number, string> = $state({});
</script>

{#if character.characterClass === 'Fortunate'}
  <Card title="Fortune">
    <div class="space-y-4">
      <NumberInput
        label="Current Luck"
        bind:value={character.fortunateOptions.currentLuck}
        min={0}
        max={99}
      />
      <p class="text-xs text-neutral-500">
        Spend luck points to modify dice rolls or escape deadly situations.
      </p>
    </div>
  </Card>

  <Card title="Standing" class="mt-6">
    <Input
      label="Standing"
      placeholder="Noble house, famous guild, religious order..."
      bind:value={character.fortunateOptions.standing}
    />
    <p class="text-xs text-neutral-500 mt-2">
      Your social standing or connection that grants influence and reputation.
    </p>
  </Card>

  <Card title="Signature Object" class="mt-6">
    <Input
      label="Name"
      placeholder="Family sword, royal signet ring..."
      bind:value={character.fortunateOptions.signatureObject.name}
    />
    <p class="text-xs text-neutral-500 mt-2">
      An object with plot immunity—cannot be lost or destroyed unless you wish it.
    </p>
  </Card>

  <Card title="Retainers" class="mt-6">
    <div class="space-y-4">
      {#each character.fortunateOptions.retainers as retainer, i (retainer.id)}
        <div class="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-medium text-neutral-100">Retainer {i + 1}</h4>
            <button
              type="button"
              onclick={() => removeRetainer(i)}
              class="text-neutral-500 hover:text-red-400 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <Input
              label="Name"
              placeholder="Retainer name"
              bind:value={retainer.name}
            />
            <Input
              label="Type"
              placeholder="Guard, servant, pet..."
              bind:value={retainer.type}
            />
          </div>

          <div class="grid grid-cols-4 gap-3">
            <NumberInput
              label="Current HP"
              bind:value={retainer.currentHP}
              min={-99}
              max={999}
            />
            <NumberInput
              label="Max HP"
              bind:value={retainer.maxHP}
              min={1}
              max={999}
            />
            <NumberInput
              label="DF"
              bind:value={retainer.defenseFactor}
              min={0}
              max={20}
            />
            <NumberInput
              label="MV"
              bind:value={retainer.movement}
              min={0}
              max={120}
            />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <NumberInput
              label="Attack Value"
              bind:value={retainer.attackValue}
              min={1}
              max={20}
            />
            <NumberInput
              label="Wage"
              bind:value={retainer.wage}
              min={0}
              showControls={false}
            />
            <NumberInput
              label="Share (%)"
              bind:value={retainer.share}
              min={0}
              max={100}
              showControls={false}
            />
          </div>

          <!-- Keywords -->
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Keywords</label>
            <div class="flex flex-wrap gap-2 mb-2">
              {#each retainer.keywords as keyword, ki}
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                  {keyword}
                  <button
                    type="button"
                    onclick={() => removeKeyword(i, ki)}
                    class="hover:text-red-400"
                  >×</button>
                </span>
              {/each}
            </div>
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="Add keyword..."
                class="flex-1 px-3 py-1.5 text-sm rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
                bind:value={newKeywords[i]}
                onkeydown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword(i, newKeywords[i] || '');
                    newKeywords[i] = '';
                  }
                }}
              />
              <button
                type="button"
                onclick={() => { addKeyword(i, newKeywords[i] || ''); newKeywords[i] = ''; }}
                class="px-3 py-1.5 text-sm rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition"
              >
                Add
              </button>
            </div>
          </div>

          <Input
            label="Equipment"
            placeholder="Retainer equipment"
            bind:value={retainer.equipment}
          />

          <Input
            label="Notes"
            placeholder="Additional notes..."
            bind:value={retainer.notes}
          />
        </div>
      {/each}

      <button
        type="button"
        onclick={addRetainer}
        class="w-full py-3 text-sm text-cyan-400 hover:text-cyan-300 border border-dashed border-neutral-700 rounded-lg hover:border-cyan-500 transition"
      >
        + Add Retainer
      </button>
    </div>
  </Card>
{/if}

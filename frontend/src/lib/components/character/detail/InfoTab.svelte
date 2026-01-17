<script lang="ts">
  import type { PlayerCharacter, CustomAttributeIcon } from '$lib/models';
  import { Card } from '$lib/components/ui';
  import { getClassColor, getAdvancementStats, getStrongCombatOption, getBraveQuirk, getCleverKnack } from '$lib/utils';
  import { 
    Barbell, PersonSimpleRun, Heart, Brain, Eye, Star, Crown, Sword, Shield, 
    Lightning, Flame, Moon, Scroll, MagicWand, Target, ArrowsOutCardinal, 
    Sparkle, ShieldStar, Skull, Crosshair, Scales, Spiral, Infinity, 
    Waves, Hourglass, Drop, Wind, HandFist, Bandaids, Atom, Compass, Clover,
    Lightbulb
  } from 'phosphor-svelte';
  import type { ComponentType } from 'svelte';

  interface Props {
    character: PlayerCharacter;
  }

  let { character }: Props = $props();

  const stats = $derived(getAdvancementStats(character.characterClass, character.level));
  const classColor = $derived(getClassColor(character.characterClass));
  const availableSlots = $derived(stats?.slots ?? 0);

  // Get standard attribute names (Whitehack uses different names)
  const standardAttributes = ['Strength', 'Agility', 'Toughness', 'Intelligence', 'Willpower', 'Charisma'];
  
  // Get attribute values based on whether custom attributes are used
  const attributes = $derived(
    character.useCustomAttributes && character.customAttributes.length > 0
      ? character.customAttributes.map(attr => ({ name: attr.name, value: attr.value, icon: attr.icon }))
      : standardAttributes.map((name, i) => ({
          name,
          value: [
            character.strength,
            character.agility,
            character.toughness,
            character.intelligence,
            character.willpower,
            character.charisma
          ][i],
          icon: ['barbell', 'personSimpleRun', 'heart', 'brain', 'eye', 'star'][i] as CustomAttributeIcon
        }))
  );

  // Get groups associated with each attribute
  function getGroupsForAttribute(attrName: string): string[] {
    return character.attributeGroupPairs
      .filter(pair => pair.attribute === attrName)
      .map(pair => pair.group);
  }

  // Complete icon mapping for all custom attribute icons (matching Swift)
  const iconComponents: Record<CustomAttributeIcon, ComponentType<any>> = {
    'barbell': Barbell,
    'personSimpleRun': PersonSimpleRun,
    'heart': Heart,
    'brain': Brain,
    'eye': Eye,
    'crown': Crown,
    'sword': Sword,
    'shield': Shield,
    'lightning': Lightning,
    'flame': Flame,
    'moon': Moon,
    'scroll': Scroll,
    'magicWand': MagicWand,
    'target': Target,
    'arrowsOutCardinal': ArrowsOutCardinal,
    'sparkle': Sparkle,
    'shieldStar': ShieldStar,
    'skull': Skull,
    'crosshair': Crosshair,
    'scales': Scales,
    'spiral': Spiral,
    'infinity': Infinity,
    'waves': Waves,
    'hourglass': Hourglass,
    'drop': Drop,
    'wind': Wind,
    'handFist': HandFist,
    'bandage': Bandaids,
    'star': Star,
    'atom': Atom,
    'compass': Compass,
    'clover': Clover
  };

  // Calculate Strong flow attacks (raises + 1)
  const maxFlowAttacks = $derived(() => {
    if (character.characterClass !== 'Strong' || !stats) return 1;
    const raises = stats.raises;
    if (raises === '-' || raises === '') return 1;
    return parseInt(raises) + 1;
  });

  // Calculate Wise extra inactive miracles from willpower
  const extraInactiveMiracles = $derived(() => {
    if (character.characterClass !== 'Wise') return 0;
    if (character.useCustomAttributes) return 0;
    if (character.willpower >= 16) return 2;
    if (character.willpower >= 14) return 1;
    return 0;
  });
</script>

<div class="space-y-6 p-4">
  <!-- Attributes Section -->
  <Card title="Attributes">
    <div class="grid grid-cols-2 gap-4">
      {#each attributes as attr}
        {@const groups = getGroupsForAttribute(attr.name)}
        {@const IconComponent = iconComponents[attr.icon]}
        <div class="text-center p-6 rounded-lg bg-neutral-800/50">
          {#if IconComponent}
            <svelte:component this={IconComponent} class="w-6 h-6 mx-auto mb-2" style="color: {classColor};" weight="bold" />
          {/if}
          <div class="text-xs text-neutral-500 mb-1">{attr.name}</div>
          <div class="text-2xl font-bold text-neutral-100">{attr.value}</div>
          {#if groups.length > 0}
            <div class="mt-2 flex flex-wrap justify-center gap-1">
              {#each groups as group}
                <span class="text-xs px-2 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300">{group}</span>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </Card>

  <!-- Affiliations Section -->
  {#if character.affiliationGroups.length > 0}
    <Card title="Affiliations">
      <div class="flex flex-wrap gap-2">
        {#each character.affiliationGroups as affiliation}
          <span class="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-200 text-sm">
            {affiliation}
          </span>
        {/each}
      </div>
    </Card>
  {/if}

  <!-- Languages Section -->
  {#if character.languages && character.languages.length > 0}
    <Card title="Languages">
      <div class="flex flex-wrap gap-2 justify-center">
        {#each character.languages as language}
          <span class="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-200 text-sm">
            {language}
          </span>
        {/each}
      </div>
    </Card>
  {/if}

  <!-- ======================= -->
  <!-- STRONG CLASS SECTION -->
  <!-- ======================= -->
  {#if character.characterClass === 'Strong'}
    <div class="space-y-4">
      <!-- Section Header -->
      <div class="flex items-center justify-center gap-2 py-2">
        <Barbell weight="bold" class="w-6 h-6 text-red-400" />
        <h2 class="text-lg font-bold text-neutral-100">The Strong</h2>
      </div>

      <!-- Main Card Container -->
      <div class="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-4 space-y-4 shadow-lg">
        
        <!-- Class Overview Card -->
        <div class="rounded-xl p-4 bg-red-500/10 border border-red-500/20">
          <div class="flex items-center gap-2 mb-3">
            <Sword weight="fill" class="w-5 h-5 text-red-400" />
            <span class="font-semibold text-red-400">Class Overview</span>
          </div>
          <p class="text-sm text-neutral-300 leading-relaxed">
            Strong characters rely on combat skills and physique. They can for example be warriors, guards, brigands, knights, bounty hunters or barbarians.
          </p>
        </div>

        <!-- Class Features Card -->
        <div class="rounded-xl p-4 bg-red-500/10 border border-red-500/20">
          <div class="flex items-center gap-2 mb-4">
            <Shield weight="fill" class="w-5 h-5 text-red-400" />
            <span class="font-semibold text-red-400">Class Features</span>
          </div>
          <div class="space-y-4">
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-red-400 text-xs">⚔</span>
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Basic Combat</div>
                <div class="text-xs text-neutral-400 mt-0.5">Get the same single basic attack per round as other classes, but two free attacks (others get one).</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Lightning weight="fill" class="w-3 h-3 text-orange-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Flow Attacks</div>
                <div class="text-xs text-neutral-400 mt-0.5">When putting an enemy at zero or negative harm points, may attack another enemy adjacent to the Strong (melee) or prior target (ranged). Limited to raises + 1 per round.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Shield weight="fill" class="w-3 h-3 text-purple-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Combat Options</div>
                <div class="text-xs text-neutral-400 mt-0.5">Can use any special combat option, and permanently fill slots with options from the Strong ability list. Effects last one round unless noted.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Combat Options Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <ShieldStar weight="fill" class="w-5 h-5 text-orange-400" />
              <span class="font-semibold text-orange-300">Selected Special Abilities</span>
            </div>
            <span class="text-xs px-2 py-1 rounded-full bg-neutral-700 text-neutral-400">
              {character.strongCombatOptions?.selectedOptions?.length || 0}/{availableSlots} slots
            </span>
          </div>
          
          {#if character.strongCombatOptions?.selectedOptions?.length > 0}
            <div class="space-y-3">
              {#each character.strongCombatOptions.selectedOptions as optionId, i}
                {@const option = getStrongCombatOption(optionId)}
                {#if option}
                  {@const colors = ['blue', 'orange', 'green', 'purple', 'yellow', 'red', 'cyan', 'pink'][optionId % 8]}
                  <div class="p-3 rounded-lg bg-{colors}-500/10 border border-{colors}-500/20">
                    <div class="flex items-center gap-2 mb-1">
                      <Star weight="fill" class="w-4 h-4 text-{colors}-400" />
                      <span class="font-medium text-sm" style="color: var(--{colors}-400, #9ca3af);">Slot {i + 1}: {option.name}</span>
                    </div>
                    <p class="text-xs text-neutral-400 pl-6">{option.description}</p>
                  </div>
                {/if}
              {/each}
            </div>
          {:else}
            <div class="p-4 rounded-lg bg-neutral-800/30 text-center">
              <p class="text-sm text-neutral-500">No abilities selected</p>
            </div>
          {/if}
        </div>

        <!-- Flow Attacks Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <Lightning weight="fill" class="w-5 h-5 text-orange-400" />
              <span class="font-semibold text-orange-300">Flow Attacks</span>
            </div>
            <span class="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 text-sm font-bold">
              Max: {maxFlowAttacks()}/round
            </span>
          </div>
          <div class="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <p class="text-sm text-neutral-300">
              When you reduce an enemy to 0 HP, you can make an additional attack against an adjacent enemy (melee) or an enemy adjacent to the prior target (ranged).
            </p>
          </div>
        </div>

        <!-- Conflict Looting Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center gap-2 mb-4">
            <Crown weight="fill" class="w-5 h-5 text-yellow-400" />
            <span class="font-semibold text-yellow-300">Conflict Looting</span>
          </div>
          <div class="space-y-3">
            <div class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div class="flex items-center gap-2 mb-1">
                <Star weight="fill" class="w-4 h-4 text-yellow-400" />
                <span class="text-sm font-medium text-yellow-300">Special Conflict</span>
              </div>
              <p class="text-xs text-neutral-400 pl-6">Note how the conflict was special (new experience or culturally important). Later take +2 for one round to df/av/sv/hp/attribute/damage/healing/mv/quality/initiative if related to the conflict memory.</p>
            </div>
            <div class="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div class="flex items-center gap-2 mb-1">
                <Drop weight="fill" class="w-4 h-4 text-green-400" />
                <span class="text-sm font-medium text-green-300">Substance</span>
              </div>
              <p class="text-xs text-neutral-400 pl-6">If enemy has suitable keyword, extract rare and potent substance (poison, acid, flammable, etc.) from corpse. Counts as inventory item.</p>
            </div>
            <div class="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div class="flex items-center gap-2 mb-1">
                <MagicWand weight="fill" class="w-4 h-4 text-purple-400" />
                <span class="text-sm font-medium text-purple-300">Supernatural</span>
              </div>
              <p class="text-xs text-neutral-400 pl-6">If enemy has supernatural non-violent ability and Strong delivers killing blow, ability transfers to Strong (works the same way).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- ======================= -->
  <!-- DEFT CLASS SECTION -->
  <!-- ======================= -->
  {#if character.characterClass === 'Deft'}
    <div class="space-y-4">
      <!-- Section Header -->
      <div class="flex items-center justify-center gap-2 py-2">
        <ArrowsOutCardinal weight="bold" class="w-6 h-6 text-purple-400" />
        <h2 class="text-lg font-bold text-neutral-100">The Deft</h2>
      </div>

      <!-- Main Card Container -->
      <div class="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-4 space-y-4 shadow-lg">
        
        <!-- Class Overview Card -->
        <div class="rounded-xl p-4 bg-purple-500/10 border border-purple-500/20">
          <div class="flex items-center gap-2 mb-3">
            <Target weight="fill" class="w-5 h-5 text-purple-400" />
            <span class="font-semibold text-purple-400">Class Overview</span>
          </div>
          <p class="text-sm text-neutral-300 leading-relaxed">
            Masters of technique and skill who rely on superior training and expertise. Whether as thieves, wandering monks, spies, marksmen, rangers, or assassins, they excel through precision and finesse.
          </p>
        </div>

        <!-- Class Features Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center gap-2 mb-4">
            <Star weight="fill" class="w-5 h-5 text-purple-400" />
            <span class="font-semibold text-purple-300">Class Features</span>
          </div>
          <div class="space-y-4">
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                <span class="text-green-400 text-sm">🎲</span>
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Double Roll</div>
                <div class="text-xs text-neutral-400 mt-0.5">Always use positive double roll for tasks and attacks in line with vocation when properly equipped</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                <Lightning weight="fill" class="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Combat Advantage</div>
                <div class="text-xs text-neutral-400 mt-0.5">Can swap combat advantage for double damage if vocation is relevant</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <Shield weight="fill" class="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Weapon Proficiency</div>
                <div class="text-xs text-neutral-400 mt-0.5">-2 AV with non-attuned two-handed melee weapons. Combat vocations get +1 damage and df from off-hand weapons</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <span class="text-red-400 text-sm">👕</span>
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Light Armor</div>
                <div class="text-xs text-neutral-400 mt-0.5">Cannot use slot abilities or swap for double damage when using shield or armor heavier than studded leather</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                <Star weight="fill" class="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Non-Combat Vocation</div>
                <div class="text-xs text-neutral-400 mt-0.5">Once per session, can save to turn a successful task roll into a critical success</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Attunement Slots Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <Sparkle weight="fill" class="w-5 h-5 text-cyan-400" />
              <span class="font-semibold text-cyan-300">Attunement Slots</span>
            </div>
            <span class="text-xs px-2 py-1 rounded-full bg-neutral-700 text-neutral-400">
              {availableSlots} slots
            </span>
          </div>

          {#if character.attunementSlots?.length > 0}
            <div class="space-y-3">
              {#each character.attunementSlots as slot, i}
                {#if i < availableSlots}
                  {@const hasContent = slot.primaryAttunement?.name || slot.secondaryAttunement?.name}
                  <div class="p-3 rounded-lg {hasContent ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-neutral-800/30'}">
                    <div class="text-xs text-cyan-400 font-medium mb-2">Slot {i + 1}</div>
                    {#if hasContent}
                      <div class="space-y-2">
                        {#each [
                          { att: slot.primaryAttunement, label: 'Primary' },
                          { att: slot.secondaryAttunement, label: 'Secondary' },
                          { att: slot.tertiaryAttunement, label: 'Tertiary' },
                          { att: slot.quaternaryAttunement, label: 'Quaternary' }
                        ] as { att, label }}
                          {#if att?.name}
                            <div class="p-2 rounded-lg bg-neutral-800/50">
                              <div class="flex items-center justify-between mb-1">
                                <span class="text-xs text-neutral-500">{label}</span>
                                <span class="text-xs px-2 py-0.5 rounded-full {att.isActive ? 'bg-green-500/20 text-green-400' : 'bg-neutral-700 text-neutral-500'}">
                                  {att.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                              </div>
                              <div class="flex items-center gap-2">
                                <span class="text-sm text-neutral-200 font-medium">{att.name}</span>
                                {#if att.isLost}
                                  <span class="text-xs text-red-400">(Lost)</span>
                                {/if}
                              </div>
                              <div class="text-xs text-neutral-500 capitalize mt-0.5">{att.type}</div>
                            </div>
                          {/if}
                        {/each}
                      </div>
                      {#if slot.hasUsedDailyPower !== undefined}
                        <div class="mt-3 pt-2 border-t border-neutral-700/50 text-xs {slot.hasUsedDailyPower ? 'text-orange-400' : 'text-green-400'} italic">
                          Daily Power: {slot.hasUsedDailyPower ? 'Used' : 'Available'}
                        </div>
                      {/if}
                    {:else}
                      <div class="text-sm text-neutral-500">Empty</div>
                    {/if}
                  </div>
                {/if}
              {/each}
            </div>
          {:else}
            <p class="text-sm text-neutral-500 text-center py-4">No attunement slots available at level {character.level}</p>
          {/if}
        </div>

        <!-- Attunement Rules Card -->
        <div class="rounded-xl p-4 bg-purple-500/10 border border-purple-500/20">
          <div class="flex items-center gap-2 mb-3">
            <Scroll weight="fill" class="w-5 h-5 text-purple-400" />
            <span class="font-semibold text-purple-400">Attunement Rules</span>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-3 text-sm">
              <Hourglass weight="fill" class="w-4 h-4 text-purple-400 shrink-0" />
              <span class="text-neutral-400">Switching attunements takes a day of practice</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <Sparkle weight="fill" class="w-4 h-4 text-purple-400 shrink-0" />
              <span class="text-neutral-400">Active attunements can be invoked once per day</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <Star weight="fill" class="w-4 h-4 text-green-400 shrink-0" />
              <span class="text-neutral-400">Hard tasks succeed automatically</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <Lightning weight="fill" class="w-4 h-4 text-orange-400 shrink-0" />
              <span class="text-neutral-400">Nigh impossible tasks become regular rolls</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <span class="text-purple-400 shrink-0">➕</span>
              <span class="text-neutral-400">Lost attunements give +1 to related tasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- ======================= -->
  <!-- WISE CLASS SECTION -->
  <!-- ======================= -->
  {#if character.characterClass === 'Wise'}
    <div class="space-y-4">
      <!-- Section Header -->
      <div class="flex items-center justify-center gap-2 py-2">
        <Sparkle weight="bold" class="w-6 h-6 text-yellow-400" />
        <h2 class="text-lg font-bold text-neutral-100">The Wise</h2>
      </div>

      <!-- Main Card Container -->
      <div class="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent p-4 space-y-4 shadow-lg">
        
        <!-- Class Overview Card -->
        <div class="rounded-xl p-4 bg-yellow-500/10 border border-yellow-500/20">
          <div class="flex items-center gap-2 mb-3">
            <Sparkle weight="fill" class="w-5 h-5 text-yellow-400" />
            <span class="font-semibold text-yellow-400">Class Overview</span>
          </div>
          <p class="text-sm text-neutral-300 leading-relaxed">
            Masters of miracles who negotiate with supernatural forces. Whether as cultists, chemists, meta-mathematicians, exorcists, druids, bards, or wizards, they channel powers beyond normal comprehension.
          </p>
        </div>

        <!-- Class Features Card -->
        <div class="rounded-xl p-4 bg-yellow-500/10 border border-yellow-500/20">
          <div class="flex items-center gap-2 mb-4">
            <Star weight="fill" class="w-5 h-5 text-yellow-400" />
            <span class="font-semibold text-yellow-400">Class Features</span>
          </div>
          <div class="space-y-4">
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                <Sparkle weight="fill" class="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Miracle Slots</div>
                <div class="text-xs text-neutral-400 mt-0.5">Each slot holds two miracles—one active, one inactive. Switching takes a day of preparation.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Brain weight="fill" class="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Willpower Bonus</div>
                <div class="text-xs text-neutral-400 mt-0.5">Level 1 slot gets +1 inactive miracle at WP 14+, +2 at WP 16+.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                <Heart weight="fill" class="w-3.5 h-3.5 text-green-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Supernatural Healing</div>
                <div class="text-xs text-neutral-400 mt-0.5">Recover HP at 2× natural rate. Requires treatment to heal beyond 1 HP or for other conditions.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <Sparkle weight="fill" class="w-3.5 h-3.5 text-red-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Magick Interference</div>
                <div class="text-xs text-neutral-400 mt-0.5">Cannot benefit from direct HP restoration (potions, miracles, medicine). Still need treatment for bleeding, illness, poison, etc.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                <Shield weight="fill" class="w-3.5 h-3.5 text-green-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Magical Defense</div>
                <div class="text-xs text-neutral-400 mt-0.5">+2 SV vs magick and mind influencing abilities.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <Sword weight="fill" class="w-3.5 h-3.5 text-red-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Combat Penalties</div>
                <div class="text-xs text-neutral-400 mt-0.5">-2 AV with non-slotted two-handed weapons.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <Heart weight="fill" class="w-3.5 h-3.5 text-red-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Equipment Cost</div>
                <div class="text-xs text-neutral-400 mt-0.5">+2 HP costs when using shields or armor heavier than leather (before doubling).</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Miracle Slots Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <MagicWand weight="fill" class="w-5 h-5 text-purple-400" />
              <span class="font-semibold text-purple-300">Miracles</span>
            </div>
            <span class="text-xs px-2 py-1 rounded-full bg-neutral-700 text-neutral-400">
              {availableSlots} slots
            </span>
          </div>

          {#if character.wiseMiracleSlots?.length > 0}
            <div class="space-y-3">
              {#each character.wiseMiracleSlots as slot, i}
                {#if i < availableSlots}
                  <div class="p-3 rounded-lg bg-neutral-800/70 border border-neutral-700/50">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-purple-400 font-medium">Slot {i + 1}</span>
                      {#if i === 0 && extraInactiveMiracles() > 0}
                        <span class="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">(+{extraInactiveMiracles()} from Willpower)</span>
                      {/if}
                    </div>
                    {#if slot.isMagicItem && i === 1}
                      <div class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <div class="flex items-center gap-2">
                          <MagicWand weight="fill" class="w-4 h-4 text-yellow-400" />
                          <span class="text-sm font-medium text-yellow-300">{slot.magicItemName || 'Unnamed Magick Item'}</span>
                        </div>
                        <p class="text-xs text-neutral-400 mt-1 pl-6">Special equipment that extends HP by character level</p>
                      </div>
                    {:else}
                      <div class="space-y-2">
                        {#each [...(slot.baseMiracles || []), ...(slot.additionalMiracles || [])] as miracle}
                          {#if miracle.name}
                            <div class="flex items-center justify-between p-2 rounded-lg {miracle.isActive ? 'bg-green-500/10 border border-green-500/20' : 'bg-neutral-800/50'}">
                              <div class="flex items-center gap-2">
                                {#if miracle.isActive}
                                  <div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <div class="w-2 h-2 rounded-full bg-green-400"></div>
                                  </div>
                                {:else}
                                  <div class="w-4 h-4 rounded-full border border-neutral-600"></div>
                                {/if}
                                <span class="text-sm {miracle.isActive ? 'text-neutral-200' : 'text-neutral-400'}">{miracle.name}</span>
                              </div>
                              <span class="text-xs {miracle.isActive ? 'text-green-400' : 'text-neutral-500'}">
                                {miracle.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          {/if}
                        {/each}
                        {#if (!slot.baseMiracles || slot.baseMiracles.every(m => !m.name)) && (!slot.additionalMiracles || slot.additionalMiracles.every(m => !m.name))}
                          <div class="text-center py-2 text-xs text-neutral-500">Empty slot</div>
                        {/if}
                      </div>
                    {/if}
                  </div>
                {/if}
              {/each}
            </div>
          {:else}
            <p class="text-sm text-neutral-500 text-center py-4">No miracle slots available at level {character.level}</p>
          {/if}
        </div>

        <!-- HP Cost Magnitudes Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-lg">📊</span>
            <span class="font-semibold text-neutral-200">HP Cost Magnitudes</span>
          </div>
          <div class="space-y-2">
            {#each [
              { mag: '0', desc: 'Trivial/Slotted scroll', examples: 'Simple effects with limits', color: 'green' },
              { mag: '1', desc: 'Simple magick', examples: 'Minor healing, light, unlocking', color: 'blue' },
              { mag: '2', desc: 'Standard magick', examples: 'Force field, water breathing', color: 'yellow' },
              { mag: 'd6', desc: 'Major magick', examples: 'Teleport, animate dead', color: 'orange' },
              { mag: '2d6', desc: 'Powerful magick', examples: 'Resurrection, weather control', color: 'red' }
            ] as { mag, desc, examples, color }}
              <div class="flex items-center gap-3 p-2 rounded-lg bg-{color}-500/10">
                <div class="w-10 h-10 rounded-lg bg-{color}-500/20 flex items-center justify-center shrink-0">
                  <span class="text-sm font-bold text-{color}-400">{mag}</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-neutral-200">{desc}</div>
                  <div class="text-xs text-neutral-500">{examples}</div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Cost Modifiers Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-lg">±</span>
            <span class="font-semibold text-neutral-200">Cost Modifiers</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div class="text-sm font-medium text-red-400 mb-3">↑ Increases Cost</div>
              <ul class="text-xs text-neutral-400 space-y-2">
                <li class="flex items-start gap-2"><span class="text-red-400">•</span>Peripheral to vocation/wording</li>
                <li class="flex items-start gap-2"><span class="text-red-400">•</span>Extra duration/range/area/victims</li>
                <li class="flex items-start gap-2"><span class="text-red-400">•</span>No save allowed</li>
                <li class="flex items-start gap-2"><span class="text-red-400">•</span>Crafting items (×2 first charge)</li>
                <li class="flex items-start gap-2"><span class="text-red-400">•</span>Adding charges (×1 per charge)</li>
                <li class="flex items-start gap-2"><span class="text-red-400">•</span>Permanent items (×2 permanent HP)</li>
              </ul>
            </div>
            <div class="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div class="text-sm font-medium text-green-400 mb-3">↓ Decreases Cost</div>
              <ul class="text-xs text-neutral-400 space-y-2">
                <li class="flex items-start gap-2"><span class="text-green-400">•</span>Close to vocation/wording</li>
                <li class="flex items-start gap-2"><span class="text-green-400">•</span>Rare/costly ingredients</li>
                <li class="flex items-start gap-2"><span class="text-green-400">•</span>Bad side effects for the Wise</li>
                <li class="flex items-start gap-2"><span class="text-green-400">•</span>Wise save (fail negates)</li>
                <li class="flex items-start gap-2"><span class="text-green-400">•</span>Extra casting time</li>
                <li class="flex items-start gap-2"><span class="text-green-400">•</span>Time/place requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- ======================= -->
  <!-- BRAVE CLASS SECTION -->
  <!-- ======================= -->
  {#if character.characterClass === 'Brave'}
    <div class="space-y-4">
      <!-- Section Header -->
      <div class="flex items-center justify-center gap-2 py-2">
        <Shield weight="bold" class="w-6 h-6 text-red-400" />
        <h2 class="text-lg font-bold text-neutral-100">The Brave</h2>
      </div>

      <!-- Main Card Container -->
      <div class="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-4 space-y-4 shadow-lg">
        
        <!-- Class Overview Card -->
        <div class="rounded-xl p-4 bg-red-500/10 border border-red-500/20">
          <div class="flex items-center gap-2 mb-3">
            <Heart weight="fill" class="w-5 h-5 text-red-400" />
            <span class="font-semibold text-red-400">Class Overview</span>
          </div>
          <div class="space-y-3">
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Heart weight="fill" class="w-3 h-3 text-red-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Unlikely Heroes</div>
                <div class="text-xs text-neutral-400 mt-0.5">Failed apprentices, gardeners dreaming of dragons and elves, wannabe bards, or peasants taking up arms against oppression.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkle weight="fill" class="w-3 h-3 text-red-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Courageous Aura</div>
                <div class="text-xs text-neutral-400 mt-0.5">Very perceptive people and creatures will always sense their courageous quality.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Attributes & HP Card -->
        <div class="rounded-xl p-4 bg-blue-500/10 border border-blue-500/20">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-blue-400">📊</span>
            <span class="font-semibold text-blue-400">Attributes & HP</span>
          </div>
          <div class="space-y-3">
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-blue-400 text-xs">↕</span>
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Attribute Adjustments</div>
                <div class="text-xs text-neutral-400 mt-0.5">May raise or lower attributes at even levels.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Heart weight="fill" class="w-3 h-3 text-blue-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">HP Advantage</div>
                <div class="text-xs text-neutral-400 mt-0.5">Get two rolls for HP at levels 1–3, picking the best roll.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Armor & Weapons Card -->
        <div class="rounded-xl p-4 bg-purple-500/10 border border-purple-500/20">
          <div class="flex items-center gap-2 mb-3">
            <Shield weight="fill" class="w-5 h-5 text-purple-400" />
            <span class="font-semibold text-purple-400">Armor & Weapons</span>
          </div>
          <div class="space-y-3">
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Shield weight="fill" class="w-3 h-3 text-purple-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Armor Restrictions</div>
                <div class="text-xs text-neutral-400 mt-0.5">Armor heavier than cloth incurs a -2 penalty to all task rolls.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sword weight="fill" class="w-3 h-3 text-purple-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Weapon Proficiency</div>
                <div class="text-xs text-neutral-400 mt-0.5">Can use any weapon without penalty.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comeback Dice Card -->
        <div class="rounded-xl p-4 bg-green-500/10 border border-green-500/20">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-green-400 text-lg">🎲</span>
              <span class="font-semibold text-green-400">Comeback Dice</span>
            </div>
            <span class="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 text-xl font-bold">
              {character.comebackDice}d6
            </span>
          </div>
          <div class="space-y-3">
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-green-400 text-xs">↻</span>
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Gain Dice</div>
                <div class="text-xs text-neutral-400 mt-0.5">Gain a d6 when losing an auction, failing a task roll, or failing a save (not attacks).</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-green-400 text-lg">🎲</span>
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Use Dice</div>
                <div class="text-xs text-neutral-400 mt-0.5">Add to any attribute, sv, av, or replace a damage die. Only best die counts if using multiple.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-red-400 text-xs">✕</span>
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Lose Dice</div>
                <div class="text-xs text-neutral-400 mt-0.5">Failed rolls with comeback dice are lost and generate no new ones.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quirks Card -->
        <div class="rounded-xl p-4 bg-yellow-500/10 border border-yellow-500/20">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <Sparkle weight="fill" class="w-5 h-5 text-yellow-400" />
              <span class="font-semibold text-yellow-400">Quirks</span>
            </div>
            <span class="text-xs px-2 py-1 rounded-full bg-neutral-700 text-neutral-400">
              {(character.braveQuirkOptions?.slots?.filter(s => s.selectedQuirk !== null && s.selectedQuirk !== undefined) || []).length}/{availableSlots} slots
            </span>
          </div>

          <div class="flex gap-3 mb-4">
            <div class="w-5 h-5 rounded bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Star weight="fill" class="w-3 h-3 text-yellow-400" />
            </div>
            <div>
              <div class="text-sm font-medium text-neutral-200">Special Abilities</div>
              <div class="text-xs text-neutral-400 mt-0.5">Each slot can hold a special quirk, with eight options to choose from as you level.</div>
            </div>
          </div>

          {#if character.braveQuirkOptions?.slots?.length > 0}
            {@const selectedQuirks = character.braveQuirkOptions.slots.filter(s => s.selectedQuirk !== null && s.selectedQuirk !== undefined)}
            {#if selectedQuirks.length > 0}
              <div class="space-y-3">
                {#each selectedQuirks as slot, i}
                  {@const quirk = getBraveQuirk(slot.selectedQuirk)}
                  {#if quirk}
                    <div class="p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50 shadow">
                      <div class="flex items-center justify-between mb-1">
                        <span class="font-medium text-sm text-yellow-300">{quirk.name}</span>
                        <span class="text-xs text-neutral-500">Slot {i + 1}</span>
                      </div>
                      <p class="text-xs text-neutral-400 leading-relaxed">{quirk.description}</p>
                      {#if slot.selectedQuirk === 0 && slot.protectedAllyName}
                        <div class="mt-2 flex items-center gap-2 text-xs text-blue-400">
                          <Shield weight="fill" class="w-3 h-3" />
                          Protected Ally: {slot.protectedAllyName}
                        </div>
                      {/if}
                    </div>
                  {/if}
                {/each}
              </div>
            {:else}
              <div class="p-4 rounded-lg bg-neutral-800/30 text-center">
                <p class="text-sm text-neutral-500">No quirks selected</p>
              </div>
            {/if}
          {/if}
        </div>

        <!-- Say No Power Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <HandFist weight="fill" class="w-5 h-5 text-red-400" />
              <span class="font-semibold text-red-400">Say No Power</span>
            </div>
            <span class="px-3 py-1.5 rounded-lg text-sm font-medium {character.hasUsedSayNo ? 'bg-neutral-700 text-neutral-500' : 'bg-green-500/20 text-green-400'}">
              {character.hasUsedSayNo ? 'Used' : 'Available'}
            </span>
          </div>
          <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div class="space-y-2 text-sm">
              <div>
                <span class="font-medium text-neutral-200">Deny Effects</span>
                <p class="text-xs text-neutral-400 mt-0.5">Once per session, deny an enemy's successful attack, miraculous effect, or fear effect.</p>
              </div>
              <div>
                <span class="font-medium text-neutral-200">Explain Action</span>
                <p class="text-xs text-neutral-400 mt-0.5">Must explain how your character plausibly avoids or resists the effect.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- ======================= -->
  <!-- CLEVER CLASS SECTION -->
  <!-- ======================= -->
  {#if character.characterClass === 'Clever'}
    <div class="space-y-4">
      <!-- Section Header -->
      <div class="flex items-center justify-center gap-2 py-2">
        <Lightbulb weight="bold" class="w-6 h-6 text-green-400" />
        <h2 class="text-lg font-bold text-neutral-100">The Clever</h2>
      </div>

      <!-- Main Card Container -->
      <div class="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent p-4 space-y-4 shadow-lg">
        
        <!-- Class Overview Card -->
        <div class="rounded-xl p-4 bg-green-500/10 border border-green-500/20">
          <div class="flex items-center gap-2 mb-3">
            <Brain weight="fill" class="w-5 h-5 text-green-400" />
            <span class="font-semibold text-green-400">Class Overview</span>
          </div>
          <div class="space-y-3">
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb weight="fill" class="w-3 h-3 text-green-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Analytical Minds</div>
                <div class="text-xs text-neutral-400 mt-0.5">Clever characters think in different ways. They may not always have a high intelligence score, but they are curious, crafty, and unafraid of failure.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Compass weight="fill" class="w-3 h-3 text-green-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Diverse Backgrounds</div>
                <div class="text-xs text-neutral-400 mt-0.5">Investigators, scientists, engineers, pioneers, and explorers who approach problems with unique perspectives.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Unorthodox Solution Card -->
        <div class="rounded-xl p-4 bg-yellow-500/10 border border-yellow-500/20">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <Lightbulb weight="fill" class="w-5 h-5 text-yellow-400" />
              <span class="font-semibold text-yellow-400">Unorthodox Solution</span>
            </div>
            <span class="px-3 py-1.5 rounded-lg text-sm font-medium {character.cleverKnackOptions?.hasUsedUnorthodoxBonus ? 'bg-neutral-700 text-neutral-500' : 'bg-green-500/20 text-green-400'}">
              {character.cleverKnackOptions?.hasUsedUnorthodoxBonus ? 'Used' : 'Available'}
            </span>
          </div>
          <div class="space-y-3">
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkle weight="fill" class="w-3 h-3 text-yellow-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Daily Power</div>
                <div class="text-xs text-neutral-400 mt-0.5">Once per day, gain a +6 bonus for an unorthodox attempt to solve a non-combat related problem.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Lightning weight="fill" class="w-3 h-3 text-orange-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Drawbacks</div>
                <div class="text-xs text-neutral-400 mt-0.5">Negative modifiers may apply to account for bizarre methods or serious drawbacks.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Information Gathering Card -->
        <div class="rounded-xl p-4 bg-blue-500/10 border border-blue-500/20">
          <div class="flex items-center gap-2 mb-4">
            <Eye weight="fill" class="w-5 h-5 text-blue-400" />
            <span class="font-semibold text-blue-400">Information Gathering</span>
          </div>
          <div class="space-y-3">
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Target weight="fill" class="w-3 h-3 text-blue-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Enhanced Detection</div>
                <div class="text-xs text-neutral-400 mt-0.5">All successful or critical rolls for clues and information gathering are treated as a pair.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-blue-400 text-xs">?</span>
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Player Questions</div>
                <div class="text-xs text-neutral-400 mt-0.5">Get additional information based on player questions, proportionate to roll quality.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Scroll weight="fill" class="w-3 h-3 text-blue-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Requirements</div>
                <div class="text-xs text-neutral-400 mt-0.5">Additional information must be within bounds of the situation and not surpass the regular success.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Special Knacks Card -->
        <div class="rounded-xl p-4 bg-purple-500/10 border border-purple-500/20">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-purple-400">⚙️</span>
              <span class="font-semibold text-purple-400">Special Knacks</span>
            </div>
            <span class="text-xs px-2 py-1 rounded-full bg-neutral-700 text-neutral-400">
              {(character.cleverKnackOptions?.slots?.filter(s => s.selectedKnack !== null && s.selectedKnack !== undefined) || []).length}/{availableSlots} slots
            </span>
          </div>

          <div class="flex gap-3 mb-4">
            <div class="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Brain weight="fill" class="w-3 h-3 text-purple-400" />
            </div>
            <div>
              <div class="text-sm font-medium text-neutral-200">Specialized Techniques</div>
              <div class="text-xs text-neutral-400 mt-0.5">Your analytical mind develops specialized techniques as you advance. Each knack represents mastery over a particular domain of clever thinking.</div>
            </div>
          </div>

          {#if character.cleverKnackOptions?.slots?.length > 0}
            {@const selectedKnacks = character.cleverKnackOptions.slots.filter(s => s.selectedKnack !== null && s.selectedKnack !== undefined)}
            {#if selectedKnacks.length > 0}
              <div class="space-y-3">
                {#each selectedKnacks as slot, i}
                  {@const knack = getCleverKnack(slot.selectedKnack)}
                  {#if knack}
                    <div class="p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50 shadow">
                      <div class="flex items-center justify-between mb-1">
                        <span class="font-medium text-sm text-purple-300">{knack.name}</span>
                        <span class="text-xs text-neutral-500">Slot {i + 1}</span>
                      </div>
                      <p class="text-xs text-neutral-400 leading-relaxed">{knack.description}</p>
                      {#if slot.selectedKnack === 0 && slot.hasUsedCombatDie !== undefined}
                        <div class="mt-2 pt-2 border-t border-neutral-700/50 flex items-center gap-2">
                          <span class="text-xs font-medium text-neutral-300">Combat Die Status:</span>
                          <span class="text-xs {slot.hasUsedCombatDie ? 'text-red-400' : 'text-green-400'}">
                            {slot.hasUsedCombatDie ? '⚠️ D10 used this battle' : '✓ D10 available'}
                          </span>
                        </div>
                      {/if}
                    </div>
                  {/if}
                {/each}
              </div>
            {:else}
              <div class="p-4 rounded-lg bg-neutral-800/30 text-center">
                <p class="text-sm text-neutral-500">No knacks selected</p>
              </div>
            {/if}
          {/if}
        </div>

        <!-- Advancement Options Card -->
        <div class="rounded-xl p-4 bg-orange-500/10 border border-orange-500/20">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-orange-400">📈</span>
            <span class="font-semibold text-orange-400">Advancement Options</span>
          </div>
          <div class="space-y-3">
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Scroll weight="fill" class="w-3 h-3 text-orange-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Extra Language</div>
                <div class="text-xs text-neutral-400 mt-0.5">Start with an additional language from the beginning.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-orange-400 text-xs">↗</span>
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Even Level Choice</div>
                <div class="text-xs text-neutral-400 mt-0.5">At even levels, choose between a raise, an additional language, or learning a ritual from a scroll.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <MagicWand weight="fill" class="w-3 h-3 text-purple-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Ritual Learning</div>
                <div class="text-xs text-neutral-400 mt-0.5">Can learn rituals from scrolls in known languages. Takes one week to study, costs (Scroll Cost + 1) × 2 HP to cast.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Combat & Saving Throws Card -->
        <div class="rounded-xl p-4 bg-red-500/10 border border-red-500/20">
          <div class="flex items-center gap-2 mb-4">
            <Shield weight="fill" class="w-5 h-5 text-red-400" />
            <span class="font-semibold text-red-400">Combat & Saving Throws</span>
          </div>
          <div class="space-y-3">
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Shield weight="fill" class="w-3 h-3 text-red-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Armor Use</div>
                <div class="text-xs text-neutral-400 mt-0.5">Can use any type of armor without penalty.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Eye weight="fill" class="w-3 h-3 text-red-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Illusion Defense</div>
                <div class="text-xs text-neutral-400 mt-0.5">+2 bonus to saving throws against illusions.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Star weight="fill" class="w-3 h-3 text-red-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Appraisal Bonus</div>
                <div class="text-xs text-neutral-400 mt-0.5">+2 to vocation-related appraisal checks.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sword weight="fill" class="w-3 h-3 text-red-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Heavy Weapons</div>
                <div class="text-xs text-neutral-400 mt-0.5">-2 AV when using heavy weapons.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- ======================= -->
  <!-- FORTUNATE CLASS SECTION -->
  <!-- ======================= -->
  {#if character.characterClass === 'Fortunate'}
    <div class="space-y-4">
      <!-- Section Header -->
      <div class="flex items-center justify-center gap-2 py-2">
        <Crown weight="bold" class="w-6 h-6 text-purple-400" />
        <h2 class="text-lg font-bold text-neutral-100">The Fortunate</h2>
      </div>

      <!-- Main Card Container -->
      <div class="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-4 space-y-4 shadow-lg">
        
        <!-- Class Overview Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center gap-2 mb-3">
            <Crown weight="fill" class="w-5 h-5 text-orange-400" />
            <span class="font-semibold text-orange-300">Class Overview</span>
          </div>
          <p class="text-sm text-neutral-300 leading-relaxed p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 mb-4">
            Fortunate characters are born with the advantages of nobility, fame, destiny, wealth, or a combination thereof. They can be royal heirs, rich and influential merchants, star performers, or religious icons. Once per game session, they may use their good fortune in a major way, like hiring a large ship, performing the will of a god, getting a personal audience with the queen, or being hailed as a friend by a hostile tribe.
          </p>
          <div class="space-y-2">
            <div class="flex gap-3 p-2 rounded-lg bg-blue-500/10">
              <div class="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Shield weight="fill" class="w-3 h-3 text-blue-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Combat Proficiency</div>
                <div class="text-xs text-neutral-400 mt-0.5">Can use any weapon or armor without penalty.</div>
              </div>
            </div>
            <div class="flex gap-3 p-2 rounded-lg bg-green-500/10">
              <div class="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-green-400 text-xs">👥</span>
              </div>
              <div>
                <div class="text-sm font-medium text-neutral-200">Social Advantages</div>
                <div class="text-xs text-neutral-400 mt-0.5">+4 to charisma for retainer morale, +2 on reaction rolls, +6 on reputation rolls.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fortune Power Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <Star weight="fill" class="w-5 h-5 text-yellow-400" />
              <span class="font-semibold text-yellow-300">Fortune Power</span>
            </div>
            <span class="px-3 py-1.5 rounded-lg text-sm font-medium {character.fortunateOptions?.hasUsedFortune ? 'bg-neutral-700 text-neutral-500' : 'bg-green-500/20 text-green-400'}">
              {character.fortunateOptions?.hasUsedFortune ? 'Used' : 'Available'}
            </span>
          </div>
          <div class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-3">
            <p class="text-sm text-neutral-300 leading-relaxed">
              Once per game session, the Fortunate may use their good fortune in a major way, such as:
            </p>
            <ul class="mt-2 space-y-1 text-sm text-neutral-400">
              <li>• Hiring a large ship</li>
              <li>• Performing the will of a god</li>
              <li>• Getting a personal audience with the queen</li>
              <li>• Being hailed as a friend by a hostile tribe</li>
            </ul>
          </div>
          <p class="text-xs text-red-400 px-2">
            Note: The Fortunate may not use their fortune power to purchase experience or fund XP for others.
          </p>
        </div>

        <!-- Standing Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-purple-400">🏛️</span>
            <span class="font-semibold text-purple-300">Standing</span>
          </div>
          {#if character.fortunateOptions?.standing}
            <div class="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-4 text-center">
              <span class="text-base font-medium text-purple-200">{character.fortunateOptions.standing}</span>
            </div>
            <p class="text-sm text-neutral-400 mb-3">When the referee thinks that the standing is relevant:</p>
            <div class="space-y-2">
              <div class="flex gap-3 p-2 rounded-lg bg-purple-500/10">
                <div class="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-purple-400 text-xs">👥</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-neutral-200">Faction Relations</div>
                  <div class="text-xs text-neutral-400 mt-0.5">Affiliated factions are considerably more helpful, and their enemies more vengeful. Others may distance themselves or show interest.</div>
                </div>
              </div>
              <div class="flex gap-3 p-2 rounded-lg bg-purple-500/10">
                <div class="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-purple-400 text-xs">🐴</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-neutral-200">Species Benefits</div>
                  <div class="text-xs text-neutral-400 mt-0.5">Your species gives any applicable benefits regardless of attribute.</div>
                </div>
              </div>
              <div class="flex gap-3 p-2 rounded-lg bg-purple-500/10">
                <div class="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-purple-400 text-xs">+6</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-neutral-200">Task Bonus</div>
                  <div class="text-xs text-neutral-400 mt-0.5">If standing and vocation align for a task, and the vocation is marked next to the applicable attribute, you get a +6 bonus.</div>
                </div>
              </div>
            </div>
          {:else}
            <p class="text-sm text-neutral-500 text-center py-2">No standing specified</p>
          {/if}
        </div>

        <!-- Signature Object Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-orange-400">🔮</span>
            <span class="font-semibold text-orange-300">Signature Object</span>
          </div>
          {#if character.fortunateOptions?.signatureObject?.name}
            <div class="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 mb-3 text-center">
              <span class="text-base font-medium text-orange-200">{character.fortunateOptions.signatureObject.name}</span>
            </div>
            <p class="text-sm text-neutral-400">
              This object has plot immunity and cannot be lost, destroyed, or made irretrievable by the referee unless you wish it to happen.
            </p>
          {:else}
            <p class="text-sm text-neutral-500 text-center py-2">No signature object specified</p>
          {/if}
        </div>

        <!-- Retainers Card -->
        <div class="rounded-xl p-4 bg-neutral-800/50 border border-neutral-700/50 shadow-md">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-cyan-400">👥</span>
              <span class="font-semibold text-cyan-300">Retainers</span>
            </div>
            <span class="text-xs px-2 py-1 rounded-full bg-neutral-700 text-neutral-400">
              {character.fortunateOptions?.retainers?.length || 0}/{availableSlots} slots
            </span>
          </div>

          <p class="text-sm text-neutral-400 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
            Retainers can grow in strength and serve as valuable allies. They have their own stats, attitudes, and can be played as alternate characters.
          </p>

          {#if character.fortunateOptions?.retainers?.length > 0}
            <div class="space-y-4">
              {#each character.fortunateOptions.retainers as retainer, i}
                <div class="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-purple-400">👤</span>
                    <span class="text-sm text-purple-300">Retainer #{i + 1}</span>
                  </div>
                  
                  <div class="text-center mb-3">
                    <div class="text-lg font-semibold {retainer.name ? 'text-neutral-100' : 'text-neutral-500'}">
                      {retainer.name || 'Unnamed Retainer'}
                    </div>
                    {#if retainer.type}
                      <div class="text-sm text-neutral-500">{retainer.type}</div>
                    {/if}
                  </div>

                  <div class="flex justify-center gap-3 mb-3">
                    <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10">
                      <Shield weight="fill" class="w-4 h-4 text-blue-400" />
                      <div class="text-center">
                        <div class="text-sm font-medium text-neutral-200">{retainer.defenseFactor ?? 0}</div>
                        <div class="text-[10px] text-neutral-500">DF</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10">
                      <ArrowsOutCardinal weight="fill" class="w-4 h-4 text-blue-400" />
                      <div class="text-center">
                        <div class="text-sm font-medium text-neutral-200">{retainer.movement ?? 30}</div>
                        <div class="text-[10px] text-neutral-500">MV</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10">
                      <Heart weight="fill" class="w-4 h-4 text-blue-400" />
                      <div class="text-center">
                        <div class="text-sm font-medium text-neutral-200">{retainer.currentHP ?? 0}/{retainer.maxHP ?? 0}</div>
                        <div class="text-[10px] text-neutral-500">HP</div>
                      </div>
                    </div>
                  </div>

                  {#if retainer.keywords?.length > 0}
                    <div class="text-center">
                      <div class="flex items-center justify-center gap-2 mb-2">
                        <span class="text-purple-400 text-sm">🏷️</span>
                        <span class="text-xs text-purple-400 font-medium">Keywords</span>
                      </div>
                      <div class="flex flex-wrap gap-1.5 justify-center">
                        {#each retainer.keywords as keyword}
                          <span class="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {keyword}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}

                  {#if retainer.notes}
                    <div class="mt-3 pt-3 border-t border-neutral-700/50 flex items-start gap-2">
                      <span class="text-neutral-500 text-sm">📝</span>
                      <p class="text-xs text-neutral-400">{retainer.notes}</p>
                    </div>
                  {/if}
                </div>

                {#if i < (character.fortunateOptions.retainers.length - 1)}
                  <hr class="border-neutral-700/50" />
                {/if}
              {/each}
            </div>
          {:else}
            <div class="p-4 rounded-lg bg-neutral-800/30 text-center">
              <p class="text-sm text-neutral-500">No retainers yet</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Notes Section -->
  {#if character.notes}
    <Card title="Notes">
      <p class="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
        {character.notes}
      </p>
    </Card>
  {/if}
</div>

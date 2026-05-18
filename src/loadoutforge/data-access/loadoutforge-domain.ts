export interface Archetype {
  base: number
  id: ArchetypeId
  name: string
  passive: string
  traits: TraitId[]
}
export type ArchetypeId = 'artificer' | 'shade' | 'vanguard' | 'warden'
export interface ForgeItem {
  description: string
  id: string
  name: string
  power: number
  rarity: ItemRarity
  slot: LoadoutSlot
  tags: TraitId[]
}
export type ItemRarity = 'Common' | 'Epic' | 'Mythic' | 'Rare'

export interface LoadoutDraft {
  archetypeId: ArchetypeId
  callsign: string
  equipped: Record<LoadoutSlot, string>
  traits: TraitId[]
}

export interface LoadoutScore {
  gaps: string[]
  itemPower: number
  readiness: number
  synergy: number
  total: number
}

export type LoadoutSlot = 'armor' | 'primary' | 'relic' | 'sidearm'

export interface MetadataPreview {
  description: string
  hash: string
  image: string
  name: string
  uri: string
}

export interface MintProofRecord {
  asset: string
  callsign: string
  createdAt: string
  metadataHash: string
  signature: string
  uri: string
}

export type TraitId = 'arcane' | 'fortified' | 'kinetic' | 'solar' | 'tactical' | 'void'

export const LOADOUTFORGE_LIVE_URL = 'https://loadoutforge088.colmena.dev'
export const LOADOUTFORGE_BUILD_ID = '088'

export const slotLabels: Record<LoadoutSlot, string> = {
  armor: 'Armor',
  primary: 'Primary',
  relic: 'Relic',
  sidearm: 'Sidearm',
}

export const archetypes: Archetype[] = [
  {
    base: 42,
    id: 'vanguard',
    name: 'Vanguard Breacher',
    passive: 'Armor tags add readiness and reduce relic penalties.',
    traits: ['kinetic', 'fortified', 'tactical'],
  },
  {
    base: 36,
    id: 'shade',
    name: 'Shade Runner',
    passive: 'Void and tactical matches add burst synergy.',
    traits: ['void', 'tactical', 'arcane'],
  },
  {
    base: 33,
    id: 'artificer',
    name: 'Field Artificer',
    passive: 'Arcane relics amplify every equipped rare item.',
    traits: ['arcane', 'solar', 'fortified'],
  },
  {
    base: 39,
    id: 'warden',
    name: 'Solar Warden',
    passive: 'Solar armor and sidearms convert power into readiness.',
    traits: ['solar', 'fortified', 'kinetic'],
  },
]

export const traitLabels: Record<TraitId, string> = {
  arcane: 'Arcane',
  fortified: 'Fortified',
  kinetic: 'Kinetic',
  solar: 'Solar',
  tactical: 'Tactical',
  void: 'Void',
}

export const itemCatalog: ForgeItem[] = [
  {
    description: 'Rail lance tuned for armor cracking and stable opener damage.',
    id: 'rail-lance-mk88',
    name: 'MK-88 Rail Lance',
    power: 31,
    rarity: 'Epic',
    slot: 'primary',
    tags: ['kinetic', 'tactical'],
  },
  {
    description: 'Silenced burst rifle that stacks void pressure on marked targets.',
    id: 'blackout-carbine',
    name: 'Blackout Carbine',
    power: 28,
    rarity: 'Rare',
    slot: 'primary',
    tags: ['void', 'tactical'],
  },
  {
    description: 'Heat-forged cannon with a slow charge and brutal finishing window.',
    id: 'helios-cannon',
    name: 'Helios Cannon',
    power: 35,
    rarity: 'Mythic',
    slot: 'primary',
    tags: ['solar', 'arcane'],
  },
  {
    description: 'Compact shard pistol for close-range stagger chains.',
    id: 'splinter-9',
    name: 'Splinter-9 Sidearm',
    power: 17,
    rarity: 'Rare',
    slot: 'sidearm',
    tags: ['kinetic', 'tactical'],
  },
  {
    description: 'Void needle sidearm with low recoil and quick reloads.',
    id: 'umbra-needle',
    name: 'Umbra Needle',
    power: 16,
    rarity: 'Epic',
    slot: 'sidearm',
    tags: ['void', 'arcane'],
  },
  {
    description: 'Solar burst pistol calibrated for squad rally windows.',
    id: 'flarelock',
    name: 'Flarelock',
    power: 15,
    rarity: 'Common',
    slot: 'sidearm',
    tags: ['solar', 'fortified'],
  },
  {
    description: 'Layered kinetic plating that favors breach-front operators.',
    id: 'bulwark-rig',
    name: 'Bulwark Rig',
    power: 24,
    rarity: 'Epic',
    slot: 'armor',
    tags: ['fortified', 'kinetic'],
  },
  {
    description: 'Reactive mantle that dampens void damage and boosts evasive rolls.',
    id: 'phase-mantle',
    name: 'Phase Mantle',
    power: 21,
    rarity: 'Rare',
    slot: 'armor',
    tags: ['void', 'tactical'],
  },
  {
    description: 'Insulated solar shell for operators holding exposed positions.',
    id: 'ember-shell',
    name: 'Ember Shell',
    power: 22,
    rarity: 'Rare',
    slot: 'armor',
    tags: ['solar', 'fortified'],
  },
  {
    description: 'A rules shard that turns matching equipment tags into metadata traits.',
    id: 'synthesis-core',
    name: 'Synthesis Core',
    power: 20,
    rarity: 'Mythic',
    slot: 'relic',
    tags: ['arcane', 'fortified'],
  },
  {
    description: 'Tactical scanner that rewards mixed tags and fast target swaps.',
    id: 'ghost-rangefinder',
    name: 'Ghost Rangefinder',
    power: 18,
    rarity: 'Epic',
    slot: 'relic',
    tags: ['tactical', 'void'],
  },
  {
    description: 'Solar sigil that raises readiness when the loadout is underpowered.',
    id: 'sunmark',
    name: 'Sunmark',
    power: 16,
    rarity: 'Rare',
    slot: 'relic',
    tags: ['solar', 'arcane'],
  },
]

export const defaultDraft: LoadoutDraft = {
  archetypeId: 'vanguard',
  callsign: 'Nightshift-088',
  equipped: {
    armor: 'bulwark-rig',
    primary: 'rail-lance-mk88',
    relic: 'synthesis-core',
    sidearm: 'splinter-9',
  },
  traits: ['kinetic', 'fortified'],
}

export function calculateLoadoutScore(draft: LoadoutDraft): LoadoutScore {
  const archetype = getArchetype(draft.archetypeId)
  const items = getEquippedItems(draft)
  const allTags = [...draft.traits, ...items.flatMap((item) => item.tags)]
  const itemPower = items.reduce((total, item) => total + item.power, 0)
  const matchingTags = allTags.filter((tag) => archetype.traits.includes(tag)).length
  const rareBonus = items.filter((item) => item.rarity === 'Epic' || item.rarity === 'Mythic').length * 4
  const completeSlots = new Set(items.map((item) => item.slot)).size
  const synergy = matchingTags * 6 + rareBonus + completeSlots * 3
  const readiness = Math.min(100, Math.round(archetype.base + itemPower * 0.42 + synergy * 0.55))
  const gaps = [
    ...(['primary', 'sidearm', 'armor', 'relic'] as LoadoutSlot[]).filter((slot) => !draft.equipped[slot]),
  ].map((slot) => `${slotLabels[slot]} slot is empty`)

  if (draft.traits.length < 2) {
    gaps.push('Pick at least two operator traits')
  }
  if (readiness < 80) {
    gaps.push('Readiness below mint recommendation')
  }

  return {
    gaps,
    itemPower,
    readiness,
    synergy,
    total: itemPower + synergy + archetype.base,
  }
}

export function getArchetype(id: ArchetypeId) {
  return archetypes.find((archetype) => archetype.id === id) ?? archetypes[0]
}

export function getEquippedItems(draft: LoadoutDraft) {
  return Object.values(draft.equipped)
    .map((itemId) => itemCatalog.find((item) => item.id === itemId))
    .filter((item): item is ForgeItem => Boolean(item))
}

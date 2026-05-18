import {
  calculateLoadoutScore,
  getArchetype,
  getEquippedItems,
  type LoadoutDraft,
  LOADOUTFORGE_LIVE_URL,
  type MetadataPreview,
  slotLabels,
  traitLabels,
} from './loadoutforge-domain'

export function createMetadataHash(draft: LoadoutDraft) {
  const payload = JSON.stringify({
    archetypeId: draft.archetypeId,
    callsign: draft.callsign.trim(),
    equipped: draft.equipped,
    traits: [...draft.traits].sort(),
  })
  const pieces = [payload]
  while (pieces.join('').length < 512) {
    pieces.push(`${pieces.length}:${payload}`)
  }
  return [0, 1, 2, 3].map((salt) => fnv1a64(`${salt}:${pieces.join('|')}`)).join('')
}

export function createMetadataJson(draft: LoadoutDraft, baseUrl = LOADOUTFORGE_LIVE_URL) {
  const preview = createMetadataPreview(draft, baseUrl)
  const score = calculateLoadoutScore(draft)
  const archetype = getArchetype(draft.archetypeId)
  const items = getEquippedItems(draft)

  return {
    attributes: [
      { trait_type: 'Build', value: 'Nightshift 088' },
      { trait_type: 'Archetype', value: archetype.name },
      { trait_type: 'Readiness', value: score.readiness },
      { trait_type: 'Power', value: score.itemPower },
      { trait_type: 'Synergy', value: score.synergy },
      ...draft.traits.map((trait) => ({ trait_type: 'Operator Trait', value: traitLabels[trait] })),
      ...items.map((item) => ({ trait_type: slotLabels[item.slot], value: item.name })),
    ],
    description: preview.description,
    image: preview.image,
    name: preview.name,
    properties: {
      category: 'game',
      files: [{ type: 'image/svg+xml', uri: preview.image }],
      loadoutforge: {
        archetype: archetype.id,
        build: '088',
        equipped: draft.equipped,
        readiness: score.readiness,
      },
    },
  }
}

export function createMetadataPreview(draft: LoadoutDraft, baseUrl = LOADOUTFORGE_LIVE_URL): MetadataPreview {
  const hash = createMetadataHash(draft)
  const score = calculateLoadoutScore(draft)
  const archetype = getArchetype(draft.archetypeId)
  const uri = `${baseUrl}/metadata/${hash}.json`

  return {
    description: `${draft.callsign.trim() || 'Unnamed operator'} is a ${archetype.name} loadout forged for LoadoutForge build 088 with ${score.total} combat power.`,
    hash,
    image: `${baseUrl}/metadata/${hash}.svg`,
    name: `LoadoutForge 088: ${draft.callsign.trim() || archetype.name}`,
    uri,
  }
}

export function createMetadataSvg(draft: LoadoutDraft) {
  const score = calculateLoadoutScore(draft)
  const archetype = getArchetype(draft.archetypeId)
  const items = getEquippedItems(draft)
  const traitText = draft.traits.map((trait) => traitLabels[trait]).join(' / ')
  const itemText = items.map((item) => `${slotLabels[item.slot]}: ${item.name}`).join(' | ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200" role="img">
  <rect width="1200" height="1200" fill="#090b0f"/>
  <path d="M80 910 280 190h640l200 720-520 190z" fill="#111923" stroke="#7df9a6" stroke-width="8"/>
  <path d="M260 790 390 310h420l130 480-340 130z" fill="#1b2630" stroke="#f4c95d" stroke-width="5"/>
  <circle cx="600" cy="525" r="150" fill="#121f2a" stroke="#5ec8f8" stroke-width="10"/>
  <path d="M520 585h160l-30-170h-100z" fill="#7df9a6"/>
  <text x="90" y="115" fill="#f5f7fb" font-family="monospace" font-size="54" font-weight="700">LOADOUTFORGE 088</text>
  <text x="90" y="185" fill="#7df9a6" font-family="monospace" font-size="38">${escapeXml(draft.callsign || 'Unnamed operator')}</text>
  <text x="90" y="255" fill="#c8d0dc" font-family="monospace" font-size="30">${escapeXml(archetype.name)}</text>
  <text x="90" y="1015" fill="#f4c95d" font-family="monospace" font-size="34">READINESS ${score.readiness} / POWER ${score.itemPower} / SYNERGY ${score.synergy}</text>
  <text x="90" y="1070" fill="#c8d0dc" font-family="monospace" font-size="24">${escapeXml(traitText)}</text>
  <text x="90" y="1118" fill="#c8d0dc" font-family="monospace" font-size="20">${escapeXml(itemText.slice(0, 100))}</text>
</svg>`
}

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function fnv1a64(input: string) {
  let hash = 0xcbf29ce484222325n
  for (let index = 0; index < input.length; index += 1) {
    hash ^= BigInt(input.charCodeAt(index))
    hash = BigInt.asUintN(64, hash * 0x100000001b3n)
  }
  return hash.toString(16).padStart(16, '0')
}

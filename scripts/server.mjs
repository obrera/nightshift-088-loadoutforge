import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const port = Number(process.env.PORT ?? 9876)
const distRoot = join(process.cwd(), 'dist')
const liveUrl = 'https://loadoutforge088.colmena.dev'

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
}

const archetypes = ['Vanguard Breacher', 'Shade Runner', 'Field Artificer', 'Solar Warden']
const primaries = ['MK-88 Rail Lance', 'Blackout Carbine', 'Helios Cannon']
const sidearms = ['Splinter-9 Sidearm', 'Umbra Needle', 'Flarelock']
const armors = ['Bulwark Rig', 'Phase Mantle', 'Ember Shell']
const relics = ['Synthesis Core', 'Ghost Rangefinder', 'Sunmark']
const traits = ['Kinetic', 'Void', 'Solar', 'Tactical', 'Arcane', 'Fortified']

function pick(hash, list, offset) {
  return list[Number.parseInt(hash.slice(offset, offset + 2), 16) % list.length]
}

function metadataFromHash(hash) {
  const archetype = pick(hash, archetypes, 0)
  const primary = pick(hash, primaries, 2)
  const sidearm = pick(hash, sidearms, 4)
  const armor = pick(hash, armors, 6)
  const relic = pick(hash, relics, 8)
  const readiness = 70 + (Number.parseInt(hash.slice(10, 12), 16) % 29)
  const power = 76 + (Number.parseInt(hash.slice(12, 14), 16) % 34)
  const synergy = 30 + (Number.parseInt(hash.slice(14, 16), 16) % 48)
  const callsign = `Operator-${hash.slice(0, 6).toUpperCase()}`
  return {
    archetype,
    armor,
    callsign,
    power,
    primary,
    readiness,
    relic,
    sidearm,
    synergy,
    traitA: pick(hash, traits, 16),
    traitB: pick(hash, traits, 18),
  }
}

function createSvg(hash) {
  const meta = metadataFromHash(hash)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <rect width="1200" height="1200" fill="#090b0f"/>
  <path d="M80 910 280 190h640l200 720-520 190z" fill="#111923" stroke="#7df9a6" stroke-width="8"/>
  <path d="M260 790 390 310h420l130 480-340 130z" fill="#1b2630" stroke="#f4c95d" stroke-width="5"/>
  <circle cx="600" cy="525" r="150" fill="#121f2a" stroke="#5ec8f8" stroke-width="10"/>
  <path d="M520 585h160l-30-170h-100z" fill="#7df9a6"/>
  <text x="90" y="115" fill="#f5f7fb" font-family="monospace" font-size="54" font-weight="700">LOADOUTFORGE 088</text>
  <text x="90" y="185" fill="#7df9a6" font-family="monospace" font-size="38">${meta.callsign}</text>
  <text x="90" y="255" fill="#c8d0dc" font-family="monospace" font-size="30">${meta.archetype}</text>
  <text x="90" y="1015" fill="#f4c95d" font-family="monospace" font-size="34">READINESS ${meta.readiness} / POWER ${meta.power} / SYNERGY ${meta.synergy}</text>
  <text x="90" y="1070" fill="#c8d0dc" font-family="monospace" font-size="24">${meta.traitA} / ${meta.traitB}</text>
  <text x="90" y="1118" fill="#c8d0dc" font-family="monospace" font-size="20">${meta.primary} | ${meta.sidearm} | ${meta.armor} | ${meta.relic}</text>
</svg>`
}

function createJson(hash) {
  const meta = metadataFromHash(hash)
  return {
    attributes: [
      { trait_type: 'Build', value: 'Nightshift 088' },
      { trait_type: 'Archetype', value: meta.archetype },
      { trait_type: 'Primary', value: meta.primary },
      { trait_type: 'Sidearm', value: meta.sidearm },
      { trait_type: 'Armor', value: meta.armor },
      { trait_type: 'Relic', value: meta.relic },
      { trait_type: 'Readiness', value: meta.readiness },
      { trait_type: 'Power', value: meta.power },
      { trait_type: 'Synergy', value: meta.synergy },
      { trait_type: 'Operator Trait', value: meta.traitA },
      { trait_type: 'Operator Trait', value: meta.traitB },
    ],
    description: `${meta.callsign} is a playable ${meta.archetype} game loadout forged by LoadoutForge build 088.`,
    image: `${liveUrl}/metadata/${hash}.svg`,
    name: `LoadoutForge 088: ${meta.callsign}`,
    properties: {
      category: 'game',
      files: [{ type: 'image/svg+xml', uri: `${liveUrl}/metadata/${hash}.svg` }],
      loadoutforge: { build: '088', readiness: meta.readiness },
    },
  }
}

async function serveFile(pathname) {
  const candidate = normalize(join(distRoot, pathname === '/' ? 'index.html' : pathname))
  if (!candidate.startsWith(distRoot)) {
    return new Response('not found', { status: 404 })
  }
  const filePath = existsSync(candidate) && !candidate.endsWith('/') ? candidate : join(distRoot, 'index.html')
  const body = await readFile(filePath)
  return new Response(body, {
    headers: { 'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream' },
  })
}

Bun.serve({
  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return Response.json({ build: '088', ok: true, service: 'loadoutforge' })
    }
    if (url.pathname === '/api/bootstrap') {
      return Response.json({
        build: '088',
        capabilities: ['archetype-builder', 'equipment-synergy', 'metadata-preview', 'mpl-core-devnet-mint'],
        liveUrl,
      })
    }
    const metadataMatch = url.pathname.match(/^\/metadata\/([a-f0-9]{64})\.(json|svg)$/)
    if (metadataMatch) {
      const [, hash, kind] = metadataMatch
      if (kind === 'svg') {
        return new Response(createSvg(hash), { headers: { 'content-type': contentTypes['.svg'] } })
      }
      return Response.json(createJson(hash))
    }
    return serveFile(url.pathname)
  },
  port,
})

console.log(`LoadoutForge server listening on :${port}`)

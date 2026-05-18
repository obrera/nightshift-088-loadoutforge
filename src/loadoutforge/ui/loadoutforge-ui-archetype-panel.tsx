import { Shield, Sparkles } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'

import {
  type ArchetypeId,
  archetypes,
  type LoadoutDraft,
  type TraitId,
  traitLabels,
} from '../data-access/loadoutforge-domain'

export function LoadoutForgeUiArchetypePanel({
  draft,
  setArchetype,
  setCallsign,
  toggleTrait,
}: {
  draft: LoadoutDraft
  setArchetype: (archetype: ArchetypeId) => void
  setCallsign: (callsign: string) => void
  toggleTrait: (trait: TraitId) => void
}) {
  return (
    <section className="space-y-4 border-b border-white/10 p-5 lg:border-r 2xl:border-b-0">
      <div className="flex items-center gap-2 text-sm font-semibold text-lime-300 uppercase">
        <Shield className="size-4" />
        Operator Chassis
      </div>
      <Input
        aria-label="Operator callsign"
        className="h-10 border-white/15 bg-black/30 text-lg"
        onChange={(event) => setCallsign(event.target.value)}
        value={draft.callsign}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {archetypes.map((archetype) => (
          <button
            className={`rounded-md border p-4 text-left transition ${
              draft.archetypeId === archetype.id
                ? 'border-lime-300 bg-lime-300/10 text-white'
                : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/25'
            }`}
            key={archetype.id}
            onClick={() => setArchetype(archetype.id)}
            type="button"
          >
            <div className="text-sm font-semibold">{archetype.name}</div>
            <div className="mt-2 text-xs leading-5 text-zinc-400">{archetype.passive}</div>
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-sky-300 uppercase">
          <Sparkles className="size-4" />
          Trait Matrix
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(traitLabels) as TraitId[]).map((trait) => (
            <Button
              key={trait}
              onClick={() => toggleTrait(trait)}
              size="sm"
              variant={draft.traits.includes(trait) ? 'default' : 'outline'}
            >
              {traitLabels[trait]}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}

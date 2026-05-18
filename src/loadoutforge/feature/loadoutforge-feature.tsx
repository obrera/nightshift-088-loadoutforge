import { useWalletUi } from '@wallet-ui/react'
import { useMemo, useState } from 'react'

import {
  type ArchetypeId,
  calculateLoadoutScore,
  defaultDraft,
  type ForgeItem,
  itemCatalog,
  type LoadoutDraft,
  type TraitId,
} from '../data-access/loadoutforge-domain'
import { createMetadataPreview } from '../data-access/loadoutforge-metadata'
import { useLoadoutForgeProofRecords } from '../data-access/use-loadoutforge-proof-records'
import { LoadoutForgeUiArchetypePanel } from '../ui/loadoutforge-ui-archetype-panel'
import { LoadoutForgeUiCatalogPanel } from '../ui/loadoutforge-ui-catalog-panel'
import { LoadoutForgeUiPreviewPanel } from '../ui/loadoutforge-ui-preview-panel'
import { LoadoutForgeFeatureMintStation } from './loadoutforge-feature-mint-station'

export function Component() {
  const [draft, setDraft] = useState<LoadoutDraft>(defaultDraft)
  const { account } = useWalletUi()
  const { addRecord, records } = useLoadoutForgeProofRecords()
  const score = useMemo(() => calculateLoadoutScore(draft), [draft])
  const preview = useMemo(() => createMetadataPreview(draft), [draft])

  function setArchetype(archetypeId: ArchetypeId) {
    setDraft((current) => ({ ...current, archetypeId }))
  }

  function setCallsign(callsign: string) {
    setDraft((current) => ({ ...current, callsign }))
  }

  function toggleTrait(trait: TraitId) {
    setDraft((current) => ({
      ...current,
      traits: current.traits.includes(trait)
        ? current.traits.filter((currentTrait) => currentTrait !== trait)
        : [...current.traits, trait].slice(-4),
    }))
  }

  function equipItem(item: ForgeItem) {
    setDraft((current) => ({
      ...current,
      equipped: {
        ...current.equipped,
        [item.slot]: item.id,
      },
    }))
  }

  function rollDrop() {
    const slots = ['primary', 'sidearm', 'armor', 'relic'] as const
    const equipped = Object.fromEntries(
      slots.map((slot, slotIndex) => {
        const options = itemCatalog.filter((item) => item.slot === slot)
        const callsignWeight = draft.callsign.length + draft.traits.length + slotIndex
        return [slot, options[callsignWeight % options.length]?.id ?? options[0]?.id]
      }),
    ) as LoadoutDraft['equipped']
    setDraft((current) => ({ ...current, equipped }))
  }

  return (
    <div className="min-h-full bg-[#090b0f] text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-lime-300 uppercase">Nightshift Build 088</div>
            <h1 className="mt-1 text-3xl font-semibold text-white">LoadoutForge</h1>
          </div>
          <div className="max-w-xl text-sm leading-6 text-zinc-400">
            Compose a playable operator loadout, tune equipment synergy, preview on-chain metadata, and mint a
            wallet-signed MPL Core devnet game asset.
          </div>
        </div>
        <div className="overflow-hidden rounded-md border border-white/10 bg-[#10151d] shadow-2xl shadow-black/30">
          <div className="grid xl:grid-cols-[1fr_1.1fr_0.9fr]">
            <LoadoutForgeUiArchetypePanel
              draft={draft}
              setArchetype={setArchetype}
              setCallsign={setCallsign}
              toggleTrait={toggleTrait}
            />
            <LoadoutForgeUiCatalogPanel draft={draft} equipItem={equipItem} rollDrop={rollDrop} />
            <LoadoutForgeUiPreviewPanel draft={draft} preview={preview} score={score} />
          </div>
          <LoadoutForgeFeatureMintStation
            account={account ?? undefined}
            addRecord={addRecord}
            draft={draft}
            preview={preview}
            records={records}
            score={score}
          />
        </div>
      </div>
    </div>
  )
}

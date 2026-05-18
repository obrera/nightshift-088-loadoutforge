import { Boxes, Hammer, Shuffle } from 'lucide-react'

import { Button } from '@/core/ui/button'

import {
  type ForgeItem,
  itemCatalog,
  type LoadoutDraft,
  type LoadoutSlot,
  slotLabels,
} from '../data-access/loadoutforge-domain'

const rarityStyles: Record<ForgeItem['rarity'], string> = {
  Common: 'text-zinc-300',
  Epic: 'text-fuchsia-300',
  Mythic: 'text-amber-300',
  Rare: 'text-sky-300',
}

export function LoadoutForgeUiCatalogPanel({
  draft,
  equipItem,
  rollDrop,
}: {
  draft: LoadoutDraft
  equipItem: (item: ForgeItem) => void
  rollDrop: () => void
}) {
  const slots = Object.keys(slotLabels) as LoadoutSlot[]

  return (
    <section className="space-y-5 border-b border-white/10 p-5 xl:border-r xl:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-lime-300 uppercase">
          <Boxes className="size-4" />
          Armory Slots
        </div>
        <Button onClick={rollDrop} size="sm" variant="secondary">
          <Shuffle />
          Roll Drop
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {slots.map((slot) => {
          const equipped = itemCatalog.find((item) => item.id === draft.equipped[slot])
          return (
            <div className="rounded-md border border-white/10 bg-black/25 p-3" key={slot}>
              <div className="text-xs text-zinc-500 uppercase">{slotLabels[slot]}</div>
              <div className="mt-1 min-h-6 text-sm font-semibold">{equipped?.name ?? 'Empty slot'}</div>
              <div className="mt-1 text-xs text-zinc-400">
                {equipped ? `${equipped.power} power` : 'No item equipped'}
              </div>
            </div>
          )
        })}
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-sky-300 uppercase">
          <Hammer className="size-4" />
          Craft Catalog
        </div>
        <div className="grid gap-3">
          {itemCatalog.map((item) => {
            const equipped = draft.equipped[item.slot] === item.id
            return (
              <button
                className={`rounded-md border p-3 text-left transition ${
                  equipped ? 'border-lime-300 bg-lime-300/10' : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                }`}
                key={item.id}
                onClick={() => equipItem(item)}
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className={`text-xs font-semibold ${rarityStyles[item.rarity]}`}>{item.rarity}</span>
                </div>
                <div className="mt-1 text-xs text-zinc-400">{item.description}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[0.68rem] text-zinc-500 uppercase">
                  <span>{slotLabels[item.slot]}</span>
                  <span>{item.power} power</span>
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

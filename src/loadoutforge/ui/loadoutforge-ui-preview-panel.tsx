import { Activity, Gauge, ImageIcon } from 'lucide-react'

import type { LoadoutDraft, LoadoutScore, MetadataPreview } from '../data-access/loadoutforge-domain'

import { createMetadataSvg } from '../data-access/loadoutforge-metadata'

export function LoadoutForgeUiPreviewPanel({
  draft,
  preview,
  score,
}: {
  draft: LoadoutDraft
  preview: MetadataPreview
  score: LoadoutScore
}) {
  return (
    <section className="space-y-5 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-lime-300 uppercase">
        <ImageIcon className="size-4" />
        Metadata Preview
      </div>
      <div
        className="aspect-square w-full overflow-hidden rounded-md border border-white/10 bg-black"
        dangerouslySetInnerHTML={{ __html: createMetadataSvg(draft) }}
      />
      <div className="grid grid-cols-3 gap-2">
        <Metric icon={<Gauge className="size-4" />} label="Readiness" value={score.readiness} />
        <Metric icon={<Activity className="size-4" />} label="Power" value={score.itemPower} />
        <Metric icon={<Activity className="size-4" />} label="Synergy" value={score.synergy} />
      </div>
      <div className="rounded-md border border-white/10 bg-black/25 p-4">
        <div className="text-sm font-semibold break-words">{preview.name}</div>
        <div className="mt-2 text-xs leading-5 text-zinc-400">{preview.description}</div>
        <div className="mt-3 font-mono text-[0.68rem] break-all text-zinc-500">{preview.uri}</div>
      </div>
    </section>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-1 text-[0.68rem] text-zinc-500 uppercase">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  )
}
import type { ReactNode } from 'react'

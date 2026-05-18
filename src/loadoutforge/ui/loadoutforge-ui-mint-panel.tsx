import { ExternalLink, RadioTower, ReceiptText } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { SolanaUiWalletDialog } from '@/solana/ui/solana-ui-wallet-dialog'

import type { LoadoutScore, MetadataPreview, MintProofRecord } from '../data-access/loadoutforge-domain'

export function LoadoutForgeUiMintPanel({
  accountAddress,
  isMinting,
  mintLoadout,
  preview,
  records,
  score,
}: {
  accountAddress?: string
  isMinting: boolean
  mintLoadout: () => void
  preview: MetadataPreview
  records: MintProofRecord[]
  score: LoadoutScore
}) {
  const ready = score.gaps.length === 0

  return (
    <section className="grid gap-4 border-t border-white/10 p-5 lg:grid-cols-[1fr_1.3fr]">
      <div className="rounded-md border border-white/10 bg-black/25 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-lime-300 uppercase">
          <RadioTower className="size-4" />
          Devnet Mint Station
        </div>
        <div className="mt-3 text-xs leading-5 text-zinc-400">
          Wallet-signed MPL Core createV1 asset mint against deterministic LoadoutForge metadata.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {accountAddress ? (
            <Button disabled={isMinting} onClick={mintLoadout} size="lg">
              <ReceiptText />
              {isMinting ? 'Minting' : 'Mint Loadout'}
            </Button>
          ) : (
            <SolanaUiWalletDialog />
          )}
          <a href={preview.uri} rel="noreferrer" target="_blank">
            <Button size="lg" variant="outline">
              <ExternalLink />
              Metadata
            </Button>
          </a>
        </div>
        <div className={`mt-4 text-xs ${ready ? 'text-lime-300' : 'text-amber-300'}`}>
          {ready ? 'Drop readiness: green' : score.gaps.join(' / ')}
        </div>
      </div>
      <div className="rounded-md border border-white/10 bg-black/25 p-4">
        <div className="text-sm font-semibold text-sky-300 uppercase">Local Proof Records</div>
        <div className="mt-3 grid gap-3">
          {records.length ? (
            records.map((record) => (
              <div className="rounded-md border border-white/10 bg-white/[0.03] p-3" key={record.signature}>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold">{record.callsign}</span>
                  <span className="text-zinc-500">{new Date(record.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-2 font-mono text-[0.68rem] break-all text-zinc-400">asset {record.asset}</div>
                <div className="mt-1 font-mono text-[0.68rem] break-all text-zinc-500">tx {record.signature}</div>
              </div>
            ))
          ) : (
            <div className="rounded-md border border-dashed border-white/15 p-4 text-sm text-zinc-500">
              No local mints recorded in this browser yet.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

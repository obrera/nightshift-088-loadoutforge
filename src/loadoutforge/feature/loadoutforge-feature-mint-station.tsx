import { type UiWalletAccount } from '@wallet-ui/react'
import { toast } from 'sonner'

import type { LoadoutDraft, LoadoutScore, MetadataPreview, MintProofRecord } from '../data-access/loadoutforge-domain'

import { useLoadoutForgeMint } from '../data-access/use-loadoutforge-mint'
import { LoadoutForgeUiMintPanel } from '../ui/loadoutforge-ui-mint-panel'

export function LoadoutForgeFeatureMintStation({
  account,
  addRecord,
  draft,
  preview,
  records,
  score,
}: {
  account?: UiWalletAccount
  addRecord: (record: MintProofRecord) => void
  draft: LoadoutDraft
  preview: MetadataPreview
  records: MintProofRecord[]
  score: LoadoutScore
}) {
  if (!account) {
    return (
      <LoadoutForgeUiMintPanel
        isMinting={false}
        mintLoadout={() => undefined}
        preview={preview}
        records={records}
        score={score}
      />
    )
  }

  return (
    <ConnectedMintStation
      account={account}
      addRecord={addRecord}
      draft={draft}
      preview={preview}
      records={records}
      score={score}
    />
  )
}

function ConnectedMintStation({
  account,
  addRecord,
  draft,
  preview,
  records,
  score,
}: {
  account: UiWalletAccount
  addRecord: (record: MintProofRecord) => void
  draft: LoadoutDraft
  preview: MetadataPreview
  records: MintProofRecord[]
  score: LoadoutScore
}) {
  const { isMinting, mintLoadout } = useLoadoutForgeMint({ account })

  return (
    <LoadoutForgeUiMintPanel
      accountAddress={account.address}
      isMinting={isMinting}
      mintLoadout={async () => {
        try {
          const record = await mintLoadout(draft)
          addRecord(record)
          toast.success(`Minted loadout asset ${record.asset}`)
        } catch (error) {
          toast.error(error instanceof Error ? error.message : String(error))
        }
      }}
      preview={preview}
      records={records}
      score={score}
    />
  )
}

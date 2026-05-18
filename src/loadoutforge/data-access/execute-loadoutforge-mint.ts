import type { useWalletUiSigner } from '@wallet-ui/react'

import { getCreateV1Instruction } from '@obrera/mpl-core-kit-lib/generated'
import {
  appendTransactionMessageInstruction,
  assertIsTransactionMessageWithSingleSendingSigner,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit'

import type { SolanaClient } from '@/solana/data-access/solana-client'

import type { LoadoutDraft, MintProofRecord } from './loadoutforge-domain'

import { createMetadataPreview } from './loadoutforge-metadata'

export async function executeLoadoutForgeMint({
  client,
  draft,
  transactionSigner,
}: {
  client: SolanaClient
  draft: LoadoutDraft
  transactionSigner: ReturnType<typeof useWalletUiSigner>
}): Promise<MintProofRecord> {
  const asset = await generateKeyPairSigner()
  const preview = createMetadataPreview(draft)
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
  const instruction = getCreateV1Instruction({
    asset,
    authority: transactionSigner,
    name: preview.name,
    owner: transactionSigner.address,
    payer: transactionSigner,
    plugins: [],
    updateAuthority: transactionSigner.address,
    uri: preview.uri,
  })
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (transactionMessage) => setTransactionMessageFeePayerSigner(transactionSigner, transactionMessage),
    (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
    (transactionMessage) => appendTransactionMessageInstruction(instruction, transactionMessage),
  )

  assertIsTransactionMessageWithSingleSendingSigner(message)
  const signatureBytes = await signAndSendTransactionMessageWithSigners(message)
  const signature = getBase58Decoder().decode(signatureBytes)

  return {
    asset: asset.address,
    callsign: draft.callsign,
    createdAt: new Date().toISOString(),
    metadataHash: preview.hash,
    signature,
    uri: preview.uri,
  }
}

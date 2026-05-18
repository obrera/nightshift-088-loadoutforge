import { getCreateV1Instruction } from '@obrera/mpl-core-kit-lib/generated'
import {
  appendTransactionMessageInstruction,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  devnet,
  generateKeyPairSigner,
  getBase58Decoder,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'

import { defaultDraft } from '../src/loadoutforge/data-access/loadoutforge-domain'
import { createMetadataPreview } from '../src/loadoutforge/data-access/loadoutforge-metadata'

const keypairPath =
  process.env.LOADOUTFORGE_DEVNET_SIGNER_KEYPAIR ?? '/home/obrera/keys/obrE1BHvP4EX8PkxPxAJxYfQkgfgCmXyJadQA3yBb7G.json'

const secret = new Uint8Array((await Bun.file(keypairPath).json()) as number[])
const payer = await createKeyPairSignerFromBytes(secret)
const asset = await generateKeyPairSigner()
const rpc = createSolanaRpc(devnet('https://api.devnet.solana.com'))
const rpcSubscriptions = createSolanaRpcSubscriptions(devnet('wss://api.devnet.solana.com'))
const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })
const preview = createMetadataPreview(defaultDraft)
const { value: latestBlockhash } = await rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
const instruction = getCreateV1Instruction({
  asset,
  authority: payer,
  name: preview.name,
  owner: payer.address,
  payer,
  plugins: [],
  updateAuthority: payer.address,
  uri: preview.uri,
})
const message = pipe(
  createTransactionMessage({ version: 0 }),
  (transactionMessage) => setTransactionMessageFeePayerSigner(payer, transactionMessage),
  (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
  (transactionMessage) => appendTransactionMessageInstruction(instruction, transactionMessage),
)

const signedTransaction = await signTransactionMessageWithSigners(message)
await sendAndConfirmTransaction(signedTransaction, { commitment: 'confirmed' })

const signatureBytes = Object.values(signedTransaction.signatures)[0]
if (!signatureBytes) {
  throw new Error('Mint succeeded locally but no signature was available on the signed transaction.')
}

console.log(
  JSON.stringify(
    {
      asset: asset.address,
      metadata: preview.uri,
      signature: getBase58Decoder().decode(signatureBytes),
    },
    null,
    2,
  ),
)

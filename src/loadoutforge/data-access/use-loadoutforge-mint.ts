import { useMutation } from '@tanstack/react-query'
import { type UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'

import { useSolanaClient } from '@/solana/data-access/use-solana-client'

import type { LoadoutDraft } from './loadoutforge-domain'

import { executeLoadoutForgeMint } from './execute-loadoutforge-mint'

export function useLoadoutForgeMint({ account }: { account: UiWalletAccount }) {
  const client = useSolanaClient()
  const transactionSigner = useWalletUiSigner({ account })
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (draft: LoadoutDraft) => executeLoadoutForgeMint({ client, draft, transactionSigner }),
  })

  return { isMinting: isPending, mintLoadout: mutateAsync }
}

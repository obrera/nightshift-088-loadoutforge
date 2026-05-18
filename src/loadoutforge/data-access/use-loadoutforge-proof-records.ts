import { useCallback, useState } from 'react'

import type { MintProofRecord } from './loadoutforge-domain'

const STORAGE_KEY = 'loadoutforge088:proof-records'

export function useLoadoutForgeProofRecords() {
  const [records, setRecords] = useState<MintProofRecord[]>(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 8) as MintProofRecord[]
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    return []
  })

  const addRecord = useCallback((record: MintProofRecord) => {
    setRecords((current) => {
      const next = [record, ...current].slice(0, 8)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { addRecord, records }
}

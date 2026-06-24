'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import type { ContentItem } from '@/types/content'

export function useContentItems() {
  const { data: session } = useSession()
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchItems = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl || !session?.backendToken) return
    try {
      const res = await fetch(`${apiUrl}/tools/content`, {
        headers: { Authorization: `Bearer ${session.backendToken}` },
      })
      if (res.ok) setItems(await res.json())
    } finally {
      setLoading(false)
    }
  }, [session?.backendToken])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    const hasPending = items.some((i) => i.status === 'pending')
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (hasPending) {
      intervalRef.current = setInterval(fetchItems, 3000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [items, fetchItems])

  return { items, loading }
}

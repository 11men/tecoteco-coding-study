"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "meme-dict-saved"

export function useSavedMemes() {
  const [savedIds, setSavedIds] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setSavedIds(parsed)
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  // Persist to localStorage whenever savedIds changes (skip initial empty state)
  const persistToStorage = useCallback((ids: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // Ignore storage errors (e.g. quota exceeded)
    }
  }, [])

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const set = new Set(prev)
      if (set.has(id)) {
        set.delete(id)
      } else {
        set.add(id)
      }
      const next = Array.from(set)
      persistToStorage(next)
      return next
    })
  }, [persistToStorage])

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  )

  const clearAll = useCallback(() => {
    setSavedIds([])
    persistToStorage([])
  }, [persistToStorage])

  return { savedIds, toggleSave, isSaved, clearAll }
}

import { useState, useCallback, useEffect } from 'react'

export interface UseAsyncResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: (...args: any[]) => Promise<T>
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = true
): UseAsyncResult<T> {
  const [loading, setLoading] = useState<boolean>(immediate)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true)
      setError(null)
      try {
        const response = await asyncFunction(...args)
        setData(response)
        setLoading(false)
        return response
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)))
        setLoading(false)
        throw err
      }
    },
    [asyncFunction]
  )

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, execute }
}

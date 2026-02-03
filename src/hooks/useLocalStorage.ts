import { useEffect, useState } from 'react'

const readStoredValue = <T,>(key: string, initialValue: T) => {
  if (typeof window === 'undefined') {
    return initialValue
  }

  try {
    const stored = window.localStorage.getItem(key)
    if (stored === null) {
      return initialValue
    }
    return JSON.parse(stored) as T
  } catch {
    return initialValue
  }
}

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => readStoredValue(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore write errors (private mode, storage limits).
    }
  }, [key, value])

  return [value, setValue] as const
}

export default useLocalStorage

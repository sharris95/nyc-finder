import { useEffect, useState } from 'react'

const useDebounce = <T,>(value: T, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      window.clearTimeout(handle)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce

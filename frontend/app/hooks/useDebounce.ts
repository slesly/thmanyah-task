import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook for search functionality with debouncing
 * @param onSearch - Callback function to execute when search term changes
 * @param delay - The delay in milliseconds (default: 500ms)
 * @param minLength - Minimum length required to trigger search (default: 2)
 * @returns Object containing search state and handlers
 */
export function useSearch(
  onSearch: (searchTerm: string) => void,
  delay: number = 500,
  minLength: number = 2
) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, delay)
  const lastSearchedTerm = useRef<string>('')
  const isInitialized = useRef(false)
  const isInitialLoad = useRef(true)

  // Memoize the onSearch callback to prevent infinite loops
  const memoizedOnSearch = useCallback(onSearch, [])

  // Trigger search when debounced term changes
  useEffect(() => {
    const trimmedTerm = debouncedSearchTerm.trim()
    
    // Skip search on initial load to prevent unwanted searches
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }

    // Only search if:
    // 1. Term has minimum length
    // 2. Term is different from last searched term
    // 3. We're not in initial loading state
    if (
      trimmedTerm.length >= minLength && 
      trimmedTerm !== lastSearchedTerm.current &&
      isInitialized.current
    ) {
      lastSearchedTerm.current = trimmedTerm
      memoizedOnSearch(trimmedTerm)
      setIsTyping(false)
    } else if (trimmedTerm.length === 0) {
      // If term is empty, reset typing state and last searched term
      setIsTyping(false)
      lastSearchedTerm.current = ''
    }
  }, [debouncedSearchTerm, memoizedOnSearch, minLength])

  // Mark as initialized after first render
  useEffect(() => {
    isInitialized.current = true
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    // Only set typing to true if there's actual content
    if (value.trim().length > 0) {
      setIsTyping(true)
    } else {
      setIsTyping(false)
    }
  }, [])

  const handleSearchSubmit = useCallback((value: string) => {
    const trimmedValue = value.trim()
    if (trimmedValue.length >= minLength) {
      setSearchTerm(trimmedValue)
      setIsTyping(false)
      lastSearchedTerm.current = trimmedValue
      memoizedOnSearch(trimmedValue)
    }
  }, [minLength, memoizedOnSearch])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setIsTyping(false)
    lastSearchedTerm.current = ''
  }, [])

  return {
    searchTerm,
    isTyping,
    debouncedSearchTerm,
    handleSearchChange,
    handleSearchSubmit,
    clearSearch,
    isValidSearch: searchTerm.trim().length >= minLength
  }
}

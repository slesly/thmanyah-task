'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSearch } from '../hooks/useDebounce'

interface SearchFormProps {
  initialSearchTerm?: string
}

export default function SearchForm({ initialSearchTerm = '' }: SearchFormProps) {
  const router = useRouter()
  const isInitialized = useRef(false)
  const lastNavigatedTerm = useRef<string>('')
  
  // Memoize the navigation function to prevent infinite loops
  const navigateToSearch = useCallback((searchTerm: string) => {
    const trimmedTerm = searchTerm.trim()
    
    // Only navigate if the term is different from last navigation
    if (trimmedTerm !== lastNavigatedTerm.current) {
      lastNavigatedTerm.current = trimmedTerm
      if (trimmedTerm) {
        router.push(`/?search=${encodeURIComponent(trimmedTerm)}`)
      } else {
        router.push('/')
      }
    }
  }, [router])
  
  const {
    searchTerm,
    isTyping,
    handleSearchChange,
    handleSearchSubmit,
    clearSearch,
    isValidSearch
  } = useSearch(navigateToSearch, 500, 2)

  // Initialize search term from props only once and handle page refresh
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      
      if (initialSearchTerm) {
        // If there's an initial search term (from URL), set it
        handleSearchChange(initialSearchTerm)
        lastNavigatedTerm.current = initialSearchTerm
      } else {
        // If no initial search term, clear everything
        clearSearch()
        lastNavigatedTerm.current = ''
      }
    }
  }, [initialSearchTerm, handleSearchChange, clearSearch])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    handleSearchChange(value)
    
    // If input is cleared, immediately clear and navigate to home
    if (!value.trim()) {
      clearSearch()
      lastNavigatedTerm.current = ''
      router.push('/')
    }
  }, [handleSearchChange, clearSearch, router])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    handleSearchSubmit(searchTerm)
  }, [searchTerm, handleSearchSubmit])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Search on Enter key
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!searchTerm.trim()) return
      handleSearchSubmit(searchTerm)
    }
  }, [searchTerm, handleSearchSubmit])

  const handleClear = useCallback(() => {
    clearSearch()
    lastNavigatedTerm.current = ''
    router.push('/')
  }, [clearSearch, router])

  // Show loading state when typing and there's a valid search term
  const showLoading = isTyping && searchTerm.trim().length >= 2

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="ابحث في أكثر من 70 مليون بودكاست وحلقة"
            className="w-full px-4 py-3 text-center border border-light-300 bg-white text-foreground rounded-lg text-base outline-none transition-all duration-200 placeholder:text-light-400 focus:border-accent-blue focus:text-foreground focus:placeholder:text-transparent focus:bg-white focus:ring-2 focus:ring-accent-blue/20"
            autoComplete="off"
            suppressHydrationWarning
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Loading indicator */}
          {showLoading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="w-4 h-4 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Search button - only show when there's text and not currently searching */}
          {searchTerm.trim() && !showLoading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <button
                type="submit"
                className="p-1 text-accent-blue hover:text-accent-blue/80 transition-colors duration-200"
                title="بحث (Enter)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}

          {/* Clear button - show when there's text */}
          {searchTerm.trim() && !showLoading && (
            <div className="absolute inset-y-0 right-10 flex items-center">
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-light-400 hover:text-light-600 transition-colors duration-200"
                title="مسح البحث"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Status indicator */}
        <div className="mt-3 text-center">
          {showLoading && (
            <p className="text-sm text-light-500 animate-pulse">
              جاري البحث عن "{searchTerm}"...
            </p>
          )}
          {searchTerm.trim().length > 0 && !isValidSearch && (
            <p className="text-sm text-light-500">
              اكتب حرفين على الأقل للبحث
            </p>
          )}
        </div>
      </form>
    </div>
  )
} 
import { SearchResult, PodbaySearchResponse } from '../types/podcast'

const API_BASE_URL = 'http://localhost:3001'

// Simple in-memory cache
const searchCache = new Map<string, { data: SearchResult[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function searchPodcasts(searchTerm: string): Promise<SearchResult[]> {
  const trimmedTerm = searchTerm.trim()
  
  // Check cache first
  const cached = searchCache.get(trimmedTerm)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(trimmedTerm)}`, {
    next: { revalidate: 60 } // Cache for 1 minute
  })
  
  if (!response.ok) {
    throw new Error('Failed to search podcasts')
  }
  
  const rawData = await response.json()
  
  // Expect backend to return the exact format we need
  // Backend should fetch from iTunes and return: { podcasts: [...], episodes: [...] }
  let data: SearchResult[] = []
  
  if (rawData && typeof rawData === 'object' && 'podcasts' in rawData && 'episodes' in rawData) {
    const podbayResponse = rawData as PodbaySearchResponse
    
    // Backend should have already processed and categorized the data
    // We just combine the arrays
    data = [...podbayResponse.podcasts, ...podbayResponse.episodes]
  }
  
  // Cache the result
  searchCache.set(trimmedTerm, {
    data,
    timestamp: Date.now()
  })
  
  return data
}

export async function getRecentSearches(): Promise<SearchResult[]> {
  const response = await fetch(`${API_BASE_URL}/api/search/recent`, {
    next: { revalidate: 300 } // Cache for 5 minutes
  })
  
  if (!response.ok) {
    throw new Error('Failed to load recent searches')
  }
  
  const rawData = await response.json()
  
  let data: SearchResult[] = []
  
  // Expect backend to return the exact format we need
  if (rawData && typeof rawData === 'object' && 'podcasts' in rawData && 'episodes' in rawData) {
    const podbayResponse = rawData as PodbaySearchResponse
    
    // Backend should have already processed and categorized the data
    data = [...podbayResponse.podcasts, ...podbayResponse.episodes]
  }
  
  return data
}
